function InputField({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  maxLength,
  className = "",
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      maxLength={maxLength}
      className={`w-full p-2 mb-4 border rounded ${className}`}
    />
  );
}

export default InputField;

