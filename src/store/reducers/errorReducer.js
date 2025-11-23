const initialState = {
    isLoading: false,
    errorMessage: null,
    categoryLoader: false,
    categoryError: null,
    detailLoader: false,
    detailError: null,
};

export const errorReducer = (state = initialState, action) => {
    switch (action.type) {
        case "IS_FETCHING":
            return {
                ...state,
                isLoading: true,
                errorMessage: null,
            };
        case "IS_SUCCESS":
            return {
                ...state,
                isLoading: false,
                errorMessage: null,
            };
        case "IS_ERROR":
            return {
                ...state,
                isLoading: false,
                errorMessage: action.payload,
            }
        case "IS_SUCCESS":
            return {
                ...state,
                isLoading: false,
                errorMessage: null,
            };
        case "IS_ERROR":
            return {
                ...state,
                isLoading: false,
                errorMessage: action.payload,
            }
        case "CATEGORY_SUCCESS":
            return {
                ...state,
                categoryLoader: false,
                categoryError: null,
            };
        case "CATEGORY_LOADER":
            return {
                ...state,
                categoryLoader: true,
                categoryError: null,
                errorMessage: null,
            }

        case "DETAIL_LOADING":
            return {
                ...state,
                detailLoader: true,
                detailError: null,
            };
        case "DETAIL_SUCCESS":
            return {
                ...state,
                detailLoader: false,
                detailError: null,
            };
        case "DETAIL_ERROR":
            return {
                ...state,
                detailLoader: false,
                detailError: action.payload,
            };

        default:
            return state;
    }  
};