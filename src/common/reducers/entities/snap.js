import * as RegisterNameActionTypes from '../../actions/register-name';

export default function snap(state={}, action) {
  const { payload } = action;

  const registerNameInitialStatus = {
    isFetching: false,
    success: false,
    error: null
  };

  switch(action.type) {
    case RegisterNameActionTypes.REGISTER_NAME:
      return {
        ...state,
        registerNameStatus: {
          ...registerNameInitialStatus,
          isFetching: true
        }
      };
    case RegisterNameActionTypes.REGISTER_NAME_SUCCESS:
      return {
        ...state,
        store_name: action.payload.snapName,
        registerNameStatus: {
          ...state.registerNameStatus,
          isFetching: false,
          success: true,
          error: null
        }
      };
    case RegisterNameActionTypes.REGISTER_NAME_ERROR:
      return {
        ...state,
        registerNameStatus: {
          ...state.registerNameStatus,
          isFetching: false,
          success: false,
          error: payload.error
        }
      };
    case RegisterNameActionTypes.REGISTER_NAME_CLEAR:
      return {
        ...state,
        registerNameStatus: {
          ...registerNameInitialStatus
        }
      };
    default:
      return state;
  }
}
