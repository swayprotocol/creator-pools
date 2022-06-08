import React, { FC, useEffect, useState } from 'react';
import { useConfig } from '../contexts/Config';
import CommonService from '../services/Common';

type OverviewProps = {
  tokenLockedTotal: number[],
  maxApyPlan: number[]
}

const initialOverviewState = {
  distribution: [],
  totalRewards: [0,0]
};

const Overview: FC<OverviewProps> = (props: OverviewProps) => {
  const { token1, token2 } = useConfig();
  const [overviewState, setOverviewState] = useState(initialOverviewState);

  useEffect(() => {
    getOverviewData();
  }, []);

  const getSupplyLockedToken1 = (amount: number): string => {
    return (amount / token1?.circulating_supply * 100).toFixed(2);
  }
  const getSupplyLockedToken2 = (amount: number): string => {
    return (amount / token2?.circulating_supply * 100).toFixed(2);
  }

async function getOverviewData() {
  const overview = await CommonService.getOverview();
  const maxApyPlan = [overview[0].maxApyPlan, overview[1].maxApyPlan];
  const totalRewards = [overview[0].totalFarmed, overview[1].totalFarmed];

  setOverviewState((prevState) => ({
    ...prevState,
    totalRewards: totalRewards,
    maxApyPlan: maxApyPlan
  }));
}

  return (
      <section className="my-5">
        <div className="container">
          <div className="row">
            <h2 className="mb-4">Overview</h2>
            <div className="col-10 col-sm-6">
              <div className="overview-item">
                <div className="d-inline-flex">
                  <img className="overview-ticker-logo" src={token1?.logo} alt={token1?.ticker} height="20"/>
                  <div className="overview-item-token-ticker">
                    {token1?.ticker}
                  </div>
                </div>
                <div className="overview-item-name">TOTAL VALUE LOCKED</div>
                <div className="overview-item-value">
                  {props.tokenLockedTotal[0].toLocaleString('en-US', { maximumFractionDigits: 0 })} {token1?.ticker}
                </div>
                <div className="overview-item-inline">
                  {getSupplyLockedToken1(props.tokenLockedTotal[0])}% of circulating supply
                </div>
              </div>
              <div className="overview-item">
                <div className="overview-item-name">ANNUAL PERCENTAGE YIELD</div>
                <div className="overview-item-value">{props.maxApyPlan[0]}%</div>
              </div>
              <div className="overview-item">
                <div className="overview-item-name">TOTAL REWARDS EARNED</div>
                <div className="overview-item-value">{overviewState.totalRewards[0].toLocaleString('en-US', { maximumFractionDigits: 2 })} {token1?.ticker}</div>
              </div>
            </div>
            <div className="col-10 col-sm-6">
              <div className="overview-item">
                <div className="d-inline-flex">
                  <img className="overview-ticker-logo" src={token2?.logo} alt={token2?.ticker} height="20"/>
                  <div className="overview-item-token-ticker">
                    {token2?.ticker}
                  </div>
                </div>
                <div className="overview-item-name">TOTAL VALUE LOCKED</div>
                <div className="overview-item-value">
                  {props.tokenLockedTotal[1].toLocaleString('en-US', { maximumFractionDigits: 0 })} {token2?.ticker}
                </div>
                <div className="overview-item-inline">
                  {getSupplyLockedToken2(props.tokenLockedTotal[1])}% of circulating supply
                </div>
              </div>
              <div className="overview-item">
                <div className="overview-item-name">ANNUAL PERCENTAGE YIELD</div>
                <div className="overview-item-value">{props.maxApyPlan[1]}%</div>
              </div>
              <div className="overview-item">
                <div className="overview-item-name">TOTAL REWARDS EARNED</div>
                <div className="overview-item-value">{overviewState.totalRewards[1].toLocaleString('en-US', { maximumFractionDigits: 2 })} {token1?.ticker}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}

export default Overview;