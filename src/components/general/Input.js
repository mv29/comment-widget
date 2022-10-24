import classNames from 'classnames';

const Input = ({ comment, setComment, className, ...props }) => {

  const handleChange = (event) => {
    event.preventDefault();
    setComment(event.target.value);
  };

  return (
    <input
      required
      value={comment}
      onChange={handleChange}
      className={classNames('input', className)}
      {...props}
    />
  );
};

export default Input;
