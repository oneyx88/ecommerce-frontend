const initialState = {
  sellers: null,
  pagination: {
    pageNumber: 1,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    lastPage: false,
  },
};

export const sellerReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_SELLERS": {
      const sellers = Array.isArray(action.payload) ? action.payload : [];
      return {
        ...state,
        sellers,
        pagination: {
          pageNumber: Number(action.pageNumber ?? state.pagination.pageNumber) + 0,
          pageSize: Number(action.pageSize ?? state.pagination.pageSize),
          totalElements: Number(action.totalElements ?? state.pagination.totalElements),
          totalPages: Number(action.totalPages ?? state.pagination.totalPages),
          lastPage: Boolean(action.lastPage ?? state.pagination.lastPage),
        },
      };
    }
    default:
      return state;
  }
};

export default sellerReducer;