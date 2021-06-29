import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import MaterialButton from '@material-ui/core/Button';

import './button.scss'


const button = (props) => (
    <div className={`container-button ${props.className}`}>
        <MaterialButton variant={props.variant ? props.variant : 'contained'}
                        size={'small'}
                        className={props.color}
                        style={{
                            width: props.width,
                            height:props.height,
                            textTransform: props.textTransform ? 'uppercase' : 'capitalize',
                            borderRadius: props.borderRadius ? props.borderRadius : '4px'
                        }}
                        onClick={props.onClick}
                        disabled={props.processing || props.disabled}>
            {props.children}
        </MaterialButton>
        {props.processing && <CircularProgress size={24} className={'circular-progress'}/>}
    </div>
);

export default React.memo(button);
