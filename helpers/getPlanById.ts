import { Plan } from '../shared/interfaces';

export const getPlanById = (id: number, plans: Plan[]): Plan => {
  return plans.find(plan => plan.planId === id);
}
