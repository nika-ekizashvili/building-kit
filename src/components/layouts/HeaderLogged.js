import { useState, useEffect, useRef } from "react";
import { useSpring, animated } from "react-spring";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { useMobileWidth } from "../../hooks/useMobileWidth";
import { setUserStatus } from "../../store/slices/statusSlice";

import Link from "next/link";

import {
  setAuthAccessToken,
  setAuthEmail,
  setAuthRole,
  setAuthUserId,
  setAuthState,
  selectAuthState,
} from "../../store/slices/authSlice";
import { setSearchValue } from "../../store/slices/projectSlice";

import HeaderPopup from "../popup/HeaderPopup";
import LogOutSvg from "../svg/LogOutSvg";
import ProfileSvg from "../svg/ProfileSvg";
import BuildSvg from "../svg/BuildSvg";
import XSvg from "../svg/XSvg";
import SearchSvg from "../svg/SearchSvg";
import Search2Svg from "../svg/Search2Svg";

import styles from "../layouts/HeaderLogged.module.css";

function HeaderLogged(props) {
  const [userDashboard, setUserDashboard] = useState(null);
  const [hideSearch, setHideSearch] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchType, setSearchType] = useState("");
  const [popup, setPopup] = useState(false);
  const ref = useRef(null);
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const loggedIn = useSelector(selectAuthState);
  const router = useRouter();
  const { asPath } = router;
  const formRef = useRef(null);
  const buttonRef = useRef(null);

  const userStatus = useSelector((state) => state.userStatus);
  const { width } = useMobileWidth();

  const handleSearchChange = async (e) => {
    setSearchType(e.target.value);
    dispatch(setSearchValue(e.target.value));
  };

  useEffect(() => {
    if (userStatus.username) {
      setUserDashboard([
        {
          svg: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <g stroke="#fff" strokeWidth="1.5">
              <circle cx="12" cy="6" r="4"></circle>
              <path
                strokeLinecap="round"
                d="M19.997 18c.003-.164.003-.331.003-.5 0-2.485-3.582-4.5-8-4.5s-8 2.015-8 4.5S4 22 12 22c2.231 0 3.84-.157 5-.437"
              ></path>
            </g>
          </svg>,
          data: userStatus.username,
          list: []
        },
        {
          svg: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <g stroke="#fff" strokeLinecap="round" strokeWidth="1.5">
              <path d="M6.88 18.15v-2.07M12 18.15v-4.14M17.12 18.15v-6.22M17.12 5.85l-.46.54a18.882 18.882 0 01-9.78 6.04"></path>
              <path strokeLinejoin="round" d="M14.19 5.85h2.93v2.92"></path>
              <path
                strokeLinejoin="round"
                d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7z"
              ></path>
            </g>
          </svg>,
          data: userStatus.p_title,
          list: []
        },
        {
          svg: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <g>
              <path
                stroke="#fff"
                strokeLinecap="round"
                strokeWidth="1.5"
                d="M12 17v-6"
              ></path>
              <circle
                cx="1"
                cy="1"
                r="1"
                fill="#fff"
                transform="matrix(1 0 0 -1 11 9)"
              ></circle>
              <path
                stroke="#fff"
                strokeLinecap="round"
                strokeWidth="1.5"
                d="M7 3.338A9.954 9.954 0 0112 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12c0-1.821.487-3.53 1.338-5"
              ></path>
            </g>
          </svg>,
          data: `${userStatus.all_projects} - პროექტი`,
          list: [
            // {
            //   title: 'დაშვებული რაოდენობა',
            //   data: userStatus.allowed_projects
            // },
            // {
            //   title: 'ექსპორტი (pdf, execl)',
            //   data: userStatus.allowed_projects
            // },
            // {
            //   title: 'მედია (ნახაზები, გალერია)',
            //   data: userStatus.allowed_projects
            // },
            // {
            //   title: 'საცდელი ვადა',
            //   data: userStatus.trial_expires
            // }
          ]
        },
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <g>
            <path
              stroke="#fff"
              strokeLinecap="round"
              strokeWidth="1.5"
              d="M12 17v-6"
            ></path>
            <circle
              cx="1"
              cy="1"
              r="1"
              fill="#fff"
              transform="matrix(1 0 0 -1 11 9)"
            ></circle>
            <path
              stroke="#fff"
              strokeLinecap="round"
              strokeWidth="1.5"
              d="M7 3.338A9.954 9.954 0 0112 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12c0-1.821.487-3.53 1.338-5"
            ></path>
          </g>
        </svg>
      ]);
    }
  }, [userStatus]);


  // const animation = useSpring({
  //   opacity: isModalOpen ? 1 : 0,
  // });

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  function openModal() {
    setIsModalOpen(true);
  }

  const handleLogout = () => {
    setTimeout(() => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");

      dispatch(setAuthState(false));
      dispatch(setAuthAccessToken(null));
      dispatch(setAuthUserId(null));
      dispatch(setAuthEmail(null));
      dispatch(setAuthRole(null));
      dispatch(setUserStatus(null));
    }, 300);

    setIsModalOpen(false);
    router.push("/");
  };

  const handleGoogleLogout = async () => {
    setTimeout(() => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");

      dispatch(setAuthState(false));
      dispatch(setAuthAccessToken(null));
      dispatch(setAuthUserId(null));
      dispatch(setAuthEmail(null));
      dispatch(setAuthRole(null));
      dispatch(setUserStatus(null));
    }, 300);

    setIsModalOpen(false);
    await signOut({
      callbackUrl: `${window.location.origin}/`,
    });
  };

  useEffect(() => {
    if (asPath === "/projects") {
      setIsFilterOpen(true);
    } else {
      setIsFilterOpen(false);
    }
  }, [asPath]);

  useEffect(() => {
    if (width > 991) {
      setHideSearch(true);
    }
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        if (buttonRef.current && !buttonRef.current.contains(event.target)) {
          setHideSearch(true);
        }
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [width]);

  return (
    <div
      style={{ zIndex: "11" }}
      id="kt_header"
      className={`header animateTY ${props.animate ? 'animate' : ''}`}
      data-kt-sticky="true"
      data-kt-sticky-name="header"
      data-kt-sticky-offset="{default: '200px', lg: '300px'}"
    >
      <div className="container d-flex flex-grow-1 flex-stack cream-bg">
        <div className="d-flex align-items-center me-5">
          <Link href="/">
            <img
              alt="Logo"
              src="/images/Logo.png"
              className={`${styles.logo}`}
            />
          </Link>
        </div>
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center flex-shrink-0" >
            {isFilterOpen && (
              <div
                id="kt_header_search"
                className={`d-flex align-items-center ${styles.searchWrapper}`}
                data-kt-search-keypress="true"
                data-kt-search-min-length={2}
                data-kt-search-enter="enter"
                data-kt-search-layout="menu"
                data-kt-search-responsive="lg"
                data-kt-menu-trigger="auto"
                data-kt-menu-permanent="true"
                data-kt-menu-placement="bottom-end"
              >
                <div
                  data-kt-search-element="toggle"
                  className="d-flex d-lg-none align-items-center"
                  style={{
                    zIndex: !hideSearch ? "-1" : "9999",
                    transitionDelay: !hideSearch ? "0s" : "0.5s",
                  }}
                >
                  <div className="btn btn-icon btn-color-gray-700 btn-active-color-primary btn-outline btn-outline-secondary w-30px h-30px">
                    <div
                      onClick={() => setHideSearch(false)}
                      ref={buttonRef}
                      className="svg-icon svg-icon-2"
                      style={{ padding: "5px" }}
                    >
                      <Search2Svg />
                    </div>
                  </div>
                </div>
                <form
                  data-kt-search-element="form"
                  className={`bg-white d-lg-block w-100 mb-lg-0 position-relative ${hideSearch ? `${styles.hideSearch}` : `${styles.showSearch}`
                    }`}
                  autoComplete="off"
                  ref={formRef}
                >
                  <input type="hidden" />
                  <span className="svg-icon svg-icon-2 svg-icon-gray-700 position-absolute top-50 translate-middle-y ms-4">
                    <SearchSvg className={styles.search} />
                  </span>
                  <input
                    type="text"
                    className="form-control bg-transparent ps-13 fs-7 h-40px"
                    name="search"
                    placeholder="ძიება"
                    data-kt-search-element="search"
                    value={searchType}
                    onChange={(e) => handleSearchChange(e)}
                  />
                  <span
                    className="position-absolute top-50 end-0 translate-middle-y lh-0 d-none me-5"
                    data-kt-search-element="spinner"
                  >
                    <span className="spinner-border h-15px w-15px align-middle text-gray-400" />
                  </span>
                  <span
                    className="btn btn-flush btn-active-color-primary position-absolute top-50 end-0 translate-middle-y lh-0 d-none me-4"
                    data-kt-search-element="clear"
                  >
                    <span className="svg-icon svg-icon-2 svg-icon-lg-1 me-0">
                      <XSvg />
                    </span>
                  </span>
                </form>
              </div>
            )}
            <div>
              <Link
                className={`${styles.headerBtn}`}
                href="/projects"
              >
                <span className="svg-icon-1">
                  <BuildSvg />
                </span>
              </Link>
            </div>
            {popup && (
              <div className={styles.popup}>
                <HeaderPopup />
              </div>
            )}
            <div className={` `} style={{ position: 'relative' }}>
              <div
                onClick={openModal}
                className={`${styles.headerBtn} ${isModalOpen ? styles.activeBg : ""
                  }`}
                data-kt-menu-trigger="click"
                data-kt-menu-attach="parent"
                data-kt-menu-placement="bottom-end"
              >
                <span className="svg-icon-1">
                  <ProfileSvg />
                </span>
                {isModalOpen && (
                  <div ref={ref} className={`${styles.modalWindow}`}>
                    <div className={styles.modal_dashboard}>
                      {userDashboard &&
                        userDashboard.map((item, index) => {
                          return (
                            <div key={index} className={styles.dashboard_item}>
                              <span className={styles.dashboard_tootlip_outer}>
                                {item.svg}
                                {item?.list?.length && item.list.length > 0 ? (
                                  item.list.map((l, index) => {
                                    return (
                                      <span key={index} className={styles.dashboard_tootlip}>
                                        <span className={`${"geo-title"} ${styles.wTitle}`}>{l.title}</span>
                                        <span className={`${"geo-title"} ${styles.wTitle}`}>{l.data}</span>
                                      </span>
                                    )
                                  })
                                ) : (
                                  ""
                                )}
                              </span>
                              <span className={`${"geo-title"} ${styles.wTitle}`}>
                                {item.data}
                              </span>
                            </div>
                          )
                        })

                      }
                    </div>
                    <Link
                      href="/account"
                      className={`${styles.modalWindowBtn} geo-title`}
                      onClick={() => setIsModalOpen(false)}
                    >
                      პროფილი
                    </Link>
                    <div
                      className={`${styles.modalWindowBtn} geo-title justify-content-between d-flex`}
                      onClick={session ? handleGoogleLogout : handleLogout}
                    >
                      გასვლა
                      <LogOutSvg className={styles.closeBtn} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderLogged;
