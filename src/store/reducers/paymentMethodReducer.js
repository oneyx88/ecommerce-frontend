const initialState = {
    paymentMethod: null,
};

export const paymentMethodReducer = (state = initialState, action) => {
    switch (action.type) {
        case "PAYMENT_METHOD_SET":
            return { ...state, paymentMethod: action.payload || null };
        case "AUTH_LOGOUT":
            // 登出时清空已选择的支付方式
            return { ...initialState };
        default:
            return state;
    }
};