import React from "react";

const DeleteBtn = (props) => {
  return (
    <svg
      {...props}
      width="15"
      height="16"
      viewBox="0 0 15 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.11537 16C2.65512 16 2.27083 15.8458 1.9625 15.5375C1.65417 15.2291 1.5 14.8448 1.5 14.3846V1.99996H0.5V0.999963H4.5V0.230713H10.5V0.999963H14.5V1.99996H13.5V14.3846C13.5 14.8448 13.3458 15.2291 13.0375 15.5375C12.7292 15.8458 12.3449 16 11.8846 16H3.11537ZM5.30768 13H6.3077V3.99996H5.30768V13ZM8.6923 13H9.69232V3.99996H8.6923V13Z"
        fill="#EB455F"
      />
    </svg>
  );
};

export default DeleteBtn;
