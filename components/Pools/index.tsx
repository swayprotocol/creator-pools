import React, { FC } from 'react';
import Item from './Item';
import { StakedEvent } from '../../shared/interfaces';

type PoolsProps = {
  top: StakedEvent[],
  latest: StakedEvent[],
  positions: StakedEvent[],
}

function renderItems(items: StakedEvent[]) {
  return (
    <>
      {items.length ?
        items?.map((stakedEvent, i) => {
          return <Item key={i} index={i} item={stakedEvent}/>;
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
        <div className="col-md-4">
          <h4>Top creator pools</h4>
          <hr/>
          {renderItems(props.top)}
        </div>
        <div className="col-md-4">
          <h4>Latest stakes</h4>
          <hr/>
          {renderItems(props.latest)}
        </div>
        <div className="col-md-4">
          <h4>Highest positions</h4>
          <hr/>
          {renderItems(props.positions)}
        </div>
      </div>
    </div>
  </section>
);

export default Pools;
