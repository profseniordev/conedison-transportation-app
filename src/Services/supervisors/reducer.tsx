import * as actionTypes from './actionTypes';
import Immutable from 'seamless-immutable';

const initialState = Immutable({
});

export default function (state=initialState, {type, ...action}) {


    switch(type) {

        case actionTypes.LOGOUT:
            return state.merge(initialState);

        default:
            return state;
    }
}
