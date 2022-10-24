import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { ADD_SUB_COMMENT, DELETE_COMMENT, EDIT_COMMENT } from '../store/comments';
import { Comment, Button } from '../components/index';

const Reply = ({ comment }) => {
  const dispatch = useDispatch();
  const [showComment, setShowComment] = useState(0);

  const handleClick = (value) => {
    setShowComment((prev) => prev === value ? 0 : value);
  }

  const handleReply = (reply) => {
    dispatch({
      type: ADD_SUB_COMMENT,
      payload: { text: reply, parentId: comment.id },
    });
  };

  const handleDelete = () => {
    const result = window.confirm(
      'Deleting a Comment will also delete all sub Comments. Do you want to delete?'
    );

    if (result) {
      dispatch({
        type: DELETE_COMMENT,
        payload: comment.id,
      });
    }
  };

  const handleEdit = (reply) => {
    dispatch({
        type: EDIT_COMMENT,
        payload: { value: reply, id: comment.id },
      });
  }

  return (
    <div
      className='column m-b-10'
      style={{ marginLeft: `${comment.level * 1}rem` }}
    >
      <div className='row align-c'>
        <span className='m-r-10 reply'>{comment.text}</span>
        <Button
          text='delete'
          onClick={handleDelete}
          className='btn--small btn--danger m-r-5'
        />
        <Button
          text='reply'
          onClick={() => handleClick(1)}
          className='btn--small btn--secondary m-r-5'
        />
        <Button
          text='edit'
          onClick={() => handleClick(2)}
          className='btn--small btn--edit'
        />
      </div>
      {showComment !== 0 && (
        <div className='row m-t-5'>
          <Comment
            InputClassName='input--small'
            btnClassName='btn--normal btn--small'
            placeholder={showComment === 1 ? 'reply to comment' : 'edit comment'}
            btnName={showComment === 1 ? 'reply' : 'edit'}
            handleSubmit={showComment === 1 ? handleReply : handleEdit}
          />
        </div>
      )}
    </div>
  );
};

export default Reply;
