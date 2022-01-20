import { Plan } from '../shared/interfaces';

export const filterPlans = (plans: Plan[]): Plan[] => {
  // filter out expired dates and sort by apy first
  const activePlans = plans.filter(plan => +plan.availableUntil > +new Date());
  return activePlans.sort((prev, current) => (current.apy - prev.apy));
}
