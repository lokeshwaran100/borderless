import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Borderless } from "../target/types/borderless";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { AccountLayout, createAssociatedTokenAccount, createMint, mintTo, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { sleep } from "@raydium-io/raydium-sdk-v2";
import { ASSOCIATED_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";

import {
  // ORCA_WHIRLPOOL_PROGRAM_ID, ORCA_WHIRLPOOLS_CONFIG,
  PDAUtil, PriceMath, SwapUtils,
  swapQuoteByInputToken, WhirlpoolContext, buildWhirlpoolClient,
  increaseLiquidityQuoteByInputToken, decreaseLiquidityQuoteByLiquidity,
  PoolUtil, IGNORE_CACHE, TickUtil,
} from "@orca-so/whirlpools-sdk";
import { TransactionBuilder, resolveOrCreateATA, DecimalUtil, Percentage, Wallet, TransactionBuilderOptions } from "@orca-so/common-sdk";

describe("borderless", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const connection = provider.connection;
  const program = anchor.workspace.Borderless as Program<Borderless>;

  const SYSTEM_PROGRAM_ID = anchor.web3.SystemProgram.programId;
  const ANCHOR_PROGRAM_ID = program.programId;
  // const TOKEN_MINT = new PublicKey("So11111111111111111111111111111111111111112");
  // const SOL_MINT = new PublicKey("So11111111111111111111111111111111111111112");
  const ORCA_WHIRLPOOL_PROGRAM_ID = new anchor.web3.PublicKey("whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc");
  const ORCA_WHIRLPOOLS_CONFIG = new anchor.web3.PublicKey("FcrweFY1G9HJAHG5inkGB6pKg1HZ6x9UC2WioAfWrGkR");
  // // let tokenMint = null;
  // // const tokenMint = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"); // Mainnet USDC
  // // let tokenMint = new PublicKey("BRjpCHtyQLNCo8gqRUr8jtdAj5AjPYQaoqbvcZiHok1k"); // Devnet USDC-dev
  // let tokenMint = new PublicKey("BRjpCHtyQLNCo8gqRUr8jtdAj5AjPYQaoqbvcZiHok1k"); // Devnet Orca USDC

  const SOL = {mint: new PublicKey("So11111111111111111111111111111111111111112"), decimals: 9};
  // const SOL = {mint: new PublicKey("4ShvTPQ3jYZzwUpxoQFSCDZxLtxQYNPUfeL3sR9mzLjJ"), decimals: 9};
  // const USDC = {mint: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"), decimals: 6};
  // const USDC = {mint: new PublicKey("9eKgmUSfTkQLRBvowV9zjY3BbhAQVaGSw1jfon5UwUJM"), decimals: 6};
  const USDC = {mint: new PublicKey("BRjpCHtyQLNCo8gqRUr8jtdAj5AjPYQaoqbvcZiHok1k"), decimals: 6};

  const adminKeypair = (provider.wallet as anchor.Wallet).payer;
  const adminPublicKey = adminKeypair.publicKey;
 
  const secretKey = Buffer.from(anchor.web3.Keypair.generate().secretKey);
  console.log("Secret Key:", secretKey.toString("hex"));
  console.log("Secret Key Array:", Object.values(secretKey));
  // const secretKey = new Uint8Array([
  //   152, 177, 183, 87, 170, 4, 139, 39, 170, 201, 191, 162, 250, 191, 223, 107,
  //   214, 226, 7, 195, 106, 57, 182, 238, 217, 125, 48, 239, 91, 216, 160, 8, 83,
  //   226, 254, 197, 105, 131, 141, 68, 188, 42, 238, 209, 33, 5, 173, 198, 210,
  //   255, 221, 234, 15, 48, 132, 173, 169, 24, 101, 176, 142, 50, 72, 139
  // ]);
  const senderKeypair = anchor.web3.Keypair.fromSecretKey(new Uint8Array([
    66,  86, 112, 147, 179,  96, 223,  65, 244, 140, 114,
    98, 150, 155, 130, 103, 231,  62,  90, 234,  39, 200,
   122, 171,  73, 222, 204, 182, 238, 159, 197, 143, 253,
   210, 219,  48, 118,  70, 193, 182, 130,  58, 131, 138,
   130, 128,  70, 241, 128, 183,  54,  83, 180,  29, 154,
    59, 134, 200,  46, 157, 191,  46,  81, 133]
  ));
  // const senderKeypair = anchor.web3.Keypair.generate();
  const senderPublicKey = senderKeypair.publicKey;
  
  const receiverKeypair = anchor.web3.Keypair.fromSecretKey(new Uint8Array([
      246, 217,  55,  21, 129, 226,  19, 185, 223,  29,  76,
       48, 201, 238, 216, 246, 146, 165, 189,  18, 166,  64,
      103, 109, 103, 200, 132,  61, 141,   3,  25, 129, 124,
       97,  60,  82,  29, 163, 254,  83, 211,  92, 242, 136,
      165,  55, 251,   9,  88, 155, 103,   4, 143, 203,  92,
      152,  42, 201, 211,  89,  87,  27,  25, 107
    ]
  ));
  // const receiverKeypair = anchor.web3.Keypair.generate();
  const receiverPublicKey = receiverKeypair.publicKey;

  const [borderlessStatePdaAccount] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("borderless"),
    ],
    ANCHOR_PROGRAM_ID
  );

  console.log("ANCHOR_PROGRAM_ID:", ANCHOR_PROGRAM_ID.toString());
  console.log("adminPublicKey:", adminPublicKey.toString());
  console.log("senderPublicKey:", senderPublicKey.toString());
  console.log("receiverPublicKey:", receiverPublicKey.toString());
  console.log("SOL:", SOL.mint.toString());
  console.log("USDC:", USDC.mint.toString());
  console.log("borderlessStatePdaAccount:", borderlessStatePdaAccount.toString());

  it("Uninitialize!", async () => {
    const txHash = await uninitialize();
    console.log("uninitialize", txHash);
  });

  it("Initialize!", async () => {
    const txHash = await initialize();
    console.log("initialize", txHash);
  });

  it("transferDirect!", async () => {
    const txHash = await transferDirect();
    console.log("transferDirect", txHash);
  });

  it("transferWithSwap!", async () => {
    const txHash = await transferWithSwap();
    console.log("transferWithSwap", txHash);
  });

  async function initialize() {
    const platformTokenAccount = await createAndGetTokenAccount(
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
        state: borderlessStatePdaAccount,
        systemProgram: SYSTEM_PROGRAM_ID
      },
      signers: [adminKeypair],
    });
    await displayPda();
    return txHash;
  }

  async function uninitialize() {
    let txHash = await program.rpc.uninitialize(
      {accounts: {
        admin: adminPublicKey,
        state: borderlessStatePdaAccount,
        systemProgram: SYSTEM_PROGRAM_ID
      },
      signers: [adminKeypair],
    });
    // await displayPda();
    return txHash;
  }

  async function transferDirect() {
    const senderTokenAccount = await createAndGetTokenAccount(
      senderPublicKey,
      USDC.mint,
      TOKEN_PROGRAM_ID
    );
    const receiverTokenAccount = await createAndGetTokenAccount(
      receiverPublicKey,
      USDC.mint,
      TOKEN_PROGRAM_ID
    );
    const platformTokenAccount = await createAndGetTokenAccount(
      adminPublicKey,
      USDC.mint,
      TOKEN_PROGRAM_ID
    );
    // await sleep(5000);
    let txHash = await program.rpc.transferDirect(
      new anchor.BN(0.1 * 10**6),
      {accounts: {
        state: borderlessStatePdaAccount,
        admin: adminPublicKey,
        sender: senderPublicKey,
        receiver: receiverPublicKey,
        mint: USDC.mint,
        senderTokenAccount: senderTokenAccount,
        receiverTokenAccount: receiverTokenAccount,
        platformTokenAccount: platformTokenAccount,
        systemProgram: SYSTEM_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID
      },
      signers: [senderKeypair, adminKeypair],
    });
    await displayPda();
    return txHash;
  }

  async function transferWithSwap() {
    const senderWsolAccount = await createAndGetTokenAccount(
      senderPublicKey,
      SOL.mint,
      TOKEN_PROGRAM_ID
    );
    const senderTokenAccount = await createAndGetTokenAccount(
      senderPublicKey,
      USDC.mint,
      TOKEN_PROGRAM_ID
    );
    const receiverTokenAccount = await createAndGetTokenAccount(
      receiverPublicKey,
      USDC.mint,
      TOKEN_PROGRAM_ID
    );
    const platformTokenAccount = await createAndGetTokenAccount(
      adminPublicKey,
      USDC.mint,
      TOKEN_PROGRAM_ID
    );
    // await sleep(5000);
    
    const sol_usdc_whirlpool_pubkey = PDAUtil.getWhirlpool(ORCA_WHIRLPOOL_PROGRAM_ID, ORCA_WHIRLPOOLS_CONFIG, SOL.mint, USDC.mint, 64).publicKey;
    const whirlpool_ctx = WhirlpoolContext.withProvider(provider, ORCA_WHIRLPOOL_PROGRAM_ID);
    const fetcher = whirlpool_ctx.fetcher;
    const sol_usdc_whirlpool_oracle_pubkey = PDAUtil.getOracle(ORCA_WHIRLPOOL_PROGRAM_ID, sol_usdc_whirlpool_pubkey).publicKey;
    const sol_usdc_whirlpool = await fetcher.getPool(sol_usdc_whirlpool_pubkey);

    const a_to_b = true;
    const sqrt_price_limit = SwapUtils.getDefaultSqrtPriceLimit(a_to_b);
    
    const tickarrays = SwapUtils.getTickArrayPublicKeys(
      sol_usdc_whirlpool.tickCurrentIndex,
      sol_usdc_whirlpool.tickSpacing,
      a_to_b,
      ORCA_WHIRLPOOL_PROGRAM_ID,
      sol_usdc_whirlpool_pubkey
    );

    let txHash = await program.rpc.transferWithSwap(
      new anchor.BN(0.1 * LAMPORTS_PER_SOL),
      sqrt_price_limit,
      {accounts: {
        state: borderlessStatePdaAccount,
        admin: adminPublicKey,
        sender: senderPublicKey,
        receiver: receiverPublicKey,
        receiverTokenAccount: receiverTokenAccount,
        platformTokenAccount: platformTokenAccount,
        tokenMintA: SOL.mint,
        tokenMintB: USDC.mint,
        systemProgram: SYSTEM_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
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
    await displayPda();
    return txHash;
  }

  async function displayPda() {
    const pda_account = await program.account.borderlessState.fetch(
      borderlessStatePdaAccount
    );
    console.log(
      `(bump:${pda_account.bump.toString()},platformUsdcAccount:${pda_account.platformUsdcAccount.toString()},platformUsdtAccount:${pda_account.platformUsdtAccount.toString()},platformFeePer10000:${pda_account.platformFeePer10000.toString()},platformFeeCollected:${pda_account.platformFeeCollected.toString()})`
    );

    console.log(
      "Admin Balance       : ",
      await connection.getBalance(adminPublicKey)
    );

    console.log(
      "Sender Balance       : ",
      await connection.getBalance(senderPublicKey)
    );
  }

  async function createAndGetTokenAccount(
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
              connection,
              adminKeypair,
              tokenMint,
              publicKey,
              null,
              tokenProgramId
          );
      }
      return tokenAccount;
  }

  async function requestAirdrop(publicKey: PublicKey, amount: number) {
    const signature = await connection.requestAirdrop(publicKey, amount * LAMPORTS_PER_SOL);
      await connection.confirmTransaction(signature);
      await sleep(5000);
  }

});
