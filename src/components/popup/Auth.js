import { useEffect, useState } from "react";
import axios from "axios";
import AuthModal from "./AuthModal";
import RegModal from "./RegModal";

const Auth = ({ onClose }) => {
  const [defaultState, setDefaultState] = useState(true);
  const [pricesData, setPricesData] = useState(null);

  const handleAuthorization = () => {
    setDefaultState(false);
  };

  const handleRegistration = () => {
    setDefaultState(true);
  };

  const getPricesData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BUILDING_URL}/api/payment-plans`);
      const data = response.data;
      setPricesData(data?.data);
    } catch (error) {
      console.error(error);
    }

  };

  useEffect(() => {
    getPricesData();
  }, []);

  return (
    <>
      {defaultState ? (
        <AuthModal
          handleAuthorization={handleAuthorization}
          onClose={onClose}
        />
      ) : (
        <RegModal
          pricesData={pricesData}
          handleRegistration={handleRegistration}
          onClose={onClose}
        />
      )}
    </>
  );
};

export default Auth;
