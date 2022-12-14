import { useState, useMemo } from 'react';
import { useDispatch, batch } from 'react-redux';

import { addSubComment, deleteComment, editComment } from '../../store/comments';
import { toggleModal } from '../../store/modal';
import { Button } from '../../components';
import Comment from './Comment';

const Reply = ({ comment }) => {
  const dispatch = useDispatch();
  const [showComment, setShowComment] = useState(0);

  const handleClick = (value) => {
    setShowComment((prev) => (prev === value ? 0 : value));
  };

  const handleReply = (reply) => {
    dispatch(addSubComment({ text: reply, parentId: comment.id }));
  };

  const handleDelete = () => {
    const result = window.confirm(
      'Deleting a Comment will also delete all its sub Comments. Do you want to delete?'
    );

    if (result) {
      batch(() => {
        dispatch(toggleModal('loader', true));
        dispatch(deleteComment(comment.id));
      });
    }
  };

  const handleEdit = (reply) => {
    dispatch(editComment({ value: reply, id: comment.id }))
  };

  const commentTimeStamp = useMemo(() => {
    if (!comment.createdAt) return '';

    const currentDateTime = new Date();
    const createdAtSec = comment.createdAt.seconds;
    const commentDateTime = new Date(createdAtSec * 1000);
    
    const secondsDiif = Math.floor((currentDateTime - (commentDateTime))/1000);
    const minutesDiff = Math.floor(secondsDiif/60);
    const hoursDiff = Math.floor(minutesDiff/60);

    if (hoursDiff > 24) return commentDateTime.toDateString();

    if (hoursDiff === 0 || isNaN(hoursDiff)) return `${minutesDiff || 1} min ago`;

    return `${hoursDiff} hr ago`;

  }, [ comment]);

  return (
    <div
      className='column m-b-15'
      style={{ marginLeft: `${comment.level * 1}rem` }}
    >
      <div className='row align-c relative reply__container'>
        <div className='m-r-10 reply'>
          <div className='row reply__timestamp absolute'>{commentTimeStamp}</div>
          <div className='m-r-10 reply'>{comment.text}</div>
        </div>
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
        <div className='row m-t-10'>
          <Comment
            InputClassName='input--small'
            btnClassName='btn--normal btn--small'
            placeholder={
              showComment === 1 ? 'reply to comment' : 'edit comment'
            }
            btnName={showComment === 1 ? 'reply' : 'edit'}
            handleSubmit={showComment === 1 ? handleReply : handleEdit}
          />
        </div>
      )}
    </div>
  );
};

export default Reply;
