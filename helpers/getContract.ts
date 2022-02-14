import { JsonRpcProvider } from '@ethersproject/providers';
import { Contract, ethers } from 'ethers';
import STAKING_ABI from '../shared/abis/staking-abi.json';
import { Event } from '@ethersproject/contracts';
import { StakedEvent, StakedEventSocialType } from '../shared/interfaces';

export function getContract(stakingContract: Contract): any {
  return {
    calculateReward: async (poolHandle: string, address: string) => {
      return stakingContract.calculateReward(poolHandle, address);
    },
    getCurrentTime: async () => {
      return stakingContract.getCurrentTime();
    },
    getMultiplePools: async (inputQueue: string[]) => {
      return stakingContract.getMultiplePools(inputQueue);
    },
    getPool: async (poolHandle: string) => {
      return stakingContract.getPool(poolHandle);
    },
    getPoolMembers: async (poolHandle: string) => {
      return stakingContract.getPoolMembers(poolHandle);
    },
    getPoolQueue: async (poolHandle: string) => {
      return stakingContract.getPoolQueue(poolHandle);
    },
    getReward: async (poolHandle: string) => {
      return stakingContract.getReward(poolHandle);
    },
    getUserQueue: async (address: string) => {
      return stakingContract.getUserQueue(address);
    },
    initialize: async (address: string) => {
      return stakingContract.initialize(address);
    },
    minAmount: async () => {
      return stakingContract.minAmount();
    },
    owner: async () => {
      return stakingContract.owner();
    },
    plans: async (id: number) => {
      return stakingContract.plans(id);
    },
    renounceOwnership: async () => {
      return stakingContract.renounceOwnership();
    },
    stake: async (poolHandle: string, amount: number, planId: number) => {
      return stakingContract.stake(poolHandle, amount, planId);
    },
    stakingToken: async () => {
      return stakingContract.stakingToken();
    },
    transferOwnership: async (address: string) => {
      return stakingContract.transferOwnership(address);
    },
    unstake: async (poolHandle: string) => {
      return stakingContract.unstake(poolHandle);
    }
  }
}