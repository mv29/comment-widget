import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { getCommentsList } from '../selectors/comments';
import { getFormatedComments } from '../utils/miscs';
import { Button } from '../components/index';

const Reply = ({ comment }) => {
  return (
    <div className='row align-c m-b-10' style={{ marginLeft: `${comment.level * 2}px` }}>
      <span className='m-r-10'>{comment.text}</span>
      <Button
        text='delete'
        className='btn--small btn--danger m-r-5'
        key='delete'
      />
      <Button text='reply' className='btn--small btn--secondary' key='reply' />
    </div>
  );
};

const CommentsList = ({ parentEntity }) => {
  const comments = useSelector(getCommentsList);

  const formattedCommentList = useMemo(
    () => getFormatedComments(comments, parentEntity),
    [comments, parentEntity]
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
