const CraftSelect = ({
  product,
  craftStatusValues,
  setCraftStatusValues,
  craftStatus,
  confirmServiceEdit,
  defaultCraftStatusValue,
}) => {
  return (
    <select
      className="form-select"
      value={craftStatusValues[product.id] || defaultCraftStatusValue || ""}
      onChange={(event) => {
        const newCraftStatusValue = event.target.value;
        setCraftStatusValues((prevStatusValues) => ({
          ...prevStatusValues,
          [product.id]: newCraftStatusValue,
        }));
        confirmServiceEdit(newCraftStatusValue, product);
      }}
    >
      <option style={{ display: "none" }}>{defaultCraftStatusValue}</option>
      {craftStatus &&
        craftStatus.map((item) => (
          <option key={item.id} value={item.id}>
            {item.attributes.title}
          </option>
        ))}
    </select>
  );
};

export default CraftSelect;
