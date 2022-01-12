import React, { FC } from 'react';
import Item from './Item';
import { StakedEvent } from '../../shared/interfaces';

type PoolsProps = {
  top: StakedEvent[],
  latest: StakedEvent[],
  positions: StakedEvent[],
  swayUsd: number
}

function renderItems(items: StakedEvent[], swayUsd: number) {
  return (
    <>
      {items.length ?
        items?.map((stakedEvent, i) => {
          return <Item key={i} index={i} item={stakedEvent} swayUsd={swayUsd}/>;
        }) : (
          <>
            <div className="loading-item"/>
            <div className="loading-item"/>
            <div className="loading-item"/>
          </>
        )}
    </>
  );
}

const Pools: FC<PoolsProps> = (props: PoolsProps) => (
  <section className="my-5">
    <div className="container">
      <div className="row gx-6">
        <div className="col-md-4 mb-5">
          <h4>Top creator pools</h4>
          <hr/>
          {renderItems(props.top, props.swayUsd)}
        </div>
        <div className="col-md-4 mb-5">
          <h4>Latest stakes</h4>
          <hr/>
          {renderItems(props.latest, props.swayUsd)}
        </div>
        <div className="col-md-4 mb-5">
          <h4>Highest positions</h4>
          <hr/>
          {renderItems(props.positions, props.swayUsd)}
        </div>
      </div>
      <hr/>
    </div>
  </section>
);

export default Pools;
