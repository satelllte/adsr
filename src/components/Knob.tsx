'use client';
import {clamp01, mapFrom01Range, mapTo01Range} from '@/utils/math';
import {useDrag} from '@use-gesture/react';
import {useId} from 'react';
import * as Slider from '@radix-ui/react-slider';
import * as Label from '@radix-ui/react-label';

export type KnobUnit = 'time' | 'percentage';

export type KnobProps = {
	title: string;
	unit: KnobUnit;
	value: number;
	min: number;
	max: number;
	onChange: (newValue: number) => void;
};

export function Knob({
	title,
	unit,
	value,
	min,
	max,
	onChange,
}: KnobProps) {
	const id = useId();

	const value01 = mapTo01Range(value, min, max);

	const angleMin = -145; // The minumum knob position angle, when x = 0
	const angleMax = 145; // The maximum knob position angle, when x = 1
	const angle = mapFrom01Range(value01, angleMin, angleMax);

	const valueText = `${parseFloat(`${value}`).toFixed(2)} ${renderUnit(unit)}`;

	const bindDrag = useDrag(({delta}) => {
		const diff = delta[1] * (-0.006); // Multiplying by negative sensitivity. Vertical axis (Y) direction of the screen is inverted.
		const newValue01 = clamp01(value01 + diff);
		onChange(mapFrom01Range(newValue01, min, max));
	});

	/// return (
	// 	<input
	// 		type='range'
	// 		value={value01}
	// 		min={0}
	// 		max={1}
	// 		step={0.01}
	// 		onChange={event => {
	// 			const newValue01 = Number(event.target.value);
	// 			onChange(mapFrom01Range(newValue01, min, max));
	// 		}}
	// 	/>
	// );

	return (
		<Slider.Root
			asChild
			id={id}
			orientation='vertical'
			min={0}
			max={1}
			step={0.005}
			value={[value01]}
			onValueCommit={newValues01 => {
				const [newValue01] = newValues01;
				onChange(mapFrom01Range(newValue01, min, max));
			}}
		>
			<div autoFocus tabIndex={0} className='flex w-16 select-none flex-col items-center text-sm focus:outline-dashed focus:outline-1 focus:outline-slate-950'>
				<Label.Root htmlFor={id}>{title}</Label.Root>
				<div className='relative h-12 w-12 touch-none' {...bindDrag()}>
					<div
						className='absolute h-full w-full rounded-full bg-gray-300'
					>
						<div className='absolute h-full w-full' style={{rotate: `${angle}deg`}}>
							<div className='absolute left-1/2 top-0 h-1/2 w-[2px] -translate-x-1/2 rounded-sm bg-stone-950'/>
							<Slider.Thumb className='hidden' tabIndex={-1}/>
						</div>
					</div>
				</div>
				<Label.Root htmlFor={id}>{valueText}</Label.Root>
			</div>
		</Slider.Root>
	);
}

const renderUnit = (unit: KnobUnit): string => {
	switch (unit) {
		case 'time':
			return 's';
		case 'percentage':
			return '%';
		default:
			return unit;
	}
};
