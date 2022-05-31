import React, { FC, useEffect, useState } from 'react';
import { IChannelDistributionItem } from '../shared/interfaces';
import { useConfig } from '../contexts/Config';

type OverviewProps = {
  tokenLockedTotal: number[],
  distribution: IChannelDistributionItem[],
  totalRewards: number[],
  totalStakes: number
}


const Overview: FC<OverviewProps> = (props: OverviewProps) => {
  const { token1, token2, staking } = useConfig();

  const getSupplyLockedToken1 = (amount: number): string => {
    return (amount / token1.circulating_supply * 100).toFixed(2);
  }
  const getSupplyLockedToken2 = (amount: number): string => {
    return (amount / token2.circulating_supply * 100).toFixed(2);
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
            <div className="col-10 col-sm-6">
              <div className="overview-item">
                <div className="d-inline-flex">
                  <img className="overview-ticker-logo" src={token1.logo} alt={token1.ticker} height="20"/>
                  <div className="overview-item-token-ticker">
                    {token1.ticker}
                  </div>
                </div>
                <div className="overview-item-name">TOTAL VALUE LOCKED</div>
                <div className="overview-item-value">
                  {props.tokenLockedTotal[0].toLocaleString('en-US', { maximumFractionDigits: 0 })} {token1.ticker}
                </div>
                <div className="overview-item-inline">
                  {getSupplyLockedToken1(props.tokenLockedTotal[0])}% of circulating supply
                </div>
              </div>
              <div className="overview-item">
                <div className="overview-item-name">ANNUAL PERCENTAGE YIELD</div>
                <div className="overview-item-value">{staking.apy}%</div>
              </div>
              <div className="overview-item">
                <div className="overview-item-name">TOTAL REWARDS EARNED</div>
                <div className="overview-item-value">{props.totalRewards[0].toLocaleString('en-US', { maximumFractionDigits: 2 })} {token1.ticker}</div>
              </div>
            </div>
            <div className="col-10 col-sm-6">
              <div className="overview-item">
                <div className="d-inline-flex">
                  <img className="overview-ticker-logo" src={token2.logo} alt={token2.ticker} height="20"/>
                  <div className="overview-item-token-ticker">

                    {token2.ticker}
                  </div>
                </div>

                <div className="overview-item-name">TOTAL VALUE LOCKED</div>
                <div className="overview-item-value">
                  {props.tokenLockedTotal[1].toLocaleString('en-US', { maximumFractionDigits: 0 })} {token2.ticker}
                </div>
                <div className="overview-item-inline">
                  {getSupplyLockedToken2(props.tokenLockedTotal[1])}% of circulating supply
                </div>
              </div>
              <div className="overview-item">
                <div className="overview-item-name">ANNUAL PERCENTAGE YIELD</div>
                <div className="overview-item-value">{staking.apy}%</div>
              </div>
              <div className="overview-item">
                <div className="overview-item-name">TOTAL REWARDS EARNED</div>
                <div className="overview-item-value">{props.totalRewards[1].toLocaleString('en-US', { maximumFractionDigits: 2 })} {token2.ticker}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}

export default Overview;