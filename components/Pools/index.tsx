import React from 'react';
import { NextPage } from 'next';
import Item from './Item';

function renderItems(items: string[]) {
  return (
    <div>
      {items.map((_, i) => {
        return <Item key={i} index={i}/>
      })}
    </div>
  )
}

const Pools: NextPage = () => (
  <section className="my-5">
    <div className="container">
      <div className="row gx-6">
        <div className="col-md-4">
          <h4>Top creator pools</h4>
          <hr/>
          {renderItems(['', '', ''])}
        </div>
        <div className="col-md-4">
          <h4>Latest stakes</h4>
          <hr/>
          {renderItems(['', '', '', '', ''])}
        </div>
        <div className="col-md-4">
          <h4>Highest positions</h4>
          <hr/>
          {renderItems(['', '', ''])}
        </div>
      </div>
    </div>
  </section>
);

export default Pools;
