import React, { FC } from 'react';
import styles from './Item.module.scss';
import { getSocialIcon } from '../../helpers/getSocialIcon';
import { StakedEventSocialType } from '../../shared/interfaces';

type StakedItem = {
  index?: number,
  item?: string,
  swayUsd?: number,
  type?: string
}

const StakedItem: FC<StakedItem> = (props: StakedItem) => (
 <div className={styles.item}>
   <div className={styles.tableItem}>
     <div className="d-flex">
       <div className={styles.icon}>{getSocialIcon(StakedEventSocialType.IG)}</div>
       <div className={styles.mainText}>metaverse</div>
     </div>
   </div>
   <div className={styles.tableItem}>
     <div className={styles.mainText}>23,388,291</div>
   </div>
   <div className={styles.tableItem}>
     <div className={styles.mainText}>2,183,293 SWAY</div>
     <div>7,588 USD</div>
   </div>
   <div className={styles.tableItem}>
     99% *promotional
   </div>
   <div className={styles.tableItem}>
     Unlocked
   </div>
   <div className={styles.tableItem}>
     <div className={styles.mainText}>3,299,291</div>
   </div>
 </div>
);

export default StakedItem;
