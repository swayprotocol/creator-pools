import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

const POLLING_INTERVAL = 12000
const GANACHE_CHAIN_ID = 1337;
const RPC_URLS: { [chainId: number]: string } = {
  1: "https://mainnet.infura.io/v3/84842078b09946638c03157f83405213",
  4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  137: 'https://polygon-rpc.com/',
  80001: 'https://rpc-mumbai.maticvigil.com/',
}

const supportedChainIds = [4, 137, 80001];

const rpc = { 4: RPC_URLS[4], 137: RPC_URLS[137], 80001: RPC_URLS[80001] };

// Adding ganache chain ID only for local development
if (process.env.REACT_APP_DEV_ENV === 'true') {
  RPC_URLS[GANACHE_CHAIN_ID] = process.env.REACT_APP_WEB3_HTTP_PROVIDER;
  supportedChainIds.push(GANACHE_CHAIN_ID);
  rpc[GANACHE_CHAIN_ID] = RPC_URLS[GANACHE_CHAIN_ID];
}

export const injected = new InjectedConnector({ supportedChainIds });

export const network = new NetworkConnector({
  urls: rpc,
  defaultChainId: 1,
})

export const walletconnect = new WalletConnectConnector({
  rpc,
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true
})