import React, { FC, useEffect, useState } from 'react';
import { BigNumber, Contract, ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import styles from './Modal.module.scss';
import { getSocialIcon } from '../../helpers/getSocialIcon';
import TOKEN_ABI from '../../shared/abis/token-abi.json';
import { setSocialPrefix } from '../../helpers/getSocialType';
import { getWalletShorthand } from '../../helpers/getWalletShorthand';
import { ModalData, ModalType, StakeData } from '../../shared/interfaces';
import { useConfig } from '../../contexts/Config';

type ModalProps = {
  onClose: (reload?: boolean) => any,
  modalData: ModalData,
  contract: any,
  tokenUserTotal: string[]
}

const initialModalData: StakeData = {
  social: '',
  poolHandle: '',
  amount: '',
  tokenType: 0
}

const Modal: FC<ModalProps> = (props: ModalProps) => {
  const [formData, setFormData] = useState(initialModalData);
  const [formError, setFormError] = useState({});
  const [callError, setCallError] = useState('');
  const [loading, setLoading] = useState(false);
  const [disableEditing, setDisableEditing] = useState(false);
  const [reward, setReward] = useState(0);
  const [selectedToken, setSelectedToken] = useState(0);

  const { library, account } = useWeb3React<Web3Provider>();
  const { token1, token2, staking } = useConfig();
  const tokens = [token1, token2];

  useEffect(() => {
    if (props.modalData.channel) {
      setFormData((prevState) => ({
        ...prevState,
        social: props.modalData.channel.social,
        poolHandle: props.modalData.channel.poolHandle || '',
        amount: props.modalData.amount || ''
      }));
      if (props.modalData.channel.social && props.modalData.channel.poolHandle) {
        setDisableEditing(true);
      }
    }
    if (props.modalData.type === ModalType.CLAIM) {
      setReward(parseFloat(props.modalData.amount))
    }
    if (!props.modalData.channel?.social) {
      setFormData((prevState) => ({
        ...prevState,
        social: staking.channels[0].prefix
      }));
    }
  }, [props.modalData]);

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
      tokenType: formData.tokenType
    };

    if (checkFormValidation(stakeData)) {
      setCallError('');
      setLoading(true);

      // convert amount to eth value
      stakeData.amount = ethers.utils.parseEther(stakeData.amount.toString(10));

      try {
        // check allowance and give permissions
        const tokenContract = new Contract(tokens[formData.tokenType].address, TOKEN_ABI, library.getSigner());
        const allowance = await tokenContract.allowance(account, staking.address);

        if (allowance.lte(stakeData.amount)) {

          const allowUnlimited = BigNumber.from(2).pow(256).sub(1);
          const awaitTx = await tokenContract.approve(staking.address, allowUnlimited, { gasLimit: 100000 });
          await awaitTx.wait();
        }

        const stakeTx = await props.contract.stake(
          formData.poolHandle,
            stakeData.amount,
            formData.tokenType,
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
      poolHandle: formData.poolHandle,
      tokenType: formData.tokenType
    };

    if (checkFormValidation(stakeData)) {
      setCallError('');
      setLoading(true);

      try {
        const stakeTx = await props.contract.unstake(stakeData.poolHandle, stakeData.tokenType, { gasLimit: 500000 });
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

    try {
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
  const handleTokenChange = (type: string, value: string) => {
    setSelectedToken(parseFloat(value));
    setFormData((prevState) => ({
      ...prevState,
      [type] : parseFloat(value)
    }));
  }

  const checkFormValidation = (data) => {
    let errors = {};
    let formIsValid = true;

    if (props.modalData.type === ModalType.STAKE || props.modalData.type === ModalType.ADD) {
      if (!data.amount || ethers.utils.parseEther(data.amount).gt(ethers.utils.parseEther(props.tokenUserTotal[selectedToken]))) {
        errors['amount'] = true;
        formIsValid = false;
        if (data.amount && ethers.utils.parseEther(data.amount).gt(ethers.utils.parseEther(props.tokenUserTotal[selectedToken]))) {
          setCallError('Amount exceeds total available.')
        }
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
                    <div className={`col-sm-5 ${styles.tokenAvailable}`}>
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
                      <label htmlFor="poolHandle" className="col-sm-3">Address</label>
                      <div className="col-sm-4">
                        <input type="text"
                              className={`form-control ${formError['poolHandle'] ? 'error' : ''}`}
                              id="poolHandle"
                              placeholder="Enter eth address"
                              value={formData.poolHandle}
                              onChange={(e) => handleChange('poolHandle', e.target.value.toLowerCase())}
                              disabled={disableEditing}/>
                      </div>
                      <div className={`${styles.midText} ${styles.lightText} col-sm-5`}>ie. 0x12345...</div>
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
                    <div className={`${styles.tokenAvailable} col-sm-9`}>
                      <img src={token1.logo} alt={token1.ticker} height="20"/>
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
                        <div className="after-element" onClick={() => handleChange('amount', props.tokenUserTotal[selectedToken])}>MAX</div>
                      </div>
                      <div className={`${styles.tokenAvailable} col-sm-5`}>
                        <img src={tokens[selectedToken].logo} alt={tokens[selectedToken].ticker} height="20"/>
                        <span>{(+props.tokenUserTotal[selectedToken]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} available</span>
                      </div>
                    </div>
                  </>
                )}
                {(props.modalData.type === ModalType.UNSTAKE || props.modalData.type === ModalType.STAKE || props.modalData.type === ModalType.ADD) && (
                    <div className="form-group row">
                      <label htmlFor="tokenType" className="col-sm-3">TokenType</label>
                      <div className="col-sm-3">
                        <select className={`form-control ${formError['tokenType'] ? 'error' : ''}`}
                                id="tokenType"
                                value={formData.tokenType}
                                onChange={(e) => handleTokenChange('tokenType', e.target.value)}>
                          <option value={0} key={token1.ticker}>{token1.ticker}</option>
                          <option value={1} key={token2.ticker}>{token2.ticker}</option>
                        </select>
                      </div>
                      {(props.modalData.type === ModalType.UNSTAKE) &&(
                        <div className={`${styles.midText} col-sm-6`}>Do you want to unstake {token1.ticker} or {token2.ticker}?</div>
                      )}
                      {(props.modalData.type === ModalType.STAKE) &&(
                          <div className={`${styles.midText} col-sm-6`}>Do you want to stake {token1.ticker} or {token2.ticker}?</div>
                      )}

                    </div>
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
                    <div className={`col-sm-5 ${styles.tokenAvailable}`}>
                      <img src={token2.logo} alt={token2.ticker} height="20"/>
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
                    {!!callError && (
                      <p className={`${styles.smallText} error-text`}>{callError}</p>
                    )}
                  </div>
                </div>
              </form>
            )}
            {(props.modalData.type === ModalType.CLAIM && reward === 0) && (
              <p>You currently have no {token1.ticker} rewards available for claiming.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
