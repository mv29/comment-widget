import { createSelector } from 'reselect';

const baseSelector = state => state.comments;

export const getCommentsList = createSelector(baseSelector, (state) => state.data);
