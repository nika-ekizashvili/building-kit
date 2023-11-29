import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import AddProject from "./AddProject";
import notify from "../../utils/notify";

import styles from "./Modal.module.css";

const HeaderPopup = () => {
  const [close, setClose] = useState(false);
  const [addProject, setAddProject] = useState(false);
  const [projectData, setProjectData] = useState(null);

  const addProjectHandler = () => {
    setAddProject(true);
    setClose(true);
  };

  const dismissHandler = () => {
    setAddProject(false);
    setClose(false);
  };

  const getProjectsData = async () => {
    await axios.get(`${process.env.NEXT_PUBLIC_BUILDING_URL}/api/projects`)
      .then((res) => {
        const data = res.data;
        setProjectData(data.data)
      });
  };

  useEffect(() => {
    getProjectsData();
  }, []);

  const deleteProjectHandler = async (item) => {
    const projectId = item.id;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BUILDING_URL}/api/projects/${projectId}`)
        .then(() => {
          getProjectsData();
          notify(false, "პროექტი წარმატებით წაიშალა");
        })
    } catch (error) {
      notify(true, "პროექტის წაშლა უარყოფილია");
      console.log(error);
    }
  };

  return (
    <>
      <div
        style={{
          display: close ? "none" : "",
          position: "absolute",
          zIndex: "20",
        }}
        className={`modal ${styles.modal}`}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">ობიექტების ჩამონათვალი</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setClose(true)}
            />
          </div>
          <div className={` modal-body `}>
            <div className={`${styles.gap20} ${styles.noWrap} row `}>
              {projectData &&
                projectData?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="card col-2 d-flex "
                      style={{ width: "20rem", overflow: "hidden" }}
                    >
                      <div>
                        <div className="card-body">
                          <Link
                            onClick={() => setClose(true)}
                            href={{
                              pathname: `/projects/${item.id}`,
                              query: { projectId: item.id },
                            }}
                            passHref
                            className="card-title"
                          >
                            {item?.attributes?.title}
                          </Link>
                          <p className="card-text">{item?.attributes?.address}</p>
                          <div className={`${styles.gap20} row `}>
                            <div
                              // onClick={() => editHandler(item)}
                              className={` btn btn-primary `}
                            >
                              რედაქტირება
                            </div>
                            <div
                              onClick={() => deleteProjectHandler(item)}
                              className="btn btn-danger"
                            >
                              წაშლა
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className={`${styles.gutter0} modal-footer row `}>
            <button
              onClick={addProjectHandler}
              type="button"
              className="btn btn-primary"
            >
              დაამატე ობიექტი
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-plus"
                viewBox="0 0 16 16"
              >
                <path d="M8 3a.5.5 0 0 1 .5.5v3.5h3a.5.5 0 0 1 0 1h-3v3.5a.5.5 0 0 1-1 0V8h-3a.5.5 0 0 1 0-1h3V3.5A.5.5 0 0 1 8 3z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {addProject && <AddProject dismiss={dismissHandler} />}
    </>
  );
};

export default HeaderPopup;
