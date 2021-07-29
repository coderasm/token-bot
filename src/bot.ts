import { ethers, Wallet } from "ethers";
import { Network } from "../types/Config";
import { Account, SendBNBData, SnipeData } from "../types/SnipeData";
import { config } from "./config";
import AccountUtil from "./libs/AccountUtil";
//import Web3 from "web3";

let Bot = {
  create: () => {
    const activeNetwork = config.activeNetwork;
    const network:Network = config.networks[activeNetwork];
    const endpointRateLimit = 0;
    const tokenDivisor = ethers.BigNumber.from(10).pow(9);

    //const web3 = new Web3(Web3.givenProvider || network.provider);
    //const provider = new ethers.providers.WebSocketProvider(network.provider.webSocket);
    const provider = new ethers.providers.JsonRpcProvider(network.provider.jsonRpcUrl);
    const accounts = config.secrets.map(async (secret) => {
      var wallets = AccountUtil.create(secret.phrase).getSigners(network.walletOffset, config.sniping.totalSnipeAccounts + 1)
      var sniper = wallets[0].connect(provider);
      var nonce = await provider.getTransactionCount(sniper.address);
      //console.log(`Sniper balance: ${ethers.utils.formatEther(await provider.getBalance(sniper.address))}`);
      return {
        sniperNonce: nonce - 1,
        id: secret.id,
        sniper: sniper,
        recipients: wallets.slice(1)
      }
    });
    const priceRanges = (config.sniping.rangeUpperBound - config.sniping.rangeLowerBound) / config.sniping.majorStep;
    const snipesPerPriceRange = Math.floor(config.sniping.totalSnipeAccounts / priceRanges)
    const amountOutMin = 0;
    const tokenIn = config.addresses[activeNetwork].WBNB
    const tokenOut = config.addresses[activeNetwork].contract;
    const factoryAddress = config.addresses[activeNetwork].factory;

    const factory = new ethers.Contract(
      config.addresses[activeNetwork].factory,
      ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)']
    );

    const pair = new ethers.Contract(
      config.addresses[activeNetwork].pair,
        ['event Mint(address indexed sender, uint amount0, uint amount1);']
      );

    const router = new ethers.Contract(
      config.addresses[activeNetwork].router,
      [
        'function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable',
        'function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external'
      ]
    );

    const token = new ethers.Contract(
      config.addresses[activeNetwork].contract,
      [
        'event TradingEnabled(bool enabled)',
        'function balanceOf(address account) external view returns (uint256)',
        'function approve(address spender, uint256 amount) external returns (bool)',
        'function claim(address payable recipient) public'
      ]
    );

    const wbnb = new ethers.Contract(
      config.addresses[activeNetwork].WBNB,
      [
        'function approve(address spender, uint amount) public returns(bool)',
      ]
    );

    const test = async () => {
      // console.log(`WBNB: ${tokenIn}`);
      // console.log(`Contract: ${tokenOut}`);
      // console.log(`Router: ${router.address}`)
      // console.log(`Factory: ${factory.address}`)
      // for (const account of accounts) {
      //   console.log(account.address);
      // }
      //getBalances(0);
      //sell();
    }

    const init = async () => {
    }

    // const listenForPairCreated = async () => {
    //   factory.on('PairCreated', async (token0, token1, pairAddress) => {
    //     console.log(`
    //       New pair detected
    //       =================
    //       token0: ${token0}
    //       token1: ${token1}
    //       pairAddress: ${pairAddress}
    //     `);

    //     //The quote currency needs to be WBNB (we will pay with WBNB)
    //     let tokenIn, tokenOut;
    //     if(token0 === addresses.WBNB) {
    //       tokenIn = token0; 
    //       tokenOut = token1;
    //     }

    //     if(token1 == addresses.WBNB) {
    //       tokenIn = token1; 
    //       tokenOut = token0;
    //     }

    //     //The quote currency is not WBNB
    //     if(typeof tokenIn === 'undefined') {
    //       return;
    //     }

    //     //We buy for 0.1 BNB of the new token
    //     //ethers was originally created for Ethereum, both also work for BSC
    //     //'ether' === 'bnb' on BSC
    //     const amountIn = ethers.utils.parseUnits('0.1', 'ether');
    //     const amounts = await router.getAmountsOut(amountIn, [tokenIn, tokenOut]);
    //     //Our execution price will be a bit different, we need some flexbility
    //     const amountOutMin = amounts[1].sub(amounts[1].div(10));
    //     console.log(`
    //       Buying new token
    //       =================
    //       tokenIn: ${amountIn.toString()} ${tokenIn} (WBNB)
    //       tokenOut: ${amountOutMin.toString()} ${tokenOut}
    //     `);
    //     const tx = await router.swapExactETHForTokensSupportingFeeOnTransferTokens(
    //       amountOutMin,
    //       [tokenIn, tokenOut],
    //       addresses.recipient,
    //       Date.now() + 1000 * 60 * 10 //10 minutes
    //     );
    //     const receipt = await tx.wait(); 
    //     console.log('Transaction receipt');
    //     console.log(receipt);
    //   });
    // }

    // const listenForMint = async () => {
    //   //'function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
    //   pair.on('Minted', async (sender, token0, token1) => {
    //     let amountIn = getRandomBetween(config.minSnipe, config.maxSnipe);
    //     const tx = await router.swapExactETHForTokensSupportingFeeOnTransferTokens(
    //         amountOutMin,
    //         [tokenIn, tokenOut],
    //         addresses.recipient,
    //         Date.now() + 1000 * 60 * 10, //10 minutes
    //         {value: amountIn}
    //     );
    //     const receipt = await tx.wait(); 
    //     console.log('Transaction receipt');
    //     console.log(receipt);
    //   });
    // }

    const listenForTradingEnabled = async () => {
      token.on('TradingEnabled', async (enabled:boolean) => {
        if(enabled) {
          doSniping();
        }
      });
    }

    function getRandomBetween(min:number, max:number) {
      var amount = Math.random() * (max - min) + min;
      return parseFloat(amount.toFixed(3));
    }

    async function doSniping() {
      // accounts[0].sniperNonce = (await provider.getTransactionCount(accounts[0].sniper.address)) - 1;
      // accounts[1].sniperNonce = (await provider.getTransactionCount(accounts[1].sniper.address)) - 1;
      // accounts[2].sniperNonce = (await provider.getTransactionCount(accounts[2].sniper.address)) - 1;
      for (let i = 0; i < config.sniping.totalSnipeAccounts; i++) {
        var amountMin = config.sniping.rangeLowerBound;
        var amountMax = config.sniping.rangeLowerBound + config.sniping.minorStep;
        if(i != 0 && i % snipesPerPriceRange == 0) {
          amountMin += config.sniping.majorStep;
          amountMax += config.sniping.majorStep;
        }
        for (let t = i; t < i + accounts.length; t++) {
          var account = await accounts[t % accounts.length];
          var snipeData = {
              account: account,
              recipient: account.recipients[i].address,
              amountMin: amountMin,
              amountMax: amountMax
          }
          snipe(snipeData);
        }
      }
    }

    // async function startSniping(i:number) {
    //   var amountMin = config.sniping.rangeLowerBound;
    //   var amountMax = config.sniping.rangeLowerBound + config.sniping.minorStep;
    //     if(i != 0 && i % snipesPerPriceRange == 0) {
    //       amountMin += config.sniping.majorStep;
    //       amountMax += config.sniping.majorStep;
    //     }
    //     setTimeout(async () => {
    //       snipe(amountMin, amountMax, recipients[i].address);
    //       if(i < recipients.length - 1)
    //         startSniping(++i);
    //     }, endpointRateLimit);
    // }

    async function snipe(snipeData: SnipeData) {
      let amountIn = getRandomBetween(snipeData.amountMin, snipeData.amountMax);
      let amountInWei = ethers.utils.parseEther(amountIn.toString());
      // console.log(snipeData);
      // console.log(tokenIn);
      // console.log(tokenOut);
      // console.log(amountInWei);
      try {
        const tx = await router.connect(snipeData.account.sniper).swapExactETHForTokensSupportingFeeOnTransferTokens(
          amountOutMin,
          [tokenIn, tokenOut],
          snipeData.recipient,
          Math.floor(Date.now() / 1000) + 60 * 10, //10 minutes
          {value: amountInWei, nonce: ++snipeData.account.sniperNonce}
        );
        //console.log(tx);
        const result = await tx.wait();
        //console.log(result);
        if(result.status == 1)
          console.log(`${snipeData.recipient} has ${(await token.connect(snipeData.account.sniper).balanceOf(snipeData.recipient))}`);
        //console.log(receipt);
      } catch (error) {
        console.log("Failed, retrying")
        snipe(snipeData);
      }
    }

    async function sell(wallet: Wallet) {
      try {
        const sniper = wallet.connect(provider);
        var Token = token.connect(sniper);
        const tokensHeld = await Token.balanceOf(sniper.address);
        const percentToSell = 10;
        const sellAmount = tokensHeld.mul(percentToSell).div(100);
        await Token.approve(router.address, tokensHeld);
        console.log(sellAmount.toString());
        const tx = await router.connect(sniper).swapExactTokensForETHSupportingFeeOnTransferTokens(
          sellAmount,
          0,
          [tokenOut, tokenIn],
          sniper.address,
          Math.floor(Date.now() / 1000) + 60 * 10
        );
        const result = await tx.wait();
        if(result.status == 1)
          console.log(`Sell successful`);
      } catch (error) {
        console.log(error);
      }
    }

    async function claim(wallet: Wallet) {
      try {
        const sniper = wallet.connect(provider);
        const sniperBalance = await provider.getBalance(token.address);
        console.log(`Sniper balance: ${ethers.utils.formatEther(sniperBalance)}`);
        var Token = token.connect(sniper);
        const tx = await token.claim(sniper.address);
        const result = await tx.wait();
        if(result.status == 1) {
          console.log(`Claim successful`);
          const sniperBalance = await provider.getBalance(token.address);
          console.log(`Sniper balance: ${ethers.utils.formatEther(sniperBalance)}`);
        }
      } catch (error) {
        console.log(error);
      }
    }

    async function sendBNBtoAllAccountSnipers() {
      for (const account of accounts) {
        sendBNBtoSnipers(await account);
      }
    }

    async function sendBNBtoSnipers(account: Account) {
      //account.sniperNonce = (await provider.getTransactionCount(account.sniper.address)) - 1;
      var amountToSend = ethers.utils.parseEther("0.01");
        for (const recipient of account.recipients) {
          var sendBNBData = {
            account:account,
            recipient: recipient.address,
            amountToSend: amountToSend
          }
          sendBNB(sendBNBData);
        }
    }

    // async function sendBNBtoAll(i:number) {
    //   var amountToSend = ethers.utils.parseEther("0.01");
    //   setTimeout(async () => {
    //     sendBNB(recipients[i].address, amountToSend);
    //     if(i < recipients.length - 1)
    //       sendBNBtoAll(++i);
    //   }, endpointRateLimit);
    // }

    async function sendBNB(sendBNBData: SendBNBData) {
      try {
        var tx = await sendBNBData.account.sniper.sendTransaction({
          to: sendBNBData.recipient,
          value: sendBNBData.amountToSend,
          nonce: ++sendBNBData.account.sniperNonce
        });
        var result = await tx.wait();
        if(result.status == 1)
          console.log(`Transfered ${ethers.utils.formatEther(sendBNBData.amountToSend)} to ${sendBNBData.recipient}`);
        else
          console.log(`Failed transfering ${ethers.utils.formatEther(sendBNBData.amountToSend)} to ${sendBNBData.recipient}`);
      } catch (error) {
        console.log(error);
      }
    }

    async function approveAllAccountSnipers() {
      for (const account of accounts) {
        approveAll(await account);
      }
    }

    async function approveAll(account: Account) {
      for (const recipient of account.recipients) {
        approve(recipient);
      }
    }

    // async function approveAll(i:number) {
    //   var recipient = recipients[i].connect(provider);
    //   setTimeout(async () => {
    //     approve(recipient);
    //     if(i < recipients.length - 1)
    //       approveAll(++i);
    //   }, endpointRateLimit);
    // }

    async function approve(recip: Wallet) {
      var recipient = recip.connect(provider);
      var nonce = await recipient.getTransactionCount();
      var Token = token.connect(recipient);
      const tokensHeld = await Token.balanceOf(recipient.address);
      try {
        var tx = await Token.approve(router.address, tokensHeld, {nonce: nonce});
        var result = await tx.wait();
        if(result.status == 1)
          console.log(`${recipient.address} approved on router`);
      } catch (error) {
        console.log(error);
      }
    }

    async function getAllAccountBalances() {
      for (const account of accounts) {
        getAccountBalances(await account);
      }
    }

    async function getAccountBalances(account: Account) {
      console.log(`Balances for account: ${account.id}`);
      console.log(`Sniper address: ${account.sniper.address}`);
      for (const recipient of account.recipients) {
        getAccountBalance(recipient);
      }
    }

    async function getAccountBalance(recip: Wallet) {
      var recipient = recip.connect(provider);
      console.log(`${recipient.address} has ${(await token.connect(recipient).balanceOf(recipient.address)).div(tokenDivisor)}`);
    }

    async function getAllAccountAddresses() {
      for (const account of accounts) {
        getAccountAddresses(await account);
      }
    }

    async function getAccountAddresses(account: Account) {
      console.log(`Addresses for account: ${account.id}`);
      console.log(`Sniper address: ${account.sniper.address}`);
      for (const recipient of account.recipients) {
        getAccountAddress(recipient);
      }
    }

    async function getAccountAddress(recipient: Wallet) {
      console.log(`${recipient.address}`);
    }
    return {
      test: test,
      init: init,
      doSniping: doSniping,
      sell: sell,
      claim: claim,
      sendBNBtoAllAccountSnipers: sendBNBtoAllAccountSnipers,
      sendBNBtoSnipers: sendBNBtoSnipers,
      getAllAccountBalances: getAllAccountBalances,
      approveAllAccountSnipers: approveAllAccountSnipers,
      getAllAccountAddresses: getAllAccountAddresses
      // listenForPairCreated: listenForPairCreated,
      // listenForMint: listenForMint,
      // listenForTradingEnabled: listenForTradingEnabled
    }
  }
}
export default Bot;