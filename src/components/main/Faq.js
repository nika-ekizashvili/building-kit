import { useState } from "react";

import styles from "./Home.module.css";

const Faq = ({ faqData }) => {
  const [visible, setVisible] = useState(null);

  let hanlder = (num) => {
    if (visible === num) {
      setVisible(null);
    } else {
      setVisible(num);
    }
  };

  return (
    <div className="container mb-320 mt-20"  data-aos="fade-up">
      <div className="d-flex w-100 align-items-center custom-row responsive-justify-center">
        <div className={styles.width50}>
          <h3 className="m-color fs-2hx fw-bold mb-8 georgian">
            ხშირად დასმული კითხვები
          </h3>
          {faqData &&
            faqData.map((item, index) => {
              return (
                <div key={index} className="faq">
                  <div
                    onClick={() => hanlder(index)}
                    className="relative justify-content-between d-flex align-items-center w-100 question fs-2 fw-bold pointer w-fit"
                  >
                    <div className={`${styles.borderBottom} w-100`}>
                      {item.attributes.question}
                    </div>
                    <svg
                      className={` ${styles.faqArrow} ${
                        visible === index ? styles.rotate : ""
                      }`}
                      width="14"
                      height="7"
                      viewBox="0 0 14 7"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.00016 7.00016L0.333496 0.333496L13.6668 0.333496L7.00016 7.00016Z"
                        fill="#4C5481"
                      />
                    </svg>
                  </div>
                  <div
                    className={`${visible === index ? styles.active : ""} ${
                      styles.answer
                    } fs-2 `}
                  >
                    {item.attributes.answer}
                  </div>
                </div>
              );
            })}
        </div>
        <div className={`${styles.responsive} w-50 relative `}>
          <img className="faq-bg" src="/images/faq.png" alt="faq" />
        </div>
      </div>
    </div>
  );
};

export default Faq;
