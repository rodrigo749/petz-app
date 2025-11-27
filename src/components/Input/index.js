import { FaPaw } from "react-icons/fa";
import styles from "./input.module.css";

export default function Input({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  error,
  icon = <FaPaw />,
  size = "full",
  className = "",
  ...props
}) {
  return (
    <div className={`${styles.inputWrapper} ${styles[size]} ${className}`}>
      <span className={styles.icon} aria-hidden>
        {icon}
      </span>
      <label className={styles.fieldLabel}>
        {label}:
        <input
          className={styles.input}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-label={label}
          {...props}
        />
      </label>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}