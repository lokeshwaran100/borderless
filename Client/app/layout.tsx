"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import AppProvider from "./components/providers";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Navbar from "./components/ui/Navbar";
import React, { useMemo } from 'react';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
  // BackpackWalletAdapter,
  // BraveWalletAdapter,
  CloverWalletAdapter,
  CoinbaseWalletAdapter,
  // ExodusWalletAdapter,
  // GlowWalletAdapter,
  HuobiWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  // SlopeWalletAdapter,
  // SolletWalletAdapter,
  SolongWalletAdapter,
  TorusWalletAdapter,
  TrustWalletAdapter
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from '@solana/web3.js';
import { AppProvider } from "./components/AppContext";
import "@solana/wallet-adapter-react-ui/styles.css";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Borderless",
  description: "Borderless and hasslefree transfer of tokens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session;
  getServerSession(authOptions).then((data)=>{
    session= data
  }).catch(e=>console.log(e));
  return (
    <html lang="en">
      <body className={inter.className}>
      <Context>
      {/* <AppProvider > */}
        <AppProvider session={session}>
          {/* <Navbar /> */}
          <Content children={children} />
        </AppProvider>
        </Context>
      </body>
    </html>
  );
}

const Context: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      // new SlopeWalletAdapter(),
      // new TorusWalletAdapter(),
      // new LedgerWalletAdapter(),
      // // new BackpackWalletAdapter(),
      // // new BraveWalletAdapter(),
      // new CloverWalletAdapter(),
      // new CoinbaseWalletAdapter(),
      // // new ExodusWalletAdapter(),
      // // new GlowWalletAdapter(),
      // new HuobiWalletAdapter(),
      // // new SolletWalletAdapter(),
      // new SolongWalletAdapter(),
      // new TrustWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const Content: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="App">

      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
};