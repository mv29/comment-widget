import { generateUUID } from '../utils/miscs';
import { BASE_NAME } from '../utils/constants';

// Actions
export const ADD_USER = `${BASE_NAME}/ADD_user`;

/*
user Schemma
{
    id -> uuid
    name -> string
}

*** User can have more then one user ***
*/


/*
  Slice Schemma
  {
    userUUId: user,
  } 
  Object of users
*/
const initialState = [];

// Reducer
const usersReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_USER: {
      const uuid = generateUUID();

      return {
        ...state,
        [uuid]: {
          id: uuid,
          name: payload,
        },
      };
    }
    default:
      return state;
  }
};

export default usersReducer;
