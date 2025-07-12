import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './App.module.css';

function App() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // API呼び出し
    axios
      .get('http://localhost:8000/api/hello')
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error('API呼び出しエラー:', error);
      });
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>FastAPIからのメッセージ:</h1>
      <p className={styles.message}>{message}</p>
      
      <div className={styles.linkSection}>
        <h2 className={styles.sectionTitle}>リンク:</h2>
        <Link to="/signup" className={styles.link}>
          新規登録
        </Link>
      </div>
    </div>
  );
}

export default App;
