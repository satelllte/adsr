import {useEffect, useState} from 'react';
import {type Input, WebMidi, type NoteMessageEvent} from 'webmidi';

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

    WebMidi.addListener('enabled', updateInputs);
    WebMidi.addListener('connected', updateInputs);
    WebMidi.addListener('disconnected', updateInputs);

    return () => {
      WebMidi.removeListener('enabled', updateInputs);
      WebMidi.removeListener('connected', updateInputs);
      WebMidi.removeListener('disconnected', updateInputs);
    };
  }, []);

  useEffect(() => {
    const selectedInput = devices[selectedIndex];
    if (selectedInput) {
      const onNoteOn = ({note}: NoteMessageEvent) => {
        playNote(note.number);
      };

      const onNoteOff = ({note}: NoteMessageEvent) => {
        stopNote(note.number);
      };

      selectedInput.addListener('noteon', onNoteOn);
      selectedInput.addListener('noteoff', onNoteOff);

      return () => {
        selectedInput.removeListener('noteon', onNoteOn);
        selectedInput.removeListener('noteoff', onNoteOff);
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
