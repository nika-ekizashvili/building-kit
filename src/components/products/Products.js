import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";

import axios from "axios";
import Swal from "sweetalert2";

import { useDispatch, useSelector } from "react-redux";
import {
  deleteProductState,
  setProductState,
} from "../../store/slices/productSlice";

import { useMobileWidth } from "../../hooks/useMobileWidth";

import ExportPopup from "../popup/ExportPopup";
import notify from "../../utils/notify";
import ProductSelect from "./ProductSelect";
import CraftSelect from "./CraftSelect";

import DeleteBtn from "../svg/DeleteBtn";
import DeletSmall from "../svg/DeletSmall";
import SettingsSvg from "../svg/SettingsSvg";
import ThreeDotsSvg from "../svg/ThreeDotsSvg";

import styles from "./Products.module.css";

const Products = ({
  showProject,
  projectType,
  readOnly,
  editHandler,
  setSelect,
  totalSum,
  searchType,
  productStatus,
  craftStatus,
  select,
  defaultImage,
  total,
  projectId
}) => {
  const dispatch = useDispatch();

  const activeCategoryId = useSelector((state) => state?.cats?.category);
  const products = useSelector((state) => state.prod.products);
  const [orderedProducts, setOrderedProducts] = useState(null);
  const [productStatusValues, setProductStatusValues] = useState({});
  const [craftStatusValues, setCraftStatusValues] = useState({});
  const [activeItem, setActiveItem] = useState();
  const [totalSumProduct, setTotalSumProduct] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);

  const [expandedItem, setExpandedItem] = useState(null);
  const { width } = useMobileWidth();

  let itemsPerPage = 7;

  let productsToMap = products;

  if (searchType) {
    const lowercaseSearchType = searchType.toLowerCase();
    const filteredProducts = products.filter(
      (product) =>
        product?.attributes?.title
          ?.toLowerCase()
          ?.includes(lowercaseSearchType) ||
        product?.attributes?.unit?.data?.attributes?.title
          ?.toLowerCase()
          .includes(lowercaseSearchType) ||
        product?.attributes?.supplier?.data?.attributes?.title
          ?.toLowerCase()
          .includes(lowercaseSearchType) ||
        product?.attributes?.quantity
          ?.toString()
          ?.toLowerCase()
          .includes(lowercaseSearchType) ||
        product?.attributes?.price
          ?.toString()
          ?.toLowerCase()
          .includes(lowercaseSearchType) ||
        product?.attributes?.type?.toLowerCase().includes(lowercaseSearchType)
    );

    if (filteredProducts?.length >= 0) {
      productsToMap = filteredProducts;
    }
  }

  const totalPages = Math.ceil(productsToMap.length / itemsPerPage);
  const startIndex = (pageIndex - 1) * itemsPerPage;
  const endIndex = pageIndex * itemsPerPage;

  const totalSumHandler = async () => {
    await axios
      .get(
        `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/products?populate=*&filters[project][id][$eq]=${projectId}`
      )
      .then((res) => {
        const data = res.data;
        setTotalSumProduct(data.data);
      });
  };

  const expandItemHandler = (id) => {
    if (expandedItem !== id) {
      setExpandedItem(id)
    } else {
      setExpandedItem(null)
    }
  };
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

  const confirmEdit = async (selectedId, product) => {
    let productData = {
      image: product?.attributes?.image?.data?.id,
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
        connect: [{ id: activeCategoryId }],
      },
      project: {
        connect: [{ id: projectId }],
      },
      product_status: {
        connect: [{ id: selectedId }],
      },
    };

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/products/${product.id}`,
        {
          data: productData,
        }
      );
      dispatch(setProductState(res.data.data));
      notify(false, "პროდუქტი რედაქტირდა");

      await axios.get(
        `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/products?populate=*&filters[id][$eq]=${product.id}`
      );
    } catch (err) {
      console.log(err);
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
          deleteProductHandler(item);
          notify(false, "პროდუქტი წაიშალა");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          notify(true, "უარყოფილია");
        }
      });
  };

  const confirmServiceEdit = async (selectedId, product) => {
    let productData = {
      title: product?.attributes?.title,
      type: "service",
      quantity: product?.attributes?.quantity,
      unit: {
        connect: [{ id: product?.attributes?.unit?.data?.id }],
      },
      price: product.attributes.price,
      categories: {
        connect: [{ id: activeCategoryId }],
      },
      project: {
        connect: [{ id: projectId }],
      },
      craft_status: {
        connect: [{ id: selectedId }],
      },
      craft_img_url: product?.attributes?.craft_img_url,
    };

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/products/${product.id}`,
        {
          data: productData,
        }
      );
      dispatch(setProductState(res.data.data));
      notify(false, "პროდუქტი რედაქტირდა");

      await axios.get(
        `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/products?populate=*&filters[id][$eq]=${product.id}`
      );
    } catch (err) {
      console.log(err);
    }
  };

  const deleteProductHandler = async (productId) => {
    await axios
      .delete(
        `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/products/${productId}`
      )
      .then(() => {
        dispatch(deleteProductState(productId));
        getProjectById();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const changeModalHandler = (product) => {
    if (activeItem === product.id) {
      setActiveItem(null);
    } else {
      setActiveItem(product.id);
    }
  };

  let productsTotal = 0;
  let categorySums = [];

  if (totalSumProduct && totalSumProduct.length > 0) {
    totalSumProduct.forEach((product) => {
      const categoryTitle =
        projectType === 'repair' ? product?.attributes?.categories?.data[0]?.attributes?.title : product?.attributes?.category_builds?.data[0]?.attributes?.title;
      const quantity = parseInt(product?.attributes?.quantity);
      const price = parseFloat(product?.attributes?.price);

      if (categoryTitle) {
        const existingCategorySum = categorySums.find(
          (item) => item.title === categoryTitle
        );
        if (existingCategorySum) {
          existingCategorySum.sum += quantity * price;
        } else {
          categorySums.push({
            title: categoryTitle,
            sum: quantity * price,
          });
        }
        productsTotal += quantity * price;
      }
    });
  }

  let vatTotal = 0;
  if (totalSumProduct && totalSumProduct.length > 0) {
    vatTotal = totalSumProduct.reduce(
      (sum, product) =>
        product?.attributes?.project?.data?.attributes?.vatPercent || 0,
      0
    );
  }

  let unforeseenExpenses = 0;
  if (totalSumProduct && totalSumProduct.length > 0) {
    unforeseenExpenses = totalSumProduct.reduce(
      (sum, product) =>
        product?.attributes?.project?.data?.attributes?.unforeseenExpenses || 0,
      0
    );
  }

  let service_percentage = 0;
  if (totalSumProduct && totalSumProduct.length > 0) {
    service_percentage = totalSumProduct.reduce(
      (sum, product) =>
        product?.attributes?.project?.data?.attributes?.service_percentage || 0,
      0
    );
  }

  const totalProductPrice = parseFloat(productsTotal);
  const vatTotalPrice =
    (parseFloat(totalProductPrice) * parseInt(vatTotal)) /
    (100 + parseFloat(vatTotal));
  const unforeseenExpensesPrice =
    (parseFloat(productsTotal) * parseFloat(unforeseenExpenses)) / 100;
  const servicePercentagePrice =
    (parseFloat(productsTotal) * parseFloat(service_percentage)) / 100;
  const totalSumPrice =
    parseFloat(totalProductPrice) +
    parseFloat(vatTotalPrice) +
    parseFloat(unforeseenExpensesPrice) +
    parseFloat(servicePercentagePrice);

  const aggregatedProducts = {};
  totalSumProduct?.forEach((product) => {
    const title = product?.attributes?.title;
    const unit = product?.attributes?.unit?.data?.attributes?.title;
    const categories =
      product?.attributes?.categories?.data[0]?.attributes?.title;
    const price = product?.attributes?.price;
    const key = `${categories}`;

    if (product.attributes.type === "service") {
      const quantity = product?.attributes?.quantity;

      if (aggregatedProducts[key]) {
        aggregatedProducts[key].titles.push(title);
        aggregatedProducts[key].quantity += quantity;
        aggregatedProducts[key].unites.push(unit);
      } else {
        aggregatedProducts[key] = {
          titles: [title],
          unites: [unit],
          quantity,
          price,
          categories,
        };
      }
    }
  });

  const orderByCategory = () => {
    let result = {};

    if (totalSumProduct && totalSumProduct.length > 0) {
      totalSumProduct.forEach(product => {
        const categories = projectType === 'repair' ? product.attributes.categories.data : product.attributes.category_builds.data;

        categories.forEach(category => {
          const categoryTitle = category.attributes.title;

          if (!result[categoryTitle]) {
            result[categoryTitle] = {
              title: categoryTitle,
              items: [],
              unit: [],
              quantity: 0,
              price: 0
            };
          }

          const categoryItem = result[categoryTitle];
          const itemIndex = categoryItem.items.findIndex(item => item.title === product.title);

          if (itemIndex === -1) {
            const unitData = product.attributes.unit.data;
            const unitIndex = categoryItem.unit.findIndex(unit => unit.id === unitData.id);

            if (unitIndex === -1) {
              categoryItem.items.push({
                title: product.attributes.title,
                unit: unitData,
                price: product.attributes.price,
                type: product.attributes.type,
                quantity: product.attributes.quantity
              });
              categoryItem.unit.push(unitData);
            }
          }

          categoryItem.quantity += product.attributes.quantity;
          categoryItem.price += product.attributes.price * product.attributes.quantity;
        });
      });
    }

    setOrderedProducts(Object.values(result));
  };

  let mobile = width < 768 ? true : false;

  let table_head =
    [
      {
        title: "დასახელება",
        width: width < 1200 && !mobile ? "27%" : mobile ? "53%" : "20%",
      },
      {
        title: "მომწოდებელი",
        width: width < 1200 ? "0px" : "11%",
      },
      {
        title: "რაოდენობა",
        width: mobile ? "0px" : "13%",
      },
      {
        title: "ერთეული",
        width: width < 1200 ? "0px" : "9%",
      },
      {
        title: "ღირებულება",
        width: width < 1200 ? "0px" : "10%",
      },
      {
        title: "ჯამი",
        width: width < 1200 && !mobile ? "15%" : mobile ? "0px" : "11%",
      },
      {
        title: "ტიპი",
        width: mobile ? "0px" : "10%",
      },
      {
        title: "სტატუსი",
        width: width < 1200 && !mobile ? "20%" : mobile ? "35%" : "13%",
      },
      {
        title: !mobile && select === null ? "ცვლილება" : "",
        width: width < 1200 && !mobile ? "15%" : mobile ? "25%" : "7%",
      },
    ];

  let sum_table_head =
    [
      {
        title: "სამუშაო",
        width: "25%"
      },
      {
        title: "ერთეული",
        width: "25%"
      },
      {
        title: "რაოდენობა",
        width: "25%"
      },
      {
        title: "ჯამი",
        width: "25%"
      },
    ];

  useEffect(() => {
    setPageIndex(1);
  }, [activeCategoryId]);

  useEffect(() => {
    totalSumHandler();
    orderByCategory();
  }, [activeCategoryId, projectId, showProject, products]);

  return (
    <Fragment>
      <Fragment>
        <div className={`${styles.table} ${totalSum || activeCategoryId === null ? styles.total_sum_table : ""}`}>
          <div className={totalSum ? styles.total_sum_wrap : ""}>
            <div className={styles.table_head}>
              {totalSum || activeCategoryId === null ? (
                sum_table_head.map((item, index) => {
                  return (
                    <span key={index} style={{ width: item.width }} className={`${styles.table_head_item} ${'geo-title'}`}>
                      {item.title}
                    </span>
                  )
                })
              ) : (
                table_head.map((item, index) => {
                  return (
                    <span key={index} style={{ width: item.width, }} className={`${styles.table_head_item} ${'geo-title'}`}>
                      {item.title}
                    </span>
                  )
                })
              )}
            </div>
            {totalSum || activeCategoryId === null ? (
              <Fragment>
                <div className={styles.table_body}>
                  {orderedProducts && orderedProducts.map((item, index) => {
                    return (
                      <div key={index} className={`${styles.table_item_wrap} ${expandedItem === item.title + index && styles.actived_table_item}`}>
                        <div className={`${styles.table_body_item_outer}`}>
                          <span style={{ width: sum_table_head[0]?.width }} className={styles.table_body_item}>
                            {item.title}
                          </span>
                          <span key={index} style={{ width: sum_table_head[1]?.width }} className={styles.table_body_item}>
                            {item.unit.map((item, index) => {
                              return (
                                <span key={index}>{item.attributes.title}</span>
                              )
                            })}
                          </span>
                          <span style={{ width: sum_table_head[2]?.width }} className={styles.table_body_item}>
                            {item?.quantity}
                          </span>
                          <span style={{ width: sum_table_head[3]?.width }} className={styles.table_body_item}>
                            {item?.price}₾
                          </span>
                        </div>
                        <div onClick={() => expandItemHandler(item.title + index)} className={`${styles.item_expand_btn} ${item.title + index === expandedItem ? styles.active_arrow : ""}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -4.5 20 20">
                            <g>
                              <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
                                <g fill="#2B3467" transform="translate(-180 -6684)">
                                  <g transform="translate(56 160)">
                                    <path d="M144 6525.39l-1.406-1.39-8.607 8.261-.918-.881.005.005-7.647-7.34-1.427 1.369 9.987 9.586 10.013-9.61"></path>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </svg>
                        </div>
                        <div className={`${styles.expanded_item} ${expandedItem === item.title + index ? styles.actived_expand : styles.deactived_expand}`}>
                          {item.items && item.items.map((sub, index) => {
                            return (
                              <Fragment key={index} >
                                <div className={styles.expanded_sub_item}>
                                  <span className="geo-title">ტიპი:</span>
                                  <span>
                                    {sub.type === 'product' ? "პროდუქტი" : 'სამუშაო'}
                                  </span>
                                </div>
                                <div className={styles.expanded_sub_item}>
                                  <span className="geo-title">დასახელება:</span>
                                  <span>
                                    {sub.title}
                                  </span>
                                </div>
                                <div className={styles.expanded_sub_item}>
                                  <span className="geo-title">რაოდენობა:</span>
                                  <span>
                                    {sub.quantity}
                                  </span>
                                </div>
                                <div className={styles.expanded_sub_item}>
                                  <span className="geo-title">ერთეული:</span>
                                  <span>
                                    {sub.unit.attributes.title}
                                  </span>
                                </div>
                                <div className={styles.expanded_sub_item}>
                                  <span className="geo-title">ღირებულება:</span>
                                  <span>
                                    {sub.quantity}
                                  </span>
                                </div>
                                <div className={`${styles.sub_item_last} ${styles.expanded_sub_item}`}>
                                  <span className="geo-title">ჯამი:</span>
                                  <span>
                                    {sub.price * sub.quantity.toFixed(2)}
                                  </span>
                                </div>
                              </Fragment>
                            )
                          })}
                        </div>
                      </div>

                    )
                  })}

                </div>
                <div className={styles.table_footer}>
                  <div className={styles.sum_table_item_sc}>
                    <div>
                      <span className="geo-title">სულ:</span>
                      <span>{`${Object?.values(categorySums).reduce(
                        (total, category) => total + category.sum,
                        0
                      ) || 0
                        } `}</span>
                      <span className="geo-title">₾</span>
                    </div>
                    {vatTotal > 0 && (
                      <div>
                        <span className="geo-title">{`დღგ: ${parseInt(vatTotal)}%`} - </span>
                        <span>{`${vatTotalPrice.toFixed(2) || 0}`}</span>
                        <span className="geo-title">₾</span>
                      </div>
                    )}
                    {unforeseenExpenses > 0 && (
                      <div>
                        <span className="geo-title">{`გაუთ.ხარჯი: ${parseFloat(unforeseenExpenses)}%`} - </span>
                        <span>{`${unforeseenExpensesPrice.toFixed(2) || 0}`}</span>
                        <span className="geo-title">₾</span>
                      </div>
                    )}
                    {service_percentage > 0 && (
                      <div>
                        <span className="geo-title">{`სერვისი: ${parseFloat(service_percentage)}%`} - </span>
                        <span>{`${servicePercentagePrice.toFixed(2) || 0}`}</span>
                        <span>₾</span>
                      </div>
                    )}
                    <div>
                      <span className="geo-title">სულ ჯამი:</span>
                      <span>{`${totalSumPrice?.toFixed(2) || 0}`}</span>
                      <span className="geo-title">₾</span>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <Fragment>
                <div className={styles.table_body}>
                  {!projectId && (
                    <span className={styles.table_body_loading}>
                      {/* <span>Loading</span> */}
                    </span>
                  )}
                  {productsToMap && productsToMap.slice(startIndex, endIndex)
                    .map((product, index) => {
                      const defaultStatusValue =
                        product?.attributes?.product_status?.data?.attributes
                          ?.title;
                      const defaultCraftStatusValue =
                        product?.attributes?.craft_status?.data?.attributes
                          ?.title;
                      return (
                        <div key={index} className={`${styles.table_item_wrap} ${expandedItem === product.id && styles.actived_table_item}`}>
                          <div className={`${styles.table_body_item_outer}`}>
                            <span style={{ width: table_head[0]?.width }} className={styles.table_body_item}>
                              {product.attributes.type === 'product' ? (
                                <a style={{
                                  gap: '7px',
                                  display: 'flex',
                                  alignItems: 'center'
                                }} href={
                                  product.attributes.productLink ? (
                                    product?.attributes?.productLink.startsWith(
                                      "https"
                                    )
                                      ? product?.attributes?.productLink
                                      : `https://${product?.attributes?.productLink}`
                                  ) : ("")
                                }
                                  target="_blank">
                                  <img
                                    onError={(e) => {
                                      e.target.src =
                                        process.env.NEXT_PUBLIC_BUILDING_URL +
                                        defaultImage;
                                    }}
                                    src={
                                      product.attributes.type === "product"
                                        ? `${process.env.NEXT_PUBLIC_BUILDING_URL}${product?.attributes?.image?.data?.attributes?.url}`
                                        : `${process.env.NEXT_PUBLIC_BUILDING_URL}${product.attributes.craft_img_url}`
                                    }
                                    alt="product img"
                                  />
                                  <span>{product?.attributes?.title}</span>
                                </a>
                              ) : (
                                <Fragment>
                                  <img
                                    onError={(e) => {
                                      e.target.src =
                                        process.env.NEXT_PUBLIC_BUILDING_URL +
                                        defaultImage;
                                    }}
                                    src={
                                      product.attributes.type === "product"
                                        ? `${process.env.NEXT_PUBLIC_BUILDING_URL}${product?.attributes?.image?.data?.attributes?.url}`
                                        : `${process.env.NEXT_PUBLIC_BUILDING_URL}${product.attributes.craft_img_url}`
                                    }
                                    alt="product img"
                                  />
                                  <span>{product?.attributes?.title === 'other' ? product?.attributes?.custom_craft_name : product?.attributes?.title}</span>
                                </Fragment>
                              )}
                            </span>
                            <span style={{ width: table_head[1]?.width }} className={styles.table_body_item}>
                              {product.attributes.type === "product" ? (
                                product?.attributes?.supplier?.data
                                  ?.attributes?.title
                              ) : (
                                " - "
                              )}
                            </span>
                            <span style={{ width: table_head[2]?.width }} className={styles.table_body_item}>
                              {product?.attributes?.quantity}
                            </span>
                            <span style={{ width: table_head[3]?.width }} className={styles.table_body_item}>
                              {product?.attributes?.unit?.data?.attributes?.title}

                            </span>
                            <span style={{ width: table_head[4]?.width }} className={styles.table_body_item}>
                              {product?.attributes?.price}
                            </span>
                            <span style={{ width: table_head[5]?.width }} className={styles.table_body_item}>
                              {(
                                product?.attributes?.price *
                                product?.attributes?.quantity
                              ).toFixed(2)}
                            </span>
                            <span style={{ width: table_head[6]?.width }} className={styles.table_body_item}>
                              {product?.attributes?.type === "product"
                                ? "პროდუქტი"
                                : "სერვისი"}
                            </span>
                            <span style={{ width: table_head[7]?.width }} className={`${styles.table_body_item} ${styles.pd_r}`}>
                              <div className="form-group">
                                {readOnly ? (
                                  defaultStatusValue || defaultCraftStatusValue
                                ) : (
                                  <Fragment>
                                    {product?.attributes?.type === "product" ? (
                                      <ProductSelect
                                        key={product.id}
                                        product={product}
                                        productStatusValues={productStatusValues}
                                        setProductStatusValues={
                                          setProductStatusValues
                                        }
                                        productStatus={productStatus}
                                        confirmEdit={confirmEdit}
                                        defaultStatusValue={defaultStatusValue}
                                      />
                                    ) : (
                                      <CraftSelect
                                        key={product.id}
                                        product={product}
                                        craftStatusValues={craftStatusValues}
                                        setCraftStatusValues={setCraftStatusValues}
                                        craftStatus={craftStatus}
                                        confirmServiceEdit={confirmServiceEdit}
                                        defaultCraftStatusValue={
                                          defaultCraftStatusValue
                                        }
                                      />
                                    )}
                                  </Fragment>
                                )}
                              </div>
                            </span>
                            <span style={{ width: table_head[8]?.width, justifyContent: width < 1200 ? 'center' : 'flex-end' }} className={`${styles.table_body_item} ${styles.changeModal}`}>
                              <div className={readOnly && styles.disabled_edit} style={{ cursor: 'pointer', transform: width < 700 ? "rotate(-90deg)" : "" }} onClick={() => changeModalHandler(product)}>
                                <ThreeDotsSvg />
                              </div>
                              {activeItem === product.id ? (
                                <div className={styles.modal}>
                                  <div
                                    onClick={() => {
                                      editHandler(product);
                                      setSelect(
                                        product?.attributes?.type === "product"
                                          ? "edit-product"
                                          : "edit-service"
                                      );
                                    }}
                                    className={`fill-btn rotate-svg-btn btn btn-primary fw-boldest`}
                                  >
                                    <SettingsSvg
                                      className={`${"card-svg rotate-svg"} ${styles.m0
                                        }`}
                                    />
                                  </div>
                                  <div
                                    onClick={() => {
                                      confirmHandler(product?.id);
                                    }}
                                    className="btn red-ghost-btn fw-boldest"
                                  >
                                    <DeleteBtn
                                      className={`${"card-svg"} ${styles.m0}`}
                                    />
                                  </div>
                                  <DeletSmall onClick={() => setActiveItem(null)} className={styles.closeBtn} />
                                </div>
                              ) : (
                                ""
                              )}
                            </span>
                          </div>
                          {width < 1200 && (
                            <div onClick={() => expandItemHandler(product.id)} className={`${styles.item_expand_btn} ${product.id === expandedItem ? styles.active_arrow : ""}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -4.5 20 20">
                                <g>
                                  <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
                                    <g fill="#2B3467" transform="translate(-180 -6684)">
                                      <g transform="translate(56 160)">
                                        <path d="M144 6525.39l-1.406-1.39-8.607 8.261-.918-.881.005.005-7.647-7.34-1.427 1.369 9.987 9.586 10.013-9.61"></path>
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </svg>
                            </div>
                          )}
                          {(
                            <div className={`${styles.expanded_item} ${expandedItem === product.id ? styles.actived_expand : styles.deactived_expand}`}>
                              <div className={styles.expanded_sub_item}>
                                <span className="geo-title">ტიპი:</span>
                                <span>
                                  {product?.attributes?.type === "product"
                                    ? "პროდუქტი"
                                    : "სერვისი"}
                                </span>
                              </div>
                              <div className={styles.expanded_sub_item}>
                                <span className="geo-title">მომწოდებელი:</span>
                                <span>
                                  {product.attributes.type === "product" ? (
                                    <a
                                      href={
                                        product.attributes.productLink ? (
                                          product?.attributes?.productLink.startsWith(
                                            "https"
                                          )
                                            ? product?.attributes?.productLink
                                            : `https://${product?.attributes?.productLink}`
                                        ) : ("")
                                      }
                                      target="_blank"
                                    >
                                      {
                                        product?.attributes?.supplier?.data
                                          ?.attributes?.title
                                      }
                                    </a>
                                  ) : (
                                    " - "
                                  )}
                                </span>
                              </div>
                              <div className={styles.expanded_sub_item}>
                                <span className="geo-title">რაოდენობა:</span>
                                <span>
                                  {product?.attributes?.quantity}
                                </span>
                              </div>
                              <div className={styles.expanded_sub_item}>
                                <span className="geo-title">ერთეული:</span>
                                <span>
                                  {product?.attributes?.unit?.data?.attributes?.title}
                                </span>
                              </div>
                              <div className={styles.expanded_sub_item}>
                                <span className="geo-title">ღირებულება:</span>
                                <span>
                                  {product?.attributes?.price}
                                </span>
                              </div>
                              <div className={styles.expanded_sub_item}>
                                <span className="geo-title">ჯამი:</span>
                                <span>
                                  {(
                                    product?.attributes?.price *
                                    product?.attributes?.quantity
                                  ).toFixed(2)}                              </span>
                              </div>

                            </div>
                          )}
                        </div>
                      )
                    })}

                </div>
                <div className={styles.table_footer}>
                  <span className="geo-title">ჯამი: {total.toFixed(2)} ₾</span>
                </div>
              </Fragment>
            )}
          </div>
        </div>
        {!productsToMap?.length && activeCategoryId && (
          <div className={styles.no_products}>
            პროდუქტი ვერ მოიძებნა!
          </div>
        )}
        {productsToMap.length > itemsPerPage && (
          <nav aria-label="Page navigation example">
            {activeCategoryId === null ? (
              ""
            ) : (
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
            )}
          </nav>
        )}
      </Fragment >
      {select === "exportPopUp" && (
        <ExportPopup
          setSelect={setSelect}
          totalSum={totalSum}
          aggregatedProducts={aggregatedProducts}
          projectId={projectId}
          productsToMap={productsToMap}
          startIndex={startIndex}
          endIndex={endIndex}
          activeItem={activeItem}
          totalSumPrice={totalSumPrice}
          categorySums={categorySums}
          vatTotal={vatTotal}
          vatTotalPrice={vatTotalPrice}
          unforeseenExpenses={unforeseenExpenses}
          unforeseenExpensesPrice={unforeseenExpensesPrice}
          service_percentage={service_percentage}
          servicePercentagePrice={servicePercentagePrice}
          select={select}
        />
      )}
    </Fragment>
  );
};

export default Products;
