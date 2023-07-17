'use client';
import {useCallback, useEffect, useId, useRef, useState} from 'react';
import WebAudioRenderer from '@elemaudio/web-renderer';
import {el, type NodeRepr_t} from '@elemaudio/core';

export default function IndexPage() {
	const ctxRef = useRef<AudioContext>();
	const coreRef = useRef<WebAudioRenderer>();

	useEffect(() => {
		if (!ctxRef.current) {
			ctxRef.current = new AudioContext();
		}

		if (!coreRef.current) {
			coreRef.current = new WebAudioRenderer();
		}

		const ctx = ctxRef.current;
		const core = coreRef.current;

		(async () => {
			const node = await core.initialize(ctx);
			node.connect(ctx.destination);
		})();
	}, []);

	const gateKey = 'gate';
	const gateOff = 0;
	const gateOn = 1;
	const gateDefault = gateOff;

	const attackKey = 'attack';
	const attackMin = 0.0001;
	const attackMax = 60;
	const attackDefault = 0.001;

	const decayKey = 'decay';
	const decayMin = 0.0001;
	const decayMax = 60;
	const decayDefault = 0.6;

	const sustainKey = 'sustain';
	const sustainMin = 0;
	const sustainMax = 1;
	const sustainDefault = 0.7;

	const releaseKey = 'release';
	const releaseMin = 0.0001;
	const releaseMax = 60;
	const releaseDefault = 0.6;

	const gateRef = useRef<NodeRepr_t>(el.const({key: gateKey, value: gateDefault}));
	const attackRef = useRef<NodeRepr_t>(el.const({key: attackKey, value: attackDefault}));
	const decayRef = useRef<NodeRepr_t>(el.const({key: decayKey, value: decayDefault}));
	const sustainRef = useRef<NodeRepr_t>(el.const({key: sustainKey, value: sustainDefault}));
	const releaseRef = useRef<NodeRepr_t>(el.const({key: releaseKey, value: releaseDefault}));

	const renderAudio = async () => {
		const ctx = ctxRef.current;
		const core = coreRef.current;
		if (!ctx || !core) {
			throw new Error('Audio core wasn\'t initialized properly');
		}

		if (ctx.state !== 'running') {
			await ctx.resume();
		}

		const attack = attackRef.current;
		const decay = decayRef.current;
		const sustain = sustainRef.current;
		const release = releaseRef.current;
		const gate = gateRef.current;
		const envelope = el.adsr(attack, decay, sustain, release, gate);
		const sine = el.cycle(220);
		const out = el.mul(envelope, sine);
		core.render(out, out);
	};

	const play = useCallback(() => {
		gateRef.current = el.const({key: gateKey, value: gateOn});
		void renderAudio();
	}, []);

	const stop = useCallback(() => {
		gateRef.current = el.const({key: gateKey, value: gateOff});
		void renderAudio();
	}, []);

	useEffect(() => {
		const onKeyDown = async (event: KeyboardEvent) => {
			if (event.repeat) {
				return;
			}

			if (event.code === 'Space') {
				play();
			}
		};

		const onKeyUp = (event: KeyboardEvent) => {
			if (event.code === 'Space') {
				stop();
			}
		};

		window.addEventListener('keydown', onKeyDown);
		window.addEventListener('keyup', onKeyUp);

		return () => {
			window.removeEventListener('keydown', onKeyDown);
			window.removeEventListener('keyup', onKeyUp);
		};
	}, [play, stop]);

	return (
		<div className='px-8 py-16 md:px-12 md:py-20 lg:px-20'>
			<div
				className='mx-auto mb-8 max-w-lg select-none border border-black p-16 text-center'
				onTouchStart={play}
				onTouchEnd={stop}
				onMouseDown={play}
				onMouseUp={stop}
			>
				Press &quot;Space&quot; key or touch here to play
			</div>
			<KnobInput
				title='Attack'
				valueDefault={attackDefault}
				valueMin={attackMin}
				valueMax={attackMax}
				constRef={attackRef}
				constKey={attackKey}
				onChange={renderAudio}
			/>
			<KnobInput
				title='Decay'
				valueDefault={decayDefault}
				valueMin={decayMin}
				valueMax={decayMax}
				constRef={decayRef}
				constKey={decayKey}
				onChange={renderAudio}
			/>
			<KnobInput
				title='Sustain'
				valueDefault={sustainDefault}
				valueMin={sustainMin}
				valueMax={sustainMax}
				constRef={sustainRef}
				constKey={sustainKey}
				onChange={renderAudio}
			/>
			<KnobInput
				title='Release'
				valueDefault={releaseDefault}
				valueMin={releaseMin}
				valueMax={releaseMax}
				constRef={releaseRef}
				constKey={releaseKey}
				onChange={renderAudio}
			/>
		</div>
	);
}

type KnobInputProps = {
	title: string;
	valueDefault: number;
	valueMin: number;
	valueMax: number;
	constRef: React.MutableRefObject<NodeRepr_t>;
	constKey: string;
	onChange: () => void;
};
function KnobInput({
	title,
	valueDefault,
	valueMin,
	valueMax,
	constRef,
	constKey,
	onChange,
}: KnobInputProps) {
	const id = useId();
	const [value, setValue] = useState<number>(valueDefault);
	return (
		<div className='flex max-w-sm flex-col'>
			<label htmlFor={id}>{`${title} | ${value}`}</label>
			<input
				id={id}
				type='range'
				defaultValue={valueDefault}
				min={valueMin}
				max={valueMax}
				step={Math.abs(valueMax - valueMin) / 1000}
				value={value}
				onChange={event => {
					const value = Number(event.target.value);
					constRef.current = el.const({key: constKey, value});
					setValue(value);
					onChange();
				}}
			/>
		</div>
	);
}
