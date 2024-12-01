import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Borderless } from "../target/types/borderless";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

describe("borderless", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const connection = provider.connection;
  const program = anchor.workspace.Borderless as Program<Borderless>;

  const SYSTEM_PROGRAM_ID = anchor.web3.SystemProgram.programId;
  const ANCHOR_PROGRAM_ID = program.programId;
  const TOKEN_MINT = new PublicKey("So11111111111111111111111111111111111111112");
  const SOL_MINT = new PublicKey("So11111111111111111111111111111111111111112");

  const adminKeypair = (provider.wallet as anchor.Wallet).payer;
  const adminPublicKey = adminKeypair.publicKey;
 
  // const secretKey = Buffer.from(anchor.web3.Keypair.generate().secretKey);
  // console.log("Secret Key:", secretKey.toString("hex"));
  // console.log("Secret Key Array:", Object.values(secretKey));
  // const secretKey = new Uint8Array([
  //   152, 177, 183, 87, 170, 4, 139, 39, 170, 201, 191, 162, 250, 191, 223, 107,
  //   214, 226, 7, 195, 106, 57, 182, 238, 217, 125, 48, 239, 91, 216, 160, 8, 83,
  //   226, 254, 197, 105, 131, 141, 68, 188, 42, 238, 209, 33, 5, 173, 198, 210,
  //   255, 221, 234, 15, 48, 132, 173, 169, 24, 101, 176, 142, 50, 72, 139
  // ]);
  // const senderKeypair = anchor.web3.Keypair.fromSecretKey(secretKey);
  const senderKeypair = anchor.web3.Keypair.generate();
  const senderPublicKey = senderKeypair.publicKey;

  const [borderlessStatePdaAccount] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("borderless"),
    ],
    ANCHOR_PROGRAM_ID
  );

  console.log("adminPublicKey:", adminPublicKey.toString());
  console.log("senderPublicKey:", senderPublicKey.toString());
  console.log("ANCHOR_PROGRAM_ID:", ANCHOR_PROGRAM_ID.toString());
  console.log("TOKEN_MINT:", TOKEN_MINT.toString());
  console.log("SOL_MINT:", SOL_MINT.toString());
  console.log("borderlessStatePdaAccount:", borderlessStatePdaAccount.toString());

  it("Initialize!", async () => {
    const txHash = await initialize();
    console.log("initialize", txHash);
  });

  it("Uninitialize!", async () => {
    const txHash = await uninitialize();
    console.log("uninitialize", txHash);
  });

  

  async function initialize() {
    let txHash = await program.rpc.initialize(
      adminPublicKey,
      adminPublicKey,
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

});
