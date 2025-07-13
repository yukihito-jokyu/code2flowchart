import React from 'react';

import styles from './Card.module.css';

export interface CardProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  buttonText,
  onButtonClick,
  variant = 'default',
  disabled = false,
}) => {
  const buttonClassName = `${styles.button} ${styles[`button--${variant}`]}`;

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      <div className={styles.actions}>
        <button
          className={buttonClassName}
          onClick={onButtonClick}
          disabled={disabled}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};