import { InjectedConnector } from '@web3-react/injected-connector';
import globalConfigData from '../config.json';

export const injected = new InjectedConnector({ supportedChainIds: globalConfigData.network.supported_chain_ids });
