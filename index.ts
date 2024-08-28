import { initializeKeypair } from "./initializeKeypair"
import * as web3 from "@solana/web3.js"
import Dotenv from "dotenv"
Dotenv.config()
//const connection = new web3.Connection("https://api.devnet.solana.com");

let programId = new web3.PublicKey(
    "8qfvwsoVco3CyfHpceNrAXdzNGi8hJrVGyxC1JVVUyQf"
)

let connection = new web3.Connection(web3.clusterApiUrl("testnet"))

async function main() {
    let payer = await initializeKeypair(connection)

    

    const transactionSignature = await sayHello(payer)

    console.log(
        `Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
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

