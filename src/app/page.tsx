'use client';
import {useCallback, useEffect, useRef} from 'react';
import WebAudioRenderer from '@elemaudio/web-renderer';
import {el, type NodeRepr_t} from '@elemaudio/core';

const GateKey = 'gate';
const GateDefault = 0;

const AttackKey = 'attack';
const AttackMin = 0.0001;
const AttackMax = 60;
const AttackDefault = 0.001;

const DecayKey = 'decay';
const DecayMin = 0.0001;
const DecayMax = 60;
const DecayDefault = 0.6;

const SustainKey = 'sustain';
const SustainMin = 0;
const SustainMax = 1;
const SustainDefault = 0.7;

const ReleaseKey = 'release';
const ReleaseMin = 0.0001;
const ReleaseMax = 60;
const ReleaseDefault = 0.6;

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

	const gateRef = useRef<NodeRepr_t>(el.const({key: GateKey, value: GateDefault}));
	const attackRef = useRef<NodeRepr_t>(el.const({key: AttackKey, value: AttackDefault}));
	const decayRef = useRef<NodeRepr_t>(el.const({key: DecayKey, value: DecayDefault}));
	const sustainRef = useRef<NodeRepr_t>(el.const({key: SustainKey, value: SustainDefault}));
	const releaseRef = useRef<NodeRepr_t>(el.const({key: ReleaseKey, value: ReleaseDefault}));

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
		gateRef.current = el.const({key: GateKey, value: 1});
		void renderAudio();
	}, []);

	const stop = useCallback(() => {
		gateRef.current = el.const({key: GateKey, value: 0});
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
				className='mx-auto max-w-lg select-none border border-black p-16 text-center'
				onTouchStart={play}
				onTouchEnd={stop}
				onMouseDown={play}
				onMouseUp={stop}
			>
				Press &quot;Space&quot; key or touch here to play
			</div>
		</div>
	);
}
