'use client';
import {useCallback, useEffect, useRef, useState} from 'react';
import WebAudioRenderer from '@elemaudio/web-renderer';
import {el, type NodeRepr_t} from '@elemaudio/core';
import {keyCodes} from '@/constants/key-codes';
import {KnobPercentage} from '@/components/ui/KnobPercentage';
import {KnobAdr} from '@/components/ui/KnobAdr';
import {Centered} from '@/components/layout/Centered';
import {InteractionArea} from '@/components/ui/InteractionArea';
import {PlayIcon} from '@/components/icons/PlayIcon';
import {SynthContainer} from './SynthContainer';
import {PageElementContainer} from './PageElementContainer';
import {SynthPageSkeleton} from './SynthPageSkeleton';
import {KnobsContainer} from './KnobsContainer';
import {title} from './constants';

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

  return <SynthPageMain ctxRef={ctxRef} coreRef={coreRef} />;
}

type SynthPageMainProps = {
  ctxRef: React.MutableRefObject<AudioContext | undefined>;
  coreRef: React.MutableRefObject<WebAudioRenderer | undefined>;
};

function SynthPageMain({ctxRef, coreRef}: SynthPageMainProps) {
  const gateOff = 0;
  const gateOn = 1;
  const gateKey = 'gate';
  const gateDefault = gateOff;

  const attackKey = 'attack';
  const attackDefault = 0.001;

  const decayKey = 'decay';
  const decayDefault = 0.6;

  const sustainKey = 'sustain';
  const sustainDefault = 0.7;

  const releaseKey = 'release';
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

  const renderAudio = useCallback(async () => {
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
  }, [coreRef, ctxRef]);

  const play = useCallback(() => {
    gateRef.current = el.const({key: gateKey, value: gateOn});
    void renderAudio();
  }, [renderAudio]);

  const stop = useCallback(() => {
    gateRef.current = el.const({key: gateKey, value: gateOff});
    void renderAudio();
  }, [renderAudio]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
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
        <PageElementContainer>
          <div className='py-4'>
            <InteractionArea
              icon={<PlayIcon />}
              title={"Touch here to play or press the 'Space' key."}
              onTouchStart={play}
              onTouchEnd={stop}
              onMouseDown={play}
              onMouseUp={stop}
            />
          </div>
        </PageElementContainer>
      }
    >
      <PageElementContainer>
        <SynthContainer isActivated title={title}>
          <KnobsContainer>
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
          </KnobsContainer>
        </SynthContainer>
      </PageElementContainer>
    </Centered>
  );
}

type KnobInputProps = {
  kind: 'percentage' | 'adr';
  title: string;
  defaultValue: number;
  constRef: React.MutableRefObject<NodeRepr_t>;
  constKey: string;
  onChange: () => void;
};
function KnobInput({
  kind,
  title,
  defaultValue,
  constRef,
  constKey,
  onChange,
}: KnobInputProps) {
  const [value, setValue] = useState<number>(defaultValue);
  const KnobComponent = kind === 'percentage' ? KnobPercentage : KnobAdr;
  return (
    <KnobComponent
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
