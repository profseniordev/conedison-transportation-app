import * as actionTypes from './actionTypes';
import Immutable from 'seamless-immutable';
import {NOTIFIABLE_TYPES} from '../../Constants/job';
import {toast} from 'react-toastify';
import React from 'react';

let data = null;
const initialState = Immutable({
    token      : '',
    user       : null,
    roles      : [],
    departments: [],
    notifications: [],
    permissions: []
});

export default function (state=initialState, {type, ...action}) {

    switch(type) {
        case actionTypes.TOKEN_SUCCESS:
            return state.merge({
                token   : action.token
            });
        /** GET ACCOUNT **/
        case actionTypes.GET_ACCOUNT_REQUEST:
            return state.merge({
                processing   : true
            });
        case actionTypes.GET_ACCOUNT_SUCCESS:
            return state.merge({
                processing     : false,
                user           : action.user
            });
        case actionTypes.GET_ACCOUNT_FAIL:
            return state.merge({
                processing   : false,
                user         : null
            });
        case actionTypes.GET_ACCOUNT_ERROR:
            return state.merge({
                processing   : false,
                user         : null
            });


        case actionTypes.GET_ROLES_SUCCESS:
            return state.merge({
                roles: action.roles
            });
        case actionTypes.GET_PERMISSIONS_SUCCESS:
            return state.merge({
                permissions: action.permissions
            });
        case actionTypes.GET_DEPARTMENTS_SUCCESS:
            return state.merge({
                departments: action.departments
            });

        case actionTypes.SOCKET_NOTIFICATIONS:
            data = JSON.parse(action.data);
            switch (data.notifiableType) {
                case NOTIFIABLE_TYPES.CREATE_JOB:
                    toast.success(
                        <span dangerouslySetInnerHTML={{__html: (data.message ? data.message : data.notifiableGroup.message)}}></span>
                    );
                    break;
                case NOTIFIABLE_TYPES.CANCEL_JOB:
                    toast.warn(
                        <span dangerouslySetInnerHTML={{__html: (data.message ? data.message : data.notifiableGroup.message)}}></span>
                    );
                    break;

                default:
                    toast.info(
                        <span dangerouslySetInnerHTML={{__html: (data.message ? data.message : data.notifiableGroup.message)}}></span>
                    );
                    break;
            }
            return state;

        case actionTypes.LOGOUT:
            return state.merge(initialState);

        default:
            return state;
    }
}
