'use client';
import {type RefObject, useCallback, useEffect, useRef, useState} from 'react';
import WebAudioRenderer from '@elemaudio/web-renderer';
import {el} from '@elemaudio/core';

import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '@/../tailwind.config';
import {
  clamp,
  dbMin,
  gainToDecibels,
  LinearSmoothedValue,
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
import {useStateWithEffect} from '@/components/hooks/useStateWithEffect';
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

    if (ctx.state !== 'running') {
      void ctx.resume();
    }

    core
      .initialize(ctx)
      .then((node) => {
        node.connect(ctx.destination);
      })
      .catch((error) => {
        console.error(error);
      });

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

  return <SynthPageMain core={core} />;
}

type SynthPageMainProps = {
  core: WebAudioRenderer;
};

const initialState = {
  gate: 0,
  freq: 440,
  attack: 0.001,
  decay: 0.6,
  sustain: 0.7,
  release: 0.6,
};

const meterLeftSource = 'meter:left';
const meterRightSource = 'meter:right';

function SynthPageMain({core}: SynthPageMainProps) {
  const meterLeftRef = useRef<HTMLCanvasElement>(null);
  const meterRightRef = useRef<HTMLCanvasElement>(null);

  useMeter({core, meterRef: meterLeftRef, source: meterLeftSource});
  useMeter({core, meterRef: meterRightRef, source: meterRightSource});

  const [state, setStateAndRender] = useStateWithEffect(
    initialState,
    useCallback(
      (state) => {
        const gateNode = el.const({key: 'gate', value: state.gate});
        const freqNode = el.const({key: 'freq', value: state.freq});
        const attackNode = el.const({key: 'attack', value: state.attack});
        const decayNode = el.const({key: 'decay', value: state.decay});
        const sustainNode = el.const({key: 'sustain', value: state.sustain});
        const releaseNode = el.const({key: 'release', value: state.release});

        const envelope = el.adsr(
          attackNode,
          decayNode,
          sustainNode,
          releaseNode,
          gateNode,
        );
        const sine = el.cycle(freqNode);
        const out = el.mul(envelope, sine);
        core.render(
          el.meter({name: meterLeftSource}, out),
          el.meter({name: meterRightSource}, out),
        );
      },
      [core],
    ),
  );

  const playNote = useCallback(
    (midiNote: number) => {
      setStateAndRender({gate: 1, freq: noteToFreq(midiNote)});
    },
    [setStateAndRender],
  );

  const stopNote = useCallback(
    (midiNote?: number) => {
      setStateAndRender({gate: 0});
    },
    [setStateAndRender],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        // Skip 2nd+ event if key is being held down already
        return;
      }

      if (event.code === keyCodes.space) {
        playNote(60);
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === keyCodes.space) {
        stopNote();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [playNote, stopNote]);

  return (
    <SynthPageLayout>
      <SynthContainer
        isActivated
        title={title}
        titleRight={<MidiSelector playNote={playNote} stopNote={stopNote} />}
        meterLeft={<Meter ref={meterLeftRef} />}
        meterRight={<Meter ref={meterRightRef} />}
      >
        <KnobsLayout>
          <KnobInput
            isLarge
            title='Frequency'
            kind='frequency'
            value={state.freq}
            onChange={(value) => {
              setStateAndRender({freq: value});
            }}
          />
          <KnobInput
            title='Attack'
            kind='adr'
            value={state.attack}
            onChange={(value) => {
              setStateAndRender({attack: value});
            }}
          />
          <KnobInput
            title='Decay'
            kind='adr'
            value={state.decay}
            onChange={(value) => {
              setStateAndRender({decay: value});
            }}
          />
          <KnobInput
            title='Sustain'
            kind='percentage'
            value={state.sustain}
            onChange={(value) => {
              setStateAndRender({sustain: value});
            }}
          />
          <KnobInput
            title='Release'
            kind='adr'
            value={state.release}
            onChange={(value) => {
              setStateAndRender({release: value});
            }}
          />
        </KnobsLayout>
      </SynthContainer>

      <InteractionArea
        icon={<PlayIcon />}
        title="Touch here to play or press the 'Space' key."
        onTouchStart={() => {
          playNote(60);
        }}
        onTouchEnd={() => {
          stopNote();
        }}
        onMouseDown={() => {
          playNote(60);
        }}
        onMouseUp={() => {
          stopNote();
        }}
      />
    </SynthPageLayout>
  );
}

type KnobInputKind = 'percentage' | 'adr' | 'frequency';
type KnobInputProps = {
  isLarge?: boolean;
  kind: KnobInputKind;
  title: string;
  value: number;
  onChange: (value: number) => void;
};
function KnobInput({isLarge, kind, title, value, onChange}: KnobInputProps) {
  const KnobComponent = resolveKnobComponent(kind);
  return (
    <KnobComponent
      isLarge={isLarge}
      title={title}
      value={value}
      defaultValue={value}
      onChange={onChange}
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
  meterRef: RefObject<HTMLCanvasElement>;
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
