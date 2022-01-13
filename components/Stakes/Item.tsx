import React, { FC } from 'react';
import styles from './Item.module.scss';
import { getSocialIcon } from '../../helpers/getSocialIcon';
import { StakedEventSocialType } from '../../shared/interfaces';
import ItemPositions from './Positions';

type StakedItem = {
  openModal: ({ type: ModalType }) => any,
}

const StakedItem: FC<StakedItem> = (props: StakedItem) => {
  const [isExpanded, setExpanded] = React.useState(false);

  return (
    <div className={styles.itemWrapper}>

      <div className={styles.item} onClick={() => setExpanded((prevState => !prevState))}>
        <div className={styles.tableItem}>
          <div className="d-flex">
            <div className={styles.icon}>{getSocialIcon(StakedEventSocialType.IG)}</div>
            <strong>metaverse</strong>
          </div>
        </div>
        <div className={styles.tableItem}>
          <strong>23,388,291</strong>
        </div>
        <div className={styles.tableItem}>
          <strong>2,183,293 SWAY</strong>
          <div>7,588 USD</div>
        </div>
        <div className={styles.tableItem}>
          99% *promotional
        </div>
        <div className={styles.tableItem}>
          Unlocked
        </div>
        <div className={styles.tableItem}>
          <strong>3,299,291</strong>
        </div>
      </div>

      {isExpanded && (
        <ItemPositions openModal={props.openModal}/>
      )}
    </div>
  )
};

export default StakedItem;
