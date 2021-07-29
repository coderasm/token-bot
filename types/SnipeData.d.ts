import { BigNumber, ethers, Wallet } from "ethers";

export interface SnipeData {
    account: Account,
    recipient: string,
    amountMin: number,
    amountMax: number
}

export interface Account {
    sniperNonce: number,
    id: string,
    sniper: ethers.Wallet,
    recipients: ethers.Wallet[]
}

export interface SendBNBData {
    account: Account,
    recipient: string,
    amountToSend: BigNumber
}