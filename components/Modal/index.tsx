import React, { FC, useEffect } from 'react';
import { ModalData, ModalType, StakeData, StakedEventSocialType } from '../../shared/interfaces';
import { getSocialIcon } from '../../helpers/getSocialIcon';
import styles from './Modal.module.scss';
import { Contract, ethers } from 'ethers';
import SWAY_TOKEN_ABI from '../../shared/abis/token-abi.json';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

type ModalProps = {
  onClose: () => any,
  modalData: ModalData,
  contract: any,
  swayUserTotal: number
}

const initialModalData: StakeData = {
  social: StakedEventSocialType.IG,
  poolHandle: '',
  amount: '',
  planId: '3'
}

const Modal: FC<ModalProps> = (props: ModalProps) => {
  const [formData, setFormData] = React.useState(initialModalData);
  const [formError, setFormError] = React.useState({});
  const [callError, setCallError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [disableEditing, setDisableEditing] = React.useState(false);

  const { library, account } = useWeb3React<Web3Provider>();

  useEffect(() => {
    if (props.modalData.channel) {
      setFormData((prevState) => ({
        ...prevState,
        social: props.modalData.channel.social,
        poolHandle: props.modalData.channel.poolHandle,
        amount: props.modalData.amount,
      }));
      setDisableEditing(true);
    }
  }, [props.modalData]);

  const handleCloseClick = (e) => {
    e.preventDefault();
    props.onClose();
  };

  const stakeAction = async event => {
    event.preventDefault();
    console.log(event);

    let stakeData = {
      social: event.target.social.value,
      poolHandle: event.target.poolHandle.value,
      amount: event.target.amount.value,
      planId: event.target.planId.value
    };

    if (checkFormValidation(stakeData)) {
      setCallError('');

      // convert amount to eth value
      stakeData.amount = ethers.utils.parseEther(stakeData.amount.toString(10));
      // set social prefix
      stakeData.poolHandle = `${formData.social === StakedEventSocialType.IG ? 'ig-' : 'tt-'}` + stakeData.poolHandle;

      try {
        // check allowance and give permissions
        const tokenContract = new Contract(process.env.NEXT_PUBLIC_SWAY_TOKEN_ADDRESS, SWAY_TOKEN_ABI, library.getSigner());
        const allowance = await tokenContract.allowance(account, process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS);
        if (+ethers.utils.formatEther(allowance) < +ethers.utils.formatEther(stakeData.amount)) {
          await tokenContract.approve(process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS, 2^256 - 1);
        }

        const stakeTx = await props.contract.stake(
          stakeData.poolHandle,
          stakeData.amount,
          stakeData.planId,
          { gasLimit: 500000 }
        );

        const tx = await stakeTx.wait();
        console.log(tx);
        setLoading(false);
        props.onClose();
      } catch (error) {
        setCallError(error['data']?.message.replace('execution reverted: ', '') || (error as any)?.message || 'Error');
        setLoading(false);
      }
    }
  }

  const handleChange = (type: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [type] : value
    }));
  }

  const checkFormValidation = (data) => {
    let errors = {};
    let formIsValid = true;

    if (!data.amount || +data.amount > props.swayUserTotal) {
      errors['amount'] = true;
      formIsValid = false;
      if (+data.amount > props.swayUserTotal) {
        setCallError('Amount exceeds total available.')
      }
    }

    if (!data.poolHandle) {
      errors['poolHandle'] = true;
      formIsValid = false;
    }

    console.log(errors);
    setFormError(errors);
    return formIsValid;
  }

  const getSocialLink = () => {
    return (
      <div className={styles.socialLinkWrapper}>
        <div className={styles.socialIcon}>
          {getSocialIcon(formData.social)}
        </div>
        <div className={styles.socialName}>
          <strong>{formData.poolHandle}</strong>
        </div>
        <div className={styles.socialLink}>
          {formData.social === StakedEventSocialType.IG ? (
            <a href={`https://www.instagram.com/${formData.poolHandle}`} rel="noreferrer" target="_blank">visit</a>
          ) : (
            <a href={`https://www.tiktok.com/@${formData.poolHandle}`} rel="noreferrer" target="_blank">visit</a>
          )}
        </div>
      </div>
    )
  }

  const getStakingMonthsDuration = (planId: string) => {
    switch(planId) {
      case '1':
        return '3';
      case '2':
        return '6';
      case '3':
        return '9';
    }
  }

  return (
    <div className={`modal ${styles.modal}`}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header pb-0">
            <h3 className="modal-title">{props.modalData.type}</h3>
            <button type="button" className={styles.closeBtn} onClick={handleCloseClick}>X</button>
          </div>
          <div className="modal-body">
            <form onSubmit={stakeAction}>
              <div className="form-group row">
                <label htmlFor="social" className="col-sm-3">Channel</label>
                <div className="col-sm-4">
                  <select className="form-control"
                          id="social"
                          value={formData.social}
                          onChange={(e) => handleChange('social', e.target.value)}
                          disabled={disableEditing}>
                    {/*<option hidden={true} value={undefined}>Select</option>*/}
                    <option value={StakedEventSocialType.IG}>Instagram</option>
                    <option value={StakedEventSocialType.TT}>TikTok</option>
                  </select>
                </div>
              </div>
              <div className="form-group row mb-0">
                <label htmlFor="poolHandle" className="col-sm-3">Identificator</label>
                <div className="col-sm-4">
                  <input type="text"
                         className={`form-control ${formError['poolHandle'] ? 'error' : ''}`}
                         id="poolHandle"
                         placeholder="Enter identificator"
                         value={formData.poolHandle}
                         onChange={(e) => handleChange('poolHandle', e.target.value)}
                         disabled={disableEditing}/>
                </div>
                <div className={`${styles.midText} ${styles.lightText} col-sm-5`}>ie. leomessi, banksy ...</div>
                {props.modalData.type === ModalType.STAKE && (
                  <div className="col-sm-9 offset-sm-3 mt-3">
                    <p className={styles.smallText}>NOTE: We don't validate entries, so make sure there are no typos.</p>
                  </div>
                )}
                <div className="col-sm-9 offset-sm-3">
                  <hr/>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-8 offset-sm-3">
                  {formData.poolHandle && getSocialLink()}
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="amount" className="col-sm-3">Amount</label>
                <div className="col-sm-4 extended-input">
                  <input type="number"
                         className={`form-control ${formError['amount'] ? 'error' : ''}`}
                         id="amount"
                         min={1}
                         step={0.00000000000001}
                         value={formData.amount}
                         onChange={(e) => handleChange('amount', e.target.value)}
                         placeholder="1000"/>
                  <div className="after-element" onClick={() => handleChange('amount', props.swayUserTotal.toString())}>MAX</div>
                </div>
                <div className={`${styles.swayAvailable} col-sm-5`}>
                  <img src="assets/favicon.png" alt="Sway" height="20" width="20"/>
                  <span>{props.swayUserTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} available</span>
                </div>
              </div>
              {(props.modalData.type === ModalType.STAKE || props.modalData.type === ModalType.ADD) && (
                <div className="form-group row">
                  <label htmlFor="planId" className="col-sm-3">Promotional APR</label>
                  <div className="col-sm-2">
                    <select className="form-control"
                            id="planId"
                            value={formData.planId}
                            onChange={(e) => handleChange('planId', e.target.value)}>
                      <option value="3">99%</option>
                      <option value="2">66%</option>
                      <option value="1">33%</option>
                    </select>
                  </div>
                  <div className={`${styles.midText} col-sm-7`}>Position will be locked for {getStakingMonthsDuration(formData.planId)} months.</div>
                </div>
              )}
              <div className="row">
                <div className="col-sm-4 offset-sm-3 mb-3 mt-2">
                  {props.modalData.type !== ModalType.UNSTAKE && (
                    <button type="submit" className={`btn btn-primary ${loading ? 'btn-pending' : ''}`}><span/>Stake</button>
                  )}
                  {props.modalData.type === ModalType.UNSTAKE && (
                    <button type="submit" className={`btn btn-primary ${loading ? 'btn-pending' : ''}`}><span/>Unstake</button>
                  )}
                </div>
                <div className="col-sm-8 offset-sm-3">
                  <p className={styles.smallText}>After clicking on Stake, Metamask will pop-up to complete the transaction.</p>
                  {props.modalData.type === ModalType.ADD && (
                    <p className={styles.smallText}>NOTE: Adding additional positions with promotional APR extends the lockup duration of the total stake.</p>
                  )}
                  {!!callError && (
                    <p className={`${styles.smallText} ${styles.errorText}`}>{callError}</p>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
