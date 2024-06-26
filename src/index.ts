import * as dotenv from 'dotenv';
import * as bip39 from 'bip39';
import { DirectSecp256k1HdWallet, OfflineSigner } from '@cosmjs/proto-signing'
import {
  assertIsDeliverTxSuccess,
  SigningStargateClient,
  GasPrice,
  coins,
} from '@cosmjs/stargate'
  ; (async () => {
    dotenv.config();
    const wallets = await initWallets()
    while (true) {
      for (const wallet of wallets) {      
      await sendTransaction(wallet);
      console.log('Sleeping for 15 seconds...');
      await sleep(15000);
      }
    }
  })()
  

  function getMnemonicsFromEnv(): string[] {
    return Object.keys(process.env)
      .filter(key => key.startsWith('MNEMONIC'))
      .map(key => process.env[key] ?? "")
      .filter(mnemonic => mnemonic !== "");
  }

async function initWallets(): Promise<OfflineSigner[]> {
  const mnemonics = getMnemonicsFromEnv();
  
  const wallets = await Promise.all(
    mnemonics.map(mnemonic => DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "nillion" }))
  );

  return wallets;
}

async function createReceiveAddress(): Promise<string> {
  const mnemonic = bip39.generateMnemonic();
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "nillion" });
  const [firstAccount] = await wallet.getAccounts();

  return firstAccount.address;
}

async function sendTransaction(wallet: OfflineSigner) {
  const rpcEndpoint = 'https://nillion-testnet-rpc.polkachu.com/'
  const client = await SigningStargateClient.connectWithSigner(
    rpcEndpoint,
    wallet,
    {
      gasPrice: GasPrice.fromString('0.002unil')
    }
  )

  const recipient = await createReceiveAddress()
  const amount = coins(1, 'unil')

  console.log("Send $NIL to", recipient)

  const [firstAccount] = await wallet.getAccounts()


  const transaction = await client.sendTokens(
    firstAccount.address,
    recipient,
    amount,
    "auto",
  )
  assertIsDeliverTxSuccess(transaction)

  console.log('Successfully broadcasted:', transaction.transactionHash)
}


async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}