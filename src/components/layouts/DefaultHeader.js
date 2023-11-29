import { useState, useEffect, useRef } from "react";
import Auth from "../popup/Auth";
import { useSpring, animated } from "react-spring";
import Link from "next/link";
import styles from "./HeaderLogged.module.css";

function DefaultHeader(props) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const modalRef = useRef(null);

  const animation = useSpring({
    opacity: showAuthModal ? 1 : 0,
  });

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  const handleClose = () => {
    setShowAuthModal(false);
  };

  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowAuthModal(false);
    }
  };

  useEffect(() => {
    if (showAuthModal) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showAuthModal]);

  return (
      <div
        className={`landing-header header animateTY ${props.animate ? 'animate' : ''}`}
        data-kt-sticky="true"
        data-kt-sticky-name="landing-header"
        data-kt-sticky-offset="{default: '200px', lg: '300px'}"
      >
        <div className="container d-flex flex-grow-1 cream-bg">
          <div className="d-flex align-items-center justify-content-between width-100 cream-bg">
            <div className="d-flex align-items-center">
            <Link href="/">
              <img
                  alt="Logo"
                  src="/images/Logo.png"
                  className={`${styles.logo}`}
              />
            </Link>
            </div>
            <div className="d-lg-block" id="kt_header_nav_wrapper">
            </div>
            <div className="ms-1">
              <div
                className={` btn geo-title custom-btn `}
                onClick={handleAuthClick}
              >
                <svg
                className="profile-icon"
                width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.06152 14.6C3.91152 14 4.79902 13.525 5.72402 13.175C6.64902 12.825 7.66152 12.65 8.76152 12.65C9.86152 12.65 10.874 12.825 11.799 13.175C12.724 13.525 13.6115 14 14.4615 14.6C15.1449 13.9167 15.699 13.1 16.124 12.15C16.549 11.2 16.7615 10.15 16.7615 9.00005C16.7615 6.78338 15.9824 4.89588 14.424 3.33755C12.8657 1.77922 10.9782 1.00005 8.76152 1.00005C6.54486 1.00005 4.65736 1.77922 3.09902 3.33755C1.54069 4.89588 0.761523 6.78338 0.761523 9.00005C0.761523 10.15 0.974023 11.2 1.39902 12.15C1.82402 13.1 2.37819 13.9167 3.06152 14.6ZM8.76152 9.35005C7.96152 9.35005 7.28652 9.07505 6.73652 8.52505C6.18652 7.97505 5.91152 7.30005 5.91152 6.50005C5.91152 5.70005 6.18652 5.02505 6.73652 4.47505C7.28652 3.92505 7.96152 3.65005 8.76152 3.65005C9.56152 3.65005 10.2365 3.92505 10.7865 4.47505C11.3365 5.02505 11.6115 5.70005 11.6115 6.50005C11.6115 7.30005 11.3365 7.97505 10.7865 8.52505C10.2365 9.07505 9.56152 9.35005 8.76152 9.35005ZM8.76152 17.7C7.54486 17.7 6.40736 17.475 5.34902 17.025C4.29069 16.575 3.36986 15.9584 2.58652 15.175C1.80319 14.3917 1.18652 13.4709 0.736523 12.4125C0.286523 11.3542 0.0615234 10.2167 0.0615234 9.00005C0.0615234 7.78338 0.286523 6.64588 0.736523 5.58755C1.18652 4.52922 1.80319 3.60838 2.58652 2.82505C3.36986 2.04172 4.29069 1.42505 5.34902 0.975049C6.40736 0.525049 7.54486 0.300049 8.76152 0.300049C9.97819 0.300049 11.1157 0.525049 12.174 0.975049C13.2324 1.42505 14.1532 2.04172 14.9365 2.82505C15.7199 3.60838 16.3365 4.52922 16.7865 5.58755C17.2365 6.64588 17.4615 7.78338 17.4615 9.00005C17.4615 10.2167 17.2365 11.3542 16.7865 12.4125C16.3365 13.4709 15.7199 14.3917 14.9365 15.175C14.1532 15.9584 13.2324 16.575 12.174 17.025C11.1157 17.475 9.97819 17.7 8.76152 17.7Z" fill="#2B3467"/>
                </svg>
                ავტორიზაცია
              </div>
              {showAuthModal && (
                <animated.div
                  className="modal"
                  style={animation}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div ref={modalRef}>
                    <div>
                      <Auth onClose={handleClose} />
                    </div>
                  </div>
                </animated.div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}

export default DefaultHeader;
