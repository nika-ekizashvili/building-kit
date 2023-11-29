import React from "react";
import styles from "./LoadingPage.module.css";

const LoadingPage = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loading}></div>
    </div>
  );
};

export default LoadingPage;
