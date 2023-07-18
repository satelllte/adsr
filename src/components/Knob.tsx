'use client';
import {clamp01, mapFrom01Range, mapTo01Range} from '@/utils/math';
import {useDrag} from '@use-gesture/react';
import {useId} from 'react';

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

	const valueText = `${renderValue(value, unit)} ${renderUnit(unit)}`;

	const bindDrag = useDrag(({delta}) => {
		const diff = delta[1] * (-0.006); // Multiplying by negative sensitivity. Vertical axis (Y) direction of the screen is inverted.
		const newValue01 = clamp01(value01 + diff);
		onChange(mapFrom01Range(newValue01, min, max));
	});

	return (
		<div
			className='flex w-16 select-none flex-col items-center text-sm outline-none focus:outline-dashed focus:outline-1 focus:outline-slate-950'
			tabIndex={0} // Making element focusable and be accessible with Tab key. Details: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
			onPointerDown={event => {
				// Touch devices have a delay before focusing so it won't focus if touch immediately moves away from target (sliding). We want thumb to focus regardless.
				// See, for reference, Radix UI Slider does the same: https://github.com/radix-ui/primitives/blob/eca6babd188df465f64f23f3584738b85dba610e/packages/react/slider/src/Slider.tsx#L442-L445
				event.currentTarget.focus();
			}}
		>
			<label htmlFor={id}>{title}</label>
			<div
				id={id}
				className='relative h-12 w-12 touch-none' // It's recommended to disable "touch-action" for use-gesture: https://use-gesture.netlify.app/docs/extras/#touch-action
				role='slider'
				aria-valuenow={value}
				aria-valuemin={min}
				aria-valuemax={max}
				aria-valuetext={valueText}
				aria-orientation='vertical'
				{...bindDrag()}
			>
				<div
					className='absolute h-full w-full rounded-full bg-gray-300'
				>
					<div className='absolute h-full w-full' style={{rotate: `${angle}deg`}}>
						<div className='absolute left-1/2 top-0 h-1/2 w-[2px] -translate-x-1/2 rounded-sm bg-stone-950'/>
					</div>
				</div>
			</div>
			<label htmlFor={id}>{valueText}</label>
		</div>
	);
}

const renderValue = (value: number, unit: KnobUnit): string => {
	if (unit === 'percentage') {
		return parseFloat(`${value * 100}`).toFixed(0);
	}

	return parseFloat(`${value}`).toFixed(2);
};

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
