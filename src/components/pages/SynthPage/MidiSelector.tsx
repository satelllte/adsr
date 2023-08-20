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
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState(0);

  useEffect(() => {
    const updateDevices = () => {
      setDevices([...WebMidi.inputs]);
    };

    WebMidi.addListener('enabled', updateDevices);
    WebMidi.addListener('connected', updateDevices);
    WebMidi.addListener('disconnected', updateDevices);

    return () => {
      WebMidi.removeListener('enabled', updateDevices);
      WebMidi.removeListener('connected', updateDevices);
      WebMidi.removeListener('disconnected', updateDevices);
    };
  }, []);

  useEffect(() => {
    const device = devices[selectedDeviceIndex];
    if (device) {
      const noteOn = ({note}: NoteMessageEvent) => {
        playNote(note.number);
      };

      const noteOff = ({note}: NoteMessageEvent) => {
        stopNote(note.number);
      };

      device.addListener('noteon', noteOn);
      device.addListener('noteoff', noteOff);

      return () => {
        device.removeListener('noteon', noteOn);
        device.removeListener('noteoff', noteOff);
      };
    }
  }, [devices, playNote, selectedDeviceIndex, stopNote]);

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
      value={selectedDeviceIndex}
      className='bg-gray-4 px-2'
      onChange={(event) => {
        setSelectedDeviceIndex(parseInt(event.target.value, 10));
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
