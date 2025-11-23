const initialState = {
  items: [],
  loading: false,
  error: null,
  saving: false,
  saveError: null,
  selectedId: null,
  selectedDetail: null,
};

export const addressesReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADDRESSES_LOADING":
      return { ...state, loading: true, error: null };
    case "ADDRESSES_SUCCESS":
      {
        const items = Array.isArray(action.payload) ? action.payload : [];
        const selectedDetail = state.selectedId
          ? (items.find(a => (a?.addressId || a?.id) === state.selectedId) || null)
          : null;
        return { ...state, loading: false, error: null, items, selectedDetail };
      }
    case "ADDRESSES_ERROR":
      return { ...state, loading: false, error: action.payload || "Failed to load addresses" };

    case "ADDRESS_SAVING":
      return { ...state, saving: true, saveError: null };
    case "ADDRESS_SAVE_SUCCESS":
      return { ...state, saving: false, saveError: null };
    case "ADDRESS_SAVE_ERROR":
      return { ...state, saving: false, saveError: action.payload || "Failed to save address" };

    case "ADDRESS_SELECTED": {
      const selectedId = action.payload || null;
      const selectedDetail = selectedId
        ? (state.items.find(a => (a?.addressId || a?.id) === selectedId) || null)
        : null;
      return { ...state, selectedId, selectedDetail };
    }

    // 兼容示例：在支付完成后清理选中地址
    case "REMOVE_CLIENT_SECRET_ADDRESS": {
      return { ...state, selectedId: null, selectedDetail: null };
    }

    default:
      return state;
  }
};

export default addressesReducer;