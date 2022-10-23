import classNames from 'classnames';

const Input = ({ className, ...props }) => {
  return (
    <input className={classNames('input input--large', className)} {...props} />
  );
};

export default Input;
