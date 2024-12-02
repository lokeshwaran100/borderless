"use client";
import {
    useState, useEffect, FC, ReactNode, createContext, useContext
} from 'react';
import * as anchor from "@coral-xyz/anchor";
import { Program, setProvider } from "@coral-xyz/anchor";
// import * as anchor from '@project-serum/anchor';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
// import idl from '../../../app/idl.json';
// import * as idl from "../../../target/idl/borderless.json";
import idl from "../../../target/idl/borderless.json";
import type { Borderless } from "../../../target/types/borderless";
// import idl from "./idl.json";
import { SessionProvider } from "next-auth/react";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";


// const idl = require("../../../target/idl/borderless.json"); // Ensure this path is correct

interface AppContextProps {
    provider: anchor.AnchorProvider | null;
    program: anchor.Program | null;
    userPublicKey: anchor.web3.PublicKey | null;
}

// Initial context value
const initialContext: AppContextProps = {
    provider: null,
    program: null,
    userPublicKey: null,
};

const AppContext = createContext<AppContextProps>(initialContext);

const getConnection = () => {
    const connection = new anchor.web3.Connection(
        "https://api.devnet.solana.com",
        "confirmed"
    );
    return connection;
};

const getProgramId = () => {
    const PROGRAM_ID = new anchor.web3.PublicKey(
        process.env.NEXT_PUBLIC_PROGRAM_ID as string
    );
    return PROGRAM_ID;
};

export const AppProvider: FC<{ children: ReactNode, session: any }> = ({ children, session }) => {
    const wallet = useAnchorWallet();
    // const { connection } = useConnection();
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");



    const [provider, _setProvider] = useState<anchor.AnchorProvider | null>(null);
    const [program, setProgram] = useState<anchor.Program | null>(null);
    const [userPublicKey, setUserPublicKey] = useState<anchor.web3.PublicKey | null>(null);

    useEffect(() => {
        if (!wallet) {
            return;
        }
        
        // const connection = getConnection();
        const provider = new anchor.AnchorProvider(
            connection, wallet, {
                commitment: "processed",
            }
        );
        setProvider(provider);
        _setProvider(provider);

        const programId = getProgramId();
        console.log('programId',programId.toString())
        console.log('idl',idl)
        console.log('JSON.stringify(idl)',JSON.stringify(idl))
        console.log('JSON.parse(JSON.stringify(idl))',JSON.parse(JSON.stringify(idl)))
        // const program = new anchor.Program(
        //     idl,
        //     // JSON.parse(JSON.stringify(idl)),
        //     programId,
        //     provider
        // );
        // const program = new Program(idl as Borderless, {
        //     connection,
        //   });
          const program = new Program(idl as Borderless, 
                  provider
            );
        setProgram(program);

        setUserPublicKey(provider.wallet.publicKey);
    }, [wallet]);

    return (
        <SessionProvider session={session}>
        <AppContext.Provider value={{ provider, program, userPublicKey }}>
            {children}
        </AppContext.Provider>
        </SessionProvider>
    );
};

export const useAppContext = () => useContext(AppContext);
