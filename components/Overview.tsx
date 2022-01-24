import React, { FC, useEffect, useState } from 'react';
import { Plan } from '../shared/interfaces';
import { filterPlans } from '../helpers/filterPlans';
import { circulatingSupplSway } from '../shared/constants';

type OverviewProps = {
  swayLockedTotal: number,
  swayUsd: number,
  plans: Plan[]
}

const defaultPlan = { apy: 0, planId: 0 } as Plan;

const Overview: FC<OverviewProps> = (props: OverviewProps) => {
  const [maxPlan, setMaxPlan] = useState<Plan>(defaultPlan);

  useEffect(() => {
    if (props.plans.length) {
      const activePlans = filterPlans(props.plans);
      setMaxPlan(activePlans[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.plans.length]);

  const getSupplyLocked = (amount: number): string => {
    return (amount / circulatingSupplSway * 100).toFixed(2);
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
                {props.swayLockedTotal.toLocaleString('en-US', { maximumFractionDigits: 0 })} SWAY
              </div>
              <div className="overview-item-name">
                {getSupplyLocked(props.swayLockedTotal)}% of circulating supply
              </div>
            </div>
            <div className="overview-item">
              <div className="overview-item-name">APY MAX</div>
              <div className="overview-item-value">{maxPlan.apy}%</div>
              {maxPlan.planId === 3 && (
                <div className="overview-item-name">*promotional</div>
              )}
            </div>
            {/*<div className="overview-item">
              <div className="overview-item-name">TOTAL REWARDS PAID</div>
              <div className="overview-item-value">0 SWAY</div>
            </div>*/}
          </div>
          <div className="col-12 col-sm-4">
            <div className="row">
              <div className="overview-item-title col-7">
                CHANNEL DISTRIBUTION
              </div>
              <div className="overview-item-channels col-5">
                <div className="overview-item-channels-item">
                  Instagram 91%
                </div>
                {/*<div className="overview-item-channels-item">*/}
                {/*  ENS 9%*/}
                {/*</div>*/}
                <div className="overview-item-channels-item">
                  TikTok 9%
                </div>
                {/*<div className="overview-item-channels-item">*/}
                {/*  Wallet 1%*/}
                {/*</div>*/}
                {/*<div className="overview-item-channels-item">*/}
                {/*  Other {'<'} 1%*/}
                {/*</div>*/}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default Overview;
