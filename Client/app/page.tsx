"use client";
import React, { useEffect, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import { LoginButton } from "./components/LoginButton";
import { useOkto, OktoContextType, BuildType } from "okto-sdk-react";
import GetButton from "./components/GetButton";
import TransferTokens from "./components/TransferTokens";
import { useAppContext } from "./components/AppContext";
import AuthButton from "./components/AuthButton";
import SendRawTransaction from "./components/SendRawTransaction";
import { RecentContacts } from './components/RecentTransactions';
import Navbar from "./components/ui/Navbar";

export default function Home() {
  const { data: session } = useSession();
  const { apiKey, setApiKey, buildType, setBuildType } = useAppContext();
  const {
    isLoggedIn,
    authenticate,
    authenticateWithUserId,
    logOut,
    getPortfolio,
    transferTokens,
    getWallets,
    createWallet,
    getSupportedNetworks,
    getSupportedTokens,
    getUserDetails,
    orderHistory,
    getNftOrderDetails,
    showWidgetModal,
    getRawTransactionStatus,
    transferTokensWithJobStatus,
    transferNft,
    transferNftWithJobStatus,
    executeRawTransaction,
    executeRawTransactionWithJobStatus,
    setTheme,
    getTheme,
  } = useOkto() as OktoContextType;
  const idToken = useMemo(() => (session ? session.id_token : null), [session]);


  async function handleAuthenticate(): Promise<any> {
    if (!idToken) {
      return { result: false, error: "No google login" };
    }
    return new Promise((resolve) => {
      authenticate(idToken, (result: any, error: any) => {
        if (result) {
          console.log("Authentication successful");
          resolve({ result: true });
        } else if (error) {
          console.error("Authentication error:", error);
          resolve({ result: false, error });
        }
      });
    });
  }

  async function handleLogout() {
    try {
      logOut();
      return { result: "logout success" };
    } catch (error) {
      return { result: "logout failed" };
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      console.log("Okto is authenticated");
    }
  }, [isLoggedIn]);

  return (
    <>
    <Navbar/>
        <main className="flex min-h-screen flex-col items-center space-y-6 p-12 bg-violet-200">
      {session && <RecentContacts />}
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg mt-8">
{/* 
        <GetButton title="Okto Authenticate" apiFn={handleAuthenticate} />
        <AuthButton authenticateWithUserId={authenticateWithUserId}/>
        <GetButton title="Okto Log out" apiFn={handleLogout} />
        <GetButton title="getPortfolio" apiFn={getPortfolio} />
        <GetButton title="getSupportedNetworks" apiFn={getSupportedNetworks} />
        <GetButton title="getSupportedTokens" apiFn={getSupportedTokens} />
        <GetButton title="getUserDetails" apiFn={getUserDetails} />
        <GetButton title="getWallets" apiFn={getWallets} />
        <GetButton title="createWallet" apiFn={createWallet} />
        <GetButton title="orderHistory" apiFn={() => orderHistory({})} /> */}
        {/* <GetButton title="getRawTransactionStatus" apiFn={() => getRawTransactionStatus({})} /> */}
        {/* <GetButton
          title="getNftOrderDetails"
          apiFn={() => getNftOrderDetails({})}
        /> */}
        {/* <button
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => {
            showWidgetModal();
          }}
        >
          Show Modal
        </button> */}
      </div>
      {/* <div className="flex flex-col gap-2 w-full max-w-lg">
        <TransferTokens apiFn={transferTokens} />
        <SendRawTransaction apiFn={executeRawTransaction} />
      </div> */}
    </main>
    </>
  );
}
