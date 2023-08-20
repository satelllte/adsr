import {useEffect, useState} from 'react';
import {type Input, WebMidi} from 'webmidi';

type MidiSelectorProps = {
  playNote: (note: number) => void;
  stopNote: (note: number) => void;
};

function connect() {
  WebMidi.enable().catch((err) => {
    console.error(err);
  });
}

export function MidiSelector({playNote, stopNote}: MidiSelectorProps) {
  const [devices, setDevices] = useState<Input[]>(WebMidi.inputs);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const updateInputs = () => {
      setDevices([...WebMidi.inputs]);
    };

    const enabledListener = WebMidi.addListener('enabled', updateInputs);
    const connectedListener = WebMidi.addListener('connected', updateInputs);
    const disconnectedListener = WebMidi.addListener(
      'disconnected',
      updateInputs,
    );
    return () => {
      if (!Array.isArray(enabledListener)) enabledListener.remove();
      if (!Array.isArray(connectedListener)) connectedListener.remove();
      if (!Array.isArray(disconnectedListener)) disconnectedListener.remove();
    };
  }, []);

  useEffect(() => {
    const selectedInput = devices[selectedIndex];
    if (selectedInput) {
      const noteOnListener = selectedInput.addListener('noteon', ({note}) => {
        playNote(note.number);
      });
      const noteOffListener = selectedInput.addListener('noteoff', ({note}) => {
        stopNote(note.number);
      });

      return () => {
        if (!Array.isArray(noteOnListener)) noteOnListener.remove();
        if (!Array.isArray(noteOffListener)) noteOffListener.remove();
      };
    }
  }, [devices, playNote, selectedIndex, stopNote]);

  if (!WebMidi.enabled) {
    return (
      <button type='button' className='bg-gray-4 px-2' onClick={connect}>
        Enable MIDI
      </button>
    );
  }

  if (!devices.length) {
    return 'No MIDI devices detected';
  }

  return (
    <select
      value={selectedIndex}
      className='bg-gray-4 px-2'
      onChange={(event) => {
        setSelectedIndex(parseInt(event.target.value, 10));
      }}
    >
      {devices.map((device, index) => (
        <option key={device.id} value={index}>
          {device.name}
        </option>
      ))}
    </select>
  );
}
