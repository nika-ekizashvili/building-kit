import React, { useState } from "react";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

import TableExport from "./TableExport";
import XsmallSvg from "../svg/XsmallSvg";

const ExportPopup = ({
  setSelect,
  totalSum,
  aggregatedProducts,
  projectId,
  productsToMap,
  startIndex,
  endIndex,
  vatTotal,
  activeItem,
  unforeseenExpensesPrice,
  servicePercentagePrice,
  totalSumPrice,
  categorySums,
  vatTotalPrice,
  unforeseenExpenses,
  service_percentage,
  select,
}) => {
  // console.log(aggregatedProducts, 'products')
  const [format, setFormat] = useState("excel");

  const handleFormatChange = (e) => {
    setFormat(e.target.value);
  };

  const exportToPDF = () => {
    const table = document.getElementById("table2Id");

    html2canvas(table).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("table.pdf");
    });
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.table_to_book(
      document.getElementById("table2Id")
    );
    XLSX.writeFile(workbook, "table.xlsx");
  };

  const handleExport = (event) => {
    event.preventDefault();

    if (format === "pdf") {
      exportToPDF();
    } else if (format === "excel") {
      exportToExcel();
    }
  };

  return (
    <div className="modal fade show">
      <div className="modal modal-dialog-centered custom-width ">
        <div
          className="modal-content custom-width custom-export-table"
          style={{ width: "90% ", height: "90%", margin: "5%" }}
        >
          <div className="modal-header" id="kt_modal_add_user_header">
            <h3 className="geo-title">ამოღება</h3>
            <div
              className="btn btn-icon btn-sm btn-active-icon-primary"
              data-kt-users-modal-action="close"
            >
              <span
                className="svg-icon svg-icon-1"
                onClick={() => {
                  setSelect(null);
                }}
              >
                <XsmallSvg />
              </span>
            </div>
          </div>
          <div
            className="gap"
            style={{padding: '21px'}}
            >
            <label className="required fs-6 fw-bold form-label mb-2 geo-title">
              აირჩიეთ ფორმატი:
            </label>
            <div style={{gap: '6px'}} className="d-flex">
              <select
                name="format"
                data-control="select2"
                data-placeholder="აირჩიეთ ფორმატი"
                data-hide-search="true"
                className="form-select form-select-solid georgian"
                value={format}
                onChange={handleFormatChange}
              >
                <option value="excel">Excel</option>
                <option value="pdf">PDF</option>
              </select>
              <button
                className="btn btn-primary"
                data-kt-users-modal-action="submit"
                onClick={(event) => handleExport(event)}
              >
                <span className="indicator-label geo-title">გადმოწერა</span>
                <span className="indicator-progress georgian">
                  გთხოვთ დაიცადოთ...
                  <span className="spinner-border spinner-border-sm align-middle ms-2" />
                </span>
              </button>
            </div>
          </div>
          <TableExport
            totalSum={totalSum}
            select={select}
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
          />
        </div>
      </div>
    </div>
  );
};

export default ExportPopup;
