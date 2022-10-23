const Button = ({ name, type, text, ...props }) => {
  return (
    <button className="btn cursor" name={name} type={type} {...props}>
      {text}
    </button>
  );
};

export default Button;
