import React, { FC, useEffect, useState } from 'react';
import { IChannelDistributionItem, Plan } from '../shared/interfaces';
import { filterPlans } from '../helpers/filterPlans';
import { useConfig } from '../contexts/Config';

type OverviewProps = {
  tokenLockedTotal: number,
  tokenUsd: number,
  plans: Plan[],
  distribution: IChannelDistributionItem[],
  totalRewards: number,
  totalStakes: number
}

const defaultPlan = { apy: 0, planId: 0 } as Plan;

const Overview: FC<OverviewProps> = (props: OverviewProps) => {
  const [maxPlan, setMaxPlan] = useState<Plan>(defaultPlan);
  const { token } = useConfig();

  useEffect(() => {
    if (props.plans.length) {
      const activePlans = filterPlans(props.plans);
      setMaxPlan(activePlans[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.plans.length]);

  const getSupplyLocked = (amount: number): string => {
    if (!token?.circulating_supply) return (0).toFixed(2);
    return (amount / token?.circulating_supply * 100).toFixed(2);
  }

  const calcPercentage = (value: number, total: number): string | number => {
    if (!total) return value;
    return ((value / total) * 100).toFixed(0);
  }

  return (
    <section className="my-5">
      <div className="container">
        <div className="row">
          <h2 className="mb-4">Overview</h2>
          <div className="col-12 col-sm-8">
            <div className="overview-item">
              <div className="overview-item-name">TVL</div>
              <div className="overview-item-value">
                {props.tokenLockedTotal.toLocaleString('en-US', { maximumFractionDigits: 0 })} {token?.ticker}
              </div>
              <div className="overview-item-name">
                {getSupplyLocked(props.tokenLockedTotal)}% of circulating supply
              </div>
            </div>
            <div className="overview-item">
              <div className="overview-item-name">APY MAX</div>
              <div className="overview-item-value">{maxPlan.apy}%</div>
            </div>
            <div className="overview-item">
              <div className="overview-item-name">TOTAL REWARDS EARNED</div>
              <div className="overview-item-value">{props.totalRewards.toLocaleString('en-US', { maximumFractionDigits: 2 })} {token?.ticker}</div>
            </div>
          </div>
          <div className="col-12 col-sm-4">
            <div className="row">
              <div className="overview-item-title col-7">
                CHANNEL DISTRIBUTION
              </div>
              <div className="overview-item-channels col-5">
                {props.distribution.map((item) => (
                  <div className="overview-item-channels-item" key={item.prefix}>
                    {item.name} {calcPercentage(item.count, props.totalStakes)}%
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default Overview;
