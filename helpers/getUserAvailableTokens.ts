import { JsonRpcProvider } from '@ethersproject/providers';
import { Contract, ethers } from 'ethers';
import TOKEN_ABI from '../shared/abis/token-abi.json';

export function getUserAvailableTokens(wallet: string, address: string, provider: string): Promise<string> {
  const rpcProvider = new JsonRpcProvider(provider);
  const tokenContract = new Contract(address!, TOKEN_ABI, rpcProvider);

  return tokenContract.balanceOf(wallet).then(bigNumber => {
    return ethers.utils.formatEther(bigNumber);
  });
}
