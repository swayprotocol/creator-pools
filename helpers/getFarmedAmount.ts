import { Plan } from '../shared/interfaces';

export const getFarmedAmount = (amount: number, stakedAt: Date, unlockTime: Date, plan: Plan): number => {
  // use new Date() until the staking is over
  const maxDate = +unlockTime < +new Date() ? unlockTime : new Date();
  return ((+maxDate - +stakedAt) / 1000 / 3600 / 24 / 365 * plan.apy / 100) * amount;
}
