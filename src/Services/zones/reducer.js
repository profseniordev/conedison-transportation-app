import * as actionTypes from './actionTypes';
import Immutable from 'seamless-immutable';

const initialState = Immutable({
    zones: [],
    stats: {},
    get_zones_processing: false
});

export default function RoutesReducer(state = initialState, {type, ...action}) {
    switch(type) {

        case actionTypes.GET_ZONES_REQUEST:
            return state.merge({
                get_zones_processing   : true
            });
        case actionTypes.GET_ZONES_SUCCESS:
            return state.merge({
                get_zones_processing  : false,
                zones                 : action.zones,
                stats                 : action.stats
            });
        case actionTypes.GET_ZONES_FAIL:
            return state.merge({
                get_zones_processing   : false
            });
        case actionTypes.GET_ZONES_ERROR:
            return state.merge({
                get_zones_processing   : false
            });
        case actionTypes.LOGOUT:
            return state.merge(initialState);
        default:
            return state;
    }
}
