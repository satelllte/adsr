import {useEffect, useId, useRef, useState} from 'react';
import {mapFrom01Linear, mapTo01Linear} from '@dsp-ts/math';
import {
  KnobHeadless,
  KnobHeadlessLabel,
  KnobHeadlessOutput,
} from 'react-knob-headless';
import {keyCodes} from '@/constants/key-codes';

type KnobPercentageProps = {
  label: string;
  value: number;
  valueDefault: number;
  onChange: (newValue: number) => void;
};

export function KnobPercentage({
  label,
  value,
  valueDefault,
  onChange,
}: KnobPercentageProps) {
  const knobRef = useRef<HTMLDivElement>(null);
  const knobId = useId();
  const labelId = useId();

  const value01 = mapTo01Linear(value, valueMin, valueMax);

  const angleMin = -145;
  const angleMax = 145;
  const angle = mapFrom01Linear(value01, angleMin, angleMax);

  const [hasManualInputInitialValue, setHasManualInputInitialValue] =
    useState(true);
  const [isManualInputActive, setIsManualInputActive] = useState(false);
  const manualInputInitialValue = hasManualInputInitialValue
    ? value // TODO: use rounding like "toManualInputFn"
    : undefined;

  const openManualInput = (withDefaultValue: boolean) => {
    setHasManualInputInitialValue(withDefaultValue);
    setIsManualInputActive(true);
  };

  const closeManualInput = () => {
    setIsManualInputActive(false);
    knobRef.current?.focus(); // Re-focus back on the knob
  };

  return (
    <div className='relative text-xs'>
      <div
        className='flex w-16 select-none flex-col items-center outline-none focus-within:outline-dashed focus-within:outline-1 focus-within:outline-gray-4'
        onClick={() => {
          // Focus the knob when clicked on any part of the container
          knobRef.current?.focus();
        }}
        // TODO: add "onKeyDown" handler to the knob container ...
      >
        <KnobHeadlessLabel id={labelId}>{label}</KnobHeadlessLabel>
        <KnobHeadless
          ref={knobRef}
          id={knobId}
          aria-labelledby={labelId}
          className='relative h-12 w-12 outline-none'
          valueRaw={value}
          valueMin={valueMin}
          valueMax={valueMax}
          dragSensitivity={dragSensitivity}
          valueRawRoundFn={valueRawRoundFn}
          valueRawDisplayFn={valueRawDisplayFn}
          onValueRawChange={onChange}
        >
          <div className='absolute h-full w-full rounded-full bg-gray-3'>
            <div
              className='absolute h-full w-full'
              style={{rotate: `${angle}deg`}}
            >
              <div className='absolute left-1/2 top-0 h-1/2 w-[2px] -translate-x-1/2 rounded-sm bg-gray-7' />
            </div>
          </div>
        </KnobHeadless>
        <KnobHeadlessOutput
          htmlFor={knobId}
          onClick={() => {
            openManualInput(true);
          }}
        >
          {valueRawDisplayFn(value)}
        </KnobHeadlessOutput>
        {isManualInputActive && (
          <ManualInput
            initialValue={manualInputInitialValue}
            onCancel={closeManualInput}
            onSubmit={(newValue) => {
              closeManualInput();
              onChange(fromManualInputFn(newValue));
            }}
          />
        )}
      </div>
    </div>
  );
}

const valueMin = 0;
const valueMax = 1;
const dragSensitivity = 0.006;
const valueRawRoundFn = (valueRaw: number) => valueRaw;
const valueRawDisplayFn = (valueRaw: number) => {
  const percent = valueRaw * 100;
  return `${percent < 10 ? percent.toFixed(1) : percent.toFixed(0)} %`;
};

/**
 * ---------------
 *  MANUAL INPUT
 * ---------------
 */

// TODO: complete this
const fromManualInputFn = (newValue: number): number => newValue;

type ManualInputProps = {
  initialValue?: number;
  onCancel: () => void;
  onSubmit: (newValue: number) => void;
};

function ManualInput({initialValue, onCancel, onSubmit}: ManualInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus(); // Focus on the input when it's mounted
  }, []);

  const isCancelledRef = useRef<boolean>(false);

  const submit = () => {
    if (isCancelledRef.current) return;
    onSubmit(Number(inputRef.current?.value));
  };

  return (
    <form
      noValidate
      className='absolute inset-x-0 bottom-0 w-full'
      onSubmit={(event) => {
        event.preventDefault(); // Prevent standard form submission behavior
        submit();
      }}
    >
      <input
        ref={inputRef}
        defaultValue={initialValue}
        type='number'
        className='w-full border border-gray-0 bg-gray-7 text-center text-gray-0 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
        onBlur={submit}
        onKeyDown={(event) => {
          // Prevent standard input behaviour when it's being changed on arrow up/down press
          if (
            event.code === keyCodes.arrowDown ||
            event.code === keyCodes.arrowUp
          ) {
            event.preventDefault();
            return;
          }

          // Cancel on escape
          if (event.code === keyCodes.escape) {
            isCancelledRef.current = true;
            onCancel();
          }
        }}
      />
    </form>
  );
}
