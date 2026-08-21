import {
  DeviceEventEmitter,
  Platform,
  type EmitterSubscription,
} from "react-native";
import InCallManager from "react-native-incall-manager";

import { diagnosticLog } from "@/services/diagnostics/diagnostic-log";

type AudioDeviceChangedEvent = {
  availableAudioDeviceList?: string;
  selectedAudioDevice?: string;
};

/**
 * Owns the native audio focus and output route for a realtime rehearsal.
 *
 * react-native-webrtc transports and decodes remote audio, but it does not
 * manage Android's call audio route. Without an explicit session, the device
 * can render the track through the earpiece or lose the audible route while
 * RTP and Realtime events continue normally.
 */
export class RealtimeAudioSession {
  private active = false;
  private routeSubscription: EmitterSubscription | null = null;

  public async start(): Promise<void> {
    if (this.active) return;

    this.routeSubscription = DeviceEventEmitter.addListener(
      "onAudioDeviceChanged",
      (event: AudioDeviceChangedEvent) => {
        diagnosticLog.record("info", "realtime.audio.route_changed", {
          availableRoutes: event.availableAudioDeviceList ?? "unknown",
          selectedRoute: event.selectedAudioDevice ?? "unknown",
        });
      },
    );

    try {
      // `video` is the library's speaker-first route profile. It does not turn
      // on video; it keeps the voice rehearsal audible on the loudspeaker while
      // still allowing Android to prefer a newly connected headset/Bluetooth.
      InCallManager.start({ media: "video", auto: true });
      if (Platform.OS === "android") InCallManager.setSpeakerphoneOn(true);
      const audioFocusResult: unknown =
        Platform.OS === "android"
          ? await InCallManager.requestAudioFocus()
          : "managed_by_ios_audio_session";
      this.active = true;

      diagnosticLog.record("info", "realtime.audio.session_started", {
        focusResult: String(audioFocusResult),
        requestedRoute: Platform.OS === "android" ? "speaker" : "system_default",
      });
    } catch (error) {
      this.routeSubscription?.remove();
      this.routeSubscription = null;
      InCallManager.stop();
      const normalized = error instanceof Error ? error : new Error("Audio session setup failed.");
      diagnosticLog.record("error", "realtime.audio.session_failed", {
        errorType: normalized.name,
      });
      throw normalized;
    }
  }

  public stop(): void {
    if (!this.active && !this.routeSubscription) return;
    this.active = false;
    this.routeSubscription?.remove();
    this.routeSubscription = null;
    InCallManager.stop();
    diagnosticLog.record("info", "realtime.audio.session_stopped");
  }
}
