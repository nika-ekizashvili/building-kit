import Link from "next/link";

import styles from "../styles/main.module.css";

const NotFound = () => {
    return (
        <div className={styles.not_found}>
            <h1>404 - Page Not Found</h1>
            <p>Sorry, the page you're looking for does not exist.</p>
            <Link className={styles.button} href={'/'}>Go to Main page</Link>
        </div>
    );
};

export default NotFound;