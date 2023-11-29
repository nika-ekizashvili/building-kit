import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useParallax } from "react-scroll-parallax";
import { useSpring, animated } from "react-spring";
import { setAuthState } from "../../store/slices/authSlice";

import Auth from "../popup/Auth.js";

import styles from "./Home.module.css";

const Heading = ({log}) => {
  const dispatch = useDispatch();
  const modalRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [animate, setAnimate] = useState(false);

  const animation = useSpring({
    opacity: showModal ? 1 : 0,
    visibility: showModal ? "visible" : "hidden",
  });

  const handleAuthClick = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowModal(false);
    }
  };
  useEffect(() => {
    setAnimate(true);
  }, []);
  useEffect(() => {
    if (showModal) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showModal]);

  useEffect(() => {
    if (
      localStorage.getItem("access_token") &&
      localStorage.getItem("access_token") !== ""
    ) {
      dispatch(setAuthState(true));
    }
  }, [log, dispatch]);

  const parallax = useParallax({
    speed: -10,
  });
  const parallaxSec = useParallax({
    speed: -5,
  });

  return (
    <div className="mb-0" id="home">
      <div
        className="bgi-no-repeat bgi-size-contain bgi-position-x-center bgi-position-y-bottom landing-dark-bg"
      >
        <div className={`${styles.heading_main} container d-flex flex-center w-100 relative mt-169 col-responsive justify-content-between`}>
          <div
            className={`${"mb-5 mb-lg-10 py-10 py-lg-20"} ${
              styles.heading_container
            }`}
          >
            <h1 className={`text-start geo-title lh-base fw-bold f-rem2 fs-lg-3x mb-15 georgian animateBY tD2 ${animate  ? 'animate' : ''}`}>
              გამოთვალე მარტივად
              <br />
              <span>
                <span id="kt_landing_hero_text geo-title">სარემონტო ხარჯთაღრიცხვა!</span>
              </span>
            </h1>
            {log ? (
              <Link href="/projects" className={`animateBY tD3 ${animate  ? 'animate' : ''}`}>
                <div className="btn-bordered">
                  <div
                    className="btn btn-primary geo-title fill-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#kt_modal_create_app"
                    id="kt_toolbar_primary_button"
                  >
                    <b>გამოთვალე!</b>
                  </div>
                </div>
              </Link>
            ) : (
              <div className={`animateBY tD3 ${animate  ? 'animate' : ''}`}>
                <div className="btn-bordered">
                  <div
                      onClick={handleAuthClick}
                      className="btn btn-primary georgian fill-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#kt_modal_create_app"
                      id="kt_toolbar_primary_button"
                  >
                    <svg
                        className=" bi-calculator-fill"
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                      <g mask="url(#mask0_3_151)">
                        <path
                            d="M10.6667 24H12.6667V21.3333H15.3333V19.3333H12.6667V16.6667H10.6667V19.3333H8V21.3333H10.6667V24ZM17.3333 23H24V21H17.3333V23ZM17.3333 19.6667H24V17.6667H17.3333V19.6667ZM18.8 14.6L20.6667 12.7333L22.5333 14.6L23.9333 13.2L22.0667 11.2667L23.9333 9.4L22.5333 8L20.6667 9.86667L18.8 8L17.4 9.4L19.2667 11.2667L17.4 13.2L18.8 14.6ZM8.33333 12.2667H15V10.2667H8.33333V12.2667ZM6.66667 28C5.93333 28 5.30556 27.7389 4.78333 27.2167C4.26111 26.6944 4 26.0667 4 25.3333V6.66667C4 5.93333 4.26111 5.30556 4.78333 4.78333C5.30556 4.26111 5.93333 4 6.66667 4H25.3333C26.0667 4 26.6944 4.26111 27.2167 4.78333C27.7389 5.30556 28 5.93333 28 6.66667V25.3333C28 26.0667 27.7389 26.6944 27.2167 27.2167C26.6944 27.7389 26.0667 28 25.3333 28H6.66667Z"
                            fill="white"
                        />
                      </g>
                    </svg>
                    <b className="geo-title">გამოთვალე!</b>
                  </div>
                </div>
              </div>
            )}
            {log ? null : (
              <animated.div
                className="modal"
                style={animation}
                onClick={(e) => e.stopPropagation()}
              >
                <div ref={modalRef}>
                  {showModal && <Auth onClose={handleClose} />}
                </div>
              </animated.div>
            )}
          </div>
          <div className={styles.heading_banner}>
            <div className={`${styles.heading_bannerImg} animateBY tD3 ${animate  ? 'animate' : ''}`}>
              <img  ref={parallaxSec.ref} src="/images/landing/banner1.png" alt="banner" />
            </div>
            <div className={`${styles.heading_bannerImg} animateBY tD4 ${animate  ? 'animate' : ''}`}>
              <img ref={parallax.ref} src="/images/landing/banner2.png" alt="banner2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heading;
