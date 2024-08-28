# update-hello-world-program.md

#LAB
We're going to build a "Hello, World!" program using Solana Playground. Solana Playground is a tool that allows you to write and deploy Solana programs from the browser.

1. Setup
   Open https://beta.solpg.io/ . Next, go ahead and delete everything in the default lib.rs file and create a Playground wallet. Rename to sayHello.rs and delete native.test.ts

   ![image](https://github.com/user-attachments/assets/83d7b31b-d68b-4eb5-be46-502848f7031c)

   ![image](https://github.com/user-attachments/assets/609bed19-e6fd-493b-9fac-01cdee9acbbe)

2. Solana Program Crate
   First, let's bring into scope everything we’ll need from the ```solana_program``` crate.

```
use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg
};
```
Next, let's set up the entry point to our program using the ```entrypoint```! macro and create the ```process_instruction``` function. The ```msg```! macro then allows us to print “Hello, world!” to the program log when the program is invoked.

3. Entry Point
   entrypoint!(process_instruction);
```
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult{
    msg!("Hello, world!");

    Ok(())
}
```
All together, the “Hello, world!” program will look like this:

```
use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg
};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult{
    msg!("Hello, world!");

    Ok(())
}
```
4. Build and Deploy
   
   ![Captura de tela 2024-08-26 232204](https://github.com/user-attachments/assets/e7de2a4c-5f6f-4998-b4b9-f83d02810bb9)

6. Invoke Program
Finally, let's invoke our program from the client side. The focus of this lesson is to build our Solana program, so we’ve gone ahead and provided the client code to invoke our “Hello, world!” program for you to download.

The ```index.ts``` 
```
import { initializeKeypair } from "./initializeKeypair"
import * as web3 from "@solana/web3.js"
import Dotenv from "dotenv"
Dotenv.config()

let programId = new web3.PublicKey(
    "8qfvwsoVco3CyfHpceNrAXdzNGi8hJrVGyxC1JVVUyQf"
)

let connection = new web3.Connection(web3.clusterApiUrl("testnet"))

async function main() {
    let payer = await initializeKeypair(connection)
    const transactionSignature = await sayHello(payer)
    
    console.log(
        `Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=testnet`
    )
}

main()
    .then(() => {
        console.log("Finished successfully")
    })
    .catch((error) => {
        console.error(error)
    })
    
export async function sayHello(
    payer: web3.Keypair
): Promise<web3.TransactionSignature> {
    const transaction = new web3.Transaction()

    const instruction = new web3.TransactionInstruction({
        keys: [],
        programId,
    })

    transaction.add(instruction)

    const transactionSignature = await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [payer]
    )

    return transactionSignature
}


```

And the import { initializeKeypair } from "./initializeKeypair"
import * as web3 from "@solana/web3.js"
import Dotenv from "dotenv"
Dotenv.config()

let programId = new web3.PublicKey(
    "8qfvwsoVco3CyfHpceNrAXdzNGi8hJrVGyxC1JVVUyQf"
)

let connection = new web3.Connection(web3.clusterApiUrl("testnet"))

async function main() {
    let payer = await initializeKeypair(connection)
    const transactionSignature = await sayHello(payer)
    
    console.log(
        `Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=testnet`
    )
}

main()
    .then(() => {
        console.log("Finished successfully")
    })
    .catch((error) => {
        console.error(error)
    })
    
export async function sayHello(
    payer: web3.Keypair
): Promise<web3.TransactionSignature> {
    const transaction = new web3.Transaction()

    const instruction = new web3.TransactionInstruction({
        keys: [],
        programId,
    })

    transaction.add(instruction)

    const transactionSignature = await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [payer]
    )

    return transactionSignature
}

And the ```initializeKeypar.ts```

```
import * as web3 from "@solana/web3.js"
import * as fs from "fs"
import dotenv from "dotenv"


dotenv.config()




export async function initializeKeypair(
    connection: web3.Connection
): Promise<web3.Keypair> {
    if (!process.env.PRIVATE_KEY) {
        console.log("Creating .env file")
        const signer = web3.Keypair.generate()
        fs.writeFileSync(".env", `PRIVATE_KEY=[${signer.secretKey.toString()}]`)
        await airdropSolIfNeeded(signer, connection)

        return signer
    }

    const secret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number[]
    const secretKey = Uint8Array.from(secret)
    const keypairFromSecretKey = web3.Keypair.fromSecretKey(secretKey)
    await airdropSolIfNeeded(keypairFromSecretKey, connection)
    return keypairFromSecretKey
}






async function airdropSolIfNeeded(
    signer: web3.Keypair,
    connection: web3.Connection
) {
    const balance = await connection.getBalance(signer.publicKey)
    console.log("Current balance is", balance / web3.LAMPORTS_PER_SOL)
    if (balance < web3.LAMPORTS_PER_SOL) {
        console.log("Airdropping 1 SOL...")
        const signature = await connection.requestAirdrop(
            signer.publicKey,
            web3.LAMPORTS_PER_SOL
        )
            const latestBlockHash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
            signature,
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight
        });

        console.log("Airdrop successful!");
    }
}

```


The code provided includes a ```sayHello``` helper function that builds and submits our transaction. We then call ```sayHello``` in the main function and print a Solana Explorer URL to view our transaction details in the browser.

Open the ```index.ts``` file you should see a variable named ```programId```. Go ahead and update this with the program ID of the “Hello, world!" program you just deployed using Solana Playground.

![image](https://github.com/user-attachments/assets/d1216bde-2ec9-43e6-ba6d-b7cc470572c8)

Next, install the Node modules with ```npm i```.

``` PowerShell
npm i @solana/web3.js@latest 
```

``` PowerShell
npm i dotenv
```

``` PowerShell
npm i --save @types/connect 
```

``` PowerShell
npm i fs 
```


Now, go ahead and run ```ts-node .\index.ts```. This command will:

Generate a new keypair and create a .env file if one does not already exist
Airdrop testnet SOL
Invoke the “Hello, world!” program
Output the transaction URL to view on Solana Explorer

![image](https://github.com/user-attachments/assets/2e64aa5d-8993-4a72-a773-e8bfb46a2737)

Congratulations, you’ve just successfully built and deployed a Solana program!
