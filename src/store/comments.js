import { generateUUID } from '../utils/miscs';
import { BASE_NAME } from '../utils/constants';

// Actions
export const ADD_COMMENT = `${BASE_NAME}/ADD_COMMENT`;
export const EDIT_COMMENT = `${BASE_NAME}/EDIT_COMMENT`;
export const DELETE_COMMENT = `${BASE_NAME}/DELETE_COMMENT`;
export const ADD_SUB_COMMENT = `${BASE_NAME}/ADD_SUB_COMMENT`;
export const REPLY_TO_COMMENT = `${BASE_NAME}/REPLY_TO_COMMENT`;

/*
Comment Schemma
{
    id -> uuid
    text -> string
    userId -> int
    parentId -> int
    subComments -> array of ids
    "createAt" datetime
    "updateAt" datetime
}

*** Parent is the entity on which the user commented. It could be anything for ex - Post, Reel, Comment,  
*** A comment can have only single or no comment as parent ***
*** A comment only belongs to single user ***
*/

/*
 NOT PURE FUNCTION
*/
const deleteCommentAndSubComments = (comments, commentId) => {
  if (!comments || !commentId) return;

  const comment = comments[commentId];
  const subComments = comment.subComments;

  // delete subComments recursively
  subComments.forEach((subCommentId) => {
    deleteCommentAndSubComments(comments, subCommentId);
  });

  // delete comment after all subComments of it are deleted
  delete comments[commentId];
};

/*
  Slice Schemma
  {
    commentUUId: comment,
  } 
  Object of comments
*/
const initialState = [];

// Reducer
const commentsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_COMMENT: {
      const uuid = generateUUID();
      const {text, parentEntity} = payload;

      return {
        ...state,
        [uuid]: {
          id: uuid,
          text: text,
          parentId: parentEntity,
          subComments: [],
          createAt: new Date(),
          userId: null,
          updatedAt: null,
        },
      };
    }
    case EDIT_COMMENT: {
      const { id: commentId, value } = payload;
      const comment = state[commentId];

      return {
        ...state,
        [commentId]: {
          ...comment,
          text: value,
        },
      };
    }
    case ADD_SUB_COMMENT: {
      const { id: commentId, value } = payload;
      const comment = state[commentId];

      return {
        ...state,
        [commentId]: {
          ...comment,
          subComments: [...comment.subComments, value],
        },
      };
    }
    case DELETE_COMMENT: {
      const newCommentSlice = { ...state };
      deleteCommentAndSubComments(newCommentSlice, payload);

      return newCommentSlice;
    }
    default:
      return state;
  }
};

export default commentsReducer;
