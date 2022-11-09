import React, { FC, useEffect, useState } from 'react';
import styles from './Patrons.module.scss';
import TOKEN_ABI from '../../shared/abis/token-abi.json';
import { BigNumber, Contract, ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { setSocialPrefix } from '../../helpers/getSocialType';
import { filterPlans } from '../../helpers/filterPlans';
import { useConfig } from '../../contexts/Config';
import { Plan, StakeData } from '../../shared/interfaces';

type ModalProps = {
  onClose: (reload?: boolean) => any,
  contract: any,
  tokenUserTotal: string,
  plans: Plan[],
}

const initialModalData: StakeData = {
  social: '',
  poolHandle: '',
  amount: '',
  planId: ''
}

const PatronsModal: FC<ModalProps> = (props: ModalProps) => {
  const { library, account } = useWeb3React<Web3Provider>();
  const { token, staking } = useConfig();
  const social = 'w';
  const poolHandle = 'cloutpatrons';
  const planId = 8;

  const [formError, setFormError] = useState({});
  const [formData, setFormData] = useState(initialModalData);
  const [activePlans, setActivePlans] = useState<Plan[]>([]);
  const [callError, setCallError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleChange = (type: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [type] : value
    }));
  }

  const getSocialLink = () => {
    return (
      <div className={styles.socialLinkWrapper}>
        <div className={styles.socialIcon}>
          <svg width="22" height="22" viewBox="0 0 146 86" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M72.9043 0C40.7582 0 10.6674 29.2533 1.3237 39.2491C-0.441232 41.1372 -0.441233 43.9645 1.3237 45.8526C10.6674 55.8485 40.7582 85.1017 72.9043 85.1017C105.087 85.1017 134.768 55.7814 143.924 45.8184C145.649 43.9417 145.649 41.16 143.924 39.2834C134.768 29.3203 105.087 0 72.9043 0ZM97.5766 52.382C92.2831 52.382 87.9918 48.0908 87.9918 42.7972C87.9918 37.5037 92.2831 33.2124 97.5766 33.2124C102.87 33.2124 107.161 37.5037 107.161 42.7972C107.161 48.0908 102.87 52.382 97.5766 52.382ZM84.6555 54.0634C79.362 54.0634 75.0707 58.3547 75.0707 63.6482C75.0707 68.9418 79.362 73.2331 84.6555 73.2331C89.9491 73.2331 94.2404 68.9418 94.2404 63.6482C94.2404 58.3547 89.9491 54.0634 84.6555 54.0634ZM60.922 54.5359C66.2156 54.5359 70.5069 58.8272 70.5069 64.1207C70.5069 69.4143 66.2156 73.7055 60.922 73.7055C55.6285 73.7055 51.3372 69.4143 51.3372 64.1207C51.3372 58.8272 55.6285 54.5359 60.922 54.5359ZM38.702 42.7972C38.702 48.0908 42.9932 52.382 48.2868 52.382C53.5804 52.382 57.8716 48.0908 57.8716 42.7972C57.8716 37.5037 53.5804 33.2124 48.2868 33.2124C42.9933 33.2124 38.702 37.5037 38.702 42.7972ZM51.3368 20.7459C51.3368 15.4523 55.6281 11.161 60.9217 11.161C66.2152 11.161 70.5065 15.4523 70.5065 20.7459C70.5065 26.0394 66.2152 30.3307 60.9217 30.3307C55.6281 30.3307 51.3368 26.0394 51.3368 20.7459ZM94.2407 21.2176C94.2407 15.924 89.9494 11.6327 84.6559 11.6327C79.3623 11.6327 75.0711 15.924 75.0711 21.2176C75.0711 26.5111 79.3623 30.8024 84.6559 30.8024C89.9494 30.8024 94.2407 26.5111 94.2407 21.2176Z" fill="currentColor"/>
          </svg>
        </div>
        <div className={styles.socialName}>
          <strong>
            cloutpatrons
          </strong>
        </div>
      </div>
    )
  }

  const getStakingMonthsDuration = (planId: string) => {
    return activePlans.find(plan => plan.planId.toString() === planId)?.lockMonths;
  }

  const checkFormValidation = (data) => {
    let errors = {};
    let formIsValid = true;

    if (!data.amount || ethers.utils.parseEther(data.amount).gt(ethers.utils.parseEther(props.tokenUserTotal)) || ethers.utils.parseEther(data.amount).lt(ethers.utils.parseEther('10000'))) {
      errors['amount'] = true;
      formIsValid = false;

      if (data.amount && ethers.utils.parseEther(data.amount).lt(ethers.utils.parseEther('10000'))) {
        setCallError('Amount smaller than 10000 SWAY.')
      }

      if (data.amount && ethers.utils.parseEther(data.amount).gt(ethers.utils.parseEther(props.tokenUserTotal))) {
        setCallError('Amount exceeds total available.')
      }
    }

    if (!data.planId) {
      errors['planId'] = true;
      formIsValid = false;
    }

    if (!data.poolHandle) {
      errors['poolHandle'] = true;
      formIsValid = false;
    }

    console.log('Form errors', errors);
    setFormError(errors);
    return formIsValid;
  }

  const stakeAction = async () => {
    let stakeData: any = {
      social,
      poolHandle,
      amount: formData.amount,
      planId
    }

    if (checkFormValidation(stakeData)) {
      setCallError('');
      setLoading(true);

      // convert amount to eth value
      stakeData.amount = ethers.utils.parseEther(stakeData.amount.toString(10));
      // set social prefix
      stakeData.poolHandle = setSocialPrefix(poolHandle, social);
      try {
        // check allowance and give permissions
        const tokenContract = new Contract(token.address, TOKEN_ABI, library.getSigner());
        const allowance = await tokenContract.allowance(account, staking.address);
        if (allowance.lte(stakeData.amount)) {
          const allowUnlimited = BigNumber.from(2).pow(256).sub(1);
          const awaitTx = await tokenContract.approve(staking.address, allowUnlimited, { gasLimit: 100000 });
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

  const formSubmit = event => {
    event.preventDefault();
    return stakeAction();
  }

  return (
    <div className={`modal ${styles.modal}`}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header pb-0">
            <h3 className="modal-title">
            <img className={styles.logo} src="./assets/patron_logo.png" alt="Patron collection" />
            </h3>
            <button type="button" className="close-btn" onClick={handleCloseClick}>X</button>
          </div>
          <div className="modal-body">
            <div className={styles.description}>
              <p>This is a special creator pool for <strong>Clout Patrons</strong> collection. Staking minimum 10,000 SWAY allows you to participate in the distribution of 333 Clout Patron NFTs and earn a 99% APY over 12 months.</p>
              <p>On the collection launch day, we will make a snapshot of the 333 highest staking positions and distribute the minted Clout Patron NFTs to the nominated Hashpack wallets (you will have to register a Hashpack wallet to receive the NFT).</p>
              <p>To claim your Patron you must <a href='https://bit.ly/cloutpatrons-claim' target="_blank" rel="noreferrer">register your wallet.</a></p>
            </div>
            <div className="modal-body">
          
            <form onSubmit={formSubmit}>
              <div className="row mb-3">
                <div className="col-sm-8 offset-sm-3">
                  {getSocialLink()}
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="amount" className="col-sm-3">Amount</label>
                <div className="col-sm-4 extended-input">
                  <input 
                    type="number"
                    className={`form-control ${formError['amount'] ? 'error' : ''}`}
                    id="amount"
                    min={1}
                    step={0.000000000000000001}
                    value={formData.amount}
                    onChange={(e) => handleChange('amount', e.target.value)}
                    placeholder="10000"
                  />
                  <div className="after-element">MAX</div>
                </div>
                <div className={`${styles.tokenAvailable} col-sm-5`}>
                  <img src={token.logo} alt={token.ticker} height="20"/>
                  <span>{(+props.tokenUserTotal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} available</span>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="planId" className="col-sm-3">Promotional APR</label>
                <div className="col-sm-3">
                  <select 
                    className={`form-control ${formError['planId'] ? 'error' : ''}`}
                    id="planId"
                    value={planId}
                    disabled
                    >
                      {activePlans.map(plan => (
                        <option value={plan.planId} key={plan.planId}>{plan.apy}%</option>
                      ))}
                  </select>
                </div>
                <div className={`${styles.midText} col-sm-6`}>Position will be locked for {getStakingMonthsDuration(planId.toString())} months.</div>
              </div>
              <div className="row">
                <div className="col-sm-4 offset-sm-3 mb-3 mt-2">
                  <button type="submit" className={`btn btn-primary ${loading ? 'btn-pending' : ''}`}><span/>Stake</button>
                </div>
                <div className="col-sm-8 offset-sm-3">
                  <p className={styles.smallText}>After clicking on stake, Metamask will pop-up to complete the transaction.</p>
                  {!!callError && (
                    <p className={`${styles.smallText} error-text`}>{callError}</p>
                  )}
                </div>
              </div>
            </form>
     
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatronsModal;


