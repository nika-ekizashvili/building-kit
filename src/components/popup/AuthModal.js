import { useState } from "react";
import { useDispatch } from "react-redux";
import { signIn } from "next-auth/react";
import axios from "axios";

import {
  setAuthAccessToken,
  setAuthEmail,
  setAuthRole,
  setAuthUserId,
} from "../../store/slices/authSlice";

import notify from "../../utils/notify";

import CloseBtn2 from "../svg/CloseBtn2";
import GoogleSvg from "../svg/GoogleSvg";
import CloseBtnBG from "../svg/CloseBtnBG";

import styles from "../popup/AuthModal.module.css";
import ShowEyeSvg from "../svg/ShowEyeSvg";
import HideEyeSvg from "../svg/HideEyeSvg";

const AuthModal = ({ handleAuthorization, onClose, pricesData }) => {
  const [lossData, setLossData] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotData, setForgotData] = useState({
    email: "",
  });
  const [authData, setAuthData] = useState({
    identifier: "",
    password: "",
  });
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      authData?.identifier?.length === 0 ||
      authData?.password?.length === 0
    ) {
      return setLossData(true);
    }

    await axios
      .post(`${process.env.NEXT_PUBLIC_BUILDING_URL}/api/auth/local`, {
        identifier: authData?.identifier,
        password: authData?.password,
      })
      .then((res) => {
        let data = res.data;
        localStorage.setItem("access_token", data.jwt);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("userId", data.user.id);

        dispatch(setAuthAccessToken(data.jwt));
        dispatch(setAuthEmail(data.user.email));
        dispatch(setAuthRole(data.user.role));
        dispatch(setAuthUserId(data.user.id));

        notify(false, "თქვენ გაიარეთ ავტორიზაცია");
        window.location.reload();
      })
      .catch(() => {
        notify(true, "იმეილი ან პაროლი არასწორია, გთხოვთ ცადოთ თავიდან");
      });
  };

  const forgotPassword = async (event) => {
    event.preventDefault();
    setIsForgot(true);
  };

  const forgotPasswordHandler = async (event) => {
    event.preventDefault();

    if (forgotData?.email?.length === 0) {
      return setLossData(true);
    }

    await axios
      .post(
        `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/auth/forgot-password`,
        forgotData
      )
      .then((response) => {
        const message = `გთხოვთ შეამოწმოთ თქვენი ელ.ფოსტა`;
        notify(false, message);
        setIsForgot(true);
        onClose();
      })
      .catch((error) => {
        if (!error.response.data.message) {
          notify(true, "შეცდომა");
        } else {
          const messages = error.response.data.message[0].messages;

          const list = [];
          messages.map((message, i) => {
            let item = "";
            if (i === 0) item += `<ul>`;

            item += `<li>${message.id}</li>`;

            if (i === messages.length - 1) item += `</ul>`;
            list.push(item);
          });

          notify(true, list);
        }
      });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signIn();
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  return (
    <div className={`${styles.container}`}>
      <form onSubmit={handleSubmit}>
        {!isForgot && (
          <div className="row">
            <div className="d-flex justify-content-between">
              <div className={`row gutter-zero`}>
                <div className="blue geo-title fs-1-5hx">სისტემაში შესვლა</div>
                <div
                  className={`${styles.registrationBtn} ${styles.cursorNone} text-muted `}
                >
                  არ ხარ დარეგისტრირებული?
                </div>
                <div
                  onClick={() => handleAuthorization(false)}
                  className={`${styles.registrationBtn} ${styles.borderBottom} geo-title`}
                >
                  დარეგისტრირდი
                </div>
              </div>
              <CloseBtnBG onClick={onClose} className={styles.closeBtn} />
            </div>
            <div className="d-grid gap-2">
              <label className="blue mt-2 fx geo-title">ელ-ფოსტა</label>
              <input
                style={{
                  borderColor:
                    lossData && authData?.identifier?.length <= 0 ? "red" : "",
                }}
                autoComplete="username"
                id="identifier"
                className="form-control"
                placeholder="youremail@gmail.com"
                type="email"
                onChange={(e) => {
                  setAuthData((prevSendData) => ({
                    ...prevSendData,
                    identifier: e.target.value,
                  }));
                }}
              />
            </div>
            {lossData && authData?.identifier?.length <= 0 && (
              <p style={{ color: "red" }}>გთხოვთ შეიყვანოთ იმეილი</p>
            )}
            <div className="d-grid gap-2" style={{ position: "relative" }}>
              <label className="blue mt-2 fx geo-title">პაროლი</label>
              <input
                style={{
                  borderColor:
                    lossData && authData?.password?.length <= 0 ? "red" : "",
                }}
                autoComplete="current-password"
                id="password"
                className="form-control"
                placeholder="******"
                type={!showPassword ? "password" : "text"}
                onChange={(e) => {
                  setAuthData((prevSendData) => ({
                    ...prevSendData,
                    password: e.target.value,
                  }));
                }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "20px",
                  bottom: "10px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                {!showPassword ? (
                  <ShowEyeSvg />
                ) : (
                  <HideEyeSvg />
                )}
              </span>
            </div>
            {lossData && authData?.password?.length <= 0 && (
              <p style={{ color: "red" }}>გთხოვთ შეიყვანოთ პაროლი</p>
            )}
            <div className="d-grid gap-2">
              <span
                onClick={forgotPassword}
                style={{ paddingTop: "5px", cursor: "pointer" }}
                className={`${styles.registrationBtn} ${styles.borderBottom} geo-title`}
              >
                დაგავიწყდა პაროლი?
              </span>
              <button
                className={`fill-btn btn btn-primary georgian ${styles.btn}`}
                type="submit"
              >
                შესვლა
              </button>
              <button
                className={`m-0 btn red-ghost-btn ${styles.btn}`}
                type="button"
                onClick={handleLogin}
              >
                შესვლა
                <GoogleSvg />
              </button>
            </div>
          </div>
        )}
        {isForgot && (
          <div className="row">
            <div className="d-flex justify-content-between">
              <div>
                <div
                  // onClick={() => handleAuthorization(false)}
                  className={`${styles.registrationBtn} row geo-title `}
                >
                  პაროლის აღდგენა
                </div>
              </div>
              <CloseBtn2 onClick={onClose} className={styles.closeBtn} />
            </div>
            <div className="d-grid gap-2">
              <label className="mt-2 fx geo-title">იმეილი:</label>
              <input
                style={{
                  borderColor:
                    lossData && forgotData?.email?.length <= 0 ? "red" : "",
                }}
                autoComplete="username"
                id="identifier"
                className="form-control"
                placeholder="youremail@gmail.com"
                type="email"
                onChange={(e) => {
                  setForgotData((prevSendData) => ({
                    ...prevSendData,
                    email: e.target.value,
                  }));
                }}
              />
            </div>
            {lossData && forgotData?.email?.length <= 0 && (
              <p className="geo-title" style={{ color: "red" }}>გთხოვთ შეიყვანოთ იმეილი</p>
            )}
            <div className="d-grid gap-2 mt-2">
              <button
                className={` btn btn-success geo-title ${styles.btn}`}
                type="button"
                onClick={forgotPasswordHandler}
              >
                გაგზავნა
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AuthModal;