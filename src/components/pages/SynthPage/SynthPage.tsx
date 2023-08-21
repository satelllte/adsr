'use client';
import {useCallback, useEffect, useRef, useState} from 'react';
import WebAudioRenderer from '@elemaudio/web-renderer';
import {el, type NodeRepr_t} from '@elemaudio/core';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '@/../tailwind.config';
import {
  LinearSmoothedValue,
  clamp,
  dbMin,
  gainToDecibels,
  mapTo01Linear,
} from '@/utils/math';
import {keyCodes} from '@/constants/key-codes';
import {Meter} from '@/components/ui/Meter';
import {KnobPercentage} from '@/components/ui/KnobPercentage';
import {KnobAdr} from '@/components/ui/KnobAdr';
import {KnobFrequency} from '@/components/ui/KnobFrequency';
import {InteractionArea} from '@/components/ui/InteractionArea';
import {PlayIcon} from '@/components/icons';
import {SynthContainer} from './SynthContainer';
import {SynthPageSkeleton} from './SynthPageSkeleton';
import {KnobsLayout} from './KnobsLayout';
import {title} from './constants';
import {SynthPageLayout} from './SynthPageLayout';
import {MidiSelector} from '@/components/pages/SynthPage/MidiSelector';
import {noteToFreq} from '@/utils/math/midi';

const {colors} = resolveConfig(tailwindConfig).theme;

export function SynthPage() {
  const [isReady, setIsReady] = useState<boolean>(false);

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

    let timeoutId: ReturnType<typeof setTimeout>;

    core.on('load', () => {
      timeoutId = setTimeout(() => {
        setIsReady(true);
      }, 500); // Giving 0.5s more, so UI won't be janky when this component lazy-loaded very quickly.
    });

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  if (!isReady) {
    return <SynthPageSkeleton />;
  }

  const ctx = ctxRef.current;
  const core = coreRef.current;

  if (!ctx) {
    throw new Error("Audio context wasn't initialized properly");
  }

  if (!core) {
    throw new Error("Elementary core wasn't initialized properly");
  }

  return <SynthPageMain ctx={ctx} core={core} />;
}

type SynthPageMainProps = {
  ctx: AudioContext;
  core: WebAudioRenderer;
};

function SynthPageMain({ctx, core}: SynthPageMainProps) {
  const gateKey = 'gate';
  const gateDefault = 0;

  const freqKey = 'freq';
  const freqDefault = 440;

  const attackKey = 'attack';
  const attackDefault = 0.001;

  const decayKey = 'decay';
  const decayDefault = 0.6;

  const sustainKey = 'sustain';
  const sustainDefault = 0.7;

  const releaseKey = 'release';
  const releaseDefault = 0.6;

  const gateRef = useRef<NodeRepr_t>(
    el.const({key: gateKey, value: gateDefault}),
  );
  const freqRef = useRef<NodeRepr_t>(
    el.const({key: freqKey, value: freqDefault}),
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

  const meterLeftSource = 'meter:left';
  const meterRightSource = 'meter:right';

  const meterLeftRef = useRef<HTMLCanvasElement>(null);
  const meterRightRef = useRef<HTMLCanvasElement>(null);

  useMeter({core, meterRef: meterLeftRef, source: meterLeftSource});
  useMeter({core, meterRef: meterRightRef, source: meterRightSource});

  const renderAudio = useCallback(async () => {
    if (ctx.state !== 'running') {
      await ctx.resume();
    }

    const gate = gateRef.current;
    const freq = freqRef.current;
    const attack = attackRef.current;
    const decay = decayRef.current;
    const sustain = sustainRef.current;
    const release = releaseRef.current;
    const envelope = el.adsr(attack, decay, sustain, release, gate);
    const sine = el.cycle(freq);
    const out = el.mul(envelope, sine);
    core.render(
      el.meter({name: meterLeftSource}, out),
      el.meter({name: meterRightSource}, out),
    );
  }, [ctx, core]);

  const play = useCallback(() => {
    gateRef.current = el.const({key: gateKey, value: 1});
    void renderAudio();
  }, [renderAudio]);

  const stop = useCallback(() => {
    gateRef.current = el.const({key: gateKey, value: 0});
    void renderAudio();
  }, [renderAudio]);

  const playNote = (midiNote: number) => {
    freqRef.current = el.const({key: freqKey, value: noteToFreq(midiNote)});
    play();
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        // Skip 2nd+ event if key is being held down already
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
    <SynthPageLayout>
      <SynthContainer
        isActivated
        title={title}
        titleRight={<MidiSelector playNote={playNote} stopNote={stop} />}
        meterLeft={<Meter ref={meterLeftRef} />}
        meterRight={<Meter ref={meterRightRef} />}
      >
        <KnobsLayout>
          <KnobInput
            isLarge
            title='Frequency'
            kind='frequency'
            defaultValue={freqDefault}
            constRef={freqRef}
            constKey={freqKey}
            onChange={renderAudio}
          />
          <KnobInput
            title='Attack'
            kind='adr'
            defaultValue={attackDefault}
            constRef={attackRef}
            constKey={attackKey}
            onChange={renderAudio}
          />
          <KnobInput
            title='Decay'
            kind='adr'
            defaultValue={decayDefault}
            constRef={decayRef}
            constKey={decayKey}
            onChange={renderAudio}
          />
          <KnobInput
            title='Sustain'
            kind='percentage'
            defaultValue={sustainDefault}
            constRef={sustainRef}
            constKey={sustainKey}
            onChange={renderAudio}
          />
          <KnobInput
            title='Release'
            kind='adr'
            defaultValue={releaseDefault}
            constRef={releaseRef}
            constKey={releaseKey}
            onChange={renderAudio}
          />
        </KnobsLayout>
      </SynthContainer>

      <InteractionArea
        icon={<PlayIcon />}
        title="Touch here to play or press the 'Space' key."
        onTouchStart={play}
        onTouchEnd={stop}
        onMouseDown={play}
        onMouseUp={stop}
      />
    </SynthPageLayout>
  );
}

type KnobInputKind = 'percentage' | 'adr' | 'frequency';
type KnobInputProps = {
  isLarge?: boolean;
  kind: KnobInputKind;
  title: string;
  defaultValue: number;
  constRef: React.MutableRefObject<NodeRepr_t>;
  constKey: string;
  onChange: () => void;
};
function KnobInput({
  isLarge,
  kind,
  title,
  defaultValue,
  constRef,
  constKey,
  onChange,
}: KnobInputProps) {
  const [value, setValue] = useState<number>(defaultValue);
  const KnobComponent = resolveKnobComponent(kind);
  return (
    <KnobComponent
      isLarge={isLarge}
      title={title}
      value={value}
      defaultValue={defaultValue}
      onChange={(newValue) => {
        constRef.current = el.const({key: constKey, value: newValue});
        setValue(newValue);
        onChange();
      }}
    />
  );
}

const resolveKnobComponent = (kind: KnobInputKind) => {
  switch (kind) {
    case 'percentage':
      return KnobPercentage;
    case 'adr':
      return KnobAdr;
    case 'frequency':
      return KnobFrequency;
    default:
      throw new Error('Unknown knob kind', kind);
  }
};

const useMeter = ({
  core,
  meterRef,
  source,
}: {
  core: WebAudioRenderer;
  meterRef: React.RefObject<HTMLCanvasElement>;
  source: string;
}) => {
  useEffect(() => {
    const canvas = meterRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const volumeDbMin = dbMin;
    const volumeDbMax = 0;
    const volumeDb = new LinearSmoothedValue(volumeDbMin, volumeDbMin, 0.3);

    type MeterEvent = {
      source?: string;
      min: number;
      max: number;
    };

    core.on('meter', (event: MeterEvent) => {
      if (event.source !== source) {
        return;
      }

      const {min, max} = event;
      const gain = Math.max(Math.abs(min), Math.abs(max));
      const db = clamp(gainToDecibels(gain), volumeDbMin, volumeDbMax);
      if (volumeDb.getCurrentValue() < db) {
        volumeDb.setCurrentAndTargetValue(db);
      } else {
        volumeDb.setTargetValue(db);
      }
    });

    let rafHandle: number | undefined;

    ctx.fillStyle = colors.green;

    const drawMeter = () => {
      const {width, height} = canvas;
      ctx.clearRect(0, 0, width, height);

      const volume01 = mapTo01Linear(
        clamp(volumeDb.getCurrentValue(), volumeDbMin, volumeDbMax),
        volumeDbMin,
        volumeDbMax,
      );
      const meterHeight = height * volume01;
      ctx.fillRect(0, height - meterHeight, width, meterHeight);

      rafHandle = requestAnimationFrame(drawMeter);
    };

    rafHandle = requestAnimationFrame(drawMeter);

    return () => {
      if (rafHandle) {
        cancelAnimationFrame(rafHandle);
      }
    };
  }, [core, meterRef, source]);
};
