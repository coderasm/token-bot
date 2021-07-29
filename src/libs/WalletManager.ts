import { ethers } from "ethers";
import * as fs from "fs/promises";
import { Secret } from "../../types/Config";

let WalletManager = {
    create: () => {
        let wallets:Secret[] = [];

        let createWallets = (amount: number) => {
            var limit = Math.floor(Math.abs(amount));
            for (let i = 0; i < limit; i++) {
                createWallet("user");
            }
        }
        
        let createWallet = (id:string) => {
            var now = new Date(Date.now());
            wallets.push({
                id: `id-${now.getMonth() + 1}-${now.getDate()}-${now.getFullYear()}T${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()}`,
                phrase: ethers.Wallet.createRandom().mnemonic.phrase
            });
        }
        
        let saveWallets = async () =>  {
            var serializedWallets = JSON.stringify(wallets, null, 4);
            await fs.writeFile("./secrets.json", serializedWallets);
        }

        return {
            createWallet: createWallet,
            createWallets: createWallets,
            saveWallets: saveWallets
        }
    }
}

export default WalletManager;