import Link from "next/link";

import styles from "../styles/main.module.css";

const Unauthorized = () => {
    return (
        <div className={styles.not_found}>
            <p className="blue geo-title fs-1-5hx">გთხოვთ გაიაროთ ავტორიზაცია ან რეგისტრაცია.
            </p>
            <Link className={`${styles.button} ${'geo-title'}`} href={'/'}>მთავარ გვერდზე დაბრუნება</Link>
        </div>
    );
};

export default Unauthorized;