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
  const noDeviceId = 'NO_DEVICE_ID';
  const [devices, setDevices] = useState<Input[]>(WebMidi.inputs);
  const [deviceId, setDeviceId] = useState<string | undefined>();

  useEffect(() => {
    const updateDevices = () => {
      const devices = [...WebMidi.inputs];
      setDevices(devices);

      if (devices.length === 1) {
        // If there's only one device, select it automatically
        setDeviceId(devices[0].id);
      }
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
    const device = deviceId ? WebMidi.getInputById(deviceId) : undefined;
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
  }, [deviceId, playNote, stopNote]);

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
      value={deviceId}
      className='bg-gray-4 px-2'
      onChange={(event) => {
        const {value} = event.target;
        if (value === noDeviceId) {
          setDeviceId(undefined);
        } else {
          setDeviceId(value);
        }
      }}
    >
      <option value={noDeviceId}>No device</option>
      {devices.map((device) => (
        <option key={device.id} value={device.id}>
          {device.name}
        </option>
      ))}
    </select>
  );
}
