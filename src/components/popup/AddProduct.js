import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";

import { setProductState, setProducts } from "../../store/slices/productSlice";
import { setCategory } from "../../store/slices/categorySlice";
import notify from "../../utils/notify";
import XredSvg from "../svg/XredSvg";

import styles from "./AddProduct.module.css";

const AddProduct = ({
  projectType,
  buildCrafts,
  projectCategory,
  setSelect,
  unit,
  suppliers,
  craftStatus,
  productStatus,
  getProjectById,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const projectId = router.query.projectId;
  const activeCategoryId = useSelector((state) => state.cats.category);
  const [lossProduct, setLossProduct] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [imgSrc, setImgSrc] = useState(null);
  const [image, setImage] = useState(null);
  const [filteredCrafts, setFilteredCrafts] = useState();
  const [craftImage, setCraftImage] = useState();
  const [categoryName, setCategoryName] = useState(null);

  const [productData, setProductData] = useState({
    image: image,
    title: "",
    type: "product",
    supplier: {
      connect: [{ id: null }],
    },
    productLink: "",
    quantity: 0,
    unit: {
      connect: [{ id: null }],
    },
    price: 0,
    categories: {
      connect: projectType === 'repair' ? [{ id: activeCategoryId }] : [],
    },
    category_builds: {
      connect: projectType === 'build' ? [{ id: activeCategoryId }] : [],
    },
    project: {
      connect: [{ id: projectId }],
    },
    product_status: {
      connect: [{ id: null }],
    },
  });

  const [craftData, setCraftData] = useState({
    title: "",
    type: "service",
    quantity: 0,
    unit: {
      connect: [{ id: null }],
    },
    price: 0,
    categories: {
      connect: projectType === 'repair' ? [{ id: activeCategoryId }] : [],
    },
    category_builds: {
      connect: projectType === 'build' ? [{ id: activeCategoryId }] : [],
    },
    project: {
      connect: [{ id: projectId }],
    },
    craft_status: {
      connect: [{ id: null }],
    },
    craft_img_url: "",
    custom_craft_name: "",
  });

  const getCategoryName = () => {
    let category_name = projectCategory.find((item) => item.id === activeCategoryId);
    setCategoryName(category_name.attributes.title);
  };

  const defaultProductsHandler = async (id) => {
    try {
      if (projectType === 'repair') {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/products?populate=*&filters[project][id]=${projectId}&filters[categories][id]=${id}`
        );
        const data = response.data;
        dispatch(setProducts(data.data));
        dispatch(setCategory(id));
      } else {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/products?populate=*&filters[project][id]=${projectId}&filters[category_builds][id]=${id}`
        );
        const data = response.data;
        dispatch(setProducts(data.data));
        dispatch(setCategory(id));
      }

    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios
        .post(`${process.env.NEXT_PUBLIC_BUILDING_URL}/api/products`, {
          data: productData,
        })
        .then((res) => {
          const data = res.data;
          notify(false, "პროდუქტი დაემატა");
          dispatch(setProductState(data.data));
          getProjectById();
        });
    } catch (err) {
      notify(true, "პროდუქტის დამატება უარყოფილია, გთხოვთ შეავსოთ ყველა ველი");
      console.log(err);
    }
    defaultProductsHandler(activeCategoryId);
    setSelect(null);
  };

  const handleCraftSubmit = async () => {
    try {
      await axios
        .post(`${process.env.NEXT_PUBLIC_BUILDING_URL}/api/products`, {
          data: craftData,
        })
        .then((res) => {
          const data = res.data;
          notify(false, "სამუშაო დაემატა");
          dispatch(setProductState(data.data));
          getProjectById();
        });
    } catch (err) {
      notify(true, "ხელობის დამატება უარყოფილია, გთხოვთ შეავსოთ ყველა ველი");
      console.log(err);
    }
    defaultProductsHandler(activeCategoryId);
    setSelect(null);
  };

  const handleMediaUpload = async (img) => {
    if (!img) {
      return;
    }

    const formData = new FormData();
    formData.append("files", img);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = res.data;
      setImage(data[0]);
      setImgSrc(data[0].url);

      notify(false, "არჩეული სურათი წარმატებით აიტვირთა");
    } catch (err) {
      console.error(err);
      notify(true, "სურათის ატვირთვა უარყოფილია");
    }
  };

  const handleImageRemove = async () => {
    if (image) {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/upload/files/${image?.id}`
      );
      setImgSrc(null);
      notify(false, "სურათი წარმატებით წაიშალა");
    } else {
      notify(true, "სურათი არ არის ატვირთული");
    }
  };

  useEffect(() => {
    setProductData((prevProductData) => ({
      ...prevProductData,
      image: image,
    }));
  }, [image]);

  useEffect(() => {
    const getCraftsByCategory = async () => {
      if (projectType === 'repair') {
        await axios
          .get(
            `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/crafts?populate=categories,image&filters[categories][id][$eq]=${activeCategoryId}`
          )
          .then((res) => {
            const data = res.data;
            setFilteredCrafts(data);
          });
      } else {
        await axios
          .get(
            `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/craft-images-builds?populate=category_builds,image&filters[category_builds][id][$eq]=${activeCategoryId}`
          )
          .then((res) => {
            const data = res.data;
            setFilteredCrafts(data);
          });
      }
    };

    getCategoryName()
    getCraftsByCategory();
  }, []);

  return (
    <div
      style={{ display: "block", paddingLeft: "0px" }}
      className={`modal fade show ${styles.addProductModal}`}
      role="dialig"
      tabIndex={-1}
      aria-hidden="true"
    >
      <div className={`modal-dialog modal-dialog-centered mw-650px`}>
        <div className="modal-content" style={{ borderRadius: "4px" }}>
          <div className="modal-header" id="kt_modal_add_user_header">
            <h2 className="geo-title">{
              toggle ? "დაამატე პროდუქტი" : "დაამატე სამუშაო"

            }
              <p className={styles.category_name}>({categoryName})</p>

            </h2>
            <div
              className={`${styles.modalClose}`}
              data-kt-users-modal-action="close"
              onClick={() => {
                setSelect(null);
              }}
            >
              <XredSvg />
            </div>
          </div>
          <div className="modal-body">
            <div className={styles.productMode}>
              <div
                onClick={() => setToggle(true)}
                className={`fw-bolder geo-title ${toggle ? styles.active : ""} `}
              >
                პროდუქტი
              </div>
              <div
                onClick={() => setToggle(false)}
                className={`fw-bolder geo-title ${!toggle ? styles.active : ""}`}
              >
                სამუშაო
              </div>
            </div>
            {toggle ? (
              <form id="kt_modal_add_user_form" className="form">
                <div
                  className="d-flex"
                  id="kt_modal_add_user_scroll"
                  data-kt-scroll="true"
                  data-kt-scroll-activate="{default: false, lg: true}"
                  data-kt-scroll-max-height="auto"
                  data-kt-scroll-dependencies="#kt_modal_add_user_header"
                  data-kt-scroll-wrappers="#kt_modal_add_user_scroll"
                  data-kt-scroll-offset="300px"
                >
                  <div
                    className={`profile-picture ${styles.addProductPic}`}
                  >
                    {imgSrc ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_BUILDING_URL}${imgSrc}`}
                        alt="Picture of the product"
                      />
                    ) : (
                      <img
                        src={`https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png`}
                        alt="Picture of the product"
                      />
                    )}
                    <div className="profile-picture-btns">
                      <div>
                        <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.0495 1.99999L3.2078 9.24165C2.94947 9.51665 2.69947 10.0583 2.64947 10.4333L2.34114 13.1333C2.2328 14.1083 2.9328 14.775 3.89947 14.6083L6.5828 14.15C6.9578 14.0833 7.4828 13.8083 7.74114 13.525L14.5828 6.28332C15.7661 5.03332 16.2995 3.60832 14.4578 1.86665C12.6245 0.141654 11.2328 0.749987 10.0495 1.99999Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M8.9082 3.20831C9.08291 4.32569 9.62371 5.35342 10.4457 6.13019C11.2677 6.90695 12.3244 7.38875 13.4499 7.49998" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M1.5 17.3333H16.5" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <input
                          onChange={(e) => {
                            handleMediaUpload(e.target.files[0]);
                          }}
                          type="file"
                          name="avatar"
                          accept=".png, .jpg, .jpeg"
                        />
                      </div>
                      <div
                        onClick={() => {
                          handleImageRemove();
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M4.13815 4.19472C5.80861 4.02602 7.47927 3.94165 9.15005 3.94165C11.9545 3.94165 14.7668 4.08439 17.5617 4.36136C17.9052 4.3954 18.156 4.70146 18.122 5.04495C18.088 5.38845 17.7819 5.63931 17.4384 5.60527C14.6833 5.33224 11.9122 5.19165 9.15005 5.19165C7.52113 5.19165 5.89209 5.27392 4.26286 5.43849L4.26103 5.43867L2.56103 5.60533C2.2175 5.63901 1.91171 5.38783 1.87803 5.0443C1.84435 4.70077 2.09553 4.39498 2.43906 4.3613L4.13815 4.19472Z" fill="white" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M7.88374 3.15379L7.70045 4.24517C7.64328 4.58558 7.32098 4.81519 6.98057 4.75802C6.64016 4.70086 6.41055 4.37855 6.46771 4.03814L6.65105 2.94648C6.65425 2.92746 6.65755 2.90755 6.66089 2.88738C6.71827 2.54082 6.80245 2.03238 7.14136 1.64807C7.53641 1.20009 8.13916 1.04166 8.90908 1.04166H11.0924C11.8717 1.04166 12.4738 1.21282 12.8665 1.66536C13.2059 2.05645 13.288 2.5667 13.3428 2.90741C13.3455 2.92399 13.3481 2.94017 13.3506 2.95591L13.5337 4.03737C13.5913 4.37771 13.362 4.7003 13.0217 4.75789C12.6814 4.81549 12.3588 4.58628 12.3012 4.24594L12.1172 3.1589C12.0475 2.73138 12.0034 2.57792 11.9225 2.48462C11.8777 2.43299 11.7215 2.29166 11.0924 2.29166H8.90908C8.27067 2.29166 8.11925 2.42906 8.07889 2.47483C8.00212 2.56188 7.9588 2.70813 7.88374 3.15379Z" fill="white" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M15.748 6.99317C16.0924 7.01541 16.3536 7.31267 16.3314 7.65713L15.7895 16.0522L15.7884 16.0681C15.7664 16.3816 15.7423 16.7264 15.6777 17.0472C15.6107 17.3798 15.4926 17.7309 15.2534 18.0424C14.7524 18.6946 13.8998 18.9585 12.6744 18.9585H7.32437C6.0989 18.9585 5.24635 18.6946 4.74537 18.0424C4.50612 17.7309 4.38804 17.3798 4.32105 17.0472C4.25644 16.7264 4.2323 16.3816 4.21034 16.0681L4.20899 16.0488L3.66734 7.65713C3.6451 7.31267 3.90632 7.01541 4.25078 6.99317C4.59524 6.97094 4.89251 7.23215 4.91474 7.57662L5.45618 15.9649C5.45622 15.9654 5.45626 15.966 5.4563 15.9666C5.47982 16.3022 5.49972 16.5684 5.54644 16.8004C5.59195 17.0263 5.65512 17.1747 5.7367 17.281C5.87739 17.4641 6.22484 17.7085 7.32437 17.7085H12.6744C13.7739 17.7085 14.1213 17.4641 14.262 17.281C14.3436 17.1747 14.4068 17.0263 14.4523 16.8004C14.499 16.5684 14.5189 16.3022 14.5424 15.9666C14.5425 15.966 14.5425 15.9654 14.5426 15.9649L15.084 7.57662C15.1062 7.23215 15.4035 6.97094 15.748 6.99317Z" fill="white" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M7.98242 13.7502C7.98242 13.405 8.26224 13.1252 8.60742 13.1252H11.3824C11.7276 13.1252 12.0074 13.405 12.0074 13.7502C12.0074 14.0953 11.7276 14.3752 11.3824 14.3752H8.60742C8.26224 14.3752 7.98242 14.0953 7.98242 13.7502Z" fill="white" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M7.29102 10.4167C7.29102 10.0715 7.57084 9.79166 7.91602 9.79166H12.0827C12.4279 9.79166 12.7077 10.0715 12.7077 10.4167C12.7077 10.7618 12.4279 11.0417 12.0827 11.0417H7.91602C7.57084 11.0417 7.29102 10.7618 7.29102 10.4167Z" fill="white" />
                        </svg>

                      </div>
                    </div>
                  </div>
                  <div className={`row mb-5 ${styles.productInputs}`}>
                    <div className="col-md-12 fv-row fv-plugins-icon-container">
                      <label className="required fs-5 fw-bold mb-2 geo-title">
                        დასახელება
                      </label>
                      <input
                        onChange={(e) => {
                          setProductData((prevSendData) => ({
                            ...prevSendData,
                            title: e.target.value,
                          }));
                        }}
                        type="text"
                        className="form-control form-control-solid georgian"
                        placeholder="პროდუქციის დასახელება"
                        name="title"
                      />
                      <div className="fv-plugins-message-container invalid-feedback"></div>
                    </div>
                    <div className="col-md-12 fv-row fv-plugins-icon-container">
                      <label className="required fs-5 fw-bold mb-2 geo-title">
                        მომწოდებელი
                      </label>
                      <select
                        onChange={(e) => {
                          setProductData((prevSendData) => ({
                            ...prevSendData,
                            supplier: {
                              connect: [{ id: e.target.value }],
                            },
                          }));
                        }}
                        name="saler"
                        defaultValue="none"
                        className="form-select form-select-solid georgian"
                        data-placeholder="მომწოდებელი"
                      >
                        <option value="none" disabled hidden>
                          აირჩიეთ მომწოდებელი
                        </option>
                        {suppliers &&
                          suppliers.map((sup) => {
                            return (
                              <option key={sup?.id} value={sup?.id}>
                                {sup?.attributes?.title}
                              </option>
                            );
                          })}
                      </select>
                      <div className="fv-plugins-message-container invalid-feedback"></div>
                    </div>
                    <div className="col-md-12 fv-row fv-plugins-icon-container">
                      <label className="fs-5 fw-bold mb-2 geo-title">
                        ლინკი
                      </label>
                      <input
                        onChange={(e) => {
                          setProductData((prevSendData) => ({
                            ...prevSendData,
                            productLink: e.target.value,
                          }));
                        }}
                        type="text"
                        className="form-control form-control-solid georgian"
                        placeholder="http://momwodebeli.ge"
                        name="prodactElAddress"
                      />
                      <div className="fv-plugins-message-container invalid-feedback"></div>
                    </div>
                    <div className="col-md-4 fv-row fv-plugins-icon-container">
                      <label className="required fs-5 fw-bold mb-2 geo-title">
                        რაოდენობა
                      </label>
                      <input
                        onWheel={(e) => e.target.blur()}
                        onChange={(e) => {
                          setProductData((prevSendData) => ({
                            ...prevSendData,
                            quantity: e.target.value,
                          }));
                        }}
                        type="number"
                        className="form-control form-control-solid georgian"
                        placeholder="პრო: რაოდენობა"
                        name="quantity"
                      />
                      <div className="fv-plugins-message-container invalid-feedback"></div>
                    </div>
                    <div className="col-md-4 fv-row fv-plugins-icon-container">
                      <label className="required fs-5 fw-bold mb-2 geo-title">
                        ერთეული
                      </label>
                      <select
                        onChange={(e) => {
                          setProductData((prevSendData) => ({
                            ...prevSendData,
                            unit: {
                              connect: [{ id: e.target.value }],
                            },
                          }));
                        }}
                        name="count"
                        defaultValue="none"
                        className="form-select form-select-solid georgian"
                        data-placeholder="საზომიერთ."
                      >
                        <option value="none" disabled hidden>
                          აირჩიეთ ერთეული
                        </option>
                        {unit &&
                          unit.map((u) => {
                            return (
                              <option key={u?.id} value={u?.id}>
                                {u?.attributes?.title}
                              </option>
                            );
                          })}
                      </select>
                      <div className="fv-plugins-message-container invalid-feedback"></div>
                    </div>
                    <div className="col-md-4 fv-row fv-plugins-icon-container">
                      <label className="required fs-5 fw-bold mb-2 geo-title">
                        ღირეულება
                      </label>
                      <input
                        onWheel={(e) => e.target.blur()}
                        onChange={(e) => {
                          setProductData((prevSendData) => ({
                            ...prevSendData,
                            price: e.target.value,
                          }));
                        }}
                        type="number"
                        className="form-control form-control-solid georgian"
                        placeholder="პროდ: ღირებულება"
                        name="price"
                      />
                      <div className="fv-plugins-message-container invalid-feedback"></div>
                    </div>
                    <div className="col-md-12 fv-row fv-plugins-icon-container">
                      <label className="required fs-5 fw-bold mb-2 geo-title">
                        სტატუსი
                      </label>
                      <select
                        onChange={(e) => {
                          setProductData((prevSendData) => ({
                            ...prevSendData,
                            product_status: {
                              connect: [{ id: e.target.value }],
                            },
                          }));
                        }}
                        name="count"
                        defaultValue="none"
                        className="form-select form-select-solid georgian"
                        data-placeholder="საზომიერთ."
                      >
                        <option value="none" disabled hidden>
                          აირჩიეთ სტატუსი
                        </option>
                        {productStatus &&
                          productStatus.map((status) => {
                            return (
                              <option key={status?.id} value={status?.id}>
                                {status?.attributes?.title}
                              </option>
                            );
                          })}
                      </select>
                      <div className="fv-plugins-message-container invalid-feedback"></div>
                    </div>
                  </div>
                </div>
                {lossProduct && (
                  <p style={{ color: "red" }}>შეავსეთ ყველა (*) ველი!!!</p>
                )}
                <div className="text-center">
                  <button
                    onClick={() => {
                      setSelect(null);
                    }}
                    type="reset"
                    className="btn btn-light me-3 geo-title"
                    data-kt-users-modal-action="cancel"
                  >
                    გაუქმება
                  </button>
                  <div
                    onClick={handleSubmit}
                    type="submit"
                    className="btn btn-primary"
                    data-kt-users-modal-action="submit"
                  >
                    <span className="indicator-label geo-title">დაამატე</span>
                  </div>
                </div>
              </form>
            ) : (
              <form id="kt_modal_add_user_form" className="form">
                <div
                  className="d-flex flex-column"
                  id="kt_modal_add_user_scroll"
                  data-kt-scroll="true"
                  data-kt-scroll-activate="{default: false, lg: true}"
                  data-kt-scroll-max-height="auto"
                  data-kt-scroll-dependencies="#kt_modal_add_user_header"
                  data-kt-scroll-wrappers="#kt_modal_add_user_scroll"
                  data-kt-scroll-offset="300px"
                >
                  <div
                    className={`notice d-flex rounded mb-9 p-6 ${styles.pictureContainer}`}
                  >
                    <div className="d-flex flex-stack flex-grow-1">
                      <img
                        src={`${process.env.NEXT_PUBLIC_BUILDING_URL}${craftImage}`}
                        onError={(e) => {
                          e.target.src = "/images/test-img.png";
                        }}
                        width={125}
                        height={125}
                        style={{ borderRadius: "8px" }}
                        alt="Picture of the product"
                      />
                    </div>
                  </div>
                  <div className={`row mb-5 ${styles.productInputs}`}>
                    <div className="w-100">
                      <label className="required fs-5 fw-bold mb-2 georgian">
                        დასახელება
                      </label>
                      <select
                        onChange={(e) => {
                          const filteredArray = filteredCrafts?.data.filter(
                            (obj) => obj?.attributes?.title === e.target.value
                          );
                          setCraftImage(
                            filteredArray[0]?.attributes?.image?.data?.attributes
                              ?.url
                          );
                          setCraftData((prevSendData) => ({
                            ...prevSendData,
                            title: e.target.value,
                            craft_img_url:
                              filteredArray[0]?.attributes?.image?.data?.attributes
                                ?.url,
                          }));
                        }}
                        name="count"
                        defaultValue="none"
                        className="form-select form-select-solid georgian"
                        data-placeholder="დასახელება"
                      >
                        <option value="none" disabled hidden>
                          {" "}
                          აირჩიეთ დასახელება
                        </option>
                        {filteredCrafts &&
                          filteredCrafts?.data.map((item, index) => {
                            return (
                              <option
                                key={item?.id + index}
                                value={item?.attributes?.title}
                              >
                                {item?.attributes?.title}
                              </option>
                            );
                          })}
                        <option value='other'>სხვა</option>
                      </select>
                      {craftData.title === 'other' && (
                        <div className="mt-2">
                          <input
                            onWheel={(e) => e.target.blur()}
                            onChange={(e) => {
                              setCraftData((prevSendData) => ({
                                ...prevSendData,
                                custom_craft_name: e.target.value,
                              }));
                            }}
                            type="text"
                            className="form-control form-control-solid georgian"
                            placeholder="გთხოვთ ხელით შეიყვანოთ დასახელება"
                            name="title"
                          />
                          <div className="fv-plugins-message-container invalid-feedback"></div>
                        </div>
                      )}
                    </div>

                    <div className="col-md-4 fv-row fv-plugins-icon-container">
                      <label className="required fs-5 fw-bold mb-2 georgian">
                        რაოდენობა
                      </label>
                      <input
                        onWheel={(e) => e.target.blur()}
                        onChange={(e) => {
                          setCraftData((prevSendData) => ({
                            ...prevSendData,
                            quantity: e.target.value,
                          }));
                        }}
                        type="number"
                        className="form-control form-control-solid georgian"
                        placeholder="პრო: რაოდენობა"
                        name="quantity"
                      />
                      <div className="fv-plugins-message-container invalid-feedback"></div>
                    </div>
                    <div className="col-md-4 fv-row fv-plugins-icon-container">
                      <label className="required fs-5 fw-bold mb-2 georgian">
                        ერთეული
                      </label>
                      <select
                        onChange={(e) => {
                          setCraftData((prevSendData) => ({
                            ...prevSendData,
                            unit: {
                              connect: [{ id: e.target.value }],
                            },
                          }));
                        }}
                        name="count"
                        defaultValue="none"
                        className="form-select form-select-solid georgian"
                        data-placeholder="საზომიერთ."
                      >
                        <option value="none" disabled hidden>
                          აირჩიეთ ერთეული
                        </option>
                        {unit &&
                          unit.map((u) => {
                            return (
                              <option key={u?.id} value={u?.id}>
                                {u?.attributes?.title}
                              </option>
                            );
                          })}
                      </select>
                      <div className="fv-plugins-message-container invalid-feedback"></div>
                    </div>
                    <div className="col-md-4 fv-row fv-plugins-icon-container">
                      <label className="required fs-5 fw-bold mb-2 georgian">
                        ღირეულება
                      </label>
                      <input
                        onWheel={(e) => e.target.blur()}
                        onChange={(e) => {
                          setCraftData((prevSendData) => ({
                            ...prevSendData,
                            price: e.target.value,
                          }));
                        }}
                        type="number"
                        className="form-control form-control-solid georgian"
                        placeholder="პროდ: ღირებულება"
                        name="price"
                      />
                      <div className="fv-plugins-message-container invalid-feedback"></div>
                    </div>
                    <div className="w-100 col-md-4 fv-row fv-plugins-icon-container">
                      <label className="required fs-5 fw-bold mb-2 georgian">
                        სტატუსი
                      </label>
                      <select
                        onChange={(e) => {
                          setCraftData((prevSendData) => ({
                            ...prevSendData,
                            craft_status: {
                              connect: [{ id: e.target.value }],
                            },
                          }));
                        }}
                        name="count"
                        defaultValue={""}
                        className="form-select form-select-solid georgian"
                        data-placeholder="დასახელება"
                      >
                        <option value="none" disabled hidden>
                          {" "}
                          აირჩიეთ სტატუსი
                        </option>
                        ;
                        {craftStatus &&
                          craftStatus?.map((item, index) => {
                            return (
                              <option key={item?.id + index} value={item?.id}>
                                {item?.attributes?.title}
                              </option>
                            );
                          })}
                      </select>
                      <div className="fv-plugins-message-container invalid-feedback"></div>
                    </div>
                  </div>
                </div>
                {lossProduct && (
                  <p style={{ color: "red" }}>შეავსეთ ყველა (*) ველი!!!</p>
                )}
                <div className="text-center">
                  <button
                    onClick={() => {
                      setSelect(null);
                    }}
                    type="reset"
                    className="btn btn-light me-3"
                    data-kt-users-modal-action="cancel"
                  >
                    გაუქმება
                  </button>
                  <div
                    onClick={handleCraftSubmit}
                    type="submit"
                    className="btn btn-primary"
                    data-kt-users-modal-action="submit"
                  >
                    <span className="indicator-label">დაამატე</span>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
