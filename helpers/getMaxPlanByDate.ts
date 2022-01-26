import { Plan } from '../shared/interfaces';
import { availablePlans } from '../shared/constants';

export const getMaxPlanByDate = (stakedAt: Date): Plan => {
  const possiblePlans = availablePlans.filter(plan => (+plan.availableUntil > +stakedAt) && (+plan.createdAt < +stakedAt));
  return possiblePlans.reduce((prev, current)=> prev.apy > current.apy ? prev : current);
}
