import React, { useState } from "react";
import styles from "@/styles/Home.module.css";

const ScrappingDataForm = () => {
  const [ShopId, setShopId] = useState("");
  const countries = [
    { id: 1, name: "singapore" },
    { id: 2, name: "vietnam" },
    { id: 3, name: "indonesia" },
    { id: 4, name: "malaysia" },
    { id: 5, name: "thailand" },
  ];
  const [data, setData] = useState([]);
  const [scrappingData, setscrappingData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [noData, setNoData] = useState("");

  const handleShopIdChange = (event) => {
    setShopId(event.target.value);
  };
  const [selectedCountry, setselectedCountry] = useState("singapore");

  const handleCountryChange = (event) => {
    setselectedCountry(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(ShopId);
    console.log(selectedCountry);
    setIsLoading(true);

    try {
      setNoData("");
      const response = await fetch(
        `http://127.0.0.1:5000/datascrapping?shop_id=${ShopId}&country=${selectedCountry}`
      );
      const jsonData = await response.json();
      setData(jsonData);

      if (jsonData.data == "No data") {
        setNoData("No data, wrong shop id");
        setscrappingData([]);
        setTotalProducts(0);
      } else {
        setNoData("");
        if (
          jsonData.data.hasOwnProperty("total_items") &&
          jsonData.data.total_items
        ) {
          setTotalProducts(jsonData.data.total_items);
        }
        if (
          jsonData.data.hasOwnProperty("product_infos") &&
          jsonData.data.product_infos
        ) {
          const displayData = jsonData.data.product_infos.map(
            (scrappingData) => {
              return {
                name: scrappingData.name,
                price: scrappingData.price,
              };
            }
          );
          setscrappingData(displayData);
        }
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
      setError(null);
    }
  };

  return (
    <React.Fragment>
      <div className={styles.scrapping_form}>
        <form onSubmit={handleSubmit}>
          <label className={styles.scrapping_input}> </label>
          Shop ID:
          <input
            type="text"
            name="shopId"
            value={ShopId}
            onChange={handleShopIdChange}
          />
          <br />
          <label htmlFor="selectedCountry"> </label>
          Country:
          <select
            id="selectedCountry"
            value={selectedCountry}
            onChange={handleCountryChange}
            className={styles.scrapping_input}
          >
            {countries.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <br />
          <div className={styles.scrapping_submit}>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
      <br />
      {noData && <h3 className={styles.scrapping_error_loading}>{noData}</h3>}
      {error && (
        <h3 className={styles.scrapping_error_loading}>
          An error occurred: {error.message}
        </h3>
      )}
      {isLoading ? (
        <h3 className={styles.scrapping_error_loading}>Loading...</h3>
      ) : (
        <div>
          <h2 className={styles.scrapping_count}>
            Total Products: {totalProducts}
          </h2>
          <br />
          <table className={styles.scrapping_table}>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {scrappingData.map((row, index) => (
                <tr key={index}>
                  <td>{row.name}</td>
                  <td>{row.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </React.Fragment>
  );
};

export default ScrappingDataForm;
