import {keyCodes} from '@/constants/key-codes';
import {isNumberKey} from '@/utils/keyboard';
import {useDrag} from '@use-gesture/react';
import clsx from 'clsx';
import {useEffect, useId, useRef, useState} from 'react';
import {KnobHeadless} from 'react-knob-headless';
import {clamp, clamp01, mapFrom01Linear, mapTo01Linear} from '@dsp-ts/math';

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
   * Note, that rounding must be applied here either, so raw slider values with lots of decimals will be handled properly.
   * Example: 1250.11011 Hz can be displayed as "1.25 kHz".
   */
  displayValueFn: (value: number) => string;
  /**
   * Used to convert the value from the raw manual input to the knob's value.
   * Note, that rounding must be applied here either, so raw slider values with lots of decimals will be handled properly.
   * Example: 0.500001 value should be converted to 50 (%).
   */
  toManualInputFn: (x: number) => number;
  /**
   * Opposite of `toManualInputFn`.
   * Example: user enters 50 (%), which is converted to 0.5.
   */
  fromManualInputFn: (x: number) => number;
  /**
   * Used for mapping the value to the knob position (number from 0 to 1).
   * This is the place for making the interpolation, if non-linear one is required.
   * Example: logarithmic scale of frequency input, when knob center position 0.5 corresponds to ~ 1 kHz (instead of 10.1 kHz which is the "linear" center of frequency range).
   */
  mapTo01?: (x: number, min: number, max: number) => number;
  /**
   * Opposite of `mapTo01`.
   */
  mapFrom01?: (x: number, min: number, max: number) => number;
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
  toManualInputFn = (x) => x,
  fromManualInputFn = (x) => x,
  mapTo01 = mapTo01Linear,
  mapFrom01 = mapFrom01Linear,
}: KnobProps) {
  const id = useId();

  const knobContainerRef = useRef<HTMLDivElement>(null);

  const [hasManualInputInitialValue, setHasManualInputInitialValue] =
    useState(true);
  const [isManualInputActive, setIsManualInputActive] = useState(false);
  const manualInputInitialValue = hasManualInputInitialValue
    ? toManualInputFn(value)
    : undefined;

  const openManualInput = (withDefaultValue: boolean) => {
    setHasManualInputInitialValue(withDefaultValue);
    setIsManualInputActive(true);
  };

  const closeManualInput = () => {
    setIsManualInputActive(false);
    knobContainerRef.current?.focus(); // Re-focus back on the knob container
  };

  const value01 = mapTo01(value, min, max);
  const valueText = displayValueFn(value);

  const angleMin = -145; // The minumum knob position angle, when x = 0
  const angleMax = 145; // The maximum knob position angle, when x = 1
  const angle = mapFrom01Linear(value01, angleMin, angleMax);

  const changeValueTo = (newValue: number): void => {
    onChange(clamp(newValue, min, max));
  };

  const changeValue01To = (newValue01: number): void => {
    changeValueTo(mapFrom01(newValue01, min, max));
  };

  const changeValue01By = (diff01: number): void => {
    changeValue01To(clamp01(value01 + diff01));
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    const {code, key} = event;

    if (code === keyCodes.arrowLeft || code === keyCodes.arrowDown) {
      changeValue01By(-0.01);
      return;
    }

    if (code === keyCodes.arrowRight || code === keyCodes.arrowUp) {
      changeValue01By(0.01);
      return;
    }

    if (code === keyCodes.backspace || code === keyCodes.delete) {
      const defaultValue01 = mapTo01(defaultValue, min, max);
      changeValue01To(defaultValue01);
      return;
    }

    if (isNumberKey(key)) {
      openManualInput(false);
    }
  };

  const bindDrag = useDrag(({delta}) => {
    const diff01 = delta[1] * -0.006; // Multiplying by negative sensitivity. Vertical axis (Y) direction of the screen is inverted.
    changeValue01By(diff01);
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
            openManualInput(true);
          }}
        >
          {valueText}
        </label>
      </div>
      {isManualInputActive && (
        <ManualInput
          initialValue={manualInputInitialValue}
          onCancel={closeManualInput}
          onSubmit={(newValue) => {
            closeManualInput();
            changeValueTo(fromManualInputFn(newValue));
          }}
        />
      )}
    </div>
  );
}

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
