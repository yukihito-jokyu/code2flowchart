import { useEffect, useState } from 'react';

import styles from './WelcomeAnimation.module.css';

interface WelcomeAnimationProps {
  isVisible: boolean;
  onAnimationComplete: () => void;
}

export const WelcomeAnimation: React.FC<WelcomeAnimationProps> = ({
  isVisible,
  onAnimationComplete,
}) => {
  const [animationPhase, setAnimationPhase] = useState<'fadeIn' | 'show' | 'fadeOut' | 'hidden'>(
    'hidden'
  );

  useEffect(() => {
    if (!isVisible) {
      setAnimationPhase('hidden');
      return;
    }

    setAnimationPhase('fadeIn');

    const timer1 = setTimeout(() => {
      setAnimationPhase('show');
    }, 500);

    const timer2 = setTimeout(() => {
      setAnimationPhase('fadeOut');
    }, 3000);

    const timer3 = setTimeout(() => {
      setAnimationPhase('hidden');
      onAnimationComplete();
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isVisible, onAnimationComplete]);

  if (animationPhase === 'hidden') {
    return null;
  }

  return (
    <div className={`${styles.overlay} ${styles[animationPhase]}`}>
      <div className={styles.welcomeMessage}>
        <h1 className={styles.title}>c2fへようこそ</h1>
        <div className={styles.sparkles}>
          <span className={styles.sparkle}>✨</span>
          <span className={styles.sparkle}>✨</span>
          <span className={styles.sparkle}>✨</span>
        </div>
      </div>
    </div>
  );
};
