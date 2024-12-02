import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Borderless } from "../target/types/borderless";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { AccountLayout, createAssociatedTokenAccount, createMint, mintTo, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { sleep } from "@raydium-io/raydium-sdk-v2";
// import { ASSOCIATED_TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";

import {
  // ORCA_WHIRLPOOL_PROGRAM_ID, ORCA_WHIRLPOOLS_CONFIG,
  PDAUtil, PriceMath, SwapUtils,
  swapQuoteByInputToken, WhirlpoolContext, buildWhirlpoolClient,
  increaseLiquidityQuoteByInputToken, decreaseLiquidityQuoteByLiquidity,
  PoolUtil, IGNORE_CACHE, TickUtil,
} from "@orca-so/whirlpools-sdk";
import { TransactionBuilder, resolveOrCreateATA, DecimalUtil, Percentage, Wallet, TransactionBuilderOptions } from "@orca-so/common-sdk";
import dotenv from "dotenv";
dotenv.config();
const bs58 = require('bs58');

function getAdminKeypair() {
    // const adminPrivateKey = new Buffer(process.env.NEXT_ADMIN_PK as string, 'base64').toString('ascii');
    const adminPrivateKey = process.env.NEXT_PUBLIC_ADMIN_PK as string
    return anchor.web3.Keypair.fromSecretKey(bs58.decode(adminPrivateKey));
}

function getProgramId() {
    return new anchor.web3.PublicKey(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string);
}

function getBorderlessStatePda(programId: PublicKey) {
    const [borderlessStatePdaAccount] = PublicKey.findProgramAddressSync(
        [
          anchor.utils.bytes.utf8.encode("borderless"),
        ],
        programId
      );

    return borderlessStatePdaAccount
}

const SYSTEM_PROGRAM_ID = anchor.web3.SystemProgram.programId;
const ORCA_WHIRLPOOL_PROGRAM_ID = new anchor.web3.PublicKey("whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc");
const ORCA_WHIRLPOOLS_CONFIG = new anchor.web3.PublicKey("FcrweFY1G9HJAHG5inkGB6pKg1HZ6x9UC2WioAfWrGkR");
const SOL = {mint: new PublicKey("So11111111111111111111111111111111111111112"), decimals: 9};
const USDC = {mint: new PublicKey("BRjpCHtyQLNCo8gqRUr8jtdAj5AjPYQaoqbvcZiHok1k"), decimals: 6};

const adminKeypair = getAdminKeypair();
const adminPublicKey = adminKeypair.publicKey;

export async function initialize(program: anchor.Program) {
    const platformTokenAccount = await createAndGetTokenAccount(
        program,
      adminPublicKey,
      USDC.mint,
      TOKEN_PROGRAM_ID
    );

    let txHash = await program.rpc.initialize(
      platformTokenAccount,
      platformTokenAccount,
      new anchor.BN(100),
      {accounts: {
        admin: adminPublicKey,
        state: getBorderlessStatePda(program.programId),
        systemProgram: SYSTEM_PROGRAM_ID
      },
      signers: [adminKeypair],
    });
    await displayPda(program);
    return txHash;
  }

  export async function uninitialize(program: anchor.Program) {
    let txHash = await program.rpc.uninitialize(
      {accounts: {
        admin: adminPublicKey,
        state: getBorderlessStatePda(program.programId),
        systemProgram: SYSTEM_PROGRAM_ID
      },
      signers: [adminKeypair],
    });
    // await displayPda(program);
    return txHash;
  }

  export async function transferDirect(
    program: anchor.Program, 
    senderPublicKey: PublicKey,
    receiverPublicKey: PublicKey,
    amount: number,
    senderKeypair?: Keypair) {
    const senderTokenAccount = await createAndGetTokenAccount(
        program,
      senderPublicKey,
      USDC.mint,
      TOKEN_PROGRAM_ID
    );
    const receiverTokenAccount = await createAndGetTokenAccount(
        program,
      receiverPublicKey,
      USDC.mint,
      TOKEN_PROGRAM_ID
    );
    const platformTokenAccount = await createAndGetTokenAccount(
        program,
      adminPublicKey,
      USDC.mint,
      TOKEN_PROGRAM_ID
    );
    if (!senderKeypair) {
        return null;
    }
    let txHash = await program.rpc.transferDirect(
      new anchor.BN(amount * 10**6),
      {accounts: {
        state: getBorderlessStatePda(program.programId),
        admin: adminPublicKey,
        sender: senderPublicKey,
        receiver: receiverPublicKey,
        mint: USDC.mint,
        senderTokenAccount: senderTokenAccount,
        receiverTokenAccount: receiverTokenAccount,
        platformTokenAccount: platformTokenAccount,
        systemProgram: SYSTEM_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
      },
      signers: [senderKeypair, adminKeypair],
    });
    await displayPda(program);
    return txHash;
  }

  export async function transferWithSwap(
    program: anchor.Program, 
    senderPublicKey: PublicKey,
    receiverPublicKey: PublicKey,
    amount: number,
    senderKeypair?: Keypair) {
    const senderWsolAccount = await createAndGetTokenAccount(
        program,
      senderPublicKey,
      SOL.mint,
      TOKEN_PROGRAM_ID
    );
    const senderTokenAccount = await createAndGetTokenAccount(
        program,
      senderPublicKey,
      USDC.mint,
      TOKEN_PROGRAM_ID
    );
    const receiverTokenAccount = await createAndGetTokenAccount(
        program,
      receiverPublicKey,
      USDC.mint,
      TOKEN_PROGRAM_ID
    );
    const platformTokenAccount = await createAndGetTokenAccount(
        program,
      adminPublicKey,
      USDC.mint,
      TOKEN_PROGRAM_ID
    );
    
    const provider = anchor.AnchorProvider.env();
    const sol_usdc_whirlpool_pubkey = PDAUtil.getWhirlpool(ORCA_WHIRLPOOL_PROGRAM_ID, ORCA_WHIRLPOOLS_CONFIG, SOL.mint, USDC.mint, 64).publicKey;
    const whirlpool_ctx = WhirlpoolContext.withProvider(provider, ORCA_WHIRLPOOL_PROGRAM_ID);
    const fetcher = whirlpool_ctx.fetcher;
    const sol_usdc_whirlpool_oracle_pubkey = PDAUtil.getOracle(ORCA_WHIRLPOOL_PROGRAM_ID, sol_usdc_whirlpool_pubkey).publicKey;
    const sol_usdc_whirlpool = await fetcher.getPool(sol_usdc_whirlpool_pubkey);

    const a_to_b = true;
    const sqrt_price_limit = SwapUtils.getDefaultSqrtPriceLimit(a_to_b);

    if (!sol_usdc_whirlpool){
        console.error("No pool available");
        return null
    }
    
    const tickarrays = SwapUtils.getTickArrayPublicKeys(
      sol_usdc_whirlpool.tickCurrentIndex,
      sol_usdc_whirlpool.tickSpacing,
      a_to_b,
      ORCA_WHIRLPOOL_PROGRAM_ID,
      sol_usdc_whirlpool_pubkey
    );

    if (!senderKeypair) {
        return null;
    }

    let txHash = await program.rpc.transferWithSwap(
      new anchor.BN(amount * LAMPORTS_PER_SOL),
      sqrt_price_limit,
      {accounts: {
        state: getBorderlessStatePda(program.programId),
        admin: adminPublicKey,
        sender: senderPublicKey,
        receiver: receiverPublicKey,
        receiverTokenAccount: receiverTokenAccount,
        platformTokenAccount: platformTokenAccount,
        tokenMintA: SOL.mint,
        tokenMintB: USDC.mint,
        systemProgram: SYSTEM_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        whirlpoolProgram: ORCA_WHIRLPOOL_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        whirlpool: sol_usdc_whirlpool_pubkey,
        tokenOwnerAccountA: senderWsolAccount,
        tokenVaultA: sol_usdc_whirlpool.tokenVaultA,
        tokenOwnerAccountB: senderTokenAccount,
        tokenVaultB: sol_usdc_whirlpool.tokenVaultB,
        tickArray0: tickarrays[0],
        tickArray1: tickarrays[1],
        tickArray2: tickarrays[2],
        oracle:sol_usdc_whirlpool_oracle_pubkey
      },
      signers: [senderKeypair, adminKeypair],
    });
    await displayPda(program);
    return txHash;
  }

  async function displayPda(program: anchor.Program) {
    const pda_account = await program.account.borderlessState.fetch(
      getBorderlessStatePda(program.programId)
    );
    console.log(
      `(bump:${pda_account.bump.toString()},platformUsdcAccount:${pda_account.platformUsdcAccount.toString()},platformUsdtAccount:${pda_account.platformUsdtAccount.toString()},platformFeePer10000:${pda_account.platformFeePer10000.toString()},platformFeeCollected:${pda_account.platformFeeCollected.toString()})`
    );

    // console.log(
    //   "Admin Balance       : ",
    //   await connection.getBalance(adminPublicKey)
    // );

    // console.log(
    //   "Sender Balance       : ",
    //   await connection.getBalance(senderPublicKey)
    // );
  }

  async function createAndGetTokenAccount(
        program: anchor.Program,
      publicKey: anchor.web3.PublicKey,
      tokenMint: anchor.web3.PublicKey,
      tokenProgramId: anchor.web3.PublicKey
  ) {
      const tokenList = await program.provider.connection.getTokenAccountsByOwner(
          publicKey,
          { mint: tokenMint, programId: tokenProgramId }
      );

      let tokenAccount = null;
      if (tokenList.value.length > 0) {
        tokenAccount = tokenList.value[0].pubkey;
      } else {
          // Create associated token accounts for the new accounts
          tokenAccount = await createAssociatedTokenAccount(
              program.provider.connection,
              adminKeypair,
              tokenMint,
              publicKey,
              undefined,
              tokenProgramId
          );
      }
      return tokenAccount;
  }