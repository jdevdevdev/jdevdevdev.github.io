import React, { useState, useEffect, ChangeEventHandler } from "react";
import styles from "./LargeTextInputComponent.module.css";

export function LargeTextInputComponent({
  initialText = "",
  value,
  onChange
}: {
  initialText?: string,
  value?: string,
  onChange?: (params: string) => void
}) {
  const [text, setText] = useState(initialText);

  useEffect(() => {
    if (value !== undefined) {
      setText(value);
    }
  }, [value]);

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    const newText = event.target.value;
    setText(newText);
    if (onChange) {
      onChange(newText);
    }
  };

  return (
    <textarea
      className={styles.LargeTextInputComponent}
      value={value !== undefined ? value : text}
      onChange={handleChange}
      rows={10}
      cols={50}
      placeholder="Enter your text here..."
    />
  );
}
