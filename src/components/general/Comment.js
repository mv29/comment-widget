import { useState } from 'react';
import classNames from 'classnames';

import Input from './Input';
import Button from './Button';

const Comment = ({ 
  handleSubmit,
  placeholder = 'Enter a Comment',
  btnName = 'Add Comment',
  btnClassName = 'btn--primary',
  InputClassName = 'input--large input--main'
}) => {
  const [comment, setComment] = useState('');

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    handleSubmit(comment);
    setComment('');
  };

  return (
    <div className='row justify-c align-start'>
      <form onSubmit={handleCommentSubmit}>
        <Input
          comment={comment}
          setComment={setComment}
          className={classNames('m-r-5', InputClassName)}
          placeholder={placeholder}
        />
        <Button text={btnName} className={btnClassName} />
      </form>
    </div>
  );
};

export default Comment;
