import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import axios from "axios";
import Swal from "sweetalert2";
import LightGallery from "lightgallery/react";

import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import notify from "../../utils/notify";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

import XredSvg from "../svg/XredSvg";
import UploadSvg from "../svg/UploadSvg";
import CopySvg from "../svg/CopySvg";
import DeleteBtn from "../svg/DeleteBtn";

import styles from "./Gallery.module.css";

const Drawings = ({ setSelect, readOnly }) => {
  const router = useRouter();
  const { projectId } = router.query;

  const [image, setImage] = useState([]);
  const [isImageUpload, setIsImageUpload] = useState(false);
  const [isProjectImages, setIsProjectImages] = useState([]);
  const [isImageState, setIsImageState] = useState(false);

  const copyLinkToClipboard = (link) => {
    const tempInput = document.createElement("input");
    tempInput.value = link;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);

    notify(false, "დაკოპირებულია: " + link);
  };

  const getProductsHandler = async () => {
    await axios
      .get(
        `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/projects?filters[id][$eq]=${projectId}&populate=drawing`
      )
      .then((res) => {
        const data = res.data;
        setIsProjectImages(data?.data[0]?.attributes?.drawing?.data);
      });
  };

  useEffect(() => {
    if (projectId) {
      getProductsHandler();
    }
  }, [projectId]);

  const handleMediaUpload = async (files) => {
    let upload_input = document.getElementById("fileInput");

    if (!files) {
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      formData.append("files", file);
    }

    try {
      await axios
        .post(`${process.env.NEXT_PUBLIC_BUILDING_URL}/api/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          const newImages = isProjectImages
            ? [...image, ...isProjectImages, ...res.data]
            : [...image, ...res.data];
          setImage(newImages);
          setIsImageUpload(true);
          notify(false, "არჩეული ნახაზი წარმატებით აიტვირთა");
        });
    } catch (err) {
      console.log(err);
      notify(true, "ნახაზის ატვირთვა უარყოფილია");
    }
  };

  useEffect(() => {
    if (isImageUpload) {
      const userImageUpload = async () => {
        await axios
          .put(
            `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/projects/${projectId}`,
            {
              data: {
                drawing: image.map((p) => p.id),
              },
            }
          )
          .then(() => {
            getProductsHandler();
          });
      };
      userImageUpload();
    }
  }, [isImageUpload, image]);

  const toggleImages = () => {
    if (!isImageState) {
      setIsImageState(false);
    } else {
      setIsImageState(true);
    }
  };

  const confirmHandler = (imageId) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "დაადასტურეთ, რომ გსურთ სურათის წაშლა",
        text: "დადასტურის შემთხვევაში, სურათი წაიშლება",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "წაშლა",
        cancelButtonText: "უარყოფა",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          handleDeleteImage(imageId);
          notify(false, "სურათი წაიშალა");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          notify(true, "ოპერაცია უარყოფილია");
        }
      });
  };

  const handleDeleteImage = async (imageId) => {
    await axios
      .delete(
        `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/upload/files/${imageId}`
      )
      .then(() => {
        getProductsHandler();
        setImage(image.filter((img) => img.id !== imageId));
      });
  };

  return (
    <div
      className="modal fade show"
      style={{ zIndex: isImageState ? "0" : "100" }}
    >
      <div className="modal modal-dialog-centered custom-width">
        <div className="modal-content custom-width">
          <div
            className={`modal-header container py-sm-10 px-sm-10 ${styles.modalHeader}`}
          >
            <h2 className="geo-title">ნახაზები</h2>
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
          <div className="modal-body d-flex flex-wrap  py-sm-10 px-sm-10 container">
            <form
              id="kt_modal_add_user_form"
              className="form"
              style={{ width: "100%" }}
            >
              <div
                style={{
                  flexDirection: "column",
                }}
                className="svg-icon svg-icon-2tx svg-icon-warning me-4 d-flex justify-content-center align-items-center"
              >
                {
                  <LightGallery
                    plugins={[lgThumbnail, lgZoom]}
                    className={styles.galleryItems}
                    elementClassNames="custom-class-name"
                    selector=".gallery-item"
                  >
                    <div className={styles.galleryItems}>
                      {!readOnly && (
                        <div className={`${styles.galleryItem}`}>
                          <div className={`${styles.addBtn}`}>
                            <input
                              id="fileInput"
                              style={{
                                width: "100%",
                                height: "100%",
                                overflow: "hidden",
                                zIndex: "0",
                                opacity: "0",
                                top: "0px",
                                position: "absolute",
                                cursor: "pointer",
                              }}
                              onChange={(e) => {
                                const files = e.target.files;
                                const modifiedFiles = Array.from(files).map(
                                  (file) => {
                                    const randomText = Math.random()
                                      .toString(36)
                                      .substring(7);
                                    const fileName = `${randomText}_${file.name}`;
                                    return new File([file], fileName, {
                                      type: file.type,
                                    });
                                  }
                                );
                                handleMediaUpload(modifiedFiles);
                              }}
                              type="file"
                              name="avatar"
                              multiple
                            />
                            <span className="fw-boldest geo-title">ნახაზის ატვირთვა</span>
                            <UploadSvg />
                          </div>
                        </div>
                      )}
                      {isProjectImages?.map((projectImg, index) => (
                        <div key={index} className={styles.galleryItem}>
                          <a
                            key={projectImg?.id}
                            href={`${process.env.NEXT_PUBLIC_BUILDING_URL}${projectImg?.attributes?.url}`}
                            className={`gallery-item`}
                            onClick={toggleImages}
                          >
                            <div className={styles.galleryItemImg}>
                              <img
                                key={index}
                                src={`${process.env.NEXT_PUBLIC_BUILDING_URL}${projectImg?.attributes?.url}`}
                                className="img-responsive col-sm"
                              />
                            </div>
                          </a>
                          <div className={styles.galleryItemBtns}>
                            <div
                              className={styles.galleryItemBtn}
                              onClick={() =>
                                copyLinkToClipboard(
                                  `${process.env.NEXT_PUBLIC_BUILDING_URL}${projectImg?.attributes?.url}`
                                )
                              }
                            >
                              <CopySvg />
                            </div>
                            <div
                              onClick={() => confirmHandler(projectImg?.id)}
                              className={styles.galleryItemBtn}
                            >
                              <DeleteBtn />
                            </div>
                          </div>
                        </div>
                      ))}
                      {isProjectImages?.length === 0 || isProjectImages === null ? (
                        <p className={styles.no_photo}>ნახაზები არ არის დამატებული</p>
                      ) : ("")}
                    </div>
                  </LightGallery>
                }
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawings;
