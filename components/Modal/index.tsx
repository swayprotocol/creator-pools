import React, { FC, useEffect, useState } from 'react';
import { BigNumber, Contract, ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import styles from './Modal.module.scss';
import { getSocialIcon } from '../../helpers/getSocialIcon';
import SWAY_TOKEN_ABI from '../../shared/abis/token-abi.json';
import { filterPlans } from '../../helpers/filterPlans';
import { setSocialPrefix } from '../../helpers/getSocialType';
import { getWalletShorthand } from '../../helpers/getWalletShorthand';
import { ModalData, ModalType, Plan, StakeData, StakedEventSocialType } from '../../shared/interfaces';

type ModalProps = {
  onClose: (reload?: boolean) => any,
  modalData: ModalData,
  contract: any,
  swayUserTotal: string,
  plans: Plan[]
}

const initialModalData: StakeData = {
  social: StakedEventSocialType.IG,
  poolHandle: '',
  amount: '',
  planId: ''
}

const Modal: FC<ModalProps> = (props: ModalProps) => {
  const [formData, setFormData] = useState(initialModalData);
  const [formError, setFormError] = useState({});
  const [callError, setCallError] = useState('');
  const [loading, setLoading] = useState(false);
  const [disableEditing, setDisableEditing] = useState(false);
  const [activePlans, setActivePlans] = useState<Plan[]>([]);
  const [reward, setReward] = useState(0);

  const { library, account } = useWeb3React<Web3Provider>();

  useEffect(() => {
    if (props.modalData.channel) {
      setFormData((prevState) => ({
        ...prevState,
        social: props.modalData.channel.social || StakedEventSocialType.IG,
        poolHandle: props.modalData.channel.poolHandle || '',
        amount: props.modalData.amount || '',
      }));
      if (props.modalData.channel.social && props.modalData.channel.poolHandle) {
        setDisableEditing(true);
      }
    }
    if (props.modalData.type === ModalType.CLAIM) {
      setReward(parseFloat(props.modalData.amount))
    }
  }, [props.modalData]);

  useEffect(() => {
    if (props.plans.length) {
      const activePlans = filterPlans(props.plans);
      setActivePlans(activePlans);
      setFormData((prevState) => ({
        ...prevState,
        planId: activePlans[0].planId.toString()
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.plans.length]);

  const handleCloseClick = (e) => {
    e.preventDefault();
    props.onClose();
  };

  const formSubmit = event => {
    event.preventDefault();

    if (props.modalData.type === ModalType.UNSTAKE) {
      // UNSTAKE
      return unstakeAction();
    }else if (props.modalData.type === ModalType.CLAIM) {
      // CLAIM
      return claimAction();
    } else {
      // STAKE and ADD
      return stakeAction();
    }
  }

  const stakeAction = async () => {
    let stakeData: any = {
      social: formData.social,
      poolHandle: formData.poolHandle,
      amount: formData.amount,
      planId: formData.planId
    };

    if (checkFormValidation(stakeData)) {
      setCallError('');
      setLoading(true);

      // convert amount to eth value
      stakeData.amount = ethers.utils.parseEther(stakeData.amount.toString(10));
      // set social prefix
      stakeData.poolHandle = setSocialPrefix(formData.poolHandle, formData.social);

      try {
        // check allowance and give permissions
        const tokenContract = new Contract(process.env.NEXT_PUBLIC_SWAY_TOKEN_ADDRESS, SWAY_TOKEN_ABI, library.getSigner());
        const allowance = await tokenContract.allowance(account, process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS);
        if (allowance.lte(stakeData.amount)) {
          const allowUnlimited = BigNumber.from(2).pow(256).sub(1);
          const awaitTx = await tokenContract.approve(process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS, allowUnlimited, { gasLimit: 100000 });
          await awaitTx.wait();
        }

        const stakeTx = await props.contract.stake(
          stakeData.poolHandle,
          stakeData.amount,
          stakeData.planId,
          { gasLimit: 500000 }
        );

        await stakeTx.wait();
        props.onClose(true);
      } catch (error) {
        setCallError(error['data']?.message.replace('execution reverted: ', '') || (error as any)?.message || 'Error');
        setLoading(false);
      }
    }
  }

  const unstakeAction = async () => {
    let stakeData = {
      poolHandle: formData.poolHandle
    };

    if (checkFormValidation(stakeData)) {
      setCallError('');
      setLoading(true);

      // set social prefix
      stakeData.poolHandle = setSocialPrefix(formData.poolHandle, formData.social);

      try {
        const stakeTx = await props.contract.unstake(stakeData.poolHandle, { gasLimit: 500000 });
        await stakeTx.wait();
        props.onClose(true);
      } catch (error) {
        setCallError(error['data']?.message.replace('execution reverted: ', '') || (error as any)?.message || 'Error');
        setLoading(false);
      }
    }
  }

  const claimAction = async () => {
    setCallError('');
    setLoading(true);

    try{
      const longPoolhandle = setSocialPrefix(formData.poolHandle, formData.social);
      const reward = await props.contract.getReward(longPoolhandle)
      await reward.wait()
      props.onClose(true);
    } catch (error) {
      setCallError(error['data']?.message?.replace('execution reverted: ', '') || (error as any)?.message || 'Error');
      setLoading(false);
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

    if (props.modalData.type === ModalType.STAKE || props.modalData.type === ModalType.ADD) {
      if (!data.amount || ethers.utils.parseEther(data.amount).gt(ethers.utils.parseEther(props.swayUserTotal))) {
        errors['amount'] = true;
        formIsValid = false;
        if (data.amount && ethers.utils.parseEther(data.amount).gt(ethers.utils.parseEther(props.swayUserTotal))) {
          setCallError('Amount exceeds total available.')
        }
      }

      if (!data.planId) {
        errors['planId'] = true;
        formIsValid = false;
      }
    }

    if (!data.poolHandle) {
      errors['poolHandle'] = true;
      formIsValid = false;
    }

    console.log('Form errors', errors);
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
          <strong>
            {formData.poolHandle.length > 30 ? getWalletShorthand(formData.poolHandle) : formData.poolHandle}
          </strong>
        </div>
        <div className={styles.socialLink}>
          <a href={getSocialUrl()} rel="noreferrer" target="_blank">visit</a>
        </div>
      </div>
    )
  }

  const getSocialUrl = (): string => {
    switch (formData.social) {
      case StakedEventSocialType.IG:
        return `https://www.instagram.com/${formData.poolHandle}`;
      case StakedEventSocialType.TT:
        return `https://www.tiktok.com/@${formData.poolHandle}`;
      case StakedEventSocialType.ENS:
        return `https://app.ens.domains/name/${formData.poolHandle}`;
      case StakedEventSocialType.W:
        return `https://polygonscan.com/address/${formData.poolHandle}`;
    }
  }

  const getStakingMonthsDuration = (planId: string) => {
    return activePlans.find(plan => plan.planId.toString() === planId)?.lockMonths;
  }

  return (
    <div className={`modal ${styles.modal}`}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header pb-0">
            <h3 className="modal-title">{props.modalData.type}</h3>
            <button type="button" className="close-btn" onClick={handleCloseClick}>X</button>
          </div>
          <div className="modal-body">
            {(props.modalData.type !== ModalType.CLAIM || props.modalData.type === ModalType.CLAIM && reward) && (
              <form onSubmit={formSubmit}>
                {props.modalData.type === ModalType.CLAIM && (
                  <div className="form-group row">
                    <label htmlFor="social" className="col-sm-3">Farmed rewards</label>
                    <div className="col-sm-4">
                      <div className={styles.socialLinkWrapper}>
                        <div className={styles.socialIcon}>
                          {getSocialIcon(formData.social)}
                        </div>
                        <div className={styles.socialName}>
                          <strong>
                            {formData.poolHandle.length > 30 ? getWalletShorthand(formData.poolHandle) : formData.poolHandle}
                          </strong>
                        </div>
                      </div>
                    </div>
                    <div className={`col-sm-5 ${styles.swayAvailable}`}>
                      <div className={styles.socialIcon}></div>
                      <span className={styles.amount}>
                        {props.modalData.amount}
                      </span>
                    </div>
                  </div>
                )}
                {(props.modalData.type === ModalType.STAKE || props.modalData.type === ModalType.UNSTAKE || props.modalData.type === ModalType.ADD) && (
                  <>
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
                          <option value={StakedEventSocialType.ENS}>Ethereum Name Service</option>
                          <option value={StakedEventSocialType.W}>Wallet</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label htmlFor="poolHandle" className="col-sm-3">Identificator</label>
                      <div className="col-sm-4">
                        <input type="text"
                              className={`form-control ${formError['poolHandle'] ? 'error' : ''}`}
                              id="poolHandle"
                              placeholder="Enter identificator"
                              value={formData.poolHandle}
                              onChange={(e) => handleChange('poolHandle', e.target.value.toLowerCase())}
                              disabled={disableEditing}/>
                      </div>
                      <div className={`${styles.midText} ${styles.lightText} col-sm-5`}>ie. leomessi, banksy.eth ...</div>
                      {props.modalData.type === ModalType.STAKE && (
                        <div className="col-sm-9 offset-sm-3 mt-3">
                          <p className={`${styles.smallText} mb-0`}>NOTE: We don't validate entries, so make sure there are no typos.</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
                {(props.modalData.type === ModalType.UNSTAKE || props.modalData.type === ModalType.ADD) && (
                  <div className="form-group row">
                    <label className="col-sm-3">Staked</label>
                    <div className={`${styles.swayAvailable} col-sm-9`}>
                      <img src="assets/favicon.png" alt="Sway" height="20" width="20"/>
                      <span>{props.modalData.channel?.userTotalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        {' '}staked in {props.modalData.channel?.positions.length} positions</span>
                    </div>
                  </div>
                )}
                <div className="row">
                  <div className="col-sm-9 offset-sm-3">
                    <hr/>
                  </div>
                </div>
                {(props.modalData.type === ModalType.STAKE || props.modalData.type === ModalType.UNSTAKE || props.modalData.type === ModalType.ADD) && (
                  <div className="row mb-3">
                    <div className="col-sm-8 offset-sm-3">
                      {formData.poolHandle && getSocialLink()}
                    </div>
                  </div>
                )}
                {(props.modalData.type === ModalType.STAKE || props.modalData.type === ModalType.ADD) && (
                  <>
                    <div className="form-group row">
                      <label htmlFor="amount" className="col-sm-3">Amount</label>
                      <div className="col-sm-4 extended-input">
                        <input type="number"
                              className={`form-control ${formError['amount'] ? 'error' : ''}`}
                              id="amount"
                              min={1}
                              step={0.000000000000000001}
                              value={formData.amount}
                              onChange={(e) => handleChange('amount', e.target.value)}
                              placeholder="1000"/>
                        <div className="after-element" onClick={() => handleChange('amount', props.swayUserTotal)}>MAX</div>
                      </div>
                      <div className={`${styles.swayAvailable} col-sm-5`}>
                        <img src="assets/favicon.png" alt="Sway" height="20" width="20"/>
                        <span>{(+props.swayUserTotal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} available</span>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label htmlFor="planId" className="col-sm-3">Promotional APR</label>
                      <div className="col-sm-3">
                        <select className={`form-control ${formError['planId'] ? 'error' : ''}`}
                                id="planId"
                                value={formData.planId}
                                onChange={(e) => handleChange('planId', e.target.value)}>
                          {activePlans.map(plan => (
                            <option value={plan.planId} key={plan.planId}>{plan.apy}%</option>
                          ))}
                        </select>
                      </div>
                      <div className={`${styles.midText} col-sm-6`}>Position will be locked for {getStakingMonthsDuration(formData.planId)} months.</div>
                    </div>
                  </>
                )}
                {props.modalData.type === ModalType.CLAIM && (
                  <div className="form-group row">
                    <div className="col-sm-4 offset-sm-3">
                      <div className={styles.socialLinkWrapper}>
                        <div className={styles.socialIcon}>
                        </div>
                        <div className={styles.socialName}>
                          Total
                        </div>
                      </div>
                    </div>
                    <div className={`col-sm-5 ${styles.swayAvailable}`}>
                      <img src="assets/favicon.png" alt="Sway" height="20" width="20"/>
                      <span>
                        {props.modalData.amount}
                      </span>
                    </div>
                  </div>
                )}
                <div className="row">
                  <div className="col-sm-4 offset-sm-3 mb-3 mt-2">
                    {(props.modalData.type === ModalType.STAKE || props.modalData.type === ModalType.ADD) && (
                      <button type="submit" className={`btn btn-primary ${loading ? 'btn-pending' : ''}`}><span/>Stake</button>
                    )}
                    {props.modalData.type === ModalType.UNSTAKE && (
                      <button type="submit" className={`btn btn-primary ${loading ? 'btn-pending' : ''}`}><span/>Unstake</button>
                    )}
                    {props.modalData.type === ModalType.CLAIM && (
                      <button type="submit" className={`btn btn-primary ${loading ? 'btn-pending' : ''}`}><span/>Claim</button>
                    )}
                  </div>
                  <div className="col-sm-8 offset-sm-3">
                    <p className={styles.smallText}>After clicking on {props.modalData.type === ModalType.CLAIM ? 'Claim' : 'Stake'}, Metamask will pop-up to complete the transaction.</p>
                    {props.modalData.type === ModalType.ADD && (
                      <p className={styles.smallText}>NOTE: Adding additional positions with promotional APR extend the lockup duration of the total stake.</p>
                    )}
                    {!!callError && (
                      <p className={`${styles.smallText} error-text`}>{callError}</p>
                    )}
                  </div>
                </div>
              </form>
            )}
            {(props.modalData.type === ModalType.CLAIM && reward === 0) && (
              <p>You currently have no SWAY rewards available for claiming.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
