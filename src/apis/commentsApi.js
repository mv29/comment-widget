import Database from '../database/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';

const COMMENT_COLLECTION = 'comments';

const addComment = async ( payload) => {
  return await addDoc(collection(Database, COMMENT_COLLECTION), { ...payload });
};

const editComment = async (commentId, payload) => {
  const commentRef = doc(Database, COMMENT_COLLECTION, commentId);
  return await setDoc(commentRef, { ...payload }, { merge: true });
};

const deleteComment = async (id) => {
  await deleteDoc(doc(Database, COMMENT_COLLECTION, id)); 
}
const commentsApi = { addComment, editComment, deleteComment };

export default commentsApi;
