import React, { FC, useEffect, useState } from 'react';
import { useConfig } from '../contexts/Config';
import CommonService from '../services/Common';

type OverviewProps = {
  tokenLockedTotal: number
}

const initialOverviewState = {
  distribution: [],
  totalRewards: 0,
  maxApyPlan: undefined
};

const Overview: FC<OverviewProps> = (props: OverviewProps) => {
  const { token, staking } = useConfig();
  const [overviewState, setOverviewState] = useState(initialOverviewState);

  useEffect(() => {
    getOverviewData();
  }, []);

  useEffect(() => {
    if (staking) setDistribution();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staking]);

  async function getOverviewData() {
    const maxApyPlan = await CommonService.getMaxApyPlan();
    const totalRewards = await CommonService.getTotalRewards();

    setOverviewState((prevState) => ({
      ...prevState,
      totalRewards: totalRewards,
      maxApyPlan: maxApyPlan
    }));
  }

  async function setDistribution() {
    const distribution = await CommonService.getChanelDistribution();
    const distributionData = distribution.map(item => ({
      name: staking?.channels.find(channel => channel.prefix === item.chanel).name,
      distribution: Math.round(Number(item.distribution) * 100)
    }))

    setOverviewState((prevState) => ({
      ...prevState,
      distribution: distributionData
    }));
  }

  const getSupplyLockedPercentage = (amount: number): string => {
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
                {getSupplyLockedPercentage(props.tokenLockedTotal)}% of circulating supply
              </div>
            </div>
            <div className="overview-item">
              <div className="overview-item-name">APY MAX</div>
              <div className="overview-item-value">{overviewState.maxApyPlan?.apy || 0}%</div>
            </div>
            <div className="overview-item">
              <div className="overview-item-name">TOTAL REWARDS EARNED</div>
              <div className="overview-item-value">{overviewState.totalRewards.toLocaleString('en-US', { maximumFractionDigits: 2 })} {token?.ticker}</div>
            </div>
          </div>
          <div className="col-12 col-sm-4">
            <div className="row">
              <div className="overview-item-title col-7">
                CHANNEL DISTRIBUTION
              </div>
              <div className="overview-item-channels col-5">
                {overviewState.distribution.map((item) => (
                  <div className="overview-item-channels-item" key={item.name}>
                    {item.name} {item.distribution}%
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
