import React, { FC } from 'react';
import { ModalType } from '../../shared/interfaces';

type ModalProps = {
  onClose: () => any,
  modalData: { type?: ModalType }
}

const Modal: FC<ModalProps> = (props: ModalProps) => {

  const handleCloseClick = (e) => {
    e.preventDefault();
    props.onClose();
  };

  return (
    <div className="modal">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header pb-0">
            <h3 className="modal-title">{props.modalData.type}</h3>
            <button type="button" className="close" onClick={handleCloseClick}>X</button>
          </div>
          <div className="modal-body">
            <div className="form-group row">
              <label htmlFor="channel" className="col-sm-3">Channel</label>
              <div className="col-sm-4">
                <select className="form-control" id="channel">
                  <option hidden={true}>Select</option>
                  <option value="99">Instagram</option>
                  <option value="66">TikTok</option>
                </select>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="identificator" className="col-sm-3">Identificator</label>
              <div className="col-sm-4">
                <input type="text" className="form-control" id="identificator" placeholder="Enter identificator"/>
              </div>
              <div className="col-sm-5 mid-text">ie. leomessi, banksy.eth...</div>
              {props.modalData.type === ModalType.STAKE && (
                <div className="col-sm-9 offset-sm-3 mt-3">
                  <p className="small-text">NOTE: We don't validate entries, so make sure there are no typos.</p>
                </div>
              )}
              <div className="col-sm-9 offset-sm-3">
                <hr/>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="amount" className="col-sm-3">Amount</label>
              <div className="col-sm-4">
                <input type="number" className="form-control" id="amount" placeholder="1000"/>
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
                <div className="col-sm-7 mid-text">Position will be locked for 9 months.</div>
              </div>
            )}
            <div className="row">
              <div className="col-sm-4 offset-sm-3 mb-3 mt-2">
                {props.modalData.type !== ModalType.UNSTAKE && (
                  <button type="button" className="btn btn-primary">Stake</button>
                )}
                {props.modalData.type === ModalType.UNSTAKE && (
                  <button type="button" className="btn btn-primary">Unstake</button>
                )}
              </div>
              <div className="col-sm-8 offset-sm-3">
                <p className="small-text">After clicking on Stake, Metamask will pop-up to complete the transaction.</p>
                {props.modalData.type === ModalType.ADD && (
                  <p className="small-text">NOTE: Adding additional positions with promotional APR extends the lockup duration of the total stake.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
