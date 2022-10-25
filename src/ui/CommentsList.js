import { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getCommentsList } from '../selectors/comments';
import { fetchComments } from '../store/comments';
import { getFormatedComments } from '../utils/miscs';
import Reply from './Reply';

const CommentsList = ({ parentId }) => {
  const dispatch = useDispatch();
  const comments = useSelector(getCommentsList);
  const isLoading = useSelector(state => state.comments.isLoading)

  const formattedCommentList = useMemo(
    () => getFormatedComments(comments, parentId),
    [comments, parentId]
  );

  useEffect(() => {
    dispatch(fetchComments());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div>
        Loading Comments
      </div>
    )
  }

  if (!formattedCommentList) return null;

  return (
    <div className='comment__list column justify-start m-t-10 p-l-10 p-r-10 p-t-10'>
      {formattedCommentList.map((comment) => (
        <Reply comment={comment} key={comment.id} />
      ))}
    </div>
  );
};

export default CommentsList;
