import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { getCommentsList } from '../selectors/comments';
import { getFormatedComments } from '../utils/miscs';
import Reply from './Reply';

const CommentsList = ({ parentId }) => {
  const comments = useSelector(getCommentsList);

  const formattedCommentList = useMemo(
    () => getFormatedComments(comments, parentId),
    [comments, parentId]
  );

  if (!formattedCommentList) return null;

  console.log('mv formattedCommentList', formattedCommentList);
  return (
    <div className='column justify-start m-t-10 p-l-5 p-r-5'>
      {formattedCommentList.map((comment) => (
        <Reply comment={comment} key={comment.id} />
      ))}
    </div>
  );
};

export default CommentsList;
