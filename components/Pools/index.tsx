import React, { FC } from 'react';
import Item from './Item';
import { ModalData, PoolItemType, StakedEvent } from '../../shared/interfaces';

type PoolsProps = {
  top: StakedEvent[],
  latest: StakedEvent[],
  positions: StakedEvent[],
  tokenUsd: number,
  loadError: boolean
  openModal: (modalData: ModalData) => any,
}

function renderItems(items: StakedEvent[], tokenUsd: number, type: PoolItemType, props: PoolsProps) {
  return (
    <>
      {items.length ?
        items?.map((stakedEvent, i) => {
          return <Item key={i}
                       index={i}
                       item={stakedEvent}
                       tokenUsd={tokenUsd}
                       type={type}
                       openModal={props.openModal}
          />;
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
    <div className="container" style={{ overflow: 'hidden' }}>
      <div className="row gx-6">
        <div className="col-md-4 mb-5">
          <h4>Top creator pools</h4>
          <hr/>
          {!props.loadError && renderItems(props.top, props.tokenUsd, PoolItemType.TOP, props)}
        </div>
        <div className="col-md-4 mb-5">
          <h4>Latest stakes</h4>
          <hr/>
          {!props.loadError && renderItems(props.latest, props.tokenUsd, PoolItemType.LATEST, props)}
        </div>
        <div className="col-md-4 mb-5">
          <h4>Highest positions</h4>
          <hr/>
          {!props.loadError && renderItems(props.positions, props.tokenUsd, PoolItemType.INDIVIDUAL, props)}
        </div>
      </div>
      {props.loadError && (
        <div className="text-center pb-1 mb-5" style={{ textAlign: 'center' }}>
          <p>There seems to be an issue getting our staking data from the Polygon network.</p>
          <p>Please try again in a few minutes.</p>
        </div>
      )}
      <hr/>
    </div>
  </section>
);

export default Pools;
