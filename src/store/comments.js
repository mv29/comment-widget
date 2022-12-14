import { batch } from 'react-redux';

import commentsApi from '../apis/commentsApi';
import { BASE_NAME } from '../utils/constants';
import { deleteCommentAndSubComments } from '../utils/miscs';
import { toggleModal } from './modal';

// Actions


const FETCH_COMMENTS_INIT = `${BASE_NAME}/FETCH_COMMENTS_INIT`;
const FETCH_COMMENTS_DONE = `${BASE_NAME}/FETCH_COMMENTS_DONE`;
const FETCH_COMMENTS_ERROR = `${BASE_NAME}/FETCH_COMMENTS_ERROR`;

export const ADD_COMMENT = `${BASE_NAME}/ADD_COMMENT`;
export const EDIT_COMMENT = `${BASE_NAME}/EDIT_COMMENT`;
export const DELETE_COMMENT = `${BASE_NAME}/DELETE_COMMENT`;
export const ADD_SUB_COMMENT = `${BASE_NAME}/ADD_SUB_COMMENT`;

// Action for adding a comment
export const addcomment = ({ text, parentId }) => {
  return async (dispatch) => {
    const payload = {
      text: text,
      parentId: parentId,
      subComments: [],
      userId: null,
    };

    try {
      const response = await commentsApi.addComment(payload);
      dispatch({
        type: ADD_COMMENT,
        payload: { id: response.id, ...payload },
      });
    } catch (err) {
      console.error(err);
    }
  };
};

// Action for editing a comment
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
      console.error(err);
    }
  };
};

// Action for adding a subComment
export const addSubComment = ({ text, parentId }) => {
  return async (dispatch, getState) => {
    const payload = {
      text: text,
      parentId: parentId,
      subComments: [],
      userId: null,
    };

    const comments = getState().comments.data;
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
      console.error(err);
    }
  };
};

// Action for deleting a commebt and its SubComemnts
export const deleteComment = (id) => {
  return async (dispatch, getState) => {
    const comments = getState().comments.data;
    const deleteCommentsId = [];
    let newCommentsState = { ...comments };

    // delete the comment with `id` from its parent subComments
    const comment = comments[id];
    const parentComment = comments[comment.parentId];
    const parentNewSubComments = parentComment?.subComments.filter(commentId => commentId !== id);

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
        console.error(err);
      }
    });

    // updating the parent on firebase
    if (parentComment) {
      const editPayload = {
        subComments: parentNewSubComments,
      };
  
      await commentsApi.editComment(parentComment.id, editPayload);
    }

    batch(() => {
      dispatch(toggleModal('loader', false));
      dispatch({
        type: DELETE_COMMENT,
        payload: newCommentsState,
      });
    });
  };
};

// Action for fetching all comments from databsae
export const fetchComments = () => {
  return async (dispatch, getState) => {
    const { isLoading } = getState().comments;

    // don't allow api call when one already in progress
    if (isLoading) return;

    batch(() => {
      dispatch({ type: FETCH_COMMENTS_INIT });
    });
    try {
      const response = await commentsApi.fetchComments();
      const comments = {};
      response?.forEach((doc) => {
        comments[doc.id] = {...doc.data(), id: doc.id};
      });

      dispatch({
        type: FETCH_COMMENTS_DONE,
        payload: comments || {},
      });
    } catch (error) {
      console.error(error);
      dispatch({ type: FETCH_COMMENTS_ERROR, payload: error });
    } finally {
    }
  }
}

/*
Comment Schemma
{
    id -> uuid
    text -> string
    userId -> int
    parentId -> int
    subComments -> array of ids
    "createdAt" datetime
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
const initialState = {
  isLoading: false,
  data: {},
  error: null,
};

// Reducer
const commentsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_COMMENTS_INIT: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case FETCH_COMMENTS_DONE: {
      return {
        ...state,
        isLoading: false,
        data: payload,
      };
    }
    case FETCH_COMMENTS_ERROR: {
      return {
        ...state,
        isLoading: false,
        error: payload,
      };
    }
    case ADD_COMMENT: {
      return {
        ...state,
        data: {
          ...state.data,
          [payload.id]: { ...payload }, 
        }
      };
    }
    case EDIT_COMMENT: {
      const { id: commentId, value } = payload;
      const comment = state.data[commentId];

      return {
        ...state,
        data: {
          ...state.data,
          [commentId]: {
            ...comment,
            text: value,
          },
        }
      };
    }
    case ADD_SUB_COMMENT: {
      const { text, parentId, id } = payload;
      const parentComment = state.data[parentId];

      return {
        ...state,
        data: {
          ...state.data,
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
          },
        }
      };
    }
    case DELETE_COMMENT: {
      return {
        ...state,
        data: {...payload},
      };
    }
    default:
      return state;
  }
};

export default commentsReducer;
