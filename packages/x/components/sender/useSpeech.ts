import { useEvent, useMergedState } from 'rc-util';
import React from 'react';

// Ensure that the SpeechRecognition API is available in the browser
let SpeechRecognition: any;

if (!SpeechRecognition && typeof window !== 'undefined') {
  SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
}

export type ControlledSpeechConfig = {
  recording?: boolean;
  onRecordingChange: (recording: boolean) => void;
};

export type AllowSpeech = boolean | ControlledSpeechConfig;

export default function useSpeech(
  onSpeech: (transcript: string) => void,
  allowSpeech?: AllowSpeech,
) {
  const onEventSpeech = useEvent(onSpeech);
  // ========================== Speech Config ==========================
  const [controlledRecording, onControlledRecordingChange, speechInControlled] =
    React.useMemo(() => {
      if (typeof allowSpeech === 'object') {
        return [
          allowSpeech.recording,
          allowSpeech.onRecordingChange,
          typeof allowSpeech.recording === 'boolean',
        ] as const;
      }

      return [undefined, undefined, false] as const;
    }, [allowSpeech]);

  // ======================== Speech Permission ========================
  const [permissionState, setPermissionState] = React.useState<PermissionState | null>(null);

  React.useEffect(() => {
    if (
      typeof allowSpeech !== 'object' &&
      typeof navigator !== 'undefined' &&
      'permissions' in navigator
    ) {
      let lastPermission: PermissionStatus | null = null;

      (navigator as any).permissions
        .query({ name: 'microphone' })
        .then((permissionStatus: PermissionStatus) => {
          setPermissionState(permissionStatus.state);

          // Keep the last permission status.
          permissionStatus.onchange = function () {
            setPermissionState(this.state);
          };

          lastPermission = permissionStatus;
        });

      return () => {
        // Avoid memory leaks
        if (lastPermission) {
          lastPermission.onchange = null;
        }
      };
    }
  }, []);

  // Convert permission state to a simple type
  const mergedAllowSpeech =
    typeof allowSpeech !== 'object' ? SpeechRecognition && permissionState !== 'denied' : true;

  // ========================== Speech Events ==========================
  const recognitionRef = React.useRef<any | null>(null);
  const [recording, setRecording] = useMergedState(false, {
    value: controlledRecording,
  });

  const forceBreakRef = React.useRef(false);

  const ensureRecognition = () => {
    if (mergedAllowSpeech && !recognitionRef.current) {
      const recognition = new SpeechRecognition();

      recognition.onstart = () => {
        setRecording(true);
      };

      recognition.onend = () => {
        setRecording(false);
      };

      recognition.onresult = (event: SpeechRecognitionResult) => {
        if (!forceBreakRef.current) {
          const transcript = (event as any).results?.[0]?.[0]?.transcript;
          onEventSpeech(transcript);
        }

        forceBreakRef.current = false;
      };

      recognitionRef.current = recognition;
    }
  };

  const triggerSpeech = useEvent((forceBreak: boolean) => {
    // Ignore if `forceBreak` but is not recording
    if (forceBreak && !recording) {
      return;
    }

    forceBreakRef.current = forceBreak;

    if (speechInControlled) {
      // If in controlled mode, do nothing
      onControlledRecordingChange?.(!recording);
    } else {
      ensureRecognition();

      if (recognitionRef.current) {
        if (recording) {
          recognitionRef.current.stop();
          onControlledRecordingChange?.(false);
        } else {
          recognitionRef.current.start();
          onControlledRecordingChange?.(true);
        }
      }
    }
  });

  return [mergedAllowSpeech, triggerSpeech, recording] as const;
}
