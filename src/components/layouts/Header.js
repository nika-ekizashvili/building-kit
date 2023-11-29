import { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAuthState, setAuthState } from "../../store/slices/authSlice";
import { useSession } from "next-auth/react";

import HeaderLogged from "./HeaderLogged";
import DefaultHeader from "./DefaultHeader";

import styles from "./HeaderLogged.module.css";

function Header() {
  const [header, setHeader] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [animateWarn, setAnimateWarn] = useState(false);

  const [isOpen, setIsOpen] = useState(true);
  const [shouldReopen, setShouldReopen] = useState(false);

  const loggedIn = useSelector(selectAuthState);
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const userStatus = useSelector((state) => state.userStatus);

  const warningHandler = () => {
    setIsOpen(false);
    setShouldReopen(true);
  }

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if ((accessToken && accessToken !== "") || session) {
      dispatch(setAuthState(true));
    } else {
      dispatch(setAuthState(false));
    }
  }, [dispatch, session]);

  useEffect(() => {
    if (loggedIn) {
      setHeader(<HeaderLogged animate={animate} />);
    } else {
      setHeader(<DefaultHeader animate={animate} />);
    }
  }, [loggedIn, session]);

  useEffect(() => {
    setAnimate(true);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setAnimateWarn(true);
    }, 500)
  }, []);

  useEffect(() => {
    if (shouldReopen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setShouldReopen(false);
      }, 3 * 60 * 1000);

      return () => clearTimeout(timer);
    }
  }, [shouldReopen]);

  if (!header) {
    return <div></div>;
  }

  return (
    <>
      {header}
      {loggedIn &&
        Number(userStatus.allowed_projects) - Number(userStatus.all_projects) < 3 && Number(userStatus.allowed_projects) - Number(userStatus.all_projects) != 0 ? (
        <Fragment>
          {isOpen && (
            <div className={`${styles.warningMessage} animateBY ${animateWarn && loggedIn ? 'animate' : ''}`}>
              <div className="container">
                <span className='geo-title'>თქვენი პროექტების დამატების ლიმიტი იწურება, დაგრჩათ{" "}
                  {Number(userStatus.allowed_projects) -
                    Number(userStatus.all_projects)}{" "}
                  პროექტი, გთხოვთ განაახლოთ გადახდის გეგმა !!!
                  <p onClick={warningHandler} className={`${'geo-title'} ${styles.warningMessage_close}`}>გასაგებია.</p>

                </span>

              </div>
            </div>
          )}
        </Fragment>
      ) : loggedIn && Number(userStatus.allowed_projects) - Number(userStatus.all_projects) ==
        0 ? (
        <div>
          {isOpen && (
            <div className={`${styles.warningMessage} animateBY ${animateWarn ? 'animate' : ''}`}>
              <div className={`${"container"} ${styles.warningInner} `}>
                <span className='geo-title'>თქვენი პროექტების დამატების ლიმიტი ამოიწურა, გთხოვთ გაანახლოთ გადახდის გეგმა !!!</span>
                <p onClick={warningHandler} className={`${'geo-title'} ${styles.warningMessage_close}`}>გასაგებია.</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        null
      )}
    </>
  );
}

export default Header;
