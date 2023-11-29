import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import axios from "axios";

import notify from "../../utils/notify";
import styles from "./Modal.module.css";

const AddProject = ({
  cities,
  buildCategories,
  propertyType,
  condition,
  categories,
  currentCondition,
  dismiss,
  setShowProject,
  setAddProject
}) => {
  const userId = useSelector((state) => state.auth.user_id);
  const { data: session } = useSession();
  const sessionUserId = session?.id;

  const [step, setStep] = useState(1);
  const [loss, setLoss] = useState(false);
  const [close, setClose] = useState(false);
  const [backBtn, setBackBtn] = useState(false);

  const [sendData, setSendData] = useState({
    project_type: "",
    title: "",
    address: "",
    phoneNumber: "",
    area: "",
    vat: false,
    vatPercent: "",
    unforeseenExpenses: "",
    city: {
      connect: [{ id: null }],
    },
    property_type: {
      connect: [{ id: null }],
    },
    categories: {
      connect: [],
      disconnect: [],
    },
    category_builds: {
      connect: [],
      disconnect: []
    },
    current_condition: {
      connect: [{ id: null }],
    },
    condition: {
      connect: [{ id: null }],
    },
    service_percentage: "",
    users_permissions_user: {
      connect: [{ id: userId || sessionUserId }],
    },
  });

  let errors = {
    stepOne: [],
    stepTwo: [],
    stepThree: [],
  };

  const getStatusClass = (stepIndex) => {
    if (stepIndex < step) {
      return "completed";
    } else if (stepIndex === step) {
      return "current";
    } else {
      return "pending";
    }
  };

  const getStatusClassName = (stepIndex) => {
    if (stepIndex < step) {
      return "custom-completed";
    } else if (stepIndex === step) {
      return "custom-current";
    } else {
      return "custom-pending";
    }
  };

  const stepChangeHandler = () => {
    if (
      step === 1 &&
      errors.stepOne.length === 0 &&
      sendData.address &&
      sendData.area &&
      sendData.project_type &&
      sendData.city.connect[0].id &&
      sendData.property_type.connect[0].id
    ) {
      setStep(step + 1);
      setLoss(false);
    } else {
      setLoss(true);
    }
    if (
      step === 2 &&
      errors.stepTwo.length === 0 &&
      sendData.condition.connect[0].id &&
      sendData.current_condition.connect[0].id
    ) {
      setStep(step + 1);
      setLoss(false);
    }
    if (
      step === 3 &&
      errors.stepThree.length === 0 &&
      sendData.title &&
      sendData.categories.connect.length || sendData.category_builds.connect.length > 0
    ) {
      setStep(step + 1);
      setLoss(false);
    }
  };

  const prevStepHandler = () => {
    if (step > 1) {
      setBackBtn(true);
      setStep(step - 1);
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    if (!sendData.categories.connect.some((cat) => cat.id === categoryId)) {
      setSendData((prevState) => ({
        ...prevState,
        categories: {
          connect: [...prevState.categories.connect, { id: categoryId }],
        },
      }));
    }
  };

  const handleBuldCategoryChange = (e) => {
    const categoryId = e.target.value;
    if (!sendData.category_builds.connect.some((cat) => cat.id === categoryId)) {
      setSendData((prevState) => ({
        ...prevState,
        category_builds: {
          connect: [...prevState.category_builds.connect, { id: categoryId }],
        },
      }));
    }
  };

  const createProjectHandler = async () => {
    try {
      await axios
        .post(`${process.env.NEXT_PUBLIC_BUILDING_URL}/api/projects`, {
          data: sendData,
        })
        .then((res) => {
          setShowProject(true);
          notify(false, "პროექტი დაემატა");
        });
    } catch (error) {
      notify(true, "პროექტის დამატება უარყოფილია, გთხოვთ შეავსოთ ყველა ველი");
      console.error(error);
    }
  };

  const finishHandler = () => {
    setClose(true);
    createProjectHandler();
    setAddProject(false);
  };

  return (
    <div style={{ display: close ? "none" : "" }} className={`${styles.modal}`}>
      <div className={styles.overlay}></div>
      <div className={` ${styles.mainBg} modal-content `}>
        <div
          className={`modal-header py-sm-10 px-sm-10 container ${styles.modalHeader}`}
        >
          <h2 className="geo-title">ობიექტის დამატება</h2>
          <div
            className="btn red-ghost-btn"
            // btn-sm btn-icon btn-active-color-primary
            data-bs-dismiss="modal"
            onClick={dismiss}
          >
            <span className="svg-icon-1 geo-title">
              პროცესის შეწყვეტა
              <svg
                className="ms-4"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.4 13.3077L9 9.7077L12.6 13.3077L13.3077 12.6L9.7077 9L13.3077 5.4L12.6 4.6923L9 8.2923L5.4 4.6923L4.6923 5.4L8.2923 9L4.6923 12.6L5.4 13.3077ZM9.00335 18C7.7588 18 6.58872 17.7638 5.4931 17.2915C4.39748 16.8192 3.44444 16.1782 2.63397 15.3685C1.82352 14.5588 1.18192 13.6066 0.70915 12.512C0.236383 11.4174 0 10.2479 0 9.00335C0 7.7588 0.236158 6.58872 0.708475 5.4931C1.18081 4.39748 1.82183 3.44444 2.63153 2.63398C3.44123 1.82353 4.39337 1.18192 5.48795 0.709151C6.58255 0.236384 7.75212 0 8.99665 0C10.2412 0 11.4113 0.236158 12.5069 0.708475C13.6025 1.18081 14.5556 1.82182 15.366 2.63152C16.1765 3.44122 16.8181 4.39337 17.2908 5.48795C17.7636 6.58255 18 7.75212 18 8.99665C18 10.2412 17.7638 11.4113 17.2915 12.5069C16.8192 13.6025 16.1782 14.5556 15.3685 15.366C14.5588 16.1765 13.6066 16.8181 12.512 17.2909C11.4174 17.7636 10.2479 18 9.00335 18Z"
                  fill="#EB455F"
                />
              </svg>
            </span>
          </div>
        </div>
        <div
          className={` modal-body py-sm-10 px-sm-10 container ${styles.scroll}`}
        >
          <div
            className="stepper stepper-pills stepper-column d-flex flex-column d-flef flex-row-fluid"
            id="kt_modal_create_app_stepper"
          >
            <div className="d-flex justify-content-center flex-row-auto w-100">
              <div className={`stepper-nav`}>
                <div
                  className={`${"stepper-item"} ${getStatusClass(1)}`}
                  data-kt-stepper-element="nav"
                >
                  <div className="stepper-icon">
                    <svg
                      className="stepper-check fas fa-check"
                      width="16"
                      height="12"
                      viewBox="0 0 16 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.54997 11.3078L0.58075 6.33855L1.2942 5.6251L5.54997 9.88087L14.7057 0.725098L15.4192 1.43855L5.54997 11.3078Z"
                        fill="white"
                      />
                    </svg>
                    <span className="stepper-number">1</span>
                  </div>
                  <div className="stepper-label">
                    <h3 className="stepper-title georgian">კატეგორია</h3>
                    <div className="stepper-desc georgian">ობიექტის აღწერა</div>
                  </div>
                </div>
                <svg
                  className={` line ${getStatusClassName(1)}`}
                  width="368"
                  height="1"
                  viewBox="0 0 368 1"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="4.37114e-08"
                    y1="0.5"
                    x2="368"
                    y2="0.500032"
                    stroke="#CFD3EB"
                  />
                </svg>
                <div
                  className={`${"stepper-item"} ${getStatusClass(2)}`}
                  data-kt-stepper-element="nav"
                >
                  <div className="stepper-icon">
                    <svg
                      className="stepper-check fas fa-check"
                      width="16"
                      height="12"
                      viewBox="0 0 16 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.54997 11.3078L0.58075 6.33855L1.2942 5.6251L5.54997 9.88087L14.7057 0.725098L15.4192 1.43855L5.54997 11.3078Z"
                        fill="white"
                      />
                    </svg>
                    <span className="stepper-number">2</span>
                  </div>
                  <div className="stepper-label">
                    <h3 className="stepper-title georgian">მდგომარეობა</h3>
                    <div className="stepper-desc georgian">
                      სამუშაოს განსაზღვრება
                    </div>
                  </div>
                </div>
                <svg
                  className={` line ${getStatusClassName(2)}`}
                  width="368"
                  height="1"
                  viewBox="0 0 368 1"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="4.37114e-08"
                    y1="0.5"
                    x2="368"
                    y2="0.500032"
                    stroke="#CFD3EB"
                  />
                </svg>
                <div
                  className={`${"stepper-item"} ${getStatusClass(3)}`}
                  data-kt-stepper-element="nav"
                >
                  <div className="stepper-icon">
                    <svg
                      className="stepper-check fas fa-check"
                      width="16"
                      height="12"
                      viewBox="0 0 16 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.54997 11.3078L0.58075 6.33855L1.2942 5.6251L5.54997 9.88087L14.7057 0.725098L15.4192 1.43855L5.54997 11.3078Z"
                        fill="white"
                      />
                    </svg>
                    <span className="stepper-number">3</span>
                  </div>
                  <div className="stepper-label">
                    <h3 className="stepper-title georgian">სამუშაოები</h3>
                    <div className="stepper-desc georgian">
                      შესასრულებელი სამუშაო
                    </div>
                  </div>
                </div>
                <svg
                  className={` line ${getStatusClassName(3)}`}
                  width="368"
                  height="1"
                  viewBox="0 0 368 1"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="4.37114e-08"
                    y1="0.5"
                    x2="368"
                    y2="0.500032"
                    stroke="#CFD3EB"
                  />
                </svg>
                <div
                  className={`${"stepper-item"} ${getStatusClass(4)}`}
                  data-kt-stepper-element="nav"
                >
                  <div className="stepper-icon">
                    <svg
                      className="stepper-check fas fa-check"
                      width="16"
                      height="12"
                      viewBox="0 0 16 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.54997 11.3078L0.58075 6.33855L1.2942 5.6251L5.54997 9.88087L14.7057 0.725098L15.4192 1.43855L5.54997 11.3078Z"
                        fill="white"
                      />
                    </svg>
                    <span className="stepper-number">4</span>
                  </div>
                  <div className="stepper-label">
                    <h3 className="stepper-title">დასრულება</h3>
                    <div className="stepper-desc"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-row-fluid py-lg-5">
              <form className="form needs-validation custom-add-form" noValidate="novalidate">
                <div
                  className={getStatusClass(1)}
                  data-kt-stepper-element="content"
                >
                  <div className="w-100">
                    <div className="fv-row mb-10">
                      <label
                        className="d-flex align-items-center fs-5 fw-bold mb-2 form-label"
                      // htmlFor="validationCustom04"
                      >
                        <span className="required georgian">პროექტის ტიპი</span>
                        <i
                          className="fas fa-exclamation-circle ms-2 fs-7"
                          title="მიუთითეთ პროექტის ტიპი"
                        />
                      </label>
                      <select
                        required
                        // id="property"
                        defaultValue="none"
                        onChange={(event) => {
                          setSendData((prevSendData) => ({
                            ...prevSendData,
                            project_type: event.target.value
                          }));
                        }}
                        className={`${"form-select"} ${"form-select-solid"} ${"georgian"}`}
                      >
                        <option value="none" disabled hidden>
                          აირჩიერ პროექტის ტიპი
                        </option>
                        <option value='build'>
                          სამშენებლო
                        </option>
                        <option value='repair'>
                          სარემონტო
                        </option>
                      </select>
                    </div>
                    <div className="fv-row mb-10">
                      <label
                        className="d-flex align-items-center fs-5 fw-bold mb-2 form-label"
                        htmlFor="validationCustom04"
                      >
                        <span className="required georgian">ქონების ტიპი</span>
                        <i
                          className="fas fa-exclamation-circle ms-2 fs-7"
                          title="მიუთითეთ სამუშაო ობიექტის ტიპი"
                        />
                      </label>
                      <select
                        required
                        id="property"
                        defaultValue="none"
                        onChange={(event) => {
                          setSendData((prevSendData) => ({
                            ...prevSendData,
                            property_type: {
                              connect: [{ id: event.target.value }],
                            },
                          }));
                        }}
                        className={`${"form-select"} ${"form-select-solid"} ${"georgian"}`}
                      >
                        <option value="none" disabled hidden>
                          აირჩიერ ქონების ტიპი
                        </option>
                        {propertyType &&
                          propertyType.map((item, index) => {
                            return (
                              <option key={index} value={item.id}>
                                {item.attributes.title}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                    <div className="row mb-10">
                      <div className="col-md-12 fv-row">
                        <div className="row fv-row">
                          <div className="col-6">
                            <label className="required fs-6 fw-bold form-label georgian mb-2">
                              მდებარეობა
                            </label>
                            <select
                              id="city"
                              defaultValue="none"
                              onChange={(event) => {
                                setSendData((prevSendData) => ({
                                  ...prevSendData,
                                  city: {
                                    connect: [{ id: event.target.value }],
                                  },
                                }));
                              }}
                              name="locale"
                              className="form-select form-select-solid georgian"
                              data-placeholder="მდებარეობა"
                            >
                              <option value="none" disabled hidden>
                                აირჩიეთ ქალაქი
                              </option>
                              {cities &&
                                cities.map((item, index) => {
                                  return (
                                    <option key={index} value={item.id}>
                                      {item.attributes.city}
                                    </option>
                                  );
                                })}
                            </select>
                          </div>
                          <div className="col-6">
                            <label className="required fs-6 fw-bold form-label georgian mb-2">
                              ფართობი (მ²)
                            </label>
                            <input
                              id="area"
                              onChange={(event) => {
                                setSendData((prevSendData) => ({
                                  ...prevSendData,
                                  area: event.target.value,
                                }));
                              }}
                              name="area"
                              type="number"
                              className="custom-input form-control georgian form-control-solid"
                              placeholder="ობიექტის ფართობი"
                              data-placeholder="area"
                            ></input>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-10">
                      <div className="col-md-12 fv-row">
                        <div className="row fv-row">
                          <div className="col-6">
                            <label className="required fs-6 fw-bold form-label georgian mb-2">
                              მისამართი
                            </label>
                            <input
                              id="address"
                              onChange={(event) => {
                                setSendData((prevSendData) => ({
                                  ...prevSendData,
                                  address: event.target.value,
                                }));
                              }}
                              type="text"
                              className="custom-input form-control georgian form-control-solid"
                              placeholder="ზუსტი მისამართი"
                            />
                          </div>
                          <div className="col-6">
                            <label className="fs-6 fw-bold form-label georgian mb-2">
                              ტელეფონი
                            </label>
                            <input
                              id="phone"
                              onChange={(event) => {
                                setSendData((prevSendData) => ({
                                  ...prevSendData,
                                  phoneNumber: event.target.value,
                                }));
                              }}
                              type="number"
                              className="custom-input form-control georgian form-control-solid"
                              placeholder="ტელეფონი"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-100">
                      <div className="row mb-10">
                        <div className={`${styles.inputWrap} col-4 `}>
                          <label className="d-flex align-items-center fs-5 fw-bold mb-2">
                            <span className={` georgian `}>
                              დღგ-ს გადამხდელი (%)
                            </span>
                          </label>
                          <input
                            className="custom-input form-control georgian form-control-solid"
                            placeholder="დღგ-ს გადამხდელი (%)"
                            type="number"
                            onChange={(e) => {
                              setSendData((prevSendData) => ({
                                ...prevSendData,
                                vatPercent: e.target.value,
                              }));
                            }}
                          />
                        </div>
                        <div className={`${styles.inputWrap} col-4 `}>
                          <label className="d-flex align-items-center fs-5 fw-bold mb-2">
                            <span className={` georgian `}>
                              გაუთვალისწინებელი ხარჯები (%)
                            </span>
                          </label>
                          <input
                            onChange={(event) => {
                              setSendData((prevSendData) => ({
                                ...prevSendData,
                                unforeseenExpenses: event.target.value,
                              }));
                            }}
                            type="number"
                            className="custom-input form-control georgian form-control-solid"
                            placeholder="გაუთვალისწინებელი ხარჯები (%)"
                          />
                        </div>
                        <div className={`${styles.inputWrap} col-4 `}>
                          <div
                            style={{ flexDirection: "column" }}
                            className="d-flex"
                          >
                            <label className="d-flex align-items-center fs-5 fw-bold mb-2">
                              <span className={` georgian `}>
                                მომსახურეობის ხარჯები (%)
                              </span>
                            </label>
                            <input
                              className="custom-input form-control georgian form-control-solid"
                              type="number"
                              id="flexSwitchCheckDefault"
                              placeholder="მომსახურების ხარჯები (%)"
                              onChange={(e) => {
                                setSendData((prevSendData) => ({
                                  ...prevSendData,
                                  service_percentage: e.target.value,
                                }));
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={getStatusClass(2)}
                  data-kt-stepper-element="content"
                >
                  <div className="w-100">
                    <div className="fv-row">
                      <div className="fv-row">
                        <label className="d-flex align-items-center fs-5 fw-bold mb-4">
                          <span className="fw-bolder required georgian fs-4">
                            მდგომარეობა
                          </span>
                        </label>
                        {condition &&
                          condition.map((item, index) => {
                            return (
                              <label
                                key={index}
                                className="d-flex mb-5 flex-stack cursor-pointer"
                              >
                                <span className="d-flex align-items-center me-2">
                                  <span className="d-flex flex-column">
                                    <span className="georgian fs-6">
                                      {item.attributes.title}
                                    </span>
                                  </span>
                                </span>
                                <span className="form-check form-check-custom form-check-solid">
                                  <div className={styles.outline}>
                                    <input
                                      id={`radio-${index}`}
                                      onChange={() => {
                                        setSendData((prevSendData) => ({
                                          ...prevSendData,
                                          condition: {
                                            connect: [{ id: item.id }],
                                          },
                                        }));
                                      }}
                                      className="form-check-input"
                                      type="radio"
                                      name="category"
                                      value={item.id}
                                    />
                                  </div>
                                </span>
                              </label>
                            );
                          })}
                      </div>
                    </div>
                    <div className="fv-row">
                      <label className="d-flex align-items-center fs-5 fw-bold mb-4">
                        <span className="fw-bolder required georgian fs-4">
                          არსებული მდგომარეობა
                        </span>
                      </label>
                      {currentCondition &&
                        currentCondition.map((item, index) => {
                          return (
                            <label
                              key={index}
                              className="d-flex flex-stack cursor-pointer mb-5"
                            >
                              <span className="d-flex align-items-center me-2">
                                <span className="d-flex flex-column">
                                  <span className="georgian fs-6">
                                    {item.attributes.title}
                                  </span>
                                  {/* <span className="fs-7 georgian text-muted">
                                  სამუშაოები სრულ რემონტამდე.
                                </span> */}
                                </span>
                              </span>
                              <span className="form-check form-check-custom form-check-solid">
                                <div className={styles.outline}>
                                  <input
                                    id="input-validation"
                                    onChange={(event) => {
                                      setSendData((prevSendData) => ({
                                        ...prevSendData,
                                        current_condition: {
                                          connect: [{ id: event.target.value }],
                                        },
                                      }));
                                    }}
                                    className="form-check-input"
                                    type="radio"
                                    name="framework"
                                    value={item.id}
                                  />
                                </div>
                              </span>
                            </label>
                          );
                        })}
                    </div>
                  </div>
                </div>
                <div
                  className={getStatusClass(3)}
                  data-kt-stepper-element="content"
                >
                  <div className="w-100">
                    <div className="fv-row mb-10">
                      <label className="required fs-5 georgian fw-bold mb-2">
                        ობიექტის დასახელება
                      </label>
                      <input
                        id="input-validation-object"
                        onChange={(event) => {
                          setSendData((prevSendData) => ({
                            ...prevSendData,
                            title: event.target.value,
                          }));
                        }}
                        type="text"
                        className="form-control georgian form-control-lg form-control-solid"
                        name="dbname"
                        placeholder="ობიექტის დასახელება"
                      />
                    </div>

                    <div className="row mb-10">
                      <div className="col-md-12 fv-row">
                        <label className="required fs-6 fw-bold form-label georgian mb-2">
                          შესასრულებელი სამუშაოები
                        </label>
                        <div className="row fv-row">
                          <div className="col-12">
                            {sendData.project_type === 'build' ? (
                              <div className={`${styles.customGap} d-flex`}>
                              {buildCategories &&
                                buildCategories.map((item, index) => {
                                  return (
                                    <div
                                      key={index}
                                      className="form-check form-check-custom form-check-solid mb-2"
                                    >
                                      <div className={styles.outline}>
                                        <input
                                          onChange={handleBuldCategoryChange}
                                          className="form-check-input"
                                          type="checkbox"
                                          value={item.id}
                                        />
                                      </div>
                                      <label
                                        onClick={(e) => e.preventDefault()}
                                        className="form-check-label georgian"
                                      >
                                        {item.attributes.title}
                                      </label>
                                    </div>
                                  );
                                })}
                            </div>
                            ) : (
                              <div className={`${styles.customGap} d-flex`}>
                                {categories &&
                                  categories.map((item, index) => {
                                    return (
                                      <div
                                        key={index}
                                        className="form-check form-check-custom form-check-solid mb-2"
                                      >
                                        <div className={styles.outline}>
                                          <input
                                            onChange={handleCategoryChange}
                                            className="form-check-input"
                                            type="checkbox"
                                            value={item.id}
                                          />
                                        </div>
                                        <label
                                          onClick={(e) => e.preventDefault()}
                                          className="form-check-label georgian"
                                        >
                                          {item.attributes.title}
                                        </label>
                                      </div>
                                    );
                                  })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={getStatusClass(4)}
                  data-kt-stepper-element="content"
                >
                  <div className="w-100 text-center">
                    <h1 className="text-dark mb-3">მონაცემები შეყვანილია!</h1>
                    <div className="text-muted fw-bold fs-3">
                      დამატების ღილაკზე დაჭერით მონაცემები ბაზაში აიტვირთება.
                    </div>
                    <div className="text-center px-4 py-15">
                      <img src="/images/done.png" alt="" className="mh-300px" />
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-stack pt-10">
                  <div>
                    <button
                      style={{ opacity: step === 1 ? "0" : "1" }}
                      onClick={prevStepHandler}
                      type="button"
                      className="btn red-ghost-btn geo-title custom-red-ghost-btn"
                    >
                      <span className="svg-icon-3 me-1">
                        <svg
                          className="me-2"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 12.2885L9.68848 11.6L7.58848 9.5H12.5V8.5H7.58848L9.68848 6.4L9 5.71152L5.71152 9L9 12.2885ZM9.00335 18C7.7588 18 6.58872 17.7638 5.4931 17.2915C4.39748 16.8192 3.44444 16.1782 2.63397 15.3685C1.82352 14.5588 1.18192 13.6066 0.70915 12.512C0.236383 11.4174 0 10.2479 0 9.00335C0 7.7588 0.236158 6.58872 0.708475 5.4931C1.18081 4.39748 1.82183 3.44444 2.63153 2.63398C3.44123 1.82353 4.39337 1.18192 5.48795 0.709151C6.58255 0.236384 7.75212 0 8.99665 0C10.2412 0 11.4113 0.236158 12.5069 0.708475C13.6025 1.18081 14.5556 1.82182 15.366 2.63152C16.1765 3.44122 16.8181 4.39337 17.2908 5.48795C17.7636 6.58255 18 7.75212 18 8.99665C18 10.2412 17.7638 11.4113 17.2915 12.5069C16.8192 13.6025 16.1782 14.5556 15.3685 15.366C14.5588 16.1765 13.6066 16.8181 12.512 17.2909C11.4174 17.7636 10.2479 18 9.00335 18Z"
                            fill="#EB455F"
                          />
                        </svg>
                      </span>
                      უკან დაბრუნება
                    </button>
                  </div>
                  <div>
                    {loss && (
                      <p style={{ color: "red" }}>შეავსეთ ყველა (*) ველი</p>
                    )}
                    <button
                      onClick={finishHandler}
                      style={{ display: step === 4 ? "" : "none" }}
                      type="button"
                      className="btn btn-lg georgian btn-primary-custom"
                    >
                      <span className="indicator-label geo-title">დამატება</span>
                      <span className="indicator-progress geo-title">
                        გთხოვთ დაიცადოთ...
                        <span className="spinner-border spinner-border-sm align-middle ms-2" />
                      </span>
                    </button>
                    <button
                      style={{ display: step >= 4 ? "none" : "" }}
                      onClick={stepChangeHandler}
                      type="button"
                      className="btn btn-lg geo-title btn-primary-custom"
                    >
                      გაგრძელება
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProject;
