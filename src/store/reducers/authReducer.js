const initialState = {
  isAuthenticating: false,
  isRegistering: false,
  authError: null,
  registerError: null,
  accessToken: null,
  idToken: null,
  refreshToken: null,
  user: null,
  clientSecret: null,
  initialized: false,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "AUTH_LOADING":
      return { ...state, isAuthenticating: true, authError: null, initialized: false };
    case "REGISTER_LOADING":
      return { ...state, isRegistering: true, registerError: null };
    case "AUTH_SUCCESS":
      return {
        ...state,
        isAuthenticating: false,
        authError: null,
        accessToken: action.payload?.accessToken || null,
        idToken: action.payload?.idToken || null,
        refreshToken: action.payload?.refreshToken || null,
        user: action.payload?.user || null,
        initialized: true,
      };
    case "REGISTER_SUCCESS":
      return { ...state, isRegistering: false, registerError: null };
    case "AUTH_ERROR":
      return { ...state, isAuthenticating: false, authError: action.payload, initialized: true };
    case "REGISTER_ERROR":
      return { ...state, isRegistering: false, registerError: action.payload };
    case "AUTH_LOGOUT":
      return { ...state, accessToken: null, idToken: null, refreshToken: null, authError: null, user: null, clientSecret: null, isAuthenticating: false, isRegistering: false, registerError: null, initialized: true };
    case "CLIENT_SECRET_SET":
      return { ...state, clientSecret: action.payload || null };
    case "CLIENT_SECRET_CLEAR":
      return { ...state, clientSecret: null };
    default:
      return state;
  }
};

export default authReducer;