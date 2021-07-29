import { Config } from "../types/Config";
import * as fs from "fs";
import { Network } from "./enums";
//import * as secrets from "./secrets.json";

const secrets = JSON.parse(fs.readFileSync("./secrets.json").toString().trim());
export let config:Config = {
  sniping: {
    rangeLowerBound:0.0105,
    rangeUpperBound:0.025,
    majorStep:0.005,
    minorStep:0.002,
    totalSnipeAccounts:12,
    sniperAddress:"",
    receiveAddresses:[],
    receiveAddressStart:"",
    receiveAddressEnd:""
  },
  secrets: secrets,

  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  activeNetwork: Network.bscMainnet,
  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    development: {
      provider: {
        webSocket: "ws://127.0.0.1:8545",
        jsonRpcUrl: "http://127.0.0.1:8545"
      },
      walletOffset: 0,
      mnemonic: secrets[0].phrase,
      network_id: "*",
      skipDryRun: true
    //  host: "127.0.0.1",     // Localhost (default: none)
    //  port: 8545,            // Standard Ethereum port (default: none)
    //  network_id: "*",       // Any network (default: none)
    },
    // Another network with more advanced options...
    // advanced: {
    // port: 8777,             // Custom port
    // network_id: 1342,       // Custom network
    // gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
    // gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
    // from: <address>,        // Account to send txs from (default: accounts[0])
    // websockets: true        // Enable EventEmitter interface for web3 (default: false)
    // },
    // Useful for deploying to a public network.
    // NB: It's important to wrap the provider as a function.
    // ropsten: {
    // provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/YOUR-PROJECT-ID`),
    // network_id: 3,       // Ropsten's id
    // gas: 5500000,        // Ropsten has a lower block limit than mainnet
    // confirmations: 2,    // # of confs to wait between deployments. (default: 0)
    // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
    // skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    // },
    // Useful for private networks
    // private: {
    // provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
    // network_id: 2111,   // This network is yours, in the cloud.
    // production: true    // Treats this network as if it was a public net. (default: false)
    // }
    bscTestnet: {
      provider: {
        webSocket: "wss://apis.ankr.com/wss/5012b30dd2f54e7880f8314ce9bdac34/424a0c79b30eec421772e7ad2100a60c/binance/full/test",
        jsonRpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545"
      },
      mnemonic: secrets[0].phrase,
      skipDryRun: true,
      walletOffset: 0,
      network_id: 97
    },
    bscMainnet: {
      provider: {
        webSocket: "wss://apis.ankr.com/wss/319ca597af7641ed83d88c5990200e3c/424a0c79b30eec421772e7ad2100a60c/binance/full/main",
        jsonRpcUrl: "https://bsc-dataseed.binance.org/"
      },
      mnemonic: secrets[0].phrase,
      skipDryRun: true,
      walletOffset: 0,
      network_id: 56
    },
    ganache: {
      provider: {
        webSocket: "ws://127.0.0.1:8545",
        jsonRpcUrl: "http://127.0.0.1:8545"
      },
      mnemonic: secrets[0].phrase,
      skipDryRun: true,
      walletOffset: 0,
      network_id: "*"
    },
    localhost: {
      provider: {
        webSocket: "ws://127.0.0.1:8545",
        jsonRpcUrl: "http://127.0.0.1:8545"
      },
      mnemonic: secrets[0].phrase,
      skipDryRun: true,
      walletOffset: 0,
      network_id: "*"
    }
  },
  addresses: {
    dead: "0x000000000000000000000000000000000000dead",
    bscTestnet: {
      WBNB: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
      factory: '0x6725F303b657a9451d8BA641348b6761A6CC7a17',
      pair: '0x100F3e4F67d43D44efF45515371E73dB373Db383',
      "contract": "0xf8EeA49aC1902A7e6927c64bae2EcFd6ce07EF45",
      "claimer": "0x6E48dDB997824898D7aa7BeF905B86F243818f4D",
      // 0xD99D1c33F9fC3444f8101754aBC46c52416550D1 or 0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3 for testnet
      // 0x10ED43C718714eb63d5aA57B78B54704E256024E or 0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F for mainnet
      router: '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3'
    },
    bscMainnet: {
      WBNB: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
      factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
      "pair": "0xCf512d971a046bf15c25Bc1D96CeE157eDF9937d",
      "contract": "0xe132e945D61870e32E35446e62C1899c43948530",
      "claimer": "0x80AcdC494fa7D14A2f5AA4374ABb565c9f199EAD",
      // 0xD99D1c33F9fC3444f8101754aBC46c52416550D1 or 0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3 for testnet
      // 0x10ED43C718714eb63d5aA57B78B54704E256024E or 0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F for mainnet
      router: '0x10ED43C718714eb63d5aA57B78B54704E256024E'
    },
    development: {
      WBNB: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
      factory: '0x6725F303b657a9451d8BA641348b6761A6CC7a17',
      pair: '0xC136267f436eA6f31AFcB7231140A40C0E0e573D',
      contract: '0xa96fc371C357A05430f4D2ca839f90c1673A1BbE',
      claimer: '0x148940678956A2eED2b4f869AB0E1460B4Ed8Aa7',
      // 0xD99D1c33F9fC3444f8101754aBC46c52416550D1 or 0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3 for testnet
      // 0x10ED43C718714eb63d5aA57B78B54704E256024E or 0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F for mainnet
      router: '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3'
    },
    ganache: {
      WBNB: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
      factory: '0x6725F303b657a9451d8BA641348b6761A6CC7a17',
      pair: '0xC136267f436eA6f31AFcB7231140A40C0E0e573D',
      contract: '0xa96fc371C357A05430f4D2ca839f90c1673A1BbE',
      claimer: '0x148940678956A2eED2b4f869AB0E1460B4Ed8Aa7',
      // 0xD99D1c33F9fC3444f8101754aBC46c52416550D1 or 0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3 for testnet
      // 0x10ED43C718714eb63d5aA57B78B54704E256024E or 0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F for mainnet
      router: '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3'
    },
    localhost: {
      WBNB: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
      factory: '0x6725F303b657a9451d8BA641348b6761A6CC7a17',
      "pair": "0x42159d18B5F22b9488b196F24217DD4819E8ec2c",
      "contract": "0x4545D3528CBCB6497fA174281D93ebFa3CaD7006",
      "claimer": "0x5EaF6161BD8EabDAd290E1B0ad0Ff80352B4f1E2",
      // 0xD99D1c33F9fC3444f8101754aBC46c52416550D1 or 0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3 for testnet
      // 0x10ED43C718714eb63d5aA57B78B54704E256024E or 0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F for mainnet
      router: '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3'
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  }
};