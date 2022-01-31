import { JsonRpcProvider } from '@ethersproject/providers';
import { Contract, ethers } from 'ethers';
import SWAY_TOKEN_ABI from '../shared/abis/token-abi.json';

export function getUserAvailableTokens(address: string): Promise<string> {
  const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_WEB3_HTTP_PROVIDER);
  const tokenContract = new Contract(process.env.NEXT_PUBLIC_SWAY_TOKEN_ADDRESS!, SWAY_TOKEN_ABI, provider);

  return tokenContract.balanceOf(address).then(bigNumber => {
    return ethers.utils.formatEther(bigNumber);
  });
}
