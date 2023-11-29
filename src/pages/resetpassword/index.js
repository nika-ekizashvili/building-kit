import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import notify from "../../utils/notify";
import CloseBtn2 from "../../components/svg/CloseBtn2";

import styles from "../../components/popup/AuthModal.module.css";

const RessetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const validatePassword = (password) => {
    const uppercaseRegex = /[A-Z]/;
    return password.length >= 9 && uppercaseRegex.test(password);
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setValidationErrors({
      newPassword: "",
      confirmPassword: "",
    });

    if (!validatePassword(newPassword)) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        newPassword: "პაროლი უნდა შეიცავდეს მინიმუმ 9 სიმბოლოს და ერთ დიდ ასოს",
      }));
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "პაროლები არ ემთხვევა",
      }));
      return;
    }

    function getQueryParam(url, param) {
      const queryParams = new URLSearchParams(new URL(url).search);
      return queryParams.get(param);
    }

    const privateCode = getQueryParam(window.location.href, "code");

    if (privateCode) {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/auth/reset-password`,
          {
            code: privateCode,
            password: newPassword,
            passwordConfirmation: confirmPassword,
          }
        )
        .then(() => {
          notify(false, "თქვენი პაროლი შეიცვალა");
          window.location.replace("/");
        })
        .catch((error) => {
          console.log("An error occurred:", error.response);
          notify(true, "პაროლი არ შეიცვალა");
        });
    } else {
      console.log("Private code not found in the URL.");
    }
  };

  return (
    <div className={`${styles.container}`}>
      <Link href="/">
        <CloseBtn2
          style={{ top: "20px", right: "20px", position: "absolute" }}
          className={styles.closeBtn}
        />
      </Link>
      <div className="row">
        <div className="d-grid gap-2">
          <div style={{ position: "relative" }}>
            <label className="blue mt-2 fx">შეიყვანეთ ახალი პაროლი</label>
            <input
              autoComplete="current-password"
              id="newPassword"
              className="form-control"
              placeholder="******"
              type={!showPassword ? "password" : "text"}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setValidationErrors((prevErrors) => ({
                  ...prevErrors,
                  newPassword: "",
                }));
              }}
              style={{
                borderColor: validationErrors.newPassword
                  ? "red"
                  : validationErrors.newPassword === false
                  ? "green"
                  : "",
              }}
            />
            {validationErrors.newPassword && (
              <p style={{ color: "red" }}>{validationErrors.newPassword}</p>
            )}
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
              {!showPassword ? "show" : "hide"}
            </span>
          </div>
          <label className="blue mt-2 fx">დაადასტურეთ ახალი პაროლი</label>
          <input
            autoComplete="current-password"
            id="confirmPassword"
            className="form-control"
            placeholder="******"
            type={!showPassword ? "password" : "text"}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setValidationErrors((prevErrors) => ({
                ...prevErrors,
                confirmPassword: "",
              }));
            }}
            style={{
              borderColor: validationErrors.confirmPassword
                ? "red"
                : validationErrors.confirmPassword === false
                ? "green"
                : "",
            }}
          />
          {validationErrors.confirmPassword && (
            <p style={{ color: "red" }}>{validationErrors.confirmPassword}</p>
          )}
        </div>
      </div>
      <div className="row">
        <div className="d-grid gap-2 mt-2">
          <button
            className={` btn btn-success georgian ${styles.btn}`}
            type="button"
            onClick={handleResetPassword}
          >
            გაგზავნა
          </button>
        </div>
      </div>
    </div>
  );
};

export default RessetPassword;
