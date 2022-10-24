import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { ADD_SUB_COMMENT } from '../store/comments';
import { Comment, Button } from '../components/index';

const Reply = ({ comment }) => {
    const dispatch = useDispatch();
  const [showReply, setShowReply] = useState(false);

  const handleReplyClick = () => setShowReply((prev) => !prev);

  const handleReply = (reply) => {
    dispatch({ type: ADD_SUB_COMMENT, payload: {text: reply, parentId: comment.id }})
  };

  return (
    <div
      className='column m-b-10'
      style={{ marginLeft: `${comment.level * 1}rem` }}
    >
      <div className='row align-c'>
        <span className='m-r-10 reply'>{comment.text}</span>
        <Button
          text='delete'
          className='btn--small btn--danger m-r-5'
          key='delete'
        />
        <Button
          text='reply'
          className='btn--small btn--secondary'
          key='reply'
          onClick={handleReplyClick}
        />
      </div>
      {showReply && (
        <div className='row m-t-5'>
          <Comment
            parentId={comment.id}
            InputClassName='input--small'
            btnName='reply'
            btnClassName='btn--normal btn--small'
            handleSubmit={handleReply}
          />
        </div>
      )}
    </div>
  );
};

export default Reply;