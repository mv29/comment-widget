import { useRef } from 'react';
import { useDispatch } from 'react-redux';

import { generateUUID } from '../utils/miscs';
import { addcomment } from '../store/comments';
import { Comment } from '../components';
import CommentsList from './CommentsList';

const CommentContainer = () => {
  const dispatch = useDispatch();
  const parentId = useRef(generateUUID());

  const handleComment = (comment) => {
    dispatch(addcomment({text: comment, parentId: parentId.current }));
  };

  return (
    <div className='column comment-container'>
      <Comment handleSubmit={handleComment} />
      <CommentsList parentId={parentId.current} />
    </div>
  );
};

export default CommentContainer;
