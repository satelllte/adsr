'use client';
import {useCallback, useEffect, useRef, useState} from 'react';
import WebAudioRenderer from '@elemaudio/web-renderer';
import {el, type NodeRepr_t} from '@elemaudio/core';
import {Knob, type KnobProps} from '@/components/ui/Knob';
import {keyCodes} from '@/constants/key-codes';
import {Centered} from '@/components/layout/Centered';
import {InteractionArea} from '../ui/InteractionArea';
import {PlayIcon} from '@/components/icons/PlayIcon';

export function SynthPage() {
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
  const attackMax = 10;
  const attackDefault = 0.001;

  const decayKey = 'decay';
  const decayMin = 0.0001;
  const decayMax = 10;
  const decayDefault = 0.6;

  const sustainKey = 'sustain';
  const sustainMin = 0;
  const sustainMax = 1;
  const sustainDefault = 0.7;

  const releaseKey = 'release';
  const releaseMin = 0.0001;
  const releaseMax = 10;
  const releaseDefault = 0.6;

  const freqKey = 'freq';
  const freqDefault = 220;

  const gateRef = useRef<NodeRepr_t>(
    el.const({key: gateKey, value: gateDefault}),
  );
  const attackRef = useRef<NodeRepr_t>(
    el.const({key: attackKey, value: attackDefault}),
  );
  const decayRef = useRef<NodeRepr_t>(
    el.const({key: decayKey, value: decayDefault}),
  );
  const sustainRef = useRef<NodeRepr_t>(
    el.const({key: sustainKey, value: sustainDefault}),
  );
  const releaseRef = useRef<NodeRepr_t>(
    el.const({key: releaseKey, value: releaseDefault}),
  );
  const freqRef = useRef<NodeRepr_t>(
    el.const({key: freqKey, value: freqDefault}),
  );

  const renderAudio = async () => {
    const ctx = ctxRef.current;
    const core = coreRef.current;
    if (!ctx || !core) {
      throw new Error("Audio core wasn't initialized properly");
    }

    if (ctx.state !== 'running') {
      await ctx.resume();
    }

    const attack = attackRef.current;
    const decay = decayRef.current;
    const sustain = sustainRef.current;
    const release = releaseRef.current;
    const gate = gateRef.current;
    const freq = freqRef.current;
    const envelope = el.adsr(attack, decay, sustain, release, gate);
    const sine = el.cycle(freq);
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

      if (event.code === keyCodes.space) {
        play();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === keyCodes.space) {
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
    <Centered
      bottomArea={
        <div className='p-4 md:p-8'>
          <InteractionArea
            icon={<PlayIcon />}
            title={"Touch here to play or press the 'Space' key."}
            onTouchStart={play}
            onTouchEnd={stop}
            onMouseDown={play}
            onMouseUp={stop}
          />
        </div>
      }
    >
      <div className='mx-4 bg-gray-2'>
        <div className='flex select-none items-center gap-2 bg-gray-1 px-2 py-1 text-sm'>
          <div className='h-2 w-2 rounded-full bg-green' />
          Simple Synth
        </div>
        <div className='flex flex-wrap justify-center gap-3 p-4'>
          <KnobInput
            title='Attack'
            unit='time'
            min={attackMin}
            max={attackMax}
            defaultValue={attackDefault}
            constRef={attackRef}
            constKey={attackKey}
            onChange={renderAudio}
          />
          <KnobInput
            title='Decay'
            unit='time'
            min={decayMin}
            max={decayMax}
            defaultValue={decayDefault}
            constRef={decayRef}
            constKey={decayKey}
            onChange={renderAudio}
          />
          <KnobInput
            title='Sustain'
            unit='percentage'
            min={sustainMin}
            max={sustainMax}
            defaultValue={sustainDefault}
            constRef={sustainRef}
            constKey={sustainKey}
            onChange={renderAudio}
          />
          <KnobInput
            title='Release'
            unit='time'
            min={releaseMin}
            max={releaseMax}
            defaultValue={releaseDefault}
            constRef={releaseRef}
            constKey={releaseKey}
            onChange={renderAudio}
          />
        </div>
      </div>
    </Centered>
  );
}

type KnobInputProps = Pick<KnobProps, 'title' | 'unit' | 'min' | 'max'> & {
  defaultValue: number;
  constRef: React.MutableRefObject<NodeRepr_t>;
  constKey: string;
  onChange: () => void;
};
function KnobInput({
  title,
  unit,
  min,
  max,
  defaultValue,
  constRef,
  constKey,
  onChange,
}: KnobInputProps) {
  const [value, setValue] = useState<number>(defaultValue);
  return (
    <Knob
      title={title}
      unit={unit}
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      onChange={(newValue) => {
        constRef.current = el.const({key: constKey, value: newValue});
        setValue(newValue);
        onChange();
      }}
    />
  );
}
