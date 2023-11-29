import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import {
  setAuthAccessToken,
  setAuthEmail,
  setAuthUserId,
  setProvider,
  setAuthRole,
} from "../store/slices/authSlice";
import axios from "axios";

import { setAuthState } from "../store/slices/authSlice";
import Heading from "../components/main/Heading";
import HowItWorks from "../components/main/HowItWorks";
import OurTeam from "../components/main/OurTeam";
import Price from "../components/main/Price";
import Faq from "../components/main/Faq";
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [faqData, setFaqData] = useState(null);
  const [pricesData, setPricesData] = useState(null);
  

  const { data: session } = useSession();
  const authUserId = useSelector((state) => state.auth.user_id);

  const loggedIn = useSelector(setAuthState);
  const log = loggedIn.payload.auth.loggedIn;

  const getFaqData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/FAQs`
      );
      const data = response.data;
      setFaqData(data?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getPricesData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/payment-plans`
      );
      const data = response.data;
      setPricesData(data?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let url;

    const loggedUserInfo = async (url) => {
      await axios.get(url).then((res) => {
        const user = res.data[0];

        if (user) {
          localStorage.setItem("email", user?.email);
          localStorage.setItem("userId", user?.id);

          dispatch(setAuthUserId(user?.id));
          dispatch(setAuthEmail(user?.email));
          dispatch(setAuthRole(user?.role));
          router.push("/");
        }
      });
    };

    if (session?.user) {
      url = `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/users?filters[email]=${session?.user.email}&populate=*`;
      dispatch(setAuthUserId(session?.id));
      dispatch(setProvider("google"));
      dispatch(setAuthAccessToken(session?.jwt));
    } else {
      url = `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/users?filters[id]=${authUserId}&populate=*`;
      dispatch(setAuthUserId(authUserId));
      dispatch(setProvider("locale"));
    }

    loggedUserInfo(url);
  }, [session]);

  useEffect(() => {
    getFaqData();
    getPricesData();
    AOS.init();
    AOS.refresh();
  }, []);

  return (
    <div
      id="kt_body"
      data-bs-spy="scroll"
      data-bs-target="#kt_landing_menu"
      data-bs-offset={200}
      className="bg-white position-relative"
    >
      <div className="d-flex flex-column flex-root">
        <Heading log={log} />
        <HowItWorks />
        <OurTeam />
        <Price log={log} pricesData={pricesData} />
        <Faq faqData={faqData} />
      </div>
    </div>
  );
};

export default Home;
