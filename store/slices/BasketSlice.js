import { createSlice } from "@reduxjs/toolkit";

const generalSlice = createSlice({
  name: "basket",
  initialState: {
    basketsData: [],
    activeProducts: [],
    idsForRemove: [],
    productExistName: "",
    productExist: false,
  },
  reducers: {
    resolveSetBasketDataAction: (state, action) => {
      const product = action.payload;
      const productCopy = { ...product };
      // Check If Product Exist In Our State
      const existingProduct = state.basketsData.find(
        (item) => item.id === product.id
      );
      if (!existingProduct) {
        productCopy.quantity = 1;
        const updatedBasket = [...state.basketsData, productCopy];
        localStorage.setItem("basket", JSON.stringify(updatedBasket));
        state.basketsData.push(productCopy);
        state.activeProducts.push(productCopy.id);
      } else {
        state.productExistName = productCopy.name;
        state.productExist = true;
      }
    },
    resolveIncrementQuantity: (state, action) => {
      const { productId } = action.payload;
      // Check If Product Exist In Our State
      const product = state.basketsData.find((item) => item.id === productId);
      if (product) {
        product.quantity += 1;
      }
    },
    resolveDecrementQuantity: (state, action) => {
      const { productId } = action.payload;
      // Check If Product Exist In Our State
      const product = state.basketsData.find((item) => item.id === productId);
      if (product && product.quantity > 1) {
        product.quantity -= 1;
      }
    },
    resolveRemoveBasketDataByIdAction: (state, action) => {
      if (action.payload == "removeAll") {
        state.basketsData = [];
        state.activeProducts = [];
        state.idsForRemove = [];
      } else {
        const product = action.payload;
        // Check If Product Exist In Our State
        const existingProduct = state.basketsData.find(
          (item) => item.id === product.id
        );
        if (existingProduct) {
          // Remove items with matching ids
          const updatedBasketData = basketData.filter(
            (item) => !idsForRemove.includes(item.id)
          );
          state.basketsData = updatedBasketData;
        }
      }
    },
    resolveRemoveProductFromBasketDataAction: (state, action) => {
      const productId = action.payload;
      // Check If Product Exist In Our State
      const existingProduct = state.basketsData.find(
        (item) => item.id === productId
      );
      if (existingProduct) {
        state.basketsData = state.basketsData.filter(
          (productItem) => productItem.id !== productId
        );
        state.activeProducts = state.activeProducts.filter(
          (id) => id !== productId
        );
        state.idsForRemove = state.idsForRemove.filter(
          (id) => id !== productId
        );
      }
    },
    resolveSetIdsForRemoveAction: (state, action) => {
      const product = action.payload;
      // Check If Product Exist In Our State
      const existingProduct = state.basketsData.find(
        (item) => item.id === product.id
      );
      const existingId = state.idsForRemove.find((id) => id === product.id);
      if (existingProduct) {
        if (!existingId) {
          state.idsForRemove.push(product.id);
        }
      }
    },
    resolveRemoveIdsForRemoveAction: (state, action) => {
      const product = action.payload;
      // Check If Product Exist In Our State
      const isIdExistOnIdsForRemoveState = state.idsForRemove.find(
        (id) => id === product.id
      );
      if (isIdExistOnIdsForRemoveState == product.id) {
        state.idsForRemove = state.idsForRemove.filter(
          (id) => id !== product.id
        );
      }
    },
    resolveSetHideAlert: (state, action) => {
      if (action.payload == true) {
        state.productExistName = "";
        state.productExist = false;
      }
    },
    resolveProcessToCheckoutAction: (state, action) => {
      if (action.payload == true) {
        state.basketsData = [];
        state.activeProducts = [];
        state.idsForRemove = [];
        state.productExistName = "";
        state.productExist = false;
        localStorage.removeItem("basket");
      }
    },
  },
});

export const {
  resolveSetBasketDataAction,
  resolveIncrementQuantity,
  resolveDecrementQuantity,
  resolveRemoveBasketDataByIdAction,
  resolveRemoveProductFromBasketDataAction,
  resolveSetIdsForRemoveAction,
  resolveRemoveIdsForRemoveAction,
  resolveSetHideAlert,
  resolveProcessToCheckoutAction,
} = generalSlice.actions;
export default generalSlice.reducer;
