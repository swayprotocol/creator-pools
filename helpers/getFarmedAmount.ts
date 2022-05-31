
export const getFarmedAmount = (amount: number, stakedAt: Date, apy): number => {
  // use new Date() until the staking is over
  return ((+new Date() - +stakedAt) / 1000 / 3600 / 24 / 365 * apy / 100) * amount;
}
