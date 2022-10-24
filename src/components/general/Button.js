import classNames from 'classnames';

const Button = ({ type, text, className, ...props }) => {
  return (
    <button
      className={classNames('btn cursor', className)}
      type={type}
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;
