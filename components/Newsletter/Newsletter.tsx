import React, { FC, useState } from 'react';
import styles from './Newsletter.module.scss';

type ModalProps = {
  onClose: () => any
}

const Newsletter: FC<ModalProps> = (props: ModalProps) => {
  const [formError, setFormError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCloseClick = (e) => {
    e.preventDefault();
    props.onClose();
  };

  const formSubmit = async event => {
    event.preventDefault();
    setFormError(false);
    setLoading(true);

    const formData = new FormData();
    formData.append('email', event.target.email.value);

    try {
      await fetch(
        'https://script.google.com/macros/s/AKfycbwRBkztK31FOMI4ylfjU4ebC9EV_k0g0toUGVwi88nrryxlFAL8L3FwLXMo6sQUNKlwOQ/exec',
        {
          body: formData,
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          mode: 'no-cors'
        }
      );
      setSuccess(true);
    } catch (e) {
      setFormError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`modal ${styles.modal}`}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header pb-0">
            <h3 className="modal-title">Stay on top</h3>
            <button type="button" className="close-btn" onClick={handleCloseClick}>X</button>
          </div>
          <div className="modal-body">
            <p className="mb-4 pb-2">
              Sign up for our newsletter and receive the best insights and the latest stats around
              creator pools.
            </p>
            {!success ? (
              <form onSubmit={formSubmit}>
                <div className="form-group row">
                  <div className="col-8 col-lg-5 offset-lg-2">
                    <input type="email"
                           className="form-control"
                           id="email"
                           autoComplete="email"
                           placeholder="Email address"
                           disabled={loading}
                           required={true}
                    />
                  </div>
                  <div className="col-4 col-lg-5">
                    <button type="submit" className={`btn btn-primary ${loading ? 'btn-pending' : ''}`}>
                      <span/>Subscribe
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className={styles.successText}>
                <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M43 11L16.875 37L5 25.1818" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <strong>You have successfully joined our mailing list.</strong>
              </div>
            )}
            <div className="row">
              {formError && (
                <p className={`${styles.smallText} error-text`}>There was an error, please try again.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
