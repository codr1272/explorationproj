import React from 'react';
import Popup from 'reactjs-popup';

const ModalMessage = ({ title, isOpen, onConfirm, onReject, butonText }) => (
  <Popup open={isOpen} closeOnDocumentClick={false}>
    {(close) => (
      <div className="modal">
        <div className="modal__header">
          <label className='modal__header-title'>{title}</label>
          <button className="modal__header-close" onClick={onReject}>
            Х
          </button></div>
        <div className="modal__actions">
          <button className="modal__button modal__button-cancel" onClick={onReject}>
            Ні
          </button>
          <button className="modal__button modal__button-agree" onClick={() => onConfirm()}>
            {butonText}
          </button>
        </div>
      </div>
    )}
  </Popup>
);

export default ModalMessage;
