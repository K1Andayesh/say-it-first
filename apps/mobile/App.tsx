import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { RehearsalSpikeScreen } from "@/features/rehearsal/rehearsal-spike-screen";
import { BillingProvider } from "@/services/billing/billing-provider";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <BillingProvider>
        <RehearsalSpikeScreen />
      </BillingProvider>
    </SafeAreaProvider>
  );
}
