import { ethers, Wallet } from "ethers";

let AccountUtil = {
    create: (mnemonic: string) => {
        let _mnemonic = mnemonic;
        let pathTemplate = "m/44'/60'/0'/0/";

        let getSigners = (offset:number, amount:number):ethers.Wallet[] => {
            var wallets = [];
            if(offset >= 0 && amount >= 0)
                for (let current = offset; current < offset + amount; current++) {
                    wallets.push(getSigner(current));
                }
            return wallets;
        }

        let getSigner = (index:number):ethers.Wallet => {
            var path = `${pathTemplate}${index}`;
            return ethers.Wallet.fromMnemonic(_mnemonic, path);
        }

        return  {
            getSigners: getSigners
        }
    }
}

export default AccountUtil;