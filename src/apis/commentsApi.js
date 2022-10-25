import Database from '../database/firebase';
import { 
  getDocs,
  collection,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  Timestamp,
  query,
  orderBy,
} from 'firebase/firestore';

const COMMENT_COLLECTION = 'comments';

const fetchComments = async () => {
  const q = query(collection(Database, COMMENT_COLLECTION), orderBy('createdAt', 'desc'));
  return await getDocs(q);
}

const addComment = async (payload) => {
  return await addDoc(collection(Database, COMMENT_COLLECTION), { ...payload, createdAt: Timestamp.now() });
};

const editComment = async (commentId, payload) => {
  const commentRef = doc(Database, COMMENT_COLLECTION, commentId);
  return await setDoc(commentRef, { ...payload }, { merge: true });
};

const deleteComment = async (id) => {
  await deleteDoc(doc(Database, COMMENT_COLLECTION, id)); 
}
const commentsApi = { addComment, editComment, deleteComment, fetchComments };

export default commentsApi;
