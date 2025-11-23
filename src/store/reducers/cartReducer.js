const initialState = {
  items: [],
  totalPrice: 0,
  loading: false,
  error: null,
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CART_LOADING":
      return { ...state, loading: true, error: null };
    case "CART_SET": {
      const items = Array.isArray(action.payload?.items) ? action.payload.items : [];
      const totalPrice = Number(action.payload?.totalPrice) || 0;
      return { ...state, items, totalPrice, loading: false, error: null };
    }
    case "CART_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "CART_CLEAR":
      return { ...initialState };
    default:
      return state;
  }
};