import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserStatus } from "../../store/slices/statusSlice";
import axios from "axios";
import Link from "next/link";
import Swal from "sweetalert2";
import notify from "../../utils/notify";

import { setCategory } from "../../store/slices/categorySlice";

import LoadingPage from "../../components/ui/LoadingPage";
import Unauthorized from "../401";
import EditProject from "../../components/popup/EditProject";
import AddProject from "../../components/popup/AddProject";
import DeleteBtn from "../../components/svg/DeleteBtn";
import EditSvg from "../../components/svg/EditSvg";
import MapSvg from "../../components/svg/MapSvg";
import AddProjectSvg from "../../components/svg/AddProjectSvg";

import styles from "../../components/popup/Modal.module.css";

const index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [addProject, setAddProject] = useState(false);
  const [editProject, setEditProject] = useState(false);
  const [showProject, setShowProject] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [cities, setCities] = useState(null);
  const [propertyType, setPropertyType] = useState(null);
  const [condition, setCondition] = useState(null);
  const [currentCondition, setCurrentCondition] = useState(null);
  const [categories, setCategories] = useState(null);
  const [buildCategories, setBuildCategories] = useState(null);
  const [select, setSelect] = useState(null)

  const [animate, setAnimate] = useState(false);

  const userId = useSelector((state) => state.auth.user_id);
  const searchValue = useSelector((state) => state.proj.searchType);
  const isLoggedIn = useSelector((state) => state.auth.loggedIn);
  const status = useSelector((state) => state.userStatus)

  const dispatch = useDispatch();

  const userStatus = useSelector((state) => state.userStatus);

  let itemsPerPage = 8;
  let projectsToMap = projectData;
  const totalPages = Math.ceil(projectsToMap?.length / itemsPerPage);
  const startIndex = (pageIndex - 1) * itemsPerPage;
  const endIndex = pageIndex * itemsPerPage;

  if (searchValue) {
    const lowercaseSearchType = searchValue.toLowerCase();
    if (projectData && Array.isArray(projectData)) {
      projectsToMap = projectData.reduce((filteredProjects, project) => {
        const projectTitle = project?.attributes?.title?.toLowerCase();
        const projectAddress = project?.attributes?.address?.toLowerCase();
        if (
          projectTitle === lowercaseSearchType ||
          projectAddress === lowercaseSearchType
        ) {
          return [project];
        } else if (
          projectTitle.includes(lowercaseSearchType) ||
          projectAddress.includes(lowercaseSearchType)
        ) {
          return [...filteredProjects, project];
        }
        return filteredProjects;
      }, []);
    } else {
      console.log("projectData is null or not an array");
    }
  }

  const handleDecrementPageIndex = () => {
    if (pageIndex > 1) {
      setPageIndex(pageIndex - 1);
    }
  };

  const handleChangePageIndex = (event) => {
    const newPageIndex = parseInt(event.target.id);
    setPageIndex(newPageIndex);
  };

  const handleIncrementPageIndex = () => {
    if (pageIndex < totalPages) {
      setPageIndex(pageIndex + 1);
    }
  };

  const addProjectHandler = () => {
    if (userStatus?.all_projects < userStatus?.allowed_projects) {
      setAddProject(!addProject);
    } else if (userStatus?.allowed_projects === "უსასრულო") {
      setAddProject(!addProject);
    } else {
      notify(true, "პროექტის ატვირთვა უარყოფილია თქვენ ამოგეწურათ ლიმიტი");
    }
  };

  const dismissHandler = () => {
    setEditProject(null);
    setSelect(null);
    setAddProject(false);
  };

  const trialExpiredChecker = async () => {
    const now = new Date();
    const expiredDate = new Date(userStatus?.trial_expires);
    if (expiredDate instanceof Date && isNaN(expiredDate) === false) {
      if (now > expiredDate) {
        try {
          await axios
            .put(
              `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/users/${userId}`,
              {
                trial_used: true,
                trial_expires: 'expired'
              }
            )
          dispatch(setUserStatus({ trial_expires: "expired", trial_used: true }));
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const getProjectsData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/projects?populate=categories,category_builds,image,main_img_url&filters[users_permissions_user][id][$eq]=${userId}`
      );
      setShowProject(false);
      return response.data;
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      return [];
    }
  };

  const editHandler = async (item) => {
    let id = item.id;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/projects?filters[id][$eq]=${id}&populate=*`
      );
      const data = response.data;
      setEditProject(data);
      setSelect('edit')
    } catch (error) {
      console.log(error);
    }
  };

  const confirmHandler = (item) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "დაადასტურეთ, რომ ნადვილად გსურთ პროექტის წაშლა",
        text: "თანხმობის შემთხვევაში, პროექტი წაიშლება",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "წაშლა",
        cancelButtonText: "უარყოფა",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteProjectHandler(item);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          notify(true, "პროექტის წაშლა უარყოფილია");
        }
      });
  };

  const deleteProjectHandler = async (item) => {
    const projectId = item.id;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/projects/${projectId}`
      );
      const data = await getProjectsData();
      setProjectData(data.data);
      dispatch(setUserStatus({ all_projects: data.meta.pagination.total }));
    } catch (error) {
      console.log(error);
    }
  };

  // const getDefaultImage = async () => {
  //   await axios
  //     .get(
  //       `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/default-image?populate=NoImage`
  //     )

  //     .then((res) => {
  //       const data = res.data;
  //       setDefaultImage(data.data.attributes.NoImage.data?.attributes.url);
  //     });
  // };

  let buttonWrap = (
    <div className={`${styles.buttons} ${'my-6'}  ${'animateBY tD2'} ${animate ? 'animate' : ''}`}>
      <Link
        type="button"
        className="btn btn-primary ghost-btn fw-boldest geo-title"
        href="/"
      >
        მთავარი გვერდი
      </Link>
      <button
        onClick={addProjectHandler}
        type="button"
        className="btn btn-primary fill-btn fw-boldest geo-title"
      >
        <AddProjectSvg />
        დაამატე ობიექტი
      </button>
    </div>
  );

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProjectsData();
      setProjectData(data.data);
      dispatch(setUserStatus({ all_projects: data.meta.pagination.total }));
    };

    fetchData();
  }, [showProject]);

  useEffect(() => {
    trialExpiredChecker();
  }, [userStatus]);

  useEffect(() => {
    const getCategoriesHandler = async () => {
      try {
        await axios
          .get(`${process.env.NEXT_PUBLIC_BUILDING_URL}/api/categories`)
          .then((res) => {
            const data = res.data;
            setCategories(data.data);
          });
      } catch (error) {
        console.log(error);
      }
    };

    const getBuildCategories = async () => {
      try {
        await axios
          .get(`${process.env.NEXT_PUBLIC_BUILDING_URL}/api/category-builds`)
          .then((res) => {
            const data = res.data;
            setBuildCategories(data.data);
          });
      } catch (error) {
        console.log(error);
      }
    };

    const getCurrentConditionHandler = async () => {
      try {
        await axios
          .get(`${process.env.NEXT_PUBLIC_BUILDING_URL}/api/current-conditions`)
          .then((res) => {
            const data = res.data;
            setCurrentCondition(data.data);
          });
      } catch (error) {
        console.log(error);
      }
    };

    const getConditionHandler = async () => {
      try {
        await axios
          .get(`${process.env.NEXT_PUBLIC_BUILDING_URL}/api/conditions`)
          .then((res) => {
            const data = res.data;
            setCondition(data.data);
          });
      } catch (error) {
        console.log(error);
      }
    };

    const getCitiesHandler = async () => {
      try {
        await axios
          .get(`${process.env.NEXT_PUBLIC_BUILDING_URL}/api/cities`)
          .then((res) => {
            const data = res.data;
            setCities(data.data);
          });
      } catch (error) {
        console.log(error);
      }
    };

    const getPropertyTypesHandler = async () => {
      try {
        axios
          .get(`${process.env.NEXT_PUBLIC_BUILDING_URL}/api/property-types`)
          .then((res) => {
            const data = res.data;
            setPropertyType(data.data);
          });
      } catch (error) {
        console.log(error);
      }
    };

    getCategoriesHandler();
    getBuildCategories();
    getCurrentConditionHandler();
    getConditionHandler();
    getCitiesHandler();
    getPropertyTypesHandler();
  }, []);

  useEffect(() => {
    setIsLoading(false)
  }, [userStatus.trialExpired]);

  useEffect(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 500);
  }, []);

  return (
    <>
      {!isLoggedIn ? (
        <Unauthorized />
      ) : isLoading ? (
        <LoadingPage />
      ) : (
        <>
          <img
            className={styles.projectBg}
            src="/images/projectBg.png"
            alt="bg"
          />
          {userStatus.trial_expires === "expired" && userStatus.p_title === 'დამწყები' ? (
            <div className={`${styles.expired} ${'animateBY tD2'} ${animate ? 'animate' : ''}`}>
              <h2>უფასო საცდელი ვადა ამოიწურა გთხოვთ გაანახლოთ გადახდის მეთოდი</h2>
              <Link
                type="button"
                className="btn btn-primary ghost-btn fw-boldest"
                href="/account"
              >
                პროფილი
              </Link>
            </div>
          ) : (
            <div
              className="container"
              style={{
                position: "relative",
                backgroundColor: "none",
                minHeight: "300px"
              }}
            >
              {projectsToMap?.length > 0 ? buttonWrap : ""}
              <div
                className={`${styles.flexWrap} d-flex justify-content-center `}
                style={{ zIndex: 1 }}
              >
                {/* <BuildingBg /> */}
                {projectsToMap?.length > 0 ? (
                  projectsToMap.slice(startIndex, endIndex).map((item, index) => {
                    const id = item?.attributes?.main_img_id;
                    const imgId = parseInt(id);
                    const imageWithMainId = item?.attributes?.image?.data?.find(
                      (image) => image.id === imgId
                    );
                    const lowestIdObject = item.attributes.project_type === 'repair' ?  (
                      item?.attributes?.categories.data.reduce((min, obj) => (obj.id < min.id ? obj : min), item?.attributes?.categories.data[0]) 
                    ) : (
                      item?.attributes?.category_builds.data.reduce((min, obj) => (obj.id < min.id ? obj : min), item?.attributes?.category_builds.data[0]) 
                    )

                    return (
                      <div
                        key={index}
                        className={`card-body ${styles.wrapChild} card  ${'animateBY tD3'} ${animate ? 'animate' : ''}`}
                      >
                        <div
                          className={`${styles.imgWrap} card`}
                          style={{ paddingBottom: "20px" }}
                        >
                          <Link
                            href={`/projects/${item?.id}`}
                            onClick={() => dispatch(setCategory(lowestIdObject.id))}
                            passHref
                            className={styles.cardLink}
                          >
                            <div className={styles.cardLinkImg}>
                              <img
                                src={
                                  (imageWithMainId &&
                                    process.env.NEXT_PUBLIC_BUILDING_URL +
                                    imageWithMainId?.attributes?.url) ||
                                  (item?.attributes?.image?.data?.[0]?.attributes
                                    ?.url &&
                                    process.env.NEXT_PUBLIC_BUILDING_URL +
                                    item?.attributes?.image?.data?.[0]
                                      ?.attributes?.url) ||
                                  "/images/test-img.png"
                                }
                                className="card-img-top"
                                alt="project-img"
                              />
                            </div>
                            <div className={`card-body ${styles.cardTtl}`}>
                              <div
                                className="card-title geo-title"
                              >
                                {item?.attributes?.title}
                              </div>
                              <p style={{ color: 'black' }} className="card-text geo-title">
                                ტიპი: {item.attributes.project_type === 'repair' ? "სარემონტო" : "სამშენებლო"}
                              </p>
                              <p className="card-text geo-title">
                                <MapSvg />
                                {item?.attributes?.address}
                              </p>
                            </div>
                          </Link>
                          <div className={`${styles.moodalButtons}`}>
                            <div
                              onClick={() => editHandler(item)}
                              className={`fill-btn rotate-svg-btn btn btn-primary fw-boldest`}
                            >
                              <EditSvg />
                              <span>რედაქტირება</span>
                            </div>
                            <div
                              onClick={() => confirmHandler(item)}
                              className="btn red-ghost-btn fw-boldest btn-primary"
                            >
                              <DeleteBtn />
                              <span>წაშლა</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className={`${styles.wrap}  ${'animateBY tD2'} ${animate ? 'animate' : ''}`}>
                    <h2 className={`geo-title`}>პროექტები ვერ მოიძებნა</h2>
                    {buttonWrap}
                  </div>
                )}
              </div>
              {projectsToMap?.length > itemsPerPage && (
                <nav aria-label="Page navigation example" className={`${"m-5 p-5"}  ${'animateBY tD2'} ${animate ? 'animate' : ''}`}>
                  <ul className="pagination">
                    <li
                      className="page-item"
                      onClick={handleDecrementPageIndex}
                      value={pageIndex}
                    >
                      <a className="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                      </a>
                    </li>
                    {Array.from({ length: totalPages }, (_, index) => (
                      <li
                        className="page-item"
                        onClick={handleChangePageIndex}
                        key={index + 1}
                      >
                        <a className="page-link" id={index + 1} href="#">
                          {index + 1}
                        </a>
                      </li>
                    ))}
                    <li
                      className="page-item"
                      onClick={handleIncrementPageIndex}
                      value={pageIndex}
                    >
                      <a className="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                      </a>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          )}
          {addProject && (
            <AddProject
              buildCategories={buildCategories}
              setAddProject={setAddProject}
              cities={cities}
              propertyType={propertyType}
              condition={condition}
              categories={categories}
              currentCondition={currentCondition}
              setShowProject={setShowProject}
              dismiss={dismissHandler}
            />
          )}
          {select === 'edit' && (
            <EditProject
              buildCategories={buildCategories}
              getProjectById={getProjectsData}
              setSelect={setSelect}
              cities={cities}
              propertyType={propertyType}
              condition={condition}
              categories={categories}
              currentCondition={currentCondition}
              setEditProject={setEditProject}
              setShowProject={setShowProject}
              project={editProject}
              dismiss={dismissHandler}
            />
          )}
        </>
      )}
    </>
  );
};

export default index;