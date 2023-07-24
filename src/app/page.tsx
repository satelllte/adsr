'use client';
import {useCallback, useEffect, useRef, useState} from 'react';
import WebAudioRenderer from '@elemaudio/web-renderer';
import {el, type NodeRepr_t} from '@elemaudio/core';
import {Knob, type KnobProps} from '@/components/Knob';
import {Piano} from '@/components/Piano';
import {keyCodes} from '@/constants/key-codes';
import {getMidiIndex, mapMidiToHz} from '@/utils/math';

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
  const freqDefault = 440;

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

      const octave = 4; // Sticking to hardcoded octave for now ...

      let midiKey: number | undefined;

      if (event.code === keyCodes.keyA) {
        midiKey = getMidiIndex(0, octave); // C
      }

      if (event.code === keyCodes.keyW) {
        midiKey = getMidiIndex(1, octave); // C#
      }

      if (event.code === keyCodes.keyS) {
        midiKey = getMidiIndex(2, octave); // D
      }

      if (event.code === keyCodes.keyE) {
        midiKey = getMidiIndex(3, octave); // D#
      }

      if (event.code === keyCodes.keyD) {
        midiKey = getMidiIndex(4, octave); // E
      }

      if (event.code === keyCodes.keyF) {
        midiKey = getMidiIndex(5, octave); // F
      }

      if (event.code === keyCodes.keyT) {
        midiKey = getMidiIndex(6, octave); // F#
      }

      if (event.code === keyCodes.keyG) {
        midiKey = getMidiIndex(7, octave); // G
      }

      if (event.code === keyCodes.keyY) {
        midiKey = getMidiIndex(8, octave); // G#
      }

      if (event.code === keyCodes.keyH) {
        midiKey = getMidiIndex(9, octave); // A
      }

      if (event.code === keyCodes.keyU) {
        midiKey = getMidiIndex(10, octave); // A#
      }

      if (event.code === keyCodes.keyJ) {
        midiKey = getMidiIndex(11, octave); // B
      }

      if (midiKey) {
        const freq = mapMidiToHz(midiKey);
        freqRef.current = el.const({key: freqKey, value: freq});
        play();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (
        event.code === keyCodes.keyA || // C
        event.code === keyCodes.keyW || // C#
        event.code === keyCodes.keyS || // D
        event.code === keyCodes.keyE || // D#
        event.code === keyCodes.keyD || // E
        event.code === keyCodes.keyF || // F
        event.code === keyCodes.keyT || // F#
        event.code === keyCodes.keyG || // G
        event.code === keyCodes.keyY || // G#
        event.code === keyCodes.keyH || // A
        event.code === keyCodes.keyU || // A#
        event.code === keyCodes.keyJ // B
      ) {
        // eslint-disable-next-line no-warning-comments
        // TODO: create a queue of pressed notes and stop only after it became empty
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
        Touch here to play
      </div>
      <div className='flex justify-center gap-3'>
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
      <div className='py-8'>
        <Piano />
      </div>
    </div>
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
