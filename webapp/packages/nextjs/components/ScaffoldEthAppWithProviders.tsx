"use client";

import { usePathname } from "next/navigation";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { Header } from "~~/components/Header";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  useInitializeNativeCurrencyPrice();
  const pathname = usePathname();

  return (
    <>
      <div className={`flex flex-col`} style={{ height: "100vh" }}>
        <Header hideReg={pathname === "/register-agent"} hideView={pathname === "/agent-dashboard"} />
        {children}
      </div>
    </>
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {/* @ts-ignore */}
        <OnchainKitProvider apiKey={process.env.NEXT_PUBLIC_ONCHAIN_KIT_CLIENT_API_KEY} chain={baseSepolia}>
          <ScaffoldEthApp>{children}</ScaffoldEthApp>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
