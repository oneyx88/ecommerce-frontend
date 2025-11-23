import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./ProductReducer";
import { errorReducer } from "./errorReducer";
import { authReducer } from "./authReducer";
import { cartReducer } from "./cartReducer";
import { addressesReducer } from "./addressesReducer";
import { paymentMethodReducer } from "./paymentMethodReducer";
import { sellerReducer } from "./sellerReducer";

export const store = configureStore({
    reducer: {
        products: productReducer,
        errors: errorReducer,
        auth: authReducer,
        cart: cartReducer,
        addresses: addressesReducer,
        payment: paymentMethodReducer,
        seller: sellerReducer,
    },
    preloadedState: {},
});

export default store;