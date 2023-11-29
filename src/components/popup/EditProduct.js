import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";

import { setProductState, setProducts } from "../../store/slices/productSlice";
import { setCategory } from "../../store/slices/categorySlice";

import notify from "../../utils/notify";

import styles from "./AddProduct.module.css";

const EditProduct = ({
  product,
  projectType,
  setSelect,
  unit,
  suppliers,
  productStatus,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const projectId = router.query.projectId;
  const productId = product?.id;
  const [lossProduct, setLossProduct] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    product?.attributes?.image?.data?.attributes?.url
  );
  const [image, setImage] = useState(product?.attributes?.image?.data?.id);
  const [filteredCrafts, setFilteredCrafts] = useState();
  const [supplierOption, setSupplierOption] = useState(
    product?.attributes?.supplier?.data?.id
  );
  const [unitOption, setUnitOption] = useState(
    product?.attributes?.unit?.data?.id
  );
  const [statusOption, setStatusOption] = useState(
    product?.attributes?.product_status?.data?.id
  );
  const activeCategoryId = useSelector((state) => state?.cats?.category);
  const [productData, setProductData] = useState({
    image: image,
    title: product?.attributes?.title,
    type: "product",
    supplier: {
      connect: [{ id: product?.attributes?.supplier?.data?.id }],
    },
    productLink: product?.attributes?.productLink,
    quantity: product?.attributes?.quantity,
    unit: {
      connect: [{ id: product?.attributes?.unit?.data?.id }],
    },
    price: product?.attributes?.price,
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
      connect: [{ id: product?.attributes?.product_status?.data?.id }],
    },
  });

  useEffect(() => {
    const getCraftsByCategory = async () => {
      await axios
        .get(
          `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/crafts?populate=categories,image&filters[categories][id][$eq]=${activeCategoryId}`
        )
        .then((res) => {
          const data = res.data;
          setFilteredCrafts(data);
        });
    };
    getCraftsByCategory();
  }, []);

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
        .put(
          `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/products/${productId}`,
          {
            data: productData,
          }
        )
        .then((res) => {
          const data = res.data;
          notify(false, "პროდუქტი რედაქტირდა");
          dispatch(setProductState(data.data));
        });
    } catch (err) {
      notify(
        true,
        "პროდუქტის რედაქტირება უარყოფილია, გთხოვთ შეავსოთ ყველა ველი"
      );
      console.log(err);
    }
    setSelect(null);
    defaultProductsHandler(activeCategoryId);
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

  useEffect(() => {
    setProductData((prevProductData) => ({
      ...prevProductData,
      image: image,
    }));
  }, [image]);

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
            <h2>პროდუქტს რედაქტირება</h2>
            <div
              className={`${styles.modalClose}`}
              data-kt-users-modal-action="close"
              onClick={() => {
                setSelect(null);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={35}
                height={35}
                viewBox="0 0 24 24"
                fill="none"
              >
                <rect
                  x={6}
                  y="17.3137"
                  width={16}
                  height={2}
                  rx={1}
                  transform="rotate(-45 6 17.3137)"
                  fill="#EB455F"
                />
                <rect
                  x="7.41422"
                  y={6}
                  width={16}
                  height={2}
                  rx={1}
                  transform="rotate(45 7.41422 6)"
                  fill="#EB455F"
                />
              </svg>
            </div>
          </div>
          <div className="modal-body">
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
                  <span className="svg-icon svg-icon-1tx svg-icon-warning me-4">
                    <div
                      className="image-input image-input-outline"
                      data-kt-image-input="true"
                    >
                      {imgSrc ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_BUILDING_URL}${imgSrc}`}
                          width={125}
                          height={125}
                          style={{ borderRadius: "8px" }}
                          alt="Picture of the product"
                        />
                      ) : (
                        <div className="image-input-wrapper w-125px h-125px"></div>
                      )}
                      <label
                        className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                        data-kt-image-input-action="change"
                        data-bs-toggle="tooltip"
                        title="Change avatar"
                      >
                        <svg
                          width="64"
                          height="64"
                          viewBox="0 0 64 64"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.82997 53.1401L15.05 52.8701C15.5607 52.8576 16.0474 52.6501 16.41 52.2901L49.87 18.8801C51.5615 17.1837 52.5113 14.8858 52.5113 12.4901C52.5113 10.0945 51.5615 7.79656 49.87 6.10012V6.10012C48.1735 4.40861 45.8756 3.45874 43.48 3.45874C41.0843 3.45874 38.7864 4.40861 37.09 6.10012L3.67997 39.5101C3.32002 39.8727 3.11249 40.3593 3.09997 40.8701L2.82997 51.0901C2.8233 51.3569 2.8701 51.6224 2.96762 51.8709C3.06513 52.1193 3.2114 52.3457 3.39778 52.5368C3.58417 52.7278 3.80691 52.8796 4.05288 52.9832C4.29885 53.0869 4.56307 53.1402 4.82997 53.1401V53.1401ZM39.92 8.93012C40.3875 8.46524 40.942 8.097 41.5518 7.84641C42.1616 7.59582 42.8148 7.46781 43.4741 7.46966C44.1334 7.47152 44.7859 7.60322 45.3943 7.85723C46.0027 8.11125 46.5551 8.48262 47.02 8.95012C47.4848 9.41763 47.8531 9.97212 48.1037 10.5819C48.3543 11.1918 48.4823 11.845 48.4804 12.5043C48.4786 13.1636 48.3469 13.816 48.0929 14.4244C47.8388 15.0328 47.4675 15.5852 47 16.0501L44 19.1201L36.85 12.0001L39.92 8.93012ZM7.06997 41.7801L34 14.8301L41.14 22.0001L14.2 48.9001L6.88997 49.0801L7.06997 41.7801Z"
                            fill="black"
                          />
                          <path
                            d="M60 56.54H4C3.46957 56.54 2.96086 56.7508 2.58579 57.1258C2.21071 57.5009 2 58.0096 2 58.54C2 59.0705 2.21071 59.5792 2.58579 59.9543C2.96086 60.3293 3.46957 60.54 4 60.54H60C60.5304 60.54 61.0391 60.3293 61.4142 59.9543C61.7893 59.5792 62 59.0705 62 58.54C62 58.0096 61.7893 57.5009 61.4142 57.1258C61.0391 56.7508 60.5304 56.54 60 56.54Z"
                            fill="black"
                          />
                        </svg>
                        <input
                          onChange={(e) => {
                            handleMediaUpload(e.target.files[0]);
                          }}
                          type="file"
                          name="avatar"
                          accept=".png, .jpg, .jpeg"
                        />
                      </label>
                      <span
                        className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                        data-kt-image-input-action="remove"
                        data-bs-toggle="tooltip"
                        title="Remove avatar"
                        onClick={() => {
                          handleImageRemove();
                        }}
                      >
                        <input type="hidden" name="avatar_remove" />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <rect
                            x="6"
                            y="17.3137"
                            width="16"
                            height="2"
                            rx="1"
                            transform="rotate(-45 6 17.3137)"
                            fill="#EB455F"
                          ></rect>
                          <rect
                            x="7.41422"
                            y="6"
                            width="16"
                            height="2"
                            rx="1"
                            transform="rotate(45 7.41422 6)"
                            fill="#EB455F"
                          ></rect>
                        </svg>
                      </span>
                    </div>
                  </span>
                  <div className="d-flex flex-stack flex-grow-1">
                    <div className="fw-bold">
                      <h4 className="text-gray-900 fw-bolder georgian">
                        სურათი
                      </h4>
                      <div className="fs-6 text-gray-700 georgian">
                        აირჩიეთ სასურველი ფორმატი
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`row mb-5 ${styles.productInputs}`}>
                  <div className="col-md-12 fv-row fv-plugins-icon-container">
                    <label className="required fs-5 fw-bold mb-2 georgian">
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
                      defaultValue={productData.title}
                    />
                    <div className="fv-plugins-message-container invalid-feedback"></div>
                  </div>
                  <div className="col-md-12 fv-row fv-plugins-icon-container">
                    <label className="required fs-5 fw-bold mb-2 georgian">
                      მომწოდებელი
                    </label>
                    <select
                      onChange={(e) => {
                        setSupplierOption(e.target.value);
                        setProductData((prevSendData) => ({
                          ...prevSendData,
                          supplier: {
                            connect: [{ id: e.target.value }],
                          },
                        }));
                      }}
                      name="saler"
                      value={supplierOption}
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
                    <label className=" fs-5 fw-bold mb-2 georgian">
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
                      defaultValue={productData.productLink}
                    />
                    <div className="fv-plugins-message-container invalid-feedback"></div>
                  </div>
                  <div className="col-md-4 fv-row fv-plugins-icon-container">
                    <label className="required fs-5 fw-bold mb-2 georgian">
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
                      defaultValue={productData.quantity}
                    />
                    <div className="fv-plugins-message-container invalid-feedback"></div>
                  </div>
                  <div className="col-md-4 fv-row fv-plugins-icon-container">
                    <label className="required fs-5 fw-bold mb-2 georgian">
                      ერთეული
                    </label>
                    <select
                      onChange={(e) => {
                        setUnitOption(e.target.value);
                        setProductData((prevSendData) => ({
                          ...prevSendData,
                          unit: {
                            connect: [{ id: e.target.value }],
                          },
                        }));
                      }}
                      name="count"
                      defaultValue={unitOption}
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
                        setProductData((prevSendData) => ({
                          ...prevSendData,
                          price: e.target.value,
                        }));
                      }}
                      type="number"
                      className="form-control form-control-solid georgian"
                      placeholder="პროდ: ღირებულება"
                      name="price"
                      defaultValue={productData.price}
                    />
                    <div className="fv-plugins-message-container invalid-feedback"></div>
                  </div>
                  <div className="col-md-12 fv-row fv-plugins-icon-container">
                    <label className="required fs-5 fw-bold mb-2 georgian">
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
                      defaultValue={statusOption}
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
                  className="btn btn-light me-3"
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
                  <span className="indicator-label">რედაქტირება</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;

// bakcup
