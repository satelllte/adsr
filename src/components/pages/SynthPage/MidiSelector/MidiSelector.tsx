import {useEffect, useState} from 'react';
import {type Input, WebMidi, type NoteMessageEvent} from 'webmidi';
import {MidiSelectorContainer} from './MidiSelectorContainer';
import {Button} from '@/components/ui/Button';

type MidiSelectorProps = {
  playNote: (note: number) => void;
  stopNote: (note: number) => void;
};

export function MidiSelector({playNote, stopNote}: MidiSelectorProps) {
  const [enabled, setEnabled] = useState<boolean>(WebMidi.enabled);
  const [devices, setDevices] = useState<Input[]>(WebMidi.inputs);
  const [deviceId, setDeviceId] = useState<string | undefined>();

  const connect = async () => {
    try {
      await WebMidi.enable();
      setEnabled(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let isFirstLoad = true;

    const updateDevices = () => {
      const devices = [...WebMidi.inputs];
      setDevices(devices);

      // Select device automatically on:
      // - first load
      // - if there's only one device left
      if ((isFirstLoad && devices.length) || devices.length === 1) {
        setDeviceId(devices[0].id);
      }

      isFirstLoad = false;
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

  const isEnabled = Boolean(enabled && deviceId);

  if (!enabled) {
    return (
      <MidiSelectorContainer isEnabled={isEnabled}>
        <Button size='small' onClick={connect}>
          Connect
        </Button>
      </MidiSelectorContainer>
    );
  }

  const noDeviceOptionId = 'NO_DEVICE_ID';
  return (
    <MidiSelectorContainer isEnabled={isEnabled}>
      <select
        value={deviceId}
        onChange={(event) => {
          const {value} = event.target;
          if (value === noDeviceOptionId) {
            setDeviceId(undefined);
          } else {
            setDeviceId(value);
          }
        }}
      >
        <option value={noDeviceOptionId}>No device</option>
        {devices.map((device) => (
          <option key={device.id} value={device.id}>
            {device.name}
          </option>
        ))}
      </select>
    </MidiSelectorContainer>
  );
}
