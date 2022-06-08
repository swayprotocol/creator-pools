import { JsonRpcProvider } from '@ethersproject/providers';
import { Contract, ethers } from 'ethers';
import getTokenAbi from "./getTokenAbi";

export async function getUserAvailableTokens(wallet: string, address: string, provider: string): Promise<string> {
  const tokenAbi = await getTokenAbi();
  const rpcProvider = new JsonRpcProvider(provider);
  const tokenContract = new Contract(address!, tokenAbi, rpcProvider);

  return tokenContract.balanceOf(wallet).then(bigNumber => {
    return ethers.utils.formatEther(bigNumber);
  });
}