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

import XsvgColored from "../svg/XsvgColored";
import PictureSvg from "../svg/PictureSvg";
import DeleteBtn from "../svg/DeleteBtn";
import ImageUpload from "../ui/ImageUpload";

import styles from "./Gallery.module.css";

const Gallery = ({ setSelect, getProjectById, readOnly }) => {
  const [image, setImage] = useState([]);
  const [projectImage, setProjectImage] = useState();
  const [isImageUpload, setIsImageUpload] = useState(false);
  const [isImageState, setIsImageState] = useState(false);
  const [choosedImage, setChoosedImage] = useState(null);

  const router = useRouter();
  const { projectId } = router.query;

  const getAllImages = async () => {
    await axios
      .get(
        `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/projects?filters[id][$eq]=${projectId}&populate=image`
      )
      .then((res) => {
        const data = res?.data;
        setProjectImage(data?.data[0]?.attributes?.image?.data);
      });
  };

  const handleMediaUpload = async (img) => {
    const formData = new FormData();
    formData.append("files", img);

    try {
      await axios
        .post(`${process.env.NEXT_PUBLIC_BUILDING_URL}/api/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          const newImages = projectImage
            ? [...image, ...projectImage, ...res.data]
            : [...image, ...res.data];
          setImage(newImages);
          setIsImageUpload(true);
          getAllImages();
          getProjectById();
          notify(false, "არჩეული სურათები წარმატებით აიტვირთა");
        });
    } catch (err) {
      console.error(err);
      notify(true, "სურათების ატვირთვა უარყოფილია");
    }
  };

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
        setImage(image.filter((img) => img.id !== imageId));
        getAllImages();
        getProjectById();
        notify(false, "სურათი წაიშალა");
      });
  };

  const setMainPicture = async () => {
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/projects/${projectId}`,
        {
          data: {
            main_img_id: choosedImage,
          },
        }
      )
      .then((res) => {
        notify(false, "ფოტოსურათი წარმატებით დაყენდა მთავარ ფოტოდ");
        getAllImages();
        getProjectById();
      });
  };

  const choosedMainImg = (id) => {
    setChoosedImage(id);
  };

  useEffect(() => {
    if (isImageUpload) {
      const userImageUpload = async () => {
        await axios
          .put(
            `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/projects/${projectId}`,
            {
              data: {
                image: image.map((p) => p.id),
              },
            }
          )
          .then(() => {
            getAllImages();
            getProjectById();
          });
      };
      userImageUpload();
    }
  }, [isImageUpload, image]);

  useEffect(() => {
    if (projectId) {
      getAllImages();
    }
  }, [projectId]);

  useEffect(() => {
    if (choosedImage) {
      setMainPicture();
    }
  }, [choosedImage]);

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
            <h2 className="geo-title">სურათები</h2>
            <div
              className={`${styles.modalClose}`}
              data-kt-users-modal-action="close"
              onClick={() => {
                setSelect(null);
              }}
            >
              <XsvgColored />
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
                            <ImageUpload
                              type="projects"
                              onImageUpload={handleMediaUpload}
                              quantity={10}
                            />
                          </div>
                        </div>
                      )}
                      {projectImage &&
                        projectImage?.map((projectImg, index) => {
                          return (
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
                                  onClick={() => choosedMainImg(projectImg?.id)}
                                  className={styles.galleryItemBtn}
                                >
                                  <PictureSvg />
                                </div>
                                <div
                                  onClick={() => confirmHandler(projectImg?.id)}
                                  className={styles.galleryItemBtn}
                                >
                                  <DeleteBtn />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      {/* {projectImage. = 0 && 'hi' } */}
                      {projectImage === null || projectImage === undefined && (
                        <p  className={styles.no_photo}>სურათები არ არის დამატებული</p>
                      )}
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

export default Gallery;
