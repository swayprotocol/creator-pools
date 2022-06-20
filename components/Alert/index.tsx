import React, { FC, useState } from 'react';

type ModalProps = {
  onClose: () => any,
  title: string,
  text: string,
}

const Alert: FC<ModalProps> = (props: ModalProps) => {

  const handleCloseClick = (e) => {
    e.preventDefault();
    props.onClose();
  };

  return (
    <div className={`modal`}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header pb-0">
            <h3 className="modal-title">{props.title}</h3>
            <button type="button" className="close-btn" onClick={handleCloseClick}>X</button>
          </div>
          <div className="modal-body">
            <p className="mb-4 pb-2">
              {props.text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
