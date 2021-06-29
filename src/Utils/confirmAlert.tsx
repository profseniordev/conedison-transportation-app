import React from 'react';
import { confirmAlert as confirmAlertComp } from 'react-confirm-alert';

function confirmAlert(data: any = {}) {
  confirmAlertComp({
    customUI: ({ onClose }) => {
      return (
        <div className="confirm-alert">
          {data.title ? <h3 className="alert-title">{data.title}</h3> : null}
          <p className="alert-message">{data.message}</p>
          <div className="alert-buttons">
            {data.buttons.map((btn, i) => {
              return (
                <button
                  key={`button-${i}`}
                  className={`btn btn-${btn.btnType || 'secondary'}`}
                  onClick={btn.onClick.bind(this, onClose)}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>
      );
    },
    closeOnEscape: false,
    closeOnClickOutside: false,
  });
}

export default confirmAlert;
