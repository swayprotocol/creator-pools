import { Plan } from '../shared/interfaces';
import { availablePlans } from '../shared/constants';

export const getPlanById = (id: number, plans?: Plan[] | undefined): Plan => {
  const plansToSearch = plans ? plans : availablePlans;
  return plansToSearch.find(plan => plan.planId === id);
}
