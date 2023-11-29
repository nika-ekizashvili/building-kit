import styles from './Home.module.css';
import {useEffect, useState} from "react";

const HowItWorks = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div style={{ marginTop: "30px" }} className="mb-n10 mb-lg-n20 z-index-2">
      <div className="container">
        <div className="d-flex w-100 relative mt-169 align-items-center col-responsive">
          <div className="w-100 gy-10 mb-md-20">
            <div>
              <div className={`mb-17 animateBY tD4 ${animate ? 'animate' : ''}`}>
                <h3
                  className="geo-title fs-2hx text-dark mb-5 georgian fw-bold"
                  id="how-it-works"
                  data-kt-scroll-offset="{default: 100, lg: 150}"
                >
                  როგორ მუშაობს?
                </h3>
                <div className="fs-6 fs-lg-4 text-muted pb-6">
                  თუ თქვენ თავად აპირებთ თავად
                  გაუძღვეთ სარემონტო სამუშაოებს, მაშინ,
                  <br />
                  ჩვენი პროგრამა თქვენთვის ნამდვილი აღმოჩენაა.
                </div>
              </div>
              <div className={` ${styles.how_it_works_item}`}>
                <div className={`${styles.how_it_works_ttl}`}>
                  <span className="badge badge-circle badge-light-success p-5 me-3 fs-3">
                    1
                  </span>
                  <div className="fw-bold fs-5 fs-lg-3 text-dark geo-title">
                    დარეგისტრირდი
                  </div>
                </div>
                <div className={`${styles.how_it_works_subitem}`}>
                  თუ თქვენ თავად აპირებთ თავად
                  გაუძღვეთ სარემონტო სამუშაოებს, მაშინ,
                  <br />
                  ჩვენი პროგრამა თქვენთვის ნამდვილი აღმოჩენაა.
                </div>
              </div>
            </div>
            <div data-aos="fade-up">
              <div className={` ${styles.how_it_works_item}`}>
                <div className={`${styles.how_it_works_ttl}`}>
                  <span className="badge badge-circle badge-light-success p-5 me-3 fs-3">
                    2
                  </span>
                  <div className="fw-bold fs-5 fs-lg-3 text-dark geo-title">
                    აირჩიეთ სამუშაოები
                  </div>
                </div>
                <div className={` ${styles.how_it_works_subitem}`}>
                  თუ თქვენ თავად აპირებთ თავად
                  გაუძღვეთ სარემონტო სამუშაოებს, მაშინ,
                  <br />
                  ჩვენი პროგრამა თქვენთვის ნამდვილი აღმოჩენაა.
                </div>
              </div>
            </div>
            <div data-aos="fade-up">
              <div className={` ${styles.how_it_works_item}`}>
                <div className={`${styles.how_it_works_ttl}`}>
                  <span className="badge badge-circle badge-light-success p-5 me-3 fs-3">
                    3
                  </span>
                  <div className="no-wrap fw-bold fs-5 fs-lg-3 text-dark geo-title">
                    დაიწყე დათვლა
                  </div>
                </div>
                <div className={`${styles.how_it_works_subitem}`}>
                  თუ თქვენ თავად აპირებთ თავად
                  გაუძღვეთ სარემონტო სამუშაოებს, მაშინ,
                  ჩვენი პროგრამა თქვენთვის ნამდვილი აღმოჩენაა.
                </div>
              </div>
            </div>
          </div>
          <div className="relative responsive-w-100 align-items-center">
            <img className="calc-img" src="/images/calc.png" alt="banner" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
