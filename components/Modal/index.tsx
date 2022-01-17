import React, { FC } from 'react';
import { ModalType, StakedEventSocialType } from '../../shared/interfaces';
import { getSocialIcon } from '../../helpers/getSocialIcon';
import styles from './Modal.module.scss';

type ModalProps = {
  onClose: () => any,
  modalData: { type?: ModalType }
}

const Modal: FC<ModalProps> = (props: ModalProps) => {
  const [identificator, setIdentificator] = React.useState('');
  const [formError, setFormError] = React.useState({});
  const [formData, setFormData] = React.useState({});

  const handleCloseClick = (e) => {
    e.preventDefault();
    props.onClose();
  };

  const stakeAction = event => {
    event.preventDefault();
    console.log(event);

    const stakeData = {
      channel: event.target.channel.value,
      identificator: event.target.identificator.value,
      amount: event.target.amount.value,
      apr: event.target.apr.value
    };

    if (checkFormValidation(stakeData)) {
      // all good
    }

  }

  const handleChange = (type: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const data = event.target.value;
    console.log(data);
    setIdentificator(data)
  }

  const checkFormValidation = (data) => {
    let errors = {};
    let formIsValid = true;

    if (!data.amount) {
      errors['amount'] = true;
      formIsValid = false;
    }

    if (!data.identificator) {
      errors['identificator'] = true;
      formIsValid = false;
    }

    console.log(errors);
    setFormError(errors);
    return formIsValid;
  }

  const socialLink = () => {
    return (
      <div className={styles.socialLinkWrapper}>
        <div className={styles.socialIcon}>
          {getSocialIcon(StakedEventSocialType.IG)}
        </div>
        <div className={styles.socialName}>
          <strong>{identificator}</strong>
        </div>
        <div className={styles.socialLink}>
          <a href={`https://www.instagram.com/${identificator}`} rel="noreferrer" target="_blank">visit</a>
        </div>
      </div>
    )
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
                <label htmlFor="channel" className="col-sm-3">Channel</label>
                <div className="col-sm-4">
                  <select className="form-control" id="channel" required={true} value={formData['channel']}>
                    {/*<option hidden={true} value={undefined}>Select</option>*/}
                    <option value={StakedEventSocialType.IG}>Instagram</option>
                    <option value={StakedEventSocialType.TT}>TikTok</option>
                  </select>
                </div>
              </div>
              <div className="form-group row mb-0">
                <label htmlFor="identificator" className="col-sm-3">Identificator</label>
                <div className="col-sm-4">
                  <input type="text"
                         className={`form-control ${formError['identificator'] ? 'error' : ''}`}
                         id="identificator"
                         placeholder="Enter identificator"
                         value={identificator}
                         onChange={(e) => handleChange('identificator', e)}/>
                </div>
                <div className={`${styles.midText} ${styles.lightText} col-sm-5`}>ie. leomessi, banksy.eth...</div>
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
                  {identificator && socialLink()}
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="amount" className="col-sm-3">Amount</label>
                <div className="col-sm-4">
                  <input type="number"
                         className={`form-control ${formError['amount'] ? 'error' : ''}`}
                         id="amount"
                         placeholder="1000"/>
                </div>
              </div>
              {props.modalData.type === ModalType.STAKE && (
                <div className="form-group row">
                  <label htmlFor="apr" className="col-sm-3">Promotional APR</label>
                  <div className="col-sm-2">
                    <select className="form-control" id="apr">
                      <option value="99" defaultValue={99}>99%</option>
                      <option value="66">66%</option>
                      <option value="33">33%</option>
                    </select>
                  </div>
                  <div className={`${styles.midText} col-sm-7`}>Position will be locked for 9 months.</div>
                </div>
              )}
              <div className="row">
                <div className="col-sm-4 offset-sm-3 mb-3 mt-2">
                  {props.modalData.type !== ModalType.UNSTAKE && (
                    <button type="submit" className="btn btn-primary">Stake</button>
                  )}
                  {props.modalData.type === ModalType.UNSTAKE && (
                    <button type="submit" className="btn btn-primary">Unstake</button>
                  )}
                </div>
                <div className="col-sm-8 offset-sm-3">
                  <p className={styles.smallText}>After clicking on Stake, Metamask will pop-up to complete the transaction.</p>
                  {props.modalData.type === ModalType.ADD && (
                    <p className={styles.smallText}>NOTE: Adding additional positions with promotional APR extends the lockup duration of the total stake.</p>
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
