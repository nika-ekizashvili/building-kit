import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const notify = (isError, msg) => {
  if (isError) {
    toast.error(msg, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 1000,
    });
  } else {
    toast.success(msg, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 1000,
    });
  }
};

export default notify;
