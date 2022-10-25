import { BASE_NAME } from '../utils/constants';;

// Action Types
const TOGGLE_MODAL = `${BASE_NAME}/TOGGLE_MODAL`;

// Actions
export function toggleModal(id, value) {
  return {
    type: TOGGLE_MODAL,
    payload: { id, value },
  };
}

// Reducer
const reducer =  (state = {}, { type, payload }) => {
  switch (type) {
    case TOGGLE_MODAL:
      return {
        ...state,
        [payload.id]: payload.value,
      };
    default:
      return state;
  }
}

export default reducer;