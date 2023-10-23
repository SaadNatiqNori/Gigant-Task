// Import Scoped Style
import bs from "@/styles/pages/basket.module.css";
// Other Imports
import { useDispatch, useSelector } from "react-redux";
import {
  resolveDecrementQuantity,
  resolveIncrementQuantity,
  resolveProcessToCheckoutAction,
  resolveRemoveIdsForRemoveAction,
  resolveRemoveProductFromBasketDataAction,
  resolveSetBasketDataAction,
  resolveSetIdsForRemoveAction,
} from "@/store/slices/BasketSlice";
import { useEffect, useState } from "react";

export default function Basket() {
  // Define dispatch for redux requests
  const dispatch = useDispatch();
  // Total Price Variable
  const [totalPrice, setTotalPrice] = useState(0);
  // Get All IDs that will be removeing
  const idsForRemove = useSelector((state) => state.basket.idsForRemove);
  // Select All Items Variable
  const [selectAll, setSelectAll] = useState(false);
  const [idOfSelectedToRemove, setIdOfSelectedToRemove] = useState([]);
  // Get All Products Added to the Basket
  const basketsData = useSelector((state) => state.basket.basketsData);
  // Modal Variables
  const [showModal, setShowModal] = useState(false);
  // Handle Increment Quantity
  const handleIncrementQty = (productId) => {
    dispatch(resolveIncrementQuantity({ productId }));
  };
  // Handle Decrement Quantity
  const handleDecrementQty = (productId) => {
    dispatch(resolveDecrementQuantity({ productId }));
  };
  // Calculate Total Price Handler
  const calcTotalPriceInBasket = () => {
    var totalPriceForEach;
    var allTotalPrice = 0;
    basketsData.forEach((element) => {
      totalPriceForEach = element.price * element.quantity;
      allTotalPrice = allTotalPrice + totalPriceForEach;
      setTotalPrice(allTotalPrice);
    });
  };

  // When First Time Load
  useEffect(() => {
    calcTotalPriceInBasket();
  }, [basketsData]);

  // Handle Select All Items
  const selectAllItems = (e) => {
    if (e.target.checked === true) {
      setSelectAll(true);
      const storage = [];
      for (let i = 0; i < basketsData.length; i++) {
        storage.push(basketsData[i].id);
        setIdOfSelectedToRemove(storage);
        dispatch(resolveSetIdsForRemoveAction(basketsData[i]));
      }
    } else {
      setSelectAll(false);
      for (let i = 0; i < basketsData.length; i++) {
        setIdOfSelectedToRemove(
          idOfSelectedToRemove.filter((id) => id !== basketsData[i].id)
        );
        dispatch(resolveRemoveIdsForRemoveAction(basketsData[i]));
      }
    }
  };
  // Handle Select One Items
  const selectOneItem = (isChecked, product) => {
    if (isChecked === true) {
      setIdOfSelectedToRemove([...idOfSelectedToRemove, product.id]);
      dispatch(resolveSetIdsForRemoveAction(product));
    } else {
      setIdOfSelectedToRemove(
        idOfSelectedToRemove.filter((id) => id !== product.id)
      );
      dispatch(resolveRemoveIdsForRemoveAction(product));
    }
  };

  // Handle Remove(Delete) Items Button
  const removeButtonHandler = () => {
    // Retrieve the current basket data from localStorage
    const basketData = JSON.parse(localStorage.getItem("basket")) || [];
    // Remove items with matching ids
    const updatedBasketData = basketData.filter(
      (item) => !idOfSelectedToRemove.includes(item.id)
    );
    // Update localStorage with the modified basket data
    localStorage.setItem("basket", JSON.stringify(updatedBasketData));
    for (let i = 0; i < idOfSelectedToRemove.length; i++) {
      console.log(idOfSelectedToRemove[i]);
      dispatch(
        resolveRemoveProductFromBasketDataAction(idOfSelectedToRemove[i])
      );
    }
    setSelectAll(false);
  };

  // Handle Process To Checkout
  const processToCheckoutHandler = () => {
    dispatch(resolveProcessToCheckoutAction(true));
    setShowModal(false);
  };

  return (
    <div className={`relative w-full px-4 py-3 ${bs.basket}`}>
      {basketsData.length < 1 ? (
        <div className="flex justify-center flex-col items-center my-5 h-52 gap-5">
          <h1 className="text-3xl font-bold">Opps!!</h1>
          <h1 className="text-xl">Your Basket Is Empty</h1>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between mb-4">
            {/* Title */}
            <h1 className="font-bold text-2xl">Basket</h1>
            {/* Delete Button */}
            <button
              onClick={() => removeButtonHandler()}
              className={`px-6 py-1 rounded-lg font-bold hover:bg-blue-200 ${bs.deleteButtons}`}
            >
              Delete
            </button>
          </div>
          {/* Table */}
          <div className="relative overflow-x-auto shadow-md">
            <table className="w-full text-sm text-left ">
              <thead className="text-xs text-white bg-blue-600 ">
                <tr>
                  <th scope="col" className="p-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-all-search"
                        type="checkbox"
                        onChange={(e) => selectAllItems(e)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  focus:ring-2 "
                      />
                      <label htmlFor="checkbox-all-search" className="sr-only">
                        checkbox
                      </label>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-lg">
                    Item
                  </th>
                  <th scope="col" className="px-6 py-3 text-lg">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-lg">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-lg">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {basketsData &&
                  basketsData.map((product, index) => {
                    return (
                      <tr
                        className={` ${
                          index % 2 == 0
                            ? "bg-blue-50 border-b border-blue-50"
                            : "bg-blue-200 border-b border-blue-200"
                        }`}
                        key={product.id}
                      >
                        <td className="w-4 p-4">
                          <div className="flex items-center">
                            <input
                              id="checkbox-table-search-1"
                              type="checkbox"
                              checked={
                                idsForRemove.includes(product.id) ? true : false
                              }
                              onChange={(e) =>
                                selectOneItem(e.target.checked, product)
                              }
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-white-900 rounded focus:ring-blue-500   focus:ring-2 "
                            />
                            <label
                              htmlFor="checkbox-table-search-1"
                              className="sr-only"
                            >
                              checkbox
                            </label>
                          </div>
                        </td>
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-lg"
                        >
                          {product.name}
                        </th>
                        <td className="px-6 py-4 font-medium text-lg">
                          <div className={`h-10 w-32 ${bs.customNumberInput}`}>
                            <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                              {/* Decrement Button */}
                              <button
                                onClick={() => handleDecrementQty(product.id)}
                                className=" border-blue-500 border-solid border-2 text-gray-600 hover:text-white-700 hover:bg-blue-400 h-full w-20 rounded-l cursor-pointer"
                              >
                                <span className="m-auto text-2xl font-bold">
                                  −
                                </span>
                              </button>
                              {/* Quantity Value */}
                              <input
                                type="number"
                                className="focus:outline-none text-center w-full border-blue-500 border-solid border-2 border-l-0 border-r-0 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700 "
                                name="custom-input-number"
                                value={product.quantity}
                              />
                              {/* Increment Button */}
                              <button
                                onClick={() => handleIncrementQty(product.id)}
                                className="border-blue-500 border-solid border-2 text-gray-600 hover:text-white-700 hover:bg-blue-400 h-full w-20 rounded-r cursor-pointer"
                              >
                                <span className="m-auto text-2xl font-bold">
                                  +
                                </span>
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-lg">
                          {product.price}
                        </td>
                        <td className="px-6 py-4 font-medium text-lg">
                          {product.price * product.quantity}
                        </td>
                      </tr>
                    );
                  })}

                {/* Total Price */}
                <tr className="bg-blue-200 border-b border-blue-200">
                  <td className="px-6 py-4 font-medium text-lg"></td>
                  <td className="px-6 py-4 font-medium text-lg"></td>
                  <td className="px-6 py-4 font-medium text-lg"></td>
                  <td className="px-6 py-4 font-medium text-lg"></td>
                  <td className="px-6 py-4 font-medium text-lg">
                    {totalPrice}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Checkout Button & Modal */}
          <div className="flex justify-end mb-4 mt-4">
            <button
              onClick={() => setShowModal(true)}
              className={`px-6 py-1 rounded-lg font-bold hover:bg-green-300 ${bs.checkoutButton}`}
            >
              Checkout
            </button>
          </div>
          {/* Modal */}
          {showModal ? (
            <div
              id="popup-modal"
              tabIndex="-1"
              className="fixed top-0 left-0 md:top-2/4 md:left-2/4 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
            >
              <div className="relative w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow shadow-xl">
                  <button
                    onClick={() => setShowModal(false)}
                    type="button"
                    className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="popup-modal"
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span
                      className="sr-only"
                      onClick={() => setShowModal(false)}
                    >
                      Close modal
                    </span>
                  </button>
                  <div className="p-6 text-center">
                    <svg
                      className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                      Are you sure you want to process to CHECKOUT with{" "}
                      <b>{basketsData.length}</b> items and <b>${totalPrice}</b>{" "}
                      Price ?
                    </h3>
                    <button
                      onClick={() => processToCheckoutHandler()}
                      data-modal-hide="popup-modal"
                      type="button"
                      className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                    >
                      Yes, I'm sure
                    </button>
                    <button
                      data-modal-hide="popup-modal"
                      onClick={() => setShowModal(false)}
                      type="button"
                      className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    >
                      No, cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </>
      )}
    </div>
  );
}
