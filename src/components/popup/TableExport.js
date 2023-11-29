import ExportTableSvg from "../svg/ExportTableSvg";
import styles from "../products/Products.module.css";

const TableExport = ({
  totalSum,
  aggregatedProducts,
  projectId,
  productsToMap,
  startIndex,
  endIndex,
  activeItem,
  categorySums,
  vatTotal,
  vatTotalPrice,
  unforeseenExpenses,
  unforeseenExpensesPrice,
  service_percentage,
  servicePercentagePrice,
  totalSumPrice,
  select,
  setSelect,
}) => {
  console.log(aggregatedProducts, 'in table export')
  return (
    <div id="table2Id" style={{ paddingTop: "20px", paddingLeft: '20px', overflowX: 'auto' }}>
      {select === "exportPopUp" && (
        <div style={{ margin: "50px", marginTop: "30px" }}>
          <ExportTableSvg />
        </div>
      )}
      <table
        style={{width: '1200px'}}
        className="table align-middle table-row-dashed fs-6 gy-5 borderBottom"
      >
        {totalSum ? (
          <thead>
            <tr
              className={styles.tableHead}
              style={{ backgroundColor: "yellow", border: "1px solid black" }}
            >
              <th style={{ paddingLeft: "8px" }}>სამუშაო</th>
              <th>ერთეული</th>
              <th>რაოდენობა</th>
              <th>სტატუსი</th>
              <th>ხარჯი</th>
              <th>ჯამი</th>
              <th>ვალუტა</th>
            </tr>
            {Object.values(aggregatedProducts).map((product, index) => (
              <tr key={index} style={{ border: "1px solid black" }}>
                <td style={{ paddingLeft: "8px" }}>{product?.categories}</td>
                <td className={styles.sumTableUnities}>
                  {product?.unites.map((i, index) => {
                    return <span key={index}>{i}</span>;
                  })}
                </td>
                <td>
                  {categorySums?.find(
                    (item) => item.title === product?.categories
                  )?.sum || 0}{" "}
                </td>
                <td>{product?.status ? "შეძენილია" : "არ არის შეძენილი"}</td>
                <td>
                  {" "}
                  {categorySums?.find(
                    (item) => item.title === product?.categories
                  )?.sum || 0}{" "}
                </td>
                <td>
                  {categorySums?.find(
                    (item) => item.title === product?.categories
                  )?.sum || 0}{" "}
                </td>
                <td>ლარი</td>
              </tr>
            ))}
            <tr style={{ border: "1px solid black" }}>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>სულ</td>
              <td>{`${
                Object?.values(categorySums).reduce(
                  (total, category) => total + category.sum,
                  0
                ) || 0
              } `}</td>
              <td>ლარი</td>
            </tr>
            <tr style={{ border: "1px solid black" }}>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>{`დღგ ${parseInt(vatTotal)}%`}</td>
              <td>{`${vatTotalPrice.toFixed(2) || 0}`}</td>
              <td>ლარი</td>
            </tr>
            <tr style={{ border: "1px solid black" }}>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>{`გაუთ.ხარჯი ${parseFloat(unforeseenExpenses)}%`}</td>
              <td>{`${unforeseenExpensesPrice.toFixed(2) || 0}`}</td>
              <td>ლარი</td>
            </tr>
            <tr style={{ border: "1px solid black" }}>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>{`სერვისი ${parseFloat(service_percentage)}%`}</td>
              <td>{`${servicePercentagePrice.toFixed(2) || 0}`}</td>
              <td>ლარი</td>
            </tr>
            <tr style={{ border: "1px solid black" }}>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>სულ ჯამი</td>
              <td>{`${totalSumPrice?.toFixed(2) || 0}`}</td>
              <td>ლარი</td>
            </tr>
          </thead>
        ) : (
          <thead>
            <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
              <th className="w-10px pe-2">
                <div className="form-check form-check-sm form-check-custom form-check-solid me-3"></div>
              </th>
              {/* min-w-125px */}
              <th className="georgian">დასახელება</th>
              <th className="georgian">მომწოდებელი</th>
              <th className="georgian">რაოდენობა</th>
              <th className="georgian">ერთეული</th>
              <th className="georgian">ღირებულება</th>
              <th className="georgian">ტიპი</th>
              <th className="georgian">სტატუსი</th>
              {select === null && (
                <th className="text-end min-w-100px georgian">ცვლილება</th>
              )}
            </tr>
          </thead>
        )}
        {totalSum ? (
          <tbody>
            <tr></tr>
          </tbody>
        ) : (
          <>
            {!projectId && (
              <tbody>
                <tr>
                  <td>
                    <div className="d-flex justify-content-center">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            )}
            {productsToMap &&
              productsToMap.slice(startIndex, endIndex).map((product) => {
                return (
                  <tbody key={product?.id}>
                    <tr>
                      <td>
                        <div className="form-check form-check-sm form-check-custom form-check-solid">
                          {/* <input
                            className="form-check-input"
                            type="checkbox"
                            defaultValue={1}
                          /> */}
                        </div>
                      </td>
                      <td
                        style={{ gap: "3px", alignItems: "center" }}
                        className="d-flex align-items-center"
                      >
                        <div className="symbol symbol-circle symbol-50px overflow-hidden me-3 m20">
                          <a>
                            <div className="symbol-label georgian">
                              <img
                                onError={(e) => {
                                  e.target.src = "/images/test-img.png";
                                }}
                                src={
                                  product.attributes.type === "product"
                                    ? `${process.env.NEXT_PUBLIC_BUILDING_URL}` +
                                      product?.attributes?.image?.data
                                        ?.attributes?.url
                                    : `${process.env.NEXT_PUBLIC_BUILDING_URL}` +
                                      product?.attributes?.craft_images?.data
                                        ?.attributes?.image?.data?.attributes
                                        ?.url
                                }
                                alt=""
                                className="w-100"
                              />
                            </div>
                          </a>
                        </div>
                        <span>{product?.attributes?.title}</span>
                      </td>
                      <td className="georgian">
                        <a
                          href={`${product?.attributes?.productLink}`}
                          target="_blank"
                        >
                          {
                            product?.attributes?.supplier?.data?.attributes
                              ?.title
                          }
                        </a>
                      </td>
                      <td className="georgian">
                        {product?.attributes?.quantity}
                      </td>
                      <td className="georgian">
                        {product?.attributes?.unit?.data?.attributes?.title}
                      </td>
                      <td className="georgian">{product?.attributes?.price}</td>
                      <td className="georgian">
                        {product?.attributes?.type === "product"
                          ? "პროდუქტი"
                          : "სერვისი"}
                      </td>
                      <td className="georgian">
                        {product?.attributes?.type === "product"
                          ? product?.attributes?.status
                            ? "შეძენილია"
                            : "არაა შეძენილი"
                          : "პროცესშია"}
                      </td>
                      {select === null && (
                        <td
                          onClick={() => changeModalHandler(product)}
                          className={`${"text-end"} ${styles.changeModal}`}
                        >
                          <div className="menu-item px-3 padding8">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="30"
                              height="30"
                              fill="currentColor"
                              className="bi bi-three-dots"
                              viewBox="0 0 16 16"
                            >
                              {" "}
                              <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />{" "}
                            </svg>
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
                                className="menu-item px-3"
                              >
                                <a className="menu-link px-3 georgian padding0">
                                  <i className="bi bi-pencil-fill" />
                                  &nbsp;გადაკეთება
                                </a>
                              </div>
                              <div
                                onClick={() => {
                                  confirmHandler(product?.id);
                                }}
                                className="menu-item px-3 padding8"
                              >
                                <a
                                  className="menu-link px-3 georgian padding0"
                                  data-kt-users-table-filter="delete_row"
                                >
                                  <i className="bi bi-eraser-fill" />
                                  &nbsp;წაშლა
                                </a>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </td>
                      )}
                    </tr>
                  </tbody>
                );
              })}
          </>
        )}
      </table>
    </div>
  );
};

export default TableExport;
