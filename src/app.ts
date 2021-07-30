import Bot from "./bot";
import WalletManager from "./libs/WalletManager";

export let app = (() => {
    let bot = Bot.create();
    //bot.doSniping();
    //bot.sendBNBtoAllAccountSnipers();
    //bot.sendBNBonAllAccountstoFirstAccount();
    //bot.approveAllAccountSnipers();
    //bot.getAllAccountBalances();
    //bot.getAllAccountAddresses();
    //let walletManager = WalletManager.create();
    //walletManager.createWallets(2);
    //walletManager.saveWallets();
    return {
        //bot: bot,
        //walletManager: walletManager
    };
})();