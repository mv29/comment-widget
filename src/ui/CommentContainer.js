import { useRef } from 'react';

import { generateUUID } from '../utils/miscs';
import { Comment } from '../components';
import CommentsList from './CommentsList';

const CommentContainer = () => {
  const parentEntity = useRef(generateUUID());

  console.log('mv parentEntity', parentEntity.current);
  return (
    <div className='column comment-container'>
      <Comment parentEntity={parentEntity.current} />
      <CommentsList parentEntity={parentEntity.current} />
    </div>
  );
};

export default CommentContainer;
