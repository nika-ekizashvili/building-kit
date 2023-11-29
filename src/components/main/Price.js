import { useState } from "react";
import { useRouter } from "next/router";

import { useSpring, animated } from "react-spring";

import Auth from "../popup/Auth.js";

const Price = ({ pricesData, log }) => {
  const router = useRouter();
  const [annual, setAnnual] = useState(false);
  const [monthly, setMonthly] = useState(true);
  const [authModal, setAuthModal] = useState(false);
  const [selected, setSelected] = useState(1);

  const [animate, setAnimate] = useState(false);

  
  const animation = useSpring({
    opacity: authModal ? 1 : 0,
    visibility: authModal ? "visible" : "hidden",
  });
  
  const authModalHandler = () => {
    if (log) {
      router.push("/account");
    } else {
      setAuthModal(true);
    }
  };

  return (
    <div className="mt-sm-n20">
      <div className="landing-dark-bg">
        <div>
          <div className="d-flex flex-column container pt-lg-20">
            <div className="text-center" id="kt_pricing">
              <div className="w-100 justify-content-start d-flex">
                <div
                  className="buy-wrap nav-group landing-dark-bg d-inline-flex mb-15"
                  data-kt-buttons="true"
                  data-aos="fade-up"
                >
                  <a
                    onClick={() => {
                      setMonthly(true);
                      setAnnual(false);
                    }}
                    className={`geo-title buy-btn custom-padding me-2 btn btn-color-gray-600 btn-active btn-active-success me-2 ${[
                      monthly ? "active" : "",
                    ]} `}
                    data-kt-plan="month"
                  >
                    თვე
                  </a>
                  <a
                    onClick={() => {
                      setMonthly(false);
                      setAnnual(true);
                    }}
                    className={`geo-title buy-btn custom-padding btn btn-color-gray-600 btn-active btn-active-success ${[
                      annual ? "active" : "",
                    ]} `}
                    data-kt-plan="annual"
                  >
                    წელი
                  </a>
                </div>
              </div>
              <div className="row">
                {pricesData &&
                  pricesData.map((item, index) => {
                    return (
                      <div key={index} className="col-xl-4" data-aos="fade-up">
                        <div className="d-flex h-100 align-items-center">
                          <div
                            className={`br-4 br-4 w-100 d-flex flex-column flex-center ${selected === item.id ? "bg-primary" : "bg-body"
                              } py-15 px-10`}
                          >
                            <div className="mb-7 text-center">
                              <h1
                                className={`${'geo-title'} ${selected === item.id
                                  ? "text-white mb-5 fw-boldest"
                                  : "text-dark mb-5 fw-boldest"
                                  }`}
                              >
                                {item.attributes.name}
                              </h1>
                              <div className="text-center">
                                {item.attributes.name !== "დამწყები" && (
                                  <div
                                    style={{
                                      fontSize: "18px",
                                      opacity: !monthly ? 1 : 0,
                                      color:
                                        selected === item.id ? "white" : "",
                                    }}
                                  >
                                    {Math.floor(
                                      (item.attributes.month_price /
                                        item.attributes.year_price) *
                                      100
                                    )}
                                    % ფასდაკლება !
                                  </div>
                                )}
                                <span
                                  className={`${selected === item.id
                                    ? "fs-3x fw-bolder"
                                    : "fs-3x fw-bolder"
                                    }`}
                                    style={{color: '#EB455F'}}


                                >
                                  {monthly
                                    ? `${item.attributes.month_price}`
                                    : `${item.attributes.year_price}`}
                                  $
                                </span>
                              </div>
                            </div>
                            <div className="w-100 mb-10">
                              <div className="d-flex flex-stack mb-5">
                                <span
                                  className={`${'geo-title'} ${selected === item.id
                                    ? "fw-bold fs-6 text-white opacity-75 py-2"
                                    : "fw-bold fs-6 text-gray-800 text-start pe-3 py-2"
                                    }`}
                                >
                                  პროექტების რაოდენობა
                                </span>
                                <span
                                  className={` ${'geo-title'} ${selected === item.id
                                    ? "svg-icon svg-icon-1 svg-icon-white text-white"
                                    : "svg-icon svg-icon-1 svg-icon-success"
                                    }`}
                                >
                                  {monthly
                                    ? item.attributes.month_allowed_projects
                                    : item.attributes.year_allowed_projects}
                                </span>
                              </div>
                              {item.id === 1 && (
                                <div className="d-flex flex-stack mb-5">
                                  <span
                                    className={` ${'geo-title'} ${selected === item.id
                                      ? "fw-bold fs-6 text-white opacity-75 py-2"
                                      : "fw-bold fs-6 text-gray-800 text-start pe-3 py-2"
                                      }`}
                                  >
                                    უფასო საცდელი ვადა
                                  </span>
                                  <span
                                    className={`${'geo-title'} ${selected === item.id
                                      ? "svg-icon svg-icon-1 svg-icon-white text-white"
                                      : "svg-icon svg-icon-1 svg-icon-success"
                                      }`}
                                  >
                                    7 დღე
                                  </span>
                                </div>
                              )}
                              <div className="d-flex flex-stack mb-5">
                                <span
                                  className={`${'geo-title'} ${selected === item.id
                                    ? "fw-bold fs-6 text-white opacity-75 py-2"
                                    : "fw-bold fs-6 text-gray-800 text-start pe-3 py-2"
                                    }`}
                                >
                                  ფოტოსურათები &amp; ნახაზები
                                </span>
                                <span
                                  className={`${'geo-title'} ${selected === item.id
                                    ? "svg-icon svg-icon-1 svg-icon-white"
                                    : "svg-icon svg-icon-1 svg-icon-success"
                                    }`}
                                >
                                  {item.attributes.allowed_media ? (
                                    <svg
                                      className="mark-icon"
                                      width="18"
                                      height="18"
                                      viewBox="0 0 18 18"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M9.00335 18C7.7588 18 6.58872 17.7638 5.4931 17.2915C4.39748 16.8192 3.44444 16.1782 2.63397 15.3685C1.82352 14.5588 1.18192 13.6066 0.70915 12.512C0.236383 11.4174 0 10.2479 0 9.00335C0 7.7588 0.23625 6.58872 0.70875 5.4931C1.18125 4.39748 1.8225 3.44444 2.6325 2.63398C3.4425 1.82353 4.395 1.18192 5.49 0.709151C6.585 0.236384 7.755 0 9 0C10.0235 0 10.9918 0.158333 11.9051 0.475C12.8184 0.791667 13.6513 1.23333 14.4038 1.8L13.6846 2.54422C13.0256 2.05449 12.3008 1.67468 11.5101 1.4048C10.7194 1.13493 9.88267 1 9 1C6.78333 1 4.89583 1.77917 3.3375 3.3375C1.77917 4.89583 1 6.78333 1 9C1 11.2167 1.77917 13.1042 3.3375 14.6625C4.89583 16.2208 6.78333 17 9 17C11.2167 17 13.1042 16.2208 14.6625 14.6625C16.2208 13.1042 17 11.2167 17 9C17 8.59743 16.9705 8.20261 16.9116 7.81552C16.8526 7.42844 16.7641 7.05212 16.6462 6.68655L17.4442 5.86922C17.6276 6.36409 17.766 6.87181 17.8596 7.39238C17.9532 7.91294 18 8.44882 18 9C18 10.245 17.7638 11.415 17.2915 12.51C16.8192 13.605 16.1782 14.5575 15.3685 15.3675C14.5588 16.1775 13.6066 16.8188 12.512 17.2913C11.4174 17.7638 10.2479 18 9.00335 18ZM7.56155 12.9077L4.00385 9.35L4.71155 8.6423L7.56155 11.4923L17.2923 1.75578L18 2.46345L7.56155 12.9077Z"
                                        fill="#2B3467"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      className="mark-icon"
                                      width="21"
                                      height="21"
                                      viewBox="0 0 21 21"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M20.1098 20.5308L16.6021 17.0231C15.8278 17.6462 14.9685 18.1314 14.0242 18.4789C13.08 18.8263 12.072 19 11.0002 19C9.75519 19 8.58519 18.7638 7.49019 18.2913C6.39519 17.8188 5.44269 17.1775 4.63269 16.3675C3.82269 15.5575 3.18144 14.605 2.70894 13.51C2.23644 12.415 2.00019 11.245 2.00019 10C2.00019 8.92821 2.17391 7.9202 2.52134 6.97597C2.86878 6.03175 3.35404 5.17246 3.97712 4.39809L0.886719 1.30771L1.60019 0.594238L20.8233 19.8173L20.1098 20.5308ZM11.0002 18C11.9297 18 12.8056 17.8487 13.6281 17.5462C14.4505 17.2436 15.2002 16.8276 15.8771 16.2981L11.5213 11.9423L9.56174 13.9077L6.00404 10.35L6.71174 9.64231L9.56174 12.4923L10.8136 11.2346L4.70212 5.12309C4.17264 5.80002 3.75661 6.54971 3.45404 7.37214C3.15148 8.19457 3.00019 9.07053 3.00019 10C3.00019 12.2167 3.77936 14.1042 5.33769 15.6625C6.89603 17.2208 8.78353 18 11.0002 18ZM18.6252 14.8077L17.881 14.0635C18.2438 13.4673 18.521 12.8297 18.7127 12.1506C18.9044 11.4714 19.0002 10.7546 19.0002 10C19.0002 7.78335 18.221 5.89585 16.6627 4.33751C15.1044 2.77918 13.2169 2.00001 11.0002 2.00001C10.2502 2.00001 9.53449 2.09585 8.85307 2.28751C8.17167 2.47918 7.53289 2.75642 6.93674 3.11924L6.19249 2.37501C6.89179 1.93783 7.64573 1.59936 8.45429 1.35961C9.26286 1.11988 10.1115 1.00001 11.0002 1.00001C12.2452 1.00001 13.4152 1.23626 14.5102 1.70876C15.6052 2.18126 16.5577 2.82251 17.3677 3.63251C18.1777 4.44251 18.8189 5.39501 19.2914 6.49001C19.7639 7.58501 20.0002 8.75501 20.0002 10C20.0002 10.8887 19.8803 11.7373 19.6406 12.5459C19.4008 13.3545 19.0624 14.1084 18.6252 14.8077ZM13.6463 9.82309L12.9386 9.11539L15.2502 6.80386L15.9579 7.51156L13.6463 9.82309Z"
                                        fill="#2B3467"
                                      />
                                    </svg>
                                  )}
                                </span>
                              </div>
                              <div className="d-flex flex-stack mb-5">
                                <span
                                  className={`${'geo-title'} ${selected === item.id
                                    ? "fw-bold fs-6 text-white opacity-75 py-2"
                                    : "fw-bold fs-6 text-gray-800 text-start pe-3 py-2"
                                    }`}
                                >
                                  ექსპორტი (pdf, execl)
                                </span>
                                <span
                                  className={`${'geo-title'} ${selected === item.id
                                    ? "svg-icon svg-icon-1 svg-icon-white"
                                    : "svg-icon svg-icon-1 svg-icon-success"
                                    }`}
                                >
                                  {item.attributes.allowed_export ? (
                                    <svg
                                      className="mark-icon"
                                      width="18"
                                      height="18"
                                      viewBox="0 0 18 18"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M9.00335 18C7.7588 18 6.58872 17.7638 5.4931 17.2915C4.39748 16.8192 3.44444 16.1782 2.63397 15.3685C1.82352 14.5588 1.18192 13.6066 0.70915 12.512C0.236383 11.4174 0 10.2479 0 9.00335C0 7.7588 0.23625 6.58872 0.70875 5.4931C1.18125 4.39748 1.8225 3.44444 2.6325 2.63398C3.4425 1.82353 4.395 1.18192 5.49 0.709151C6.585 0.236384 7.755 0 9 0C10.0235 0 10.9918 0.158333 11.9051 0.475C12.8184 0.791667 13.6513 1.23333 14.4038 1.8L13.6846 2.54422C13.0256 2.05449 12.3008 1.67468 11.5101 1.4048C10.7194 1.13493 9.88267 1 9 1C6.78333 1 4.89583 1.77917 3.3375 3.3375C1.77917 4.89583 1 6.78333 1 9C1 11.2167 1.77917 13.1042 3.3375 14.6625C4.89583 16.2208 6.78333 17 9 17C11.2167 17 13.1042 16.2208 14.6625 14.6625C16.2208 13.1042 17 11.2167 17 9C17 8.59743 16.9705 8.20261 16.9116 7.81552C16.8526 7.42844 16.7641 7.05212 16.6462 6.68655L17.4442 5.86922C17.6276 6.36409 17.766 6.87181 17.8596 7.39238C17.9532 7.91294 18 8.44882 18 9C18 10.245 17.7638 11.415 17.2915 12.51C16.8192 13.605 16.1782 14.5575 15.3685 15.3675C14.5588 16.1775 13.6066 16.8188 12.512 17.2913C11.4174 17.7638 10.2479 18 9.00335 18ZM7.56155 12.9077L4.00385 9.35L4.71155 8.6423L7.56155 11.4923L17.2923 1.75578L18 2.46345L7.56155 12.9077Z"
                                        fill="#2B3467"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      className="mark-icon"
                                      width="21"
                                      height="21"
                                      viewBox="0 0 21 21"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M20.1098 20.5308L16.6021 17.0231C15.8278 17.6462 14.9685 18.1314 14.0242 18.4789C13.08 18.8263 12.072 19 11.0002 19C9.75519 19 8.58519 18.7638 7.49019 18.2913C6.39519 17.8188 5.44269 17.1775 4.63269 16.3675C3.82269 15.5575 3.18144 14.605 2.70894 13.51C2.23644 12.415 2.00019 11.245 2.00019 10C2.00019 8.92821 2.17391 7.9202 2.52134 6.97597C2.86878 6.03175 3.35404 5.17246 3.97712 4.39809L0.886719 1.30771L1.60019 0.594238L20.8233 19.8173L20.1098 20.5308ZM11.0002 18C11.9297 18 12.8056 17.8487 13.6281 17.5462C14.4505 17.2436 15.2002 16.8276 15.8771 16.2981L11.5213 11.9423L9.56174 13.9077L6.00404 10.35L6.71174 9.64231L9.56174 12.4923L10.8136 11.2346L4.70212 5.12309C4.17264 5.80002 3.75661 6.54971 3.45404 7.37214C3.15148 8.19457 3.00019 9.07053 3.00019 10C3.00019 12.2167 3.77936 14.1042 5.33769 15.6625C6.89603 17.2208 8.78353 18 11.0002 18ZM18.6252 14.8077L17.881 14.0635C18.2438 13.4673 18.521 12.8297 18.7127 12.1506C18.9044 11.4714 19.0002 10.7546 19.0002 10C19.0002 7.78335 18.221 5.89585 16.6627 4.33751C15.1044 2.77918 13.2169 2.00001 11.0002 2.00001C10.2502 2.00001 9.53449 2.09585 8.85307 2.28751C8.17167 2.47918 7.53289 2.75642 6.93674 3.11924L6.19249 2.37501C6.89179 1.93783 7.64573 1.59936 8.45429 1.35961C9.26286 1.11988 10.1115 1.00001 11.0002 1.00001C12.2452 1.00001 13.4152 1.23626 14.5102 1.70876C15.6052 2.18126 16.5577 2.82251 17.3677 3.63251C18.1777 4.44251 18.8189 5.39501 19.2914 6.49001C19.7639 7.58501 20.0002 8.75501 20.0002 10C20.0002 10.8887 19.8803 11.7373 19.6406 12.5459C19.4008 13.3545 19.0624 14.1084 18.6252 14.8077ZM13.6463 9.82309L12.9386 9.11539L15.2502 6.80386L15.9579 7.51156L13.6463 9.82309Z"
                                        fill="#2B3467"
                                      />
                                    </svg>
                                  )}
                                </span>
                              </div>
                            </div>
                            <a
                              onClick={() => {
                                setSelected(item.id);
                                authModalHandler()

                              }}
                              className={` border-none ${selected === item.id
                                ? "btn btn-color-primary btn-active-light-primary btn-light br-4"
                                : "btn btn-primary br-4 br-4"
                                }`}
                            >
                              შეძენა
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <animated.div
        className="modal"
        style={animation}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {authModal && <Auth onClose={() => setAuthModal(false)} />}
        </div>
      </animated.div>
    </div>
  );
};

export default Price;
