import * as readline from 'readline';
import * as bip39 from 'bip39';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (question: string): Promise<string> => {
  return new Promise((resolve) => rl.question(question, resolve));
};

const generateMnemonic = (): string => {
  return bip39.generateMnemonic(128); 
};

const main = async () => {
  const input = await askQuestion('Berapa wallet bang? ');
  const walletCount = parseInt(input, 10);

  if (!isNaN(walletCount) && walletCount > 0) {
    for (let i = 1; i <= walletCount; i++) {
      const mnemonic = generateMnemonic();
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "nillion" });
      const [firstAccount] = await wallet.getAccounts();
      
      console.log(`Wallet ${i}: ${firstAccount.address}`);
      console.log(mnemonic)

    }
  } else {
    console.log('Invalid input. Please enter a positive number.');
  }

  rl.close();
};

main();
