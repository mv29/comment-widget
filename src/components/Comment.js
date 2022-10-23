import Input  from "./Input";
import Button from "./Button";

const Comment = () => {
  return (
    <div className="row justify-c align-start">
      <Input className="m-r-5" placeHolder="Enter a Comment" />
      <Button text="Add Comment" />
    </div>
  );
};

export default Comment;
