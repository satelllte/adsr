import {keyCodes} from '@/constants/key-codes';
import {clamp, clamp01, mapFrom01Linear, mapTo01Linear} from '@/utils/math';
import {useDrag} from '@use-gesture/react';
import clsx from 'clsx';
import {useEffect, useId, useRef, useState} from 'react';

export type KnobProps = {
  isLarge?: boolean;
  title: string;
  value: number;
  defaultValue: number;
  min: number;
  max: number;
  onChange: (newValue: number) => void;
  /**
   * Used to display the value in the knob.
   * Example: 1250 Hz can be displayed as "1.25 kHz".
   */
  displayValueFn: (value: number) => string;
  /**
   * Used to round/normalize the raw input value.
   * Example: value of 440.0012 rounds to 440 (Hz).
   */
  roundFn?: (x: number) => number;
  /**
   * Used to convert the value from the raw manual input to the knob's value.
   * Example: user enters 50 (%), which is converted to 0.5.
   */
  fromManualInputFn?: (x: number) => number;
  /**
   * Opposite of `fromManualInputFn`.
   * Example: 0.5 value should be converted to 50 (%).
   */
  toManualInputFn?: (x: number) => number;
  /**
   * Used for mapping the knob position to the value.
   * This is the place for making an interpolation, if non-linear one is required.
   * Example: logarithmic scale of frequency input, when knob center position 0.5 corresponds to ~ 1 kHz (instead of 10.1 kHz which is the "linear" center of frequency range).
   */
  mapFrom01?: (x: number, min: number, max: number) => number;
  /**
   * Opposite of `mapFrom01`.
   */
  mapTo01?: (x: number, min: number, max: number) => number;
};

export function Knob({
  isLarge = false,
  title,
  value,
  defaultValue,
  min,
  max,
  onChange,
  displayValueFn,
  roundFn = (x) => x,
  fromManualInputFn = (x) => x,
  toManualInputFn = (x) => x,
  mapFrom01 = mapFrom01Linear,
  mapTo01 = mapTo01Linear,
}: KnobProps) {
  const id = useId();

  const knobContainerRef = useRef<HTMLDivElement>(null);

  const [hasNumberInputInitialValue, setHasNumberInputInitialValue] =
    useState(true);
  const [isNumberInputActive, setIsNumberInputActive] = useState(false);
  const numberInputInitialValue = hasNumberInputInitialValue
    ? toManualInputFn(value)
    : undefined;

  const openNumberInput = (withDefaultValue: boolean) => {
    setHasNumberInputInitialValue(withDefaultValue);
    setIsNumberInputActive(true);
  };

  const closeNumberInput = () => {
    setIsNumberInputActive(false);
    knobContainerRef.current?.focus(); // Re-focus back on the knob container
  };

  const value01 = mapTo01(value, min, max);
  const valueText = displayValueFn(value);

  const angleMin = -145; // The minumum knob position angle, when x = 0
  const angleMax = 145; // The maximum knob position angle, when x = 1
  const angle = mapFrom01Linear(value01, angleMin, angleMax);

  const changeValueTo = (newValue01: number): void => {
    onChange(roundFn(mapFrom01(newValue01, min, max)));
  };

  const changeValueBy = (diff01: number): void => {
    const newValue01 = clamp01(value01 + diff01);
    changeValueTo(newValue01);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = ({code}) => {
    if (code === keyCodes.arrowLeft || code === keyCodes.arrowDown) {
      changeValueBy(-0.01);
      return;
    }

    if (code === keyCodes.arrowRight || code === keyCodes.arrowUp) {
      changeValueBy(0.01);
      return;
    }

    if (code === keyCodes.backspace || code === keyCodes.delete) {
      const defaultValue01 = mapTo01(defaultValue, min, max);
      changeValueTo(defaultValue01);
      return;
    }

    if (
      code === keyCodes.digit0 ||
      code === keyCodes.digit1 ||
      code === keyCodes.digit2 ||
      code === keyCodes.digit3 ||
      code === keyCodes.digit4 ||
      code === keyCodes.digit5 ||
      code === keyCodes.digit6 ||
      code === keyCodes.digit7 ||
      code === keyCodes.digit8 ||
      code === keyCodes.digit9
    ) {
      openNumberInput(false);
    }
  };

  const bindDrag = useDrag(({delta}) => {
    const diff01 = delta[1] * -0.006; // Multiplying by negative sensitivity. Vertical axis (Y) direction of the screen is inverted.
    changeValueBy(diff01);
  });

  return (
    <div className='relative text-xs'>
      <div
        ref={knobContainerRef}
        className={clsx(
          'flex select-none flex-col items-center outline-none focus:outline-dashed focus:outline-1 focus:outline-gray-4',
          isLarge ? 'w-20' : 'w-16',
        )}
        tabIndex={-1} // Making element focusable by mouse / touch (not Tab). Details: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
        onKeyDown={onKeyDown}
        onPointerDown={(event) => {
          // Touch devices have a delay before focusing so it won't focus if touch immediately moves away from target (sliding). We want thumb to focus regardless.
          // See, for reference, Radix UI Slider does the same: https://github.com/radix-ui/primitives/blob/eca6babd188df465f64f23f3584738b85dba610e/packages/react/slider/src/Slider.tsx#L442-L445
          event.currentTarget.focus();
        }}
      >
        <label htmlFor={id}>{title}</label>
        <div
          id={id}
          className={clsx(
            'relative touch-none', // It's recommended to disable "touch-action" for use-gesture: https://use-gesture.netlify.app/docs/extras/#touch-action
            isLarge ? 'h-16 w-16' : 'h-12 w-12',
          )}
          role='slider'
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuetext={valueText}
          aria-orientation='vertical'
          {...bindDrag()}
        >
          <div className='absolute h-full w-full rounded-full bg-gray-3'>
            <div
              className='absolute h-full w-full'
              style={{rotate: `${angle}deg`}}
            >
              <div className='absolute left-1/2 top-0 h-1/2 w-[2px] -translate-x-1/2 rounded-sm bg-gray-7' />
            </div>
          </div>
        </div>
        <label
          htmlFor={id}
          onClick={() => {
            openNumberInput(true);
          }}
        >
          {valueText}
        </label>
      </div>
      {isNumberInputActive && (
        <NumberInput
          initialValue={numberInputInitialValue}
          onCancel={closeNumberInput}
          onSubmit={(newValue) => {
            closeNumberInput();
            onChange(roundFn(clamp(fromManualInputFn(newValue), min, max)));
          }}
        />
      )}
    </div>
  );
}

type NumberInputProps = {
  initialValue?: number;
  onCancel: () => void;
  onSubmit: (newValue: number) => void;
};

function NumberInput({initialValue, onCancel, onSubmit}: NumberInputProps) {
  const isCancelledRef = useRef<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus(); // Focus on the input when it's mounted
  }, []);

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
