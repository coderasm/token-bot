import * as enums from "../src/enums"

export interface Config {
    sniping: Sniping
    activeNetwork: enums.Network,
    networks: Networks,
    mocha: any,
    addresses: Addresses,
    secrets: Secret[]
}

export interface Secret {
    id: string,
    phrase: string
}

export interface Sniping {
    rangeLowerBound:number,
    rangeUpperBound:number,
    majorStep:number,
    minorStep:number,
    totalSnipeAccounts: number,
    sniperAddress:string,
    receiveAddresses:string[],
    receiveAddressStart:string,
    receiveAddressEnd:string
}

export interface Addresses {
    dead: string,
    bscTestnet: CommonAddresses,
    bscMainnet: CommonAddresses,
    development: CommonAddresses,
    ganache: CommonAddresses,
    localhost: CommonAddresses
}

export interface CommonAddresses {
    WBNB: string,
    factory: string,
    pair: string,
    contract: string,
    claimer: string,
    router: string,
    pair: string
}

public interface Networks {
    development: Network,
    bscTestnet: Network,
    bscMainnet: Network,
    ganache: Network,
    localhost: Network
}

export interface Network {
    provider: Provider,
    mnemonic: string,
    network_id: number | string,
    skipDryRun: boolean,
    walletOffset: number
}

export interface Provider {
    webSocket: string,
    jsonRpcUrl: string
}