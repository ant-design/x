import { useEvent } from 'rc-util';
import React from 'react';

// Ensure that the SpeechRecognition API is available in the browser
let SpeechRecognition: any;

if (!SpeechRecognition && typeof window !== 'undefined') {
  SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
}

export default function useSpeech() {
  // ======================== Speech Permission ========================
  const [permissionState, setPermissionState] = React.useState<PermissionState | null>(null);

  React.useEffect(() => {
    if (typeof navigator !== 'undefined' && 'permissions' in navigator) {
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
  const mergedAllowSpeech = SpeechRecognition && permissionState !== 'denied';

  // ========================== Speech Events ==========================
  const recognitionRef = React.useRef<any | null>(null);
  const [recording, setRecording] = React.useState(false);

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
        const transcript = (event as any).results?.[0]?.[0]?.transcript;
        console.log('Speech Recognition Result:', transcript);
      };

      recognitionRef.current = recognition;
    }
  };

  const triggerSpeech = useEvent(() => {
    ensureRecognition();

    if (recognitionRef.current) {
      if (recording) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
    }
  });

  return [mergedAllowSpeech, triggerSpeech] as const;
}
