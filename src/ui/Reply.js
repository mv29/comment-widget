import { useState, useMemo } from 'react';
import { useDispatch, batch } from 'react-redux';

import { addSubComment, deleteComment, editComment } from '../store/comments';
import { toggleModal } from '../store/modal';
import { Comment, Button } from '../components/index';

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
    return '';
    // const commentDateTime = comment.createdAt;
    // const currentDateTime = new Date();
    // const hoursDifference = currentDateTime.getHours() - commentDateTime.getHours();
    // const minutesDifference = currentDateTime.getMinutes() - commentDateTime.getMinutes();
    // if (hoursDifference > 24) {
    //   return commentDateTime.toDateString();
    // } else {
    //   if (hoursDifference === 0) {
    //     return `${minutesDifference || 1} min ago`;
    //   }
    //   return `${hoursDifference} hr`;
    // }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ comment.createdAt]);

  return (
    <div
      className='column m-b-15'
      style={{ marginLeft: `${comment.level * 1}rem` }}
    >
      <div className='row align-c relative'>
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
