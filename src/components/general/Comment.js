import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { ADD_COMMENT } from '../../store/comments';
import Input from './Input';
import Button from './Button';

const Comment = ({ parentEntity }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch({ type: ADD_COMMENT, payload: {text: comment, parentEntity }})
    setComment('');
  };

  return (
    <div className='row justify-c align-start'>
      <form onSubmit={handleSubmit}>
        <Input
          comment={comment}
          setComment={setComment}
          className='m-r-5'
          placeholder='Enter a Comment'
        />
        <Button text='Add Comment' className="btn--primary" />
      </form>
    </div>
  );
};

export default Comment;
