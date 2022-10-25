import { useDispatch } from 'react-redux';

import { addcomment } from '../store/comments';
import { Comment } from '../components';
import CommentsList from './CommentsList';

/*
  Hard Coding this for main comment in UI
*/
const PARENT_ID = 'mv29';

const CommentContainer = () => {
  const dispatch = useDispatch();

  const handleComment = (comment) => {
    dispatch(addcomment({text: comment, parentId: PARENT_ID }));
  };

  return (
    <div className='column comment__container'>
      <Comment handleSubmit={handleComment} />
      <CommentsList parentId={PARENT_ID} />
    </div>
  );
};

export default CommentContainer;
