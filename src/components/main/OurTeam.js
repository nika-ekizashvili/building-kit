import { useState, useEffect } from "react";
import { useParallax } from "react-scroll-parallax";

import styles from "./Home.module.css";

const AboutCompany = () => {
  const [count, setCount] = useState(30);
  const [isCounting, setIsCounting] = useState(false);
  const [count1, setCount1] = useState(450);
  const [count2, setCount2] = useState(1499950);
  const [isCounting1, setIsCounting1] = useState(false);
  const [isCounting2, setIsCounting2] = useState(false);

  const parallax = useParallax({
    speed: -10,
  });

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY >= 930 && !isCounting) {
        setIsCounting(true);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isCounting]);

  useEffect(() => {
    let intervalId;

    if (isCounting) {
      intervalId = setInterval(() => {
        if (count < 70) {
          setCount(count + 1);
        } else {
          setIsCounting(false);
        }
      }, 50);
    }

    return () => clearInterval(intervalId);
  }, [isCounting, count]);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY >= 930 && !isCounting1) {
        setIsCounting1(true);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isCounting1]);

  useEffect(() => {
    let intervalId;

    if (isCounting1) {
      intervalId = setInterval(() => {
        if (count1 < 500) {
          setCount1(count1 + 1);
        } else {
          setIsCounting1(false);
        }
      }, 50);
    }

    return () => clearInterval(intervalId);
  }, [isCounting1, count1]);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY >= 930 && !isCounting2) {
        setIsCounting2(true);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isCounting2]);

  useEffect(() => {
    let intervalId;

    if (isCounting2) {
      intervalId = setInterval(() => {
        if (count2 < 1500000) {
          setCount2(count2 + 1);
        } else {
          setIsCounting2(false);
        }
      }, 50);
    }

    return () => clearInterval(intervalId);
  }, [isCounting2, count2]);

  return (
    <div className={`mt-sm-n10 ${styles.ourTeamContainer}`} data-aos="fade-up">
      <div className="pt-18 landing-dark-bg">
        <div className="container">
          <div
            className={`${"d-flex align-center align-items-center mt-15 mb-18"} ${styles.our_team_item
              }`}
            id="achievements"
            data-kt-scroll-offset="{default: 100, lg: 150}"
          >
            <img ref={parallax.ref} className="team" src="/images/team.png" alt="banner" />
            <div
              className={`${"w-50 responsive-w-100 responsive-justify-center ms-4"} ${styles.our_team_subitem
                }`}
            >
              <h3 className="m-color fs-2hx fw-bold mb-5 geo-title">
                კომპანიის შესახებ
              </h3>
              <div className="fs-2 light-text fw-bold georgian">
                კომპანია „ReCount.Ge“ დაარსდა 2023 წელს. ჩვენ შესაძლებელს ვხდით მიიღოთ  სარემონტო ხარჯთაღრიცხვა თქვენივე შევსებულ ინფორმაციაზე დაყდნობით და ასევე განახორჩიელოთ პროდუქციის შეძენა ონლაინ ჩვენს პლათფორმაზე ტრანსპორტირებით.
              </div>

            </div>
          </div>
          <div className="d-flex flex-center">
            <div className="d-flex flex-wrap flex-center justify-content-lg-between mb-15 mx-auto w-xl-900px">
              <div className="d-flex flex-column flex-center h-200px w-200px h-lg-250px w-lg-250px m-3 bgi-no-repeat bgi-position-center bgi-size-contain">
                <div className="mb-0">
                  <div className="fs-lg-2hx fs-2x fw-bolder d-flex flex-center">
                    <div
                      className="min-w-70px"
                      data-kt-countup="true"
                      data-kt-countup-value={700}
                      data-kt-countup-suffix="+"
                    >
                      <p>{count}+</p>
                    </div>
                  </div>
                  <span className="geo-title text-gray-600 fw-bold fs-5 lh-0">
                    პარტნიორი
                    <svg
                      className="custom-svg"
                      width="104"
                      height="104"
                      viewBox="0 0 104 104"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g mask="url(#mask0_194_3153)">
                        <path
                          d="M52.4332 91C51.2054 91 50.1762 90.5847 49.3457 89.7542C48.5151 88.9236 48.0998 87.8944 48.0998 86.6667C48.0998 86.1611 48.2082 85.6375 48.4248 85.0958C48.6415 84.5542 48.9665 84.0667 49.3998 83.6333L69.4415 63.5917L66.2998 60.45L46.3665 80.4917C45.9332 80.925 45.4637 81.25 44.9582 81.4667C44.4526 81.6833 43.9109 81.7917 43.3332 81.7917C42.1054 81.7917 41.0762 81.3764 40.2457 80.5458C39.4151 79.7153 38.9998 78.6861 38.9998 77.4583C38.9998 76.7361 39.1082 76.1403 39.3248 75.6708C39.5415 75.2014 39.8304 74.7861 40.1915 74.425L60.2332 54.3833L57.1998 51.35L37.1582 71.2833C36.7248 71.7167 36.2554 72.0417 35.7498 72.2583C35.2443 72.475 34.6665 72.5833 34.0165 72.5833C32.8609 72.5833 31.8498 72.15 30.9832 71.2833C30.1165 70.4167 29.6832 69.4056 29.6832 68.25C29.6832 67.6722 29.7915 67.1306 30.0082 66.625C30.2248 66.1194 30.5498 65.65 30.9832 65.2167L51.0248 45.175L47.8832 42.1417L27.9498 62.1833C27.5887 62.5444 27.1554 62.8333 26.6498 63.05C26.1443 63.2667 25.5304 63.375 24.8082 63.375C23.5804 63.375 22.5512 62.9597 21.7207 62.1292C20.8901 61.2986 20.4748 60.2694 20.4748 59.0417C20.4748 58.4639 20.5832 57.9222 20.7998 57.4167C21.0165 56.9111 21.3415 56.4417 21.7748 56.0083L45.9332 31.85L62.1832 48.2083C62.9776 49.0028 63.9165 49.6347 64.9998 50.1042C66.0832 50.5736 67.1665 50.8083 68.2498 50.8083C70.561 50.8083 72.5832 49.9958 74.3165 48.3708C76.0498 46.7458 76.9165 44.6694 76.9165 42.1417C76.9165 41.1306 76.736 40.0833 76.3748 39C76.0137 37.9167 75.3637 36.9056 74.4248 35.9667L55.0332 16.575C56.2609 15.4194 57.6332 14.5347 59.1498 13.9208C60.6665 13.3069 62.1832 13 63.6998 13C65.5776 13 67.311 13.3069 68.8998 13.9208C70.4887 14.5347 71.9332 15.4917 73.2332 16.7917L91.5415 35.2083C92.8415 36.5083 93.7985 37.9528 94.4123 39.5417C95.0262 41.1306 95.3332 42.9722 95.3332 45.0667C95.3332 46.5111 95.0082 47.9736 94.3582 49.4542C93.7082 50.9347 92.7693 52.2889 91.5415 53.5167L55.4665 89.7C54.8887 90.2778 54.3832 90.6389 53.9498 90.7833C53.5165 90.9278 53.011 91 52.4332 91ZM15.2748 56.3333L12.4582 53.5167C11.2304 52.3611 10.2915 50.9889 9.6415 49.4C8.9915 47.8111 8.6665 46.15 8.6665 44.4167C8.6665 42.5389 9.02762 40.8056 9.74984 39.2167C10.4721 37.6278 11.3748 36.2917 12.4582 35.2083L30.7665 16.7917C31.9221 15.6361 33.2943 14.7153 34.8832 14.0292C36.4721 13.3431 38.0248 13 39.5415 13C41.4915 13 43.2248 13.2708 44.7415 13.8125C46.2582 14.3542 47.7387 15.3472 49.1832 16.7917L71.3915 39C71.8248 39.4333 72.1498 39.9028 72.3665 40.4083C72.5832 40.9139 72.6915 41.4556 72.6915 42.0333C72.6915 43.1889 72.2582 44.2 71.3915 45.0667C70.5248 45.9333 69.5137 46.3667 68.3582 46.3667C67.7082 46.3667 67.1665 46.2764 66.7332 46.0958C66.2998 45.9153 65.8304 45.5722 65.3248 45.0667L45.8248 25.7833L15.2748 56.3333Z"
                          fill="#2B3467"
                        />
                      </g>
                    </svg>
                  </span>
                </div>
              </div>
              <div className="d-flex flex-column flex-center h-200px w-200px h-lg-250px w-lg-250px m-3 bgi-no-repeat bgi-position-center bgi-size-contain">
                <div className="mb-0">
                  <div className="fs-lg-2hx fs-2x fw-bolder d-flex flex-center">
                    <div
                      className="min-w-70px"
                      data-kt-countup="true"
                      data-kt-countup-value={80}
                      data-kt-countup-suffix="K+"
                    >
                      <p>{count1}+</p>
                    </div>
                  </div>
                  <span className="geo-title text-gray-600 fw-bold fs-5 lh-0">
                    ობიექტი
                    <svg
                      className="custom-svg"
                      width="104"
                      height="104"
                      viewBox="0 0 104 104"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g mask="url(#mask0_73_298)">
                        <path
                          d="M80.017 90.8919C79.5504 90.8919 79.1198 90.8155 78.7253 90.6627C78.3309 90.5099 77.9448 90.2446 77.567 89.8669L55.967 68.3502C55.5893 67.9725 55.324 67.5864 55.1712 67.1919C55.0184 66.7974 54.9421 66.3669 54.9421 65.9002C54.9421 65.4335 55.0184 65.003 55.1712 64.6086C55.324 64.2141 55.5893 63.8279 55.967 63.4501L63.1754 56.2419C63.5532 55.8641 63.9393 55.5988 64.3337 55.4461C64.7282 55.2932 65.1587 55.2168 65.6253 55.2168C66.092 55.2168 66.5226 55.2932 66.9171 55.4461C67.3115 55.5988 67.6976 55.8641 68.0754 56.2419L89.6753 77.8419C90.0531 78.2196 90.3185 78.6057 90.4713 79.0002C90.624 79.3946 90.7004 79.8252 90.7004 80.2919C90.7004 80.7585 90.624 81.189 90.4713 81.5835C90.3185 81.978 90.0531 82.3641 89.6753 82.7418L82.4671 89.8669C82.0893 90.2446 81.7032 90.5099 81.3088 90.6627C80.9143 90.8155 80.4837 90.8919 80.017 90.8919ZM80.017 86.3502L86.0753 80.2919L65.6504 59.8669L59.5921 65.9252L80.017 86.3502ZM23.8754 90.9169C23.4087 90.9169 22.974 90.8363 22.5712 90.6752C22.1684 90.5141 21.7781 90.2446 21.4003 89.8669L14.2171 82.7669C13.8393 82.3891 13.5698 81.9988 13.4087 81.596C13.2476 81.1932 13.167 80.7585 13.167 80.2919C13.167 79.8252 13.2476 79.3807 13.4087 78.9585C13.5698 78.5363 13.8393 78.1363 14.2171 77.7585L36.517 55.4585H45.5587L48.9086 52.1085L30.5337 33.7336H24.3587L13.417 22.7919L22.6587 13.5502L33.6004 24.4919V30.6669L51.9753 49.0418L65.0421 35.9752L57.0504 27.9835L61.9504 23.0835H52.1254L50.342 21.3836L62.6421 9.0835L64.342 10.7835V20.6918L69.2421 15.7918L86.4587 32.8419C87.5198 33.8474 88.3059 35.0016 88.817 36.3043C89.3281 37.6071 89.5837 38.9863 89.5837 40.4419C89.5837 41.5085 89.4254 42.5446 89.1088 43.5502C88.7921 44.5557 88.3254 45.5057 87.7088 46.4002L78.8337 37.5252L72.6837 43.6752L68.0504 39.0419L48.542 58.5502V67.7335L26.3254 89.8669C25.9476 90.2446 25.5615 90.5141 25.1671 90.6752C24.7726 90.8363 24.342 90.9169 23.8754 90.9169ZM23.8754 86.2669L45.2086 64.9336V58.8752H39.1504L17.8171 80.2086L23.8754 86.2669ZM23.8754 86.2669L17.8171 80.2086L20.8587 83.2252L23.8754 86.2669Z"
                          fill="#2B3467"
                        />
                      </g>
                    </svg>
                  </span>
                </div>
              </div>
              <div className="d-flex flex-column flex-center h-200px w-200px h-lg-250px w-lg-250px m-3 bgi-no-repeat bgi-position-center bgi-size-contain">
                <div className="mb-0">
                  <div className="fs-lg-2hx fs-2x fw-bolder d-flex flex-center">
                    <div
                      className="min-w-70px"
                      data-kt-countup="true"
                      data-kt-countup-value={35}
                      data-kt-countup-suffix="M+"
                    >
                      <p>{count2}+</p>
                    </div>
                  </div>
                  <span className="geo-title text-gray-600 fw-bold fs-5 lh-0">
                    დაზოგილი თანხა
                    <svg
                      className="custom-svg"
                      width="104"
                      height="104"
                      viewBox="0 0 104 104"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g mask="url(#mask0_194_3164)">
                        <path
                          d="M40.9202 65.466V62.906L44.9602 62.506V62.386C43.6002 61.5593 42.4802 60.5593 41.6002 59.386C40.7202 58.186 40.0669 56.8527 39.6402 55.386C39.2136 53.9193 39.0002 52.3593 39.0002 50.706C39.0002 48.066 39.4936 45.746 40.4802 43.746C41.4936 41.746 42.9602 40.186 44.8802 39.066C46.8269 37.9193 49.1869 37.346 51.9602 37.346C54.6536 37.346 56.9602 37.9193 58.8802 39.066C60.8002 40.2127 62.2669 41.8527 63.2803 43.986C64.3202 46.0927 64.8402 48.6127 64.8402 51.546H61.1202C61.1202 49.226 60.8002 47.2127 60.1602 45.506C59.5469 43.7993 58.5602 42.4793 57.2002 41.546C55.8669 40.6127 54.1202 40.146 51.9602 40.146C49.8536 40.146 48.1202 40.5993 46.7602 41.506C45.4002 42.386 44.3869 43.6393 43.7202 45.266C43.0536 46.866 42.7202 48.7727 42.7202 50.986C42.7202 53.226 43.1202 55.2127 43.9202 56.946C44.7202 58.6527 45.8669 59.9993 47.3602 60.986C48.8802 61.946 50.6669 62.426 52.7202 62.426H63.0402V65.466H40.9202ZM47.7602 51.506V34.666H50.3202V51.506H47.7602ZM53.6002 51.506V34.666H56.1602V51.506H53.6002Z"
                          fill="#2B3467"
                        />
                        <path
                          d="M52.0004 95.3332C43.1892 95.3332 35.292 92.9874 28.3087 88.2957C21.3253 83.604 16.0837 77.2999 12.5837 69.3832V79.3332H8.25038V61.9999H25.5837V66.3332H16.0504C18.8504 73.7554 23.5392 79.7221 30.117 84.2332C36.6948 88.7443 43.9893 90.9998 52.0004 90.9998C57.1948 90.9998 62.0739 90.0679 66.6378 88.204C71.2018 86.3401 75.2212 83.7679 78.6962 80.4873C82.1712 77.2067 84.9935 73.3123 87.1629 68.804C89.3323 64.2956 90.5837 59.4165 90.9171 54.1665H95.2504C94.9726 59.9054 93.6434 65.2748 91.2628 70.2748C88.8823 75.2748 85.7615 79.636 81.9004 83.3582C78.0393 87.0804 73.5393 90.0068 68.4004 92.1373C63.2615 94.2679 57.7948 95.3332 52.0004 95.3332ZM32.6837 18.1581L30.5003 14.3082C33.7393 12.436 37.1435 11.0276 40.7129 10.0832C44.2823 9.13873 48.0448 8.6665 52.0004 8.6665C60.6448 8.6665 68.542 11.0262 75.692 15.7457C82.842 20.4651 88.0837 26.8665 91.417 34.9498V24.6665H95.7503V41.9998H78.417V37.6665H87.9503C85.317 30.4665 80.6975 24.5554 74.092 19.9332C67.4864 15.3109 60.1225 12.9998 52.0004 12.9998C48.4503 12.9998 45.074 13.4401 41.8712 14.3206C38.6684 15.2012 35.6059 16.4804 32.6837 18.1581ZM17.3337 46.8332L13.5837 38.4165L5.16699 34.6665L13.5837 30.9165L17.3337 22.4998L21.0837 30.9165L29.5004 34.6665L21.0837 38.4165L17.3337 46.8332Z"
                          fill="#2B3467"
                        />
                      </g>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <h3
            className="geo-title fs-2hx text-dark mb-5 georgian fw-bold"
            id="how-it-works"
            data-kt-scroll-offset="{default: 100, lg: 150}"
          >
            ჩვენი გუნდი გთავაზობთ
          </h3>
          <div className="text-start fs-2 fw-bold text-muted mb-20 georgian">
            თუ ჩვენი ვებ- აპლიკაციის გამოყენება გსურთ, იხილეთ ქვემოთ მოცემული
            სატარიფო გეგმები, ამ გზით თქვენ შეძლებთ თქვენზე მორგებული სატარიფო
            გეგმის შეძენას და ჩვენი ვებ-აპლიკაციის გამოყენებას.
            <br />
            <br />
            ჩვენი პლატფორმის გამოყენების შედეგად თქვენ მიიღებთ:
            <br />
            სწორი რიგითობით გაწერილ, დეტალურად ჩაშლილ, საბაზრო, საბითუმო, საცალო, ფასებზე დაყრდნობით დათვლილ და მაქსიმალურ სიზუსტემდე მიყვანილ სარემონტო ხარჯთაღრიცხვას.
          </div>
          {/* <div className="fs-2 fw-bold text-muted text-center">
            <a
              href="../../demo11/dist/account/security.html"
              className="link-primary fs-4 fw-bolder"
            >
              ReCounter.Ge
            </a>
          </div> */}
        </div>
      </div>
    </div >
  );
};

export default AboutCompany;
