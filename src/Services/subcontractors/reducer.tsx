import * as actionTypes from './actionTypes';
import Immutable from 'seamless-immutable';

const initialState = Immutable({
    subcontractors: [],
    processing: false,
});

export default function (state=initialState, {type, ...action}) {


    switch(type) {

        // CREATE
    case actionTypes.CREATE_SUBCONTRACTOR_REQUEST:
        return state.merge({
          processing: true,
        });
      case actionTypes.CREATE_SUBCONTRACTOR_SUCCESS:
        return state.merge({
          processing: false,
          //subcontractors: [...state.subcontractors, action.subcontactor],
        });
      case actionTypes.CREATE_SUBCONTRACTOR_FAIL:
        return state.merge({
         _processing: false,
        });
      case actionTypes.CREATE_SUBCONTRACTOR_ERROR:
        return state.merge({
          processing: false,
        });

        case actionTypes.GET_SUBCONTRACTORS_SUCCESS:
            return state.merge({
                subcontractors: action.subcontractors
            });

        case actionTypes.LOGOUT:
            return state.merge(initialState);

        default:
            return state;
    }
}
