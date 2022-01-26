import { InjectedConnector } from '@web3-react/injected-connector';
import { Plan } from './interfaces';

const supportedChainIds = [137, 80001];

export const injected = new InjectedConnector({ supportedChainIds });

// hardcoding SWAY circulating supply
export const circulatingSupplSway = 10917462;

// hardcoding available and past staking plans
export const availablePlans: Plan[] = [
  {
    planId: 1,
    apy: 33,
    availableUntil: new Date('2022-01-20T23:00:00.000Z'),
    lockMonths: 3,
    createdAt: new Date('2021-11-01T23:00:00.000Z')
  },
  {
    planId: 2,
    apy: 66,
    availableUntil: new Date('2022-01-20T23:00:00.000Z'),
    lockMonths: 6,
    createdAt: new Date('2021-11-01T23:00:00.000Z')
  },
  {
    planId: 3,
    apy: 99,
    availableUntil: new Date('2021-11-30T22:00:00.000Z'),
    lockMonths: 9,
    createdAt: new Date('2021-11-01T23:00:00.000Z')
  },
  {
    planId: 4,
    apy: 444,
    availableUntil: new Date('2022-02-01T00:00:00.000Z'),
    lockMonths: 3,
    createdAt: new Date('2022-01-21T00:00:00.000Z')
  },
  {
    planId: 5,
    apy: 222,
    availableUntil: new Date('2022-04-01T00:00:00.000Z'),
    lockMonths: 9,
    createdAt: new Date('2022-01-21T00:00:00.000Z')
  },
  {
    planId: 6,
    apy: 111,
    availableUntil: new Date('2022-07-01T00:00:00.000Z'),
    lockMonths: 6,
    createdAt: new Date('2022-01-21T00:00:00.000Z')
  }
];
