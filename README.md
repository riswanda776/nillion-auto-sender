## Overview

This project demonstrates a simple script to initialize a wallet using a mnemonic phrase, generate a recipient address, and send transactions periodically on the Nillion testnet. The script uses various libraries such as `dotenv`, `bip39`, `@cosmjs/proto-signing`, and `@cosmjs/stargate` to achieve this functionality.

## Prerequisites

Before running the project, ensure you have faucet in your wallet and the following installed:

- Node.js (v14 or later)
- npm (Node package manager)

## Setup Instructions

1. **Clone the Repository**

   Clone this repository to your local machine using:

   ```bash
   git clone https://github.com/riswanda776/nillion-auto-sender.git
   cd nillion-auto-sender```
   
2. **Install Dependencies**

   Install TypeScript and types for Node.js:

   ```bash
   npm install --save-dev typescript @types/node
      ```
   Install Dependencies:
   ```bash
   npm install 

3. **Environment Configuration**

   Modify `.env` file in the root directory of the project with your keplr mnemonic phrase

4. **Run Project**



   ```bash
   npm start
      ```

