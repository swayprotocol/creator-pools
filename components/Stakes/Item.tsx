import React, { FC, useState } from 'react';
import styles from './Item.module.scss';
import { getSocialIcon } from '../../helpers/getSocialIcon';
import { Channel, ModalData } from '../../shared/interfaces';
import ItemPositions from './Positions';
import { getWalletShorthand } from '../../helpers/getWalletShorthand';
import { useConfig } from '../../contexts/Config';

type StakedItem = {
  openModal: (modalData: ModalData) => any,
  channel: Channel,
  tokenUsd: number,
  tokenUserTotal: string,
  contract: any,
}

const StakedItem: FC<StakedItem> = (props: StakedItem) => {
  const [isExpanded, setExpanded] = useState(false);
  const { token } = useConfig();

  return (
    <div className={`${styles.itemWrapper} ${isExpanded ? styles.itemWrapperActive : ''}`}>

      <div className={styles.item} onClick={() => setExpanded((prevState => !prevState))}>
        <div className={styles.itemIcon}>▶</div>
        <div className={styles.tableItem}>
          <div className="d-flex">
            <div className={styles.icon}>{getSocialIcon(props.channel.social)}</div>
            <strong>
              {props.channel.poolHandle.length > 30 ? getWalletShorthand(props.channel.poolHandle) : props.channel.poolHandle}
            </strong>
          </div>
        </div>
        <div className={styles.tableItem}>
          <strong>{props.channel.totalAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}</strong>
        </div>
        <div className={styles.tableItem}>
          <strong>{props.channel.userTotalAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })} {token.ticker}</strong>
          <div>{(props.channel.userTotalAmount * props.tokenUsd).toLocaleString('en-US', { maximumFractionDigits: 0 })} USD</div>
        </div>
        <div className={styles.tableItem}>
          {props.channel.averageAPR}%
        </div>
        <div className={styles.tableItem}>
          {props.channel.positions.some(position => +position.unlockTime > +new Date()) ? 'Locked' : 'Unlocked'}
        </div>
        <div className={styles.tableItem}>
          <strong>{props.channel.totalFarmed.toLocaleString('en-US', { maximumFractionDigits: 2 })}</strong>
        </div>
      </div>

      {isExpanded && (
        <ItemPositions openModal={props.openModal}
                       positions={props.channel.positions}
                       tokenUsd={props.tokenUsd}
                       tokenUserTotal={props.tokenUserTotal}
                       channel={props.channel}
                       contract={props.contract}
        />
      )}
    </div>
  )
};

export default StakedItem;
