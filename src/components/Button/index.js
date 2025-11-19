import styles from "./button.module.css";

export default function Button({ 
  children, 
  variant = "primary", 
  size = "medium", 
  type = "button",
  onClick,
  disabled = false,
  className = "",
  ...props 
}) {
  const buttonClass = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`;

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}