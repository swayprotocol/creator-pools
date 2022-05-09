import { Plan } from '../shared/interfaces';

export const filterPlans = (plans: Plan[]): Plan[] => {
  // filter out expired dates and sort by apy first
  const activePlans = plans.filter(plan => +plan.availableUntil > +new Date());
  if (!activePlans.length) {
    // add a planId: 0, that doesn't expire, but it's unstakeable
    activePlans.push({
      planId: 0,
      apy: 0,
      availableUntil: new Date('2099-12-31'),
      lockMonths: 0
    })
  }
  return activePlans.sort((prev, current) => (current.apy - prev.apy));
}
