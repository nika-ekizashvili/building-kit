import { useState, useEffect } from "react";

const AboutCompany = () => {
  const [count, setCount] = useState(650);
  const [isCounting, setIsCounting] = useState(false);
  const [count1, setCount1] = useState(30);
  const [count2, setCount2] = useState(0);
  const [isCounting1, setIsCounting1] = useState(false);
  const [isCounting2, setIsCounting2] = useState(false);

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
        if (count < 700) {
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
        if (count1 < 80) {
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
        if (count2 < 35) {
          setCount2(count2 + 1);
        } else {
          setIsCounting2(false);
        }
      }, 50);
    }

    return () => clearInterval(intervalId);
  }, [isCounting2, count2]);

  return (
    <div className="mt-sm-n10">
      <div className="landing-curve landing-dark-color">
        <svg
          viewBox="15 -1 1470 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 48C4.93573 47.6644 8.85984 47.3311 12.7725 47H1489.16C1493.1 47.3311 1497.04 47.6644 1501 48V47H1489.16C914.668 -1.34764 587.282 -1.61174 12.7725 47H1V48Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="pb-15 pt-18 landing-dark-bg">
        <div className="container">
          <div
            className="text-center mt-15 mb-18"
            id="achievements"
            data-kt-scroll-offset="{default: 100, lg: 150}"
          >
            <h3 className="fs-2hx fw-bolder mb-5 georgian">
              ჩვენი გუნდი
            </h3>
            <div className="fs-5 text-gray-700 fw-bold georgian">
            ომპანია „ReCount.Ge“ დაარსდა 2023 წელს. 
              <br />
              ჩვენ შესაძლებელს ვხდით მიიღოთ  სარემონტო ხარჯთაღრიცხვა თქვენივე შევსებულ ინფორმაციაზე დაყდნობით და ასევე განახორჩიელოთ პროდუქციის შეძენა<br />
              ონლაინ ჩვენს პლათფორმაზე ტრანსპორტირებით.
            </div>
          </div>
          <div className="d-flex flex-center">
            <div className="d-flex flex-wrap flex-center justify-content-lg-between mb-15 mx-auto w-xl-900px">
              <div
                className="d-flex flex-column flex-center h-200px w-200px h-lg-250px w-lg-250px m-3 bgi-no-repeat bgi-position-center bgi-size-contain"
              >
                <span className="svg-icon svg-icon-2tx svg-icon-white mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <rect
                      x={2}
                      y={2}
                      width={9}
                      height={9}
                      rx={2}
                      fill="black"
                    />
                    <rect
                      opacity="0.3"
                      x={13}
                      y={2}
                      width={9}
                      height={9}
                      rx={2}
                      fill="black"
                    />
                    <rect
                      opacity="0.3"
                      x={13}
                      y={13}
                      width={9}
                      height={9}
                      rx={2}
                      fill="black"
                    />
                    <rect
                      opacity="0.3"
                      x={2}
                      y={13}
                      width={9}
                      height={9}
                      rx={2}
                      fill="black"
                    />
                  </svg>
                </span>
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
                  <span className="text-gray-600 fw-bold fs-5 lh-0">
                    Known Companies
                  </span>
                </div>
              </div>
              <div
                className="d-flex flex-column flex-center h-200px w-200px h-lg-250px w-lg-250px m-3 bgi-no-repeat bgi-position-center bgi-size-contain"
              >
                <span className="svg-icon svg-icon-2tx svg-icon-white mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M13 10.9128V3.01281C13 2.41281 13.5 1.91281 14.1 2.01281C16.1 2.21281 17.9 3.11284 19.3 4.61284C20.7 6.01284 21.6 7.91285 21.9 9.81285C22 10.4129 21.5 10.9128 20.9 10.9128H13Z"
                      fill="black"
                    />
                    <path
                      opacity="0.3"
                      d="M13 12.9128V20.8129C13 21.4129 13.5 21.9129 14.1 21.8129C16.1 21.6129 17.9 20.7128 19.3 19.2128C20.7 17.8128 21.6 15.9128 21.9 14.0128C22 13.4128 21.5 12.9128 20.9 12.9128H13Z"
                      fill="black"
                    />
                    <path
                      opacity="0.3"
                      d="M11 19.8129C11 20.4129 10.5 20.9129 9.89999 20.8129C5.49999 20.2129 2 16.5128 2 11.9128C2 7.31283 5.39999 3.51281 9.89999 3.01281C10.5 2.91281 11 3.41281 11 4.01281V19.8129Z"
                      fill="black"
                    />
                  </svg>
                </span>
                <div className="mb-0">
                  <div className="fs-lg-2hx fs-2x fw-bolder d-flex flex-center">
                    <div
                      className="min-w-70px"
                      data-kt-countup="true"
                      data-kt-countup-value={80}
                      data-kt-countup-suffix="K+"
                    >
                      <p>{count1}K+</p>
                    </div>
                  </div>
                  <span className="text-gray-600 fw-bold fs-5 lh-0">
                    Statistic Reports
                  </span>
                </div>
              </div>
              <div
                className="d-flex flex-column flex-center h-200px w-200px h-lg-250px w-lg-250px m-3 bgi-no-repeat bgi-position-center bgi-size-contain"
              >
                <span className="svg-icon svg-icon-2tx svg-icon-white mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M21 10H13V11C13 11.6 12.6 12 12 12C11.4 12 11 11.6 11 11V10H3C2.4 10 2 10.4 2 11V13H22V11C22 10.4 21.6 10 21 10Z"
                      fill="black"
                    />
                    <path
                      opacity="0.3"
                      d="M12 12C11.4 12 11 11.6 11 11V3C11 2.4 11.4 2 12 2C12.6 2 13 2.4 13 3V11C13 11.6 12.6 12 12 12Z"
                      fill="black"
                    />
                    <path
                      opacity="0.3"
                      d="M18.1 21H5.9C5.4 21 4.9 20.6 4.8 20.1L3 13H21L19.2 20.1C19.1 20.6 18.6 21 18.1 21ZM13 18V15C13 14.4 12.6 14 12 14C11.4 14 11 14.4 11 15V18C11 18.6 11.4 19 12 19C12.6 19 13 18.6 13 18ZM17 18V15C17 14.4 16.6 14 16 14C15.4 14 15 14.4 15 15V18C15 18.6 15.4 19 16 19C16.6 19 17 18.6 17 18ZM9 18V15C9 14.4 8.6 14 8 14C7.4 14 7 14.4 7 15V18C7 18.6 7.4 19 8 19C8.6 19 9 18.6 9 18Z"
                      fill="black"
                    />
                  </svg>
                </span>
                <div className="mb-0">
                  <div className="fs-lg-2hx fs-2x fw-bolder d-flex flex-center">
                    <div
                      className="min-w-70px"
                      data-kt-countup="true"
                      data-kt-countup-value={35}
                      data-kt-countup-suffix="M+"
                    >
                      <p>{count2}M+</p>
                    </div>
                  </div>
                  <span className="text-gray-600 fw-bold fs-5 lh-0">
                    Secure Payments
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="fs-2 fw-bold text-muted text-center mb-3 georgian">
            <span className="fs-1 lh-1 text-gray-700 ">“</span>ჩვენი პლატფორმის
            გამოყენების შედეგად თქვენ მიიღებთ:
            <br />
            <span className="text-gray-700 me-1 georgian">
              სწორი რიგითობით გაწერილ, დეტალურად ჩაშლილ,{" "}
            </span>{" "}
            საბაზრო ფასებზე ან/და თქვენივე სურვილისამებრ მითითებული ღირებულებაზე
            დაყრდნობით დათვლილ სარემონტო ხარჯთაღრიცხვას.
          </div>
          <div className="fs-2 fw-bold text-muted text-center">
            <a
              href="../../demo11/dist/account/security.html"
              className="link-primary fs-4 fw-bolder"
            >
              ReCounter.Ge
            </a>
          </div>
        </div>
        <div className="landing-curve landing-dark-color">
          <svg
            viewBox="15 12 1470 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 11C3.93573 11.3356 7.85984 11.6689 11.7725 12H1488.16C1492.1 11.6689 1496.04 11.3356 1500 11V12H1488.16C913.668 60.3476 586.282 60.6117 11.7725 12H0V11Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AboutCompany;
