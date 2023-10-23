// Import Scoped Style
import ps from "@/styles/pages/products.module.css";
// Other Imports
import { productsData } from "@/public/assets/data/products";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resolveSetBasketDataAction,
  resolveSetHideAlert,
} from "@/store/slices/BasketSlice";

export default function Products() {
  // Define dispatch for redux requests
  const dispatch = useDispatch();
  // Products Data Variable
  const [products, setProducts] = useState([]);
  // Basket Temp Storage Variable
  const [basket, setBasket] = useState([]);
  //   const [productExist, setProductExist] = useState(false);
  //   const [productExistName, setProductExistName] = useState("");
  const activeProducts = useSelector((state) => state.basket.activeProducts);
  const productExistName = useSelector(
    (state) => state.basket.productExistName
  );
  const productExist = useSelector((state) => state.basket.productExist);
  // Pagination Variables
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 9;
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const totalPages = Math.ceil(productsData.length / perPage);
  // Generate an array of page numbers from 1 to totalPages for looping page buttons
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );
  // Handle Change Page
  const handleChangePage = (page) => {
    setCurrentPage(page);
  };
  // Handle Next Page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  // Handle Prev Page
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  // Handle Get Products
  const handleGetProducts = () => {
    const allProductsData = productsData.slice(startIndex, endIndex);
    setProducts(allProductsData);
  };
  //   Search Handler
  const searchInProducts = (searchText) => {
    if (searchText == "") {
      handleGetProducts();
    } else {
      const allProductsData = productsData.slice(startIndex, endIndex);
      const filteredProductsData = allProductsData.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setProducts(filteredProductsData);
    }
  };
  // When First Time Load
  useEffect(() => {
    // Get All Products
    handleGetProducts();
  }, [currentPage]);

  useEffect(() => {
    const localStorageData = JSON.parse(localStorage.getItem("basket"));
    if (JSON.parse(localStorage.getItem("basket")) != null) {
      for (let i = 0; i < localStorageData.length; i++) {
        dispatch(resolveSetBasketDataAction(localStorageData[i]));
      }
      setTimeout(() => {
        dispatch(resolveSetHideAlert(true));
      }, 10);
    }
  }, []);

  // Handle Add To Basket
  const addToBasket = (product) => {
    dispatch(resolveSetBasketDataAction(product));
    setTimeout(() => {
      dispatch(resolveSetHideAlert(true));
    }, 2000);
  };

  return (
    <>
      <div className={`px-6 py-3 w-full md:w-2/5 ${ps.products}`}>
        {/* Title */}
        <h1 className="font-bold text-2xl">Products</h1>
        {/* Search Button Start */}
        <input
          type="text"
          placeholder="Search"
          className={`w-full px-5 py-2 my-3 ${ps.search} text-center text-xl`}
          onChange={(e) => searchInProducts(e.target.value)}
        />
        {products.length < 1 ? (
          <h1 className="text-center uppercase text-2xl py-5 font-bold">
            No Data Found
          </h1>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2 min-h-4/5">
              {/* Products Card Start */}
              {products.length > 0 &&
                products.map((product) => {
                  return (
                    <div
                      className={`flex flex-col justify-center items-center gap-2 cursor-pointer`}
                      key={product.id}
                      onClick={() => addToBasket(product)}
                    >
                      <div
                        className={`${ps.box} hover:bg-blue-300 ${
                          activeProducts.includes(product.id) ? ps.added : ""
                        }`}
                      ></div>
                      <div className="text-center font-bold text-xl">
                        {product.name}
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="flex justify-center items-center my-4 gap-1">
              {/* Pagination Start */}
              <button
                onClick={handlePrevPage}
                className={`px-3 py-1 rounded-lg font-bold ${
                  ps.paginationButtons
                }  ${currentPage == 1 ? ps.disabled : "hover:bg-blue-300"}`}
              >
                Previous
              </button>
              <div className="pages">
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    onClick={() => handleChangePage(page)}
                    className={`px-3 py-1 rounded-lg font-bold mx-1 ${
                      ps.paginationButtons
                    } hover:bg-blue-300 ${
                      currentPage === page ? ps.activaPage : ""
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={handleNextPage}
                disabled={currentPage == totalPages ? true : false}
                className={`px-3 py-1 rounded-lg font-bold ${
                  ps.paginationButtons
                }  ${
                  currentPage == totalPages ? ps.disabled : "hover:bg-blue-300"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
      {/* Alerts */}
      {productExist ? (
        <div
          className="p-4 mb-4 text-sm text-yellow-800 shadow-lg rounded-lg fixed z-50 top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
          role="alert"
        >
          <span className="font-medium">Warning !</span>{" "}
          <span className="font-bold">{productExistName}</span> is already exist
        </div>
      ) : (
        ""
      )}
    </>
  );
}
