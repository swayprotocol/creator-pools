import { Plan } from '../shared/interfaces';

export const getMaxPlanByDate = (stakedAt: Date, plans: Plan[]): Plan => {
  const possiblePlans = plans.filter(plan => (+plan.availableUntil > +stakedAt) && ((+plan.availableUntil - plan.lockMonths*31*24*60*60*1000) < +stakedAt));
  return possiblePlans.reduce((prev, current)=> prev.apy > current.apy ? prev : current);
}
