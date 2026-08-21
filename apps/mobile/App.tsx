import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { RehearsalSpikeScreen } from "@/features/rehearsal/rehearsal-spike-screen";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <RehearsalSpikeScreen />
    </SafeAreaProvider>
  );
}
