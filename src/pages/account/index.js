import { useSelector } from "react-redux";

import Unauthorized from "../401";
import Account from "../../components/account/Account";

const index = () => {
  const isLoggedIn = useSelector((state) => state.auth.loggedIn);

  return isLoggedIn ? <Account /> : <Unauthorized />
};

export default index;
