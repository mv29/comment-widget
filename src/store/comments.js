import { batch } from 'react-redux';

import commentsApi from '../apis/commentsApi';
import { BASE_NAME } from '../utils/constants';
import { toggleModal } from './modal';

// Actions
export const ADD_COMMENT = `${BASE_NAME}/ADD_COMMENT`;
export const EDIT_COMMENT = `${BASE_NAME}/EDIT_COMMENT`;
export const DELETE_COMMENT = `${BASE_NAME}/DELETE_COMMENT`;
export const ADD_SUB_COMMENT = `${BASE_NAME}/ADD_SUB_COMMENT`;

export const addcomment = ({ text, parentId }) => {
  return async (dispatch) => {
    const payload = {
      text: text,
      parentId: parentId,
      subComments: [],
      createdAt: new Date(),
      userId: null,
      updatedAt: null,
    };

    try {
      const response = await commentsApi.addComment(payload);
      dispatch({
        type: ADD_COMMENT,
        payload: { id: response.id, ...payload },
      });
    } catch (err) {
      alert(err);
    }
  };
};

export const editComment = ({ id, value }) => {
  return async (dispatch) => {
    const payload = { text: value };

    try {
      await commentsApi.editComment(id, payload);
      dispatch({
        type: EDIT_COMMENT,
        payload: { id, value },
      });
    } catch (err) {
      alert(err);
    }
  };
};

export const addSubComment = ({ text, parentId }) => {
  return async (dispatch, getState) => {
    const payload = {
      text: text,
      parentId: parentId,
      subComments: [],
      createdAt: new Date(),
      userId: null,
      updatedAt: null,
    };

    const comments = getState().comments;
    const parentComment = comments[parentId];
    try {
      const response = await commentsApi.addComment(payload);

      const editPayload = {
        subComments: [...parentComment.subComments, response.id],
      };
      await commentsApi.editComment(parentId, editPayload);

      dispatch({
        type: ADD_SUB_COMMENT,
        payload: { text, parentId, id: response.id },
      });
    } catch (err) {
      alert(err);
    }
  };
};

// deletes the comment and all its sub comments and returns deleted comments id's
const deleteCommentAndSubComments = (comments, commentId, deletedComments) => {
  if (!comments || !commentId) return;

  const comment = comments[commentId];
  const subComments = comment.subComments;

  deletedComments.push(commentId);
  // delete subComments recursively
  subComments.forEach((subCommentId) => {
    deleteCommentAndSubComments(comments, subCommentId, deletedComments);
  });

  // delete comment after all subComments of it are deleted
  delete comments[commentId];
};

export const deleteComment = (id) => {
  return async (dispatch, getState) => {
    const comments = getState().comments;
    const deleteCommentsId = [];
    let newCommentsState = { ...comments };

    // delete the comment with `id` from its parent subComments
    const comment = comments[id];
    const parentComment = comments[comment.parentId];
    const parentNewSubComments = parentComment.subComments.filter(commentId => commentId !== id);

    if (parentComment) {
      newCommentsState = {
        ...newCommentsState,
        [parentComment.id]: {
          ...parentComment,
          subComments: parentNewSubComments,
        }
      }
    }

    deleteCommentAndSubComments(newCommentsState, id, deleteCommentsId);

    // deleting all the comments one by one
    // firebase dose not provide buld delete for document
    deleteCommentsId.forEach(async (commentId) => {
      try {
        await commentsApi.deleteComment(commentId);
      } catch (err) {
        alert(err);
      }
    });

    // updating the parent on firebase
    const editPayload = {
      subComments: parentNewSubComments,
    };

    await commentsApi.editComment(parentComment.id, editPayload);

    batch(() => {
      dispatch(toggleModal('loader', false));
      dispatch({
        type: DELETE_COMMENT,
        payload: newCommentsState,
      });
    });
  };
};

/*
Comment Schemma
{
    id -> uuid
    text -> string
    userId -> int
    parentId -> int
    subComments -> array of ids
    "createdAt" datetime
    "updateAt" datetime
}

*** Parent is the entity on which the user commented. It could be anything for ex - Post, Reel, Comment,  
*** A comment can have only single or no comment as parent ***
*** A comment only belongs to single user ***
*/

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
      return {
        ...state,
        [payload.id]: { ...payload },
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
      const { text, parentId, id } = payload;
      const parentComment = state[parentId];

      return {
        ...state,
        [parentId]: {
          ...parentComment,
          subComments: [...parentComment.subComments, id],
        },
        [id]: {
          id: id,
          text: text,
          parentId: parentId,
          subComments: [],
          createdAt: new Date(),
          userId: null,
          updatedAt: null,
        },
      };
    }
    case DELETE_COMMENT: {
      return {...payload};
    }
    default:
      return state;
  }
};

export default commentsReducer;
