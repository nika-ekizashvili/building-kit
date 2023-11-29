import React, { useState } from "react";
import MastercardSvg from "../svg/MastercardSvg";

import styles from "../popup/RegModal.module.css";

const PaymentMethod = ({ setEditUserData, title, type, userData }) => {
  const [cardNumberValue, setCardNumberValue] = useState(userData?.card_number);
  const [monthValue, setMonthValue] = useState(userData?.card_month);
  const [yearValue, setYearValue] = useState(userData?.card_year);
  const [inputValue, setInputValue] = useState(userData?.card_cvc);

  const isValidCardNumber = (cardNum) => {
    return cardNum?.length === 16 && /^\d+$/.test(cardNum);
  };

  function formatCardNumber(cardNumber) {
    const numericValue = cardNumber?.replace(/\D/g, "");
    const formattedValue = numericValue?.replace(/(\d{4})(?=\d)/g, "$1 ");

    return formattedValue;
  }

  return (
    <div className={styles.paymentWrapper}>
      <h3 className="mt-2">{title ? title : "Payment Method:"}</h3>
      <label className="mt-2" style={{ fontSize: "18px", fontWeight: "500" }}>
        Card Number
      </label>
      <div style={{ position: "relative" }}>
        <input
          style={{
            borderWidth: "1px",
            borderStyle: "solid",
          }}
          required
          min="0"
          className={`form-control ${styles.noArrow} ${styles.cardNumberInput}`}
          placeholder="Card Number"
          type="text"
          value={formatCardNumber(cardNumberValue) || ""}
          onChange={(e) => {
            let value = e.target.value;
            value = value.replace(/\D/g, "");

            if (value.length <= 16) {
              setCardNumberValue(value);
              setEditUserData((prevSendData) => ({
                ...prevSendData,
                card_number: value,
              }));
            }
          }}
        />
        <MastercardSvg />
      </div>
      <div style={{ display: "flex", gap: "10px", width: "100%" }}>
        <input
          style={{
            width: "40%",
            fontSize: "18px",
          }}
          required
          min="0"
          className={`form-control ${styles.noArrow}`}
          placeholder="CVC"
          type="number"
          value={inputValue || ""}
          onChange={(e) => {
            let value = e.target.value;
            if (/^\d{0,3}$/.test(value)) {
              setInputValue(value);
            }
            setEditUserData((prevSendData) => ({
              ...prevSendData,
              card_cvc: value,
            }));
          }}
        />
        <div
          style={{
            display: "flex",
            gap: "10px",
            width: "60%",
            alignItems: "center",
          }}
        >
          <div
            style={{
              height: "80%",
              width: "4px",
              backgroundColor: "grey",
              transform: "rotate(18deg)",
            }}
          ></div>
          <input
            style={{ fontSize: "18px" }}
            required
            min="0"
            max="12"
            className={`form-control ${styles.noArrow}`}
            placeholder="Month"
            type="number"
            value={monthValue || ""}
            onChange={(e) => {
              let value = e.target.value;
              if (/^\d{0,2}$/.test(value)) {
                setMonthValue(value);
              }
              setEditUserData((prevSendData) => ({
                ...prevSendData,
                card_month: value,
              }));
            }}
          />
          <div
            style={{
              height: "80%",
              width: "4px",
              backgroundColor: "grey",
              transform: "rotate(18deg)",
            }}
          ></div>
          <input
            style={{ fontSize: "18px" }}
            required
            min="5"
            max="99"
            className={`form-control ${styles.noArrow}`}
            placeholder="Year"
            type="number"
            value={yearValue || ""}
            onChange={(e) => {
              let value = e.target.value;
              if (/^\d{0,2}$/.test(value)) {
                setYearValue(value);
              }
              setEditUserData((prevSendData) => ({
                ...prevSendData,
                card_year: value,
              }));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
