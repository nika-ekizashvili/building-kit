import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { setCategory } from "../../store/slices/categorySlice";
import { setProducts } from "../../store/slices/productSlice";

import EditProject from "../popup/EditProject";
import Filter from "./Filter";
import Products from "../products/Products";
import AddProduct from "../popup/AddProduct";
import Gallery from "../popup/Gallery";
import EditProduct from "../popup/EditProduct";
import EditService from "../popup/EditService";
import Drawings from "../popup/Drawings";
import ExportSvg from "../svg/ExportSvg";
import Search2Svg from "../svg/Search2Svg";
import LinerSvg from "../svg/LinerSvg";
import AddSvg from "../svg/AddSvg";
import MapSvg from "../svg/MapSvg";
import EditSvg from "../svg/EditSvg"
import CopySvg from "../svg/CopySvg";

import styles from "./Project.module.css";
import notify from "../../utils/notify";

const Project = ({
  projectType,
  buildCategories,
  buildCrafts,
  showProject,
  setShowProject,
  readOnly,
  projectIdR,
  hashedUrl,
  project,
  crafts,
  unit,
  suppliers,
  craftStatus,
  allProduct,
  projectCategory,
  editHandler,
  editProductItem,
  productOptions,
  productStatus,
  defaultImage,
  getProjectById,
  allowedExport,
  cities,
  propertyType,
  condition,
  currentCondition,
  categories
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { projectId } = router.query;

  const products = useSelector((state) => state.prod.products);
  const activeCategoryId = useSelector((state) => state?.cats?.category);

  const [editProject, setEditProject] = useState(null);
  const [select, setSelect] = useState(null);
  const [totalSum, setTotalSum] = useState(false);
  const [searchType, setSearchType] = useState("");

  const [animate, setAnimate] = useState(false);


  const dismissHandler = () => {
    setSelect(null);
    setEditProject(null);
    // setAddProject(false);
  };

  const handleSearchChange = (e) => {
    setSearchType(e.target.value);
  };
  const totalSumTable = () => {
    setTotalSum(true);
  };


  const edit_project_handler = async (item) => {
    let id = item[0].id

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/projects?filters[id][$eq]=${id}&populate=*`
      );
      const data = response.data;
      setEditProject(data);
      setSelect("edit-project")
    } catch (error) {
      console.log(error);
    }
  };

  const defaultProductsHandler = async (id) => {
    if (id) {
      if (projectType === 'repair') {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/products?populate=*&filters[project][id]=${projectId || projectIdR}&filters[categories][id]=${id}`
          );
          const data = response.data.data;
          dispatch(setProducts(data));
          dispatch(setCategory(id));
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/products?populate=*&filters[project][id]=${projectId || projectIdR}&filters[category_builds][id]=${id}`
          );
          const data = response.data.data;
          dispatch(setProducts(data));
          dispatch(setCategory(id));
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  const filterProductCategory = async (id) => {
    if (id) {
      if (projectType === 'repair') {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/products?populate=*&filters[project][id]=${projectId || projectIdR}&filters[categories][id]=${id}`
          );
          const data = response.data;
          dispatch(setProducts(data.data));
          dispatch(setCategory(id));
          setTotalSum(false);
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/products?populate=*&filters[project][id]=${projectId || projectIdR}&filters[category_builds][id]=${id}`
          );
          const data = response.data;
          dispatch(setProducts(data.data));
          dispatch(setCategory(id));
          setTotalSum(false);
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  const total = products.reduce((acc, product) => {
    const productTotal =
      product?.attributes?.price * product?.attributes?.quantity;
    return acc + productTotal;
  }, 0);

  const allowanceChecker = () => {
    setSelect("add");
  };

  useEffect(() => {
    const defaultProductCallBack = async () => {
      if (activeCategoryId && projectId || activeCategoryId && projectIdR) {
        await defaultProductsHandler(activeCategoryId);
      }
    };
    defaultProductCallBack();
  }, [activeCategoryId, projectId, projectIdR]);

  const generateSharedProjectHandler = async () => {
    const allSharedProjects = await axios.get(`${process.env.NEXT_PUBLIC_BUILDING_URL}/api/shared-projects`);
    const sharedProjects = allSharedProjects.data.data;

    if (sharedProjects.some((item) => item.attributes.hash === hashedUrl)) {
      copyUrl();
      notify(false, 'ლინკი დაკოპირებულია');
    } else {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/shared-projects`,
          {
            data: {
              hash: hashedUrl,
              projects: {
                connect: [{ id: projectId || projectIdR }],
              },
            },
          }
        );
        copyUrl();
        notify(false, 'ლინკი გენერირდა და დაკოპირდა')
      } catch (error) {
        console.log(error);
      }
    }
  };

  const copyUrl = () => {
    const copyText = `http://localhost:3000/share/${hashedUrl}`;

    navigator.clipboard.writeText(copyText)
      .then(() => {
        // console.log("URL copied to clipboard");
      })
      .catch((error) => {
        console.error("Failed to copy URL to clipboard", error);
      });
  };

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <>
      {project &&
        project.map((p, index) => {
          const id = p?.attributes?.main_img_id;
          const imgId = parseInt(id);
          const imageWithMainId = p?.attributes?.image?.data?.find(
            (image) => image.id === imgId
          );

          return (
            <div key={index} className={`${styles.toolbarContainer} animateBY tD2 ${animate ? 'animate' : ''}`}>
              <img
                src={
                  (imageWithMainId &&
                    process.env.NEXT_PUBLIC_BUILDING_URL +
                    imageWithMainId?.attributes?.url) ||
                  (p?.attributes?.image?.data?.[0]?.attributes?.url &&
                    process.env.NEXT_PUBLIC_BUILDING_URL +
                    p?.attributes?.image?.data?.[0]?.attributes?.url) ||
                  "/images/test-img.png"
                }
                alt="main-photo"
                className={styles.toolbarImg}
              />
              <div className={`${styles.toolbarDesc}`}>
                <div className={`container ${styles.toolbarDescContainer}`}>
                  <div className="page-title d-flex flex-column me-3">
                    <h1 className="geo-title">{p?.attributes?.title}</h1>
                    <h2
                      className={`d-flex fw-bolder my-1 fs-3 ${styles.toolbarAddress}`}
                    >
                      <MapSvg />
                      &nbsp;{p?.attributes?.address}
                    </h2>
                    <ul className="breadcrumb breadcrumb-dot fw-bold text-gray-600 fs-7 my-1">
                      <li className="breadcrumb-item text-gray-600 georgian">
                        {p?.attributes?.project_type === 'repair' ? 'სარემონტო' : 'სამშენებლო'}
                      </li>
                      <li className="breadcrumb-item text-gray-600 georgian">
                        {p?.attributes?.city?.data?.attributes?.city}
                      </li>
                      <li className="breadcrumb-item text-gray-600 georgian">
                        {p?.attributes?.property_type?.data?.attributes?.title}
                      </li>
                      <li className="breadcrumb-item text-gray-600 georgian">
                        {p?.attributes?.condition?.data?.attributes?.title}
                      </li>
                      <li className="breadcrumb-item text-gray-600 georgian">
                        {
                          p?.attributes?.current_condition?.data?.attributes
                            ?.title
                        }
                      </li>
                      <li className="breadcrumb-item text-gray-600 georgian">
                        {p?.attributes?.area} მ2
                      </li>
                      <li className="breadcrumb-item text-gray-600 georgian">
                        {new Date(p?.attributes?.createdAt)
                          .toISOString()
                          .slice(0, 10)}
                      </li>
                    </ul>
                  </div>
                  <div className="d-flex align-items-center py-2 py-md-1">
                    <div
                      className="me-3"
                      onClick={() => {
                        setSelect("gallery");
                      }}
                    >
                      <a
                        className="btn btn-light-primary fw-bolder georgian geo-title"
                        data-kt-menu-trigger="click"
                        data-kt-menu-placement="bottom-end"
                      >
                        <i className="bi bi-image-fill" />
                        სურათები
                      </a>
                      <div
                        className="menu menu-sub menu-sub-dropdown w-250px w-md-300px"
                        data-kt-menu="true"
                        id="kt_menu_61484d4eae1ca"
                      ></div>
                    </div>
                    <div
                      className="d-flex align-items-center py-2 py-md-1"
                      onClick={() => {
                        setSelect("dranings");
                      }}

                    >
                      <a
                        className="btn btn-primary fw-bolder georgian geo-title"
                        data-bs-toggle="modal"
                        data-bs-target="#kt_modal_create_app"
                        id="kt_toolbar_primary_button"
                      >
                        <LinerSvg />
                        ნახაზები
                      </a>
                    </div>
                    {!readOnly && (
                      <div
                        style={{ marginLeft: '0.75rem' }}
                        className="d-flex align-items-center py-2 py-md-1"
                        onClick={() => {
                          generateSharedProjectHandler()
                          // copyUrl();
                          // notify(false, "ლინკი დაკოპირდა")
                        }}
                      >
                        <a
                          className="btn btn-primary fw-bolder georgian geo-title "
                          data-bs-toggle="modal"
                          data-bs-target="#kt_modal_create_app"
                          id="kt_toolbar_primary_button"
                        >
                          <CopySvg />
                          გაზიარება
                        </a>
                      </div>
                    )}
                    {!readOnly && (
                      <div
                        style={{ marginLeft: 'auto', display: 'flex' }}
                        onClick={() => edit_project_handler(project)}
                        className={`fill-btn rotate-svg-btn btn btn-primary fw-boldest`}
                      >
                        <EditSvg />
                        <span>რედაქტირება</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      <Filter
        totalSumOnClick={totalSumTable}
        filterProductCategory={filterProductCategory}
        projectCategory={projectCategory}
      />
      <div id="kt_content_container" className={`${'container'} animateBY tD4 ${animate ? 'animate' : ''}`}>
        <div className="card">
          <div className="card-header border-0 pt-6">
            <div className="card-title">
              {activeCategoryId === null ? (
                ""
              ) : (
                <div className="d-flex align-items-center position-relative my-1">
                  <span className="svg-icon svg-icon-1 position-absolute ms-6">
                    <Search2Svg />
                  </span>
                  <input
                    type="text"
                    value={searchType}
                    onChange={(e) => handleSearchChange(e)}
                    data-kt-user-table-filter="search"
                    className="form-control form-control-solid w-250px ps-14 georgian"
                    placeholder="ძებნა"
                  />
                </div>
              )}
            </div>
            <div className="card-toolbar">
              {!readOnly ? (
                <div
                  className="d-flex justify-content-end"
                  data-kt-user-table-toolbar="base"
                >
                  {activeCategoryId === null ? (
                    <button
                      type="button"
                      onClick={() => {
                        allowedExport && setSelect("exportPopUp");
                      }}
                      className={`${"btn btn-light-primary me-3 georgian"} ${!allowedExport && styles.disabledBtn
                        }`}
                      data-bs-toggle="modal"
                      data-bs-target="#kt_modal_export_users"
                    >
                      <span className="svg-icon svg-icon-2">
                        <ExportSvg />
                      </span>
                      <b>ექსპორტი</b>
                    </button>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <button
                        type="button"
                        onClick={allowanceChecker}
                        className={`btn btn-primary georgian`}
                        data-bs-toggle="modal"
                        data-bs-target="#kt_modal_add_user"
                      >
                        <AddSvg />
                        <b className="geo-title">დამატება</b>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                ""
              )}
              {select === "edit-project" && (
                <EditProject
                  projectType={projectType}
                  setSelect={setSelect}
                  cities={cities}
                  propertyType={propertyType}
                  buildCategories={buildCategories}
                  condition={condition}
                  categories={categories}
                  currentCondition={currentCondition}
                  setShowProject={setShowProject}
                  project={editProject}
                  setEditProject={setEditProject}
                  dismiss={dismissHandler}
                  getProjectById={getProjectById}
                />
              )}
              {select === "gallery" && (
                <Gallery
                  readOnly={readOnly}
                  getProjectById={getProjectById}
                  setSelect={setSelect}
                />
              )}
              {select === "dranings" && (
                <Drawings
                  readOnly={readOnly}
                  getProjectById={getProjectById}
                  setSelect={setSelect}
                />
              )}
              {select === "add" && !readOnly && (
                <AddProduct
                  projectType={projectType}
                  projectCategory={projectCategory}
                  getProjectById={getProjectById}
                  project={productOptions}
                  setSelect={setSelect}
                  productStatus={productStatus}
                  craftStatus={craftStatus}
                  crafts={crafts}
                  buildCrafts={buildCrafts}
                  unit={unit}
                  allCategories={projectCategory}
                  suppliers={suppliers}
                />
              )}
              {select === "edit-product" && !readOnly && (
                <EditProduct
                  projectType={projectType}
                  product={editProductItem}
                  setSelect={setSelect}
                  craftStatus={craftStatus}
                  productStatus={productStatus}
                  crafts={crafts}
                  unit={unit}
                  allCategories={projectCategory}
                  suppliers={suppliers}
                />
              )}
              {select === "edit-service" && !readOnly && (
                <EditService
                  projectType={projectType}
                  product={editProductItem}
                  setSelect={setSelect}
                  craftStatus={craftStatus}
                  crafts={crafts}
                  buildCrafts={buildCrafts}
                  unit={unit}
                  allCategories={projectCategory}
                  suppliers={suppliers}
                />
              )}
            </div>
          </div>
          <div className="card-body pt-0">
            <Products
              projectType={projectType}
              showProject={showProject}
              readOnly={readOnly}
              getProjectById={getProjectById}
              defaultImage={defaultImage}
              productStatus={productStatus}
              projectId={projectId || projectIdR}
              craftStatus={craftStatus}
              editHandler={editHandler}
              allProduct={allProduct}
              setSelect={setSelect}
              totalSum={totalSum}
              searchType={searchType}
              select={select}
              total={total}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Project;
