import React, { FC } from 'react';
import styles from './Item.module.scss';
import { getSocialIcon } from '../../helpers/getSocialIcon';
import { Channel } from '../../shared/interfaces';
import ItemPositions from './Positions';

type StakedItem = {
  openModal: ({ type: ModalType }) => any,
  channel: Channel,
  swayUsd: number,
}

const StakedItem: FC<StakedItem> = (props: StakedItem) => {
  const [isExpanded, setExpanded] = React.useState(false);

  return (
    <div className={`${styles.itemWrapper} ${isExpanded ? styles.itemWrapperActive : ''}`}>

      <div className={styles.item} onClick={() => setExpanded((prevState => !prevState))}>
        <div className={styles.tableItem}>
          <div className="d-flex">
            <div className={styles.icon}>{getSocialIcon(props.channel.social)}</div>
            <strong>{props.channel.poolHandle}</strong>
          </div>
        </div>
        <div className={styles.tableItem}>
          <strong>0</strong>
        </div>
        <div className={styles.tableItem}>
          <strong>{props.channel.totalAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })} SWAY</strong>
          <div>{(props.channel.totalAmount * props.swayUsd).toLocaleString('en-US', { maximumFractionDigits: 0 })} USD</div>
        </div>
        <div className={styles.tableItem}>
          99% *promotional
        </div>
        <div className={styles.tableItem}>
          Locked
        </div>
        <div className={styles.tableItem}>
          <strong>{props.channel.farmed.toLocaleString('en-US', { maximumFractionDigits: 2 })}</strong>
        </div>
      </div>

      {isExpanded && (
        <ItemPositions openModal={props.openModal}
                       positions={props.channel.positions}
                       swayUsd={props.swayUsd}
                       channel={props.channel}
        />
      )}
    </div>
  )
};

export default StakedItem;
