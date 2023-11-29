import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';

import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setProductState, setProducts } from '../../store/slices/productSlice';
import { setCategory } from "../../store/slices/categorySlice";

import notify from '../../utils/notify';

import styles from "./AddProduct.module.css";

const EditService = ({
  projectType,
  buildCrafts,
  product,
  unit,
  setSelect,
  craftStatus,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const projectId = router.query.projectId;
  const productId = product.id;

  const activeCategoryId = useSelector(state => state.cats.category);

  const [lossProduct, setLossProduct] = useState(false);
  const [filteredCrafts, setFilteredCrafts] = useState();
  const [craftImage, setCraftImage] = useState(product?.attributes?.craft_img_url);
  const [craftTitle, setCraftTitle] = useState();

  const [craftUnit, setCraftUnit] = useState(product?.attributes?.unit?.data?.id);
  const [craftStatusOption, setCraftStatusOption] = useState(product?.attributes?.craft_status?.data?.id);

  const [craftData, setCraftData] = useState({
    title: product?.attributes?.title,
    type: "service",
    quantity: product?.attributes?.quantity,
    unit: {
      connect: [{ id: product?.attributes?.unit?.data?.id }],
    },
    price: product.attributes.price,
    categories: {
      connect: projectType === 'repair' ? [{ id: activeCategoryId }] : [],
    },
    category_builds: {
      connect: projectType === 'build' ? [{ id: activeCategoryId }] : [],
    },
    project: {
      connect: [{ id: projectId }]
    },
    craft_status: {
      connect: [{ id: product?.attributes?.craft_status?.data?.id }]
    },
    craft_img_url: product?.attributes?.craft_img_url,
    custom_craft_name: product?.attributes?.custom_craft_name
  });

  const getCraftId = () => {
    const productTitle = product.attributes.title.trim();

    const filteredCraftId = filteredCrafts?.data.find((item) => item.attributes.title.trim() === productTitle);

    if (filteredCraftId) {
      setCraftTitle(filteredCraftId.id)
    }
  }

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

    // getCategoryName()
    getCraftsByCategory();
  }, []);

  useEffect(() => {
    getCraftId();
  }, [filteredCrafts])

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

  const handleCraftSubmit = async () => {
    try {
      await axios
        .put(`${process.env.NEXT_PUBLIC_BUILDING_URL}/api/products/${productId}`, {
          data: craftData,
        })
        .then((res) => {
          const data = res.data;
          notify(false, "სამუშაო რედაქტირდა");
          dispatch(setProductState(data.data));
        })
    } catch (err) {
      notify(true, "ხელობის დამატება უარყოფილია, გთხოვთ შეავსოთ ყველა ველი");
      console.log(err);
    }
    defaultProductsHandler(activeCategoryId);
    setSelect(null);
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
        <div className="modal-content" style={{ borderRadius: '4px' }}>
          <div className="modal-header" id="kt_modal_add_user_header">
            <h2 className='geo-title'>სერვისის რედაქტირება</h2>
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
                <div className={`notice d-flex rounded mb-9 p-6 ${styles.pictureContainer}`}>
                  <div className='d-flex flex-stack flex-grow-1'>

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
                  <div className='w-100'>
                    <label className="required fs-5 fw-bold mb-2 georgian">
                      დასახელება
                    </label>
                    <select
                      value={craftData.title}
                      onChange={(e) => {
                        const filteredArray = filteredCrafts?.data.filter(obj => obj?.attributes?.id === e.target.value);
                        setCraftImage(filteredArray[0]?.attributes?.image?.data?.attributes?.url);
                        // setCraftTitle(e.target.value);
                        setCraftData((prevSendData) => ({
                          ...prevSendData,
                          title: e.target.value,
                          craft_img_url: filteredArray[0]?.attributes?.image?.data?.attributes?.url
                        }));
                      }}
                      name="title"
                      className="form-select form-select-solid georgian"
                      data-placeholder="დასახელება"
                    >
                      <option value="none" disabled hidden > აირჩიეთ დასახელება</option>;+
                      {filteredCrafts &&
                        filteredCrafts?.data.map((item, index) => {
                          return (
                            <option key={item?.id + index} value={item?.attributes?.title}>
                              {item?.attributes?.title}
                            </option>
                          );
                        })
                      }
                      <option value="other">სხვა</option>
                    </select>
                    {craftData.title === 'other' && (
                      <div className="mt-2">
                        <input
                          value={craftData.custom_craft_name}
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
                      defaultValue={craftData.quantity}
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
                        setCraftUnit(e.target.value)
                        setCraftData((prevSendData) => ({
                          ...prevSendData,
                          unit: {
                            connect: [{ id: e.target.value }],
                          },
                        }));
                      }}
                      name="count"
                      defaultValue={craftUnit}
                      className="form-select form-select-solid georgian"
                      data-placeholder="საზომიერთ."
                    >
                      <option value="none" disabled hidden>აირჩიეთ ერთეული</option>
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
                      defaultValue={craftData.price}
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
                        setCraftStatusOption(e.target.value)
                        setCraftData((prevSendData) => ({
                          ...prevSendData,
                          craft_status: {
                            connect: [{ id: e.target.value }],
                          },
                        }));
                      }}
                      name="count"
                      defaultValue={craftStatusOption}
                      className="form-select form-select-solid georgian"
                      data-placeholder="დასახელება"
                    >
                      <option value="none" disabled hidden > აირჩიეთ სტატუსი</option>;
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
              {lossProduct && <p style={{ color: 'red' }}>შეავსეთ ყველა (*) ველი!!!</p>}
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
                  onClick={handleCraftSubmit}
                  type="submit"
                  className="btn btn-primary"
                  data-kt-users-modal-action="submit"
                >
                  <span className="indicator-label geo-title">რედაქტირება</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditService;