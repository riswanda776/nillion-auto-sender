import * as dotenv from "dotenv";
import * as bip39 from "bip39";
import { DirectSecp256k1HdWallet, OfflineSigner } from "@cosmjs/proto-signing";
import {
  assertIsDeliverTxSuccess,
  SigningStargateClient,
  GasPrice,
  coins,
} from "@cosmjs/stargate";
(async () => {
  dotenv.config();
  const wallet = await initWallet();
  console.log("List Wallet : ");
  wallet.forEach(async (w, index) => {
    const [firstAccount] = await w.getAccounts();
    console.log(firstAccount.address, index + 1);
  });

  while (true) {
    for (let i = 0; i < wallet.length; i++) {
      for (let j = 0; j < wallet.length; j++) {
        if (i !== j) {
          try {
            const [otherAcc] = await wallet[j].getAccounts();
            await sendTransaction(wallet[i], otherAcc.address);
          } catch (error) {
            console.error("Error sending transaction");
          }
        }
      }
    }
    console.log("Sleeping for 15 seconds...");
    await sleep(15000);
  }
})();

async function initWallet(): Promise<OfflineSigner[]> {
  const mnemonics = [
    "seed1",
    "seed2",
    "seed3",
    "seed4",
    "seed5",
    "seed6",
    "seed7",
    "seed8",
    "seed9",
    "seed10",
  ];

  const wallets: OfflineSigner[] = await Promise.all(
    mnemonics.map((mnemonic) =>
      DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "nillion" })
    )
  );

  return wallets;
}

async function sendTransaction(wallet: OfflineSigner, address: string) {
  console.log("");
  const rpcEndpoint = "https://nillion-testnet-rpc.polkachu.com/";
  const client = await SigningStargateClient.connectWithSigner(
    rpcEndpoint,
    wallet,
    {
      gasPrice: GasPrice.fromString("0.002unil"),
    }
  );

  const recipient = address;
  const amount = coins(1, "unil");

  const [firstAccount] = await wallet.getAccounts();

  console.log(`Sending $NIL from ${firstAccount.address} to ${recipient}`);

  const transaction = await client.sendTokens(
    firstAccount.address,
    recipient,
    amount,
    "auto"
  );
  assertIsDeliverTxSuccess(transaction);

  console.log("Successfully broadcasted:", transaction.transactionHash);
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
