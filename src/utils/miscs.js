/**
 * A standard UUID generator function.
 * Picked from https://stackoverflow.com/a/8809472
 */
export const generateUUID = () => {
  let d = Date.now();
  // Time in microseconds since page-load or 0 if unsupported
  let d2 = (performance && performance.now && performance.now() * 1000) || 0;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = Math.random() * 16;
    if (d > 0) {
      // eslint-disable-next-line no-bitwise
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      // eslint-disable-next-line no-bitwise
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    // eslint-disable-next-line
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}


export const getFormatedCommentsList = (comments, comment, level) => {
  if (!comments || !comment) return;

  let formattedComment = [];
  const subComments = comment.subComments;

  // push current comment in the list initially
  formattedComment.push({ ...comment, level: level });

  // recursivelly add subComments in the order present
  subComments.forEach((subCommentId) => {
    formattedComment = [...formattedComment, ...getFormatedCommentsList(comments, subCommentId, level + 1)];
  });
  
  // return the formattedList after each recursive iteration
  return formattedComment;
};


export const getFormatedComments = (commentsObject, parentId) => {
  let commentsList = [];
  const comments = Object.values(commentsObject);

  // filter the comments belonging to parent
  const parentComments = comments.filter((comment) => comment.parentId === parentId);

  // Generate all the sub comments for parent comment
  parentComments.forEach((comment) => {
    commentsList = [...commentsList, ...getFormatedCommentsList(commentsObject, comment, 0)];
  });

  return commentsList;
}