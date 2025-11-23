import api from "../../api/api"
import axios from "axios";

export const fetchProducts = (queryString) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" })
        const url = queryString ? `/products?${queryString}` : "/products";
        const { data } = await api.get(url);
        dispatch({
            type: "FETCH_PRODUCTS",
            payload: data.productSummaries,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.isLastPage,
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch products",
         });
    }
};

// -------- SELLER: Fetch own products --------
export const fetchSellerProducts = (queryString) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const url = queryString ? `/products/sellers?${queryString}` : "/products/sellers";
        const { data } = await api.get(url);
        const items = Array.isArray(data?.productSummaries)
            ? data.productSummaries
            : (Array.isArray(data?.items) ? data.items
                : (Array.isArray(data?.content) ? data.content
                    : (Array.isArray(data) ? data : [])));
        dispatch({
            type: "FETCH_PRODUCTS",
            payload: items,
            pageNumber: Number(data?.pageNumber ?? data?.number ?? 0),
            pageSize: Number(data?.pageSize ?? data?.size ?? items.length ?? 10),
            totalElements: Number(data?.totalElements ?? items.length ?? 0),
            totalPages: Number(data?.totalPages ?? 1),
            lastPage: Boolean(typeof data?.isLastPage !== 'undefined' ? data?.isLastPage : (data?.last ?? true)),
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch seller products",
         });
    }
};

export const fetchCategories = (queryString) => async (dispatch) => {
    try {
        dispatch({ type: "CATEGORY_LOADER" });
        const url = queryString ? `/categories?${queryString}` : "/categories";
        const { data } = await api.get(url);
        const categories = Array.isArray(data?.categories)
            ? data.categories
            : (Array.isArray(data?.items) ? data.items
                : (Array.isArray(data?.content) ? data.content : []));
        dispatch({
            type: "FETCH_CATEGORIES",
            payload: categories,
            pageNumber: data?.pageNumber ?? data?.pageable?.pageNumber ?? 0,
            pageSize: data?.pageSize ?? data?.pageable?.pageSize ?? categories.length ?? 0,
            totalElements: data?.totalElements ?? data?.total ?? categories.length ?? 0,
            totalPages: data?.totalPages ?? data?.pageable?.totalPages ?? 1,
            lastPage: data?.isLastPage ?? data?.lastPage ?? false,
        });
        dispatch({ type: "CATEGORY_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch categories",
         });
    }
};

// -------- ADMIN: Create category --------
export const createCategoryDashboardAction = (payload, setOpen, reset, toast) => async (dispatch) => {
    try {
        dispatch({ type: "CATEGORY_LOADER" });
        const body = {
            categoryName: payload?.categoryName,
            description: payload?.description,
        };
        await api.post(`/categories`, body);
        toast?.success?.("Category created successfully");
        typeof setOpen === 'function' && setOpen(false);
        typeof reset === 'function' && reset();
        try { await dispatch(fetchCategories()); } catch (_) {}
        dispatch({ type: "CATEGORY_SUCCESS" });
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to create category";
        toast?.error?.(message);
        dispatch({ type: "IS_ERROR", payload: message });
    }
};

// -------- ADMIN: Update category --------
export const updateCategoryDashboardAction = (payload, setOpen, categoryId, reset, toast) => async (dispatch) => {
    try {
        dispatch({ type: "CATEGORY_LOADER" });
        if (!categoryId) throw new Error("Missing category id");
        const body = {
            categoryName: payload?.categoryName,
            description: payload?.description,
        };
        await api.put(`/categories/${encodeURIComponent(categoryId)}`, body);
        toast?.success?.("Category updated successfully");
        typeof setOpen === 'function' && setOpen(false);
        typeof reset === 'function' && reset();
        try { await dispatch(fetchCategories()); } catch (_) {}
        dispatch({ type: "CATEGORY_SUCCESS" });
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to update category";
        toast?.error?.(message);
        dispatch({ type: "IS_ERROR", payload: message });
    }
};

// -------- ADMIN: Delete category --------
export const deleteCategoryDashboardAction = (setOpen, categoryId, toast) => async (dispatch) => {
    try {
        dispatch({ type: "CATEGORY_LOADER" });
        if (!categoryId) throw new Error("Missing category id");
        await api.delete(`/categories/${encodeURIComponent(categoryId)}`);
        toast?.success?.("Category deleted successfully");
        typeof setOpen === 'function' && setOpen(false);
        try { await dispatch(fetchCategories()); } catch (_) {}
        dispatch({ type: "CATEGORY_SUCCESS" });
        return true;
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to delete category";
        toast?.error?.(message);
        dispatch({ type: "IS_ERROR", payload: message });
        return false;
    }
};

export const fetchProductById = (id) => async (dispatch) => {
    try {
        dispatch({ type: "DETAIL_LOADING" });
        const { data } = await api.get(`/products/${id}`);
        dispatch({
            type: "FETCH_PRODUCT_DETAIL",
            payload: data,
        });
        dispatch({ type: "DETAIL_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({
            type: "DETAIL_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch product detail",
        });
    }
};

// -------- ADMIN: Fetch sellers (dashboard) --------
export const getAllSellersDashboard = (queryString) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const url = queryString ? `/users/sellers?${queryString}` : "/users/sellers";
        const { data } = await api.get(url);
        // Try multiple shapes
        const sellers = Array.isArray(data?.sellers)
            ? data.sellers
            : (Array.isArray(data?.items) ? data.items
                : (Array.isArray(data?.content) ? data.content
                    : (Array.isArray(data?.users) ? data.users
                        : (Array.isArray(data) ? data : []))));
        const pageNumber = (data?.pageNumber ?? data?.pageable?.pageNumber ?? 0);
        const pageSize = (data?.pageSize ?? data?.pageable?.pageSize ?? sellers.length ?? 10);
        const totalElements = (data?.totalElements ?? data?.pageable?.totalElements ?? sellers.length ?? 0);
        const totalPages = (data?.totalPages ?? data?.pageable?.totalPages ?? 1);
        const lastPage = Boolean(data?.isLastPage ?? data?.last ?? false);
        dispatch({
            type: "FETCH_SELLERS",
            payload: sellers,
            pageNumber,
            pageSize,
            totalElements,
            totalPages,
            lastPage,
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to fetch sellers";
        dispatch({ type: "IS_ERROR", payload: message });
    }
};

// -------- ADMIN: Create new seller (dashboard) --------
export const addNewDashboardSeller = (payload, toast, reset, setOpen, setLoader) => async (dispatch) => {
    try {
        if (typeof setLoader === 'function') setLoader(true);
        const body = {
            username: payload?.username,
            firstName: payload?.firstName,
            lastName: payload?.lastName,
            email: payload?.email,
            password: payload?.password,
        };
        await api.post(`/users/signup/sellers`, body);
        toast?.success?.("Seller created successfully");
        typeof setOpen === 'function' && setOpen(false);
        typeof reset === 'function' && reset();
        // Refresh list
        try { await dispatch(getAllSellersDashboard()); } catch (_) {}
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to create seller";
        toast?.error?.(message);
        dispatch({ type: "IS_ERROR", payload: message });
    } finally {
        if (typeof setLoader === 'function') setLoader(false);
    }
};

// -------- ADMIN: Update product from dashboard --------
export const updateProductFromDashboard = (payload, toast, reset, setLoader, setOpen) => async (dispatch) => {
    try {
        if (typeof setLoader === 'function') setLoader(true);
        const { id, ...body } = payload || {};
        if (!id) throw new Error("Missing product id");
        // 更新产品信息
        await api.put(`/products/${id}`, body);
        if (toast) toast.success("Product updated successfully");
        if (typeof setOpen === 'function') setOpen(false);
        if (typeof reset === 'function') reset();
        // 刷新产品列表（保底，不携带查询参数）
        try { await dispatch(fetchProducts()); } catch (_) {}
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to update product";
        if (toast) toast.error(message);
        // 可根据需要派发错误状态
        // dispatch({ type: "IS_ERROR", payload: message });
    } finally {
        if (typeof setLoader === 'function') setLoader(false);
    }
};

// -------- ADMIN: Create product from dashboard --------
export const createProductFromDashboard = (categoryId, payload, toast, reset, setLoader, setOpen) => async (dispatch) => {
    try {
        if (typeof setLoader === 'function') setLoader(true);
        if (!categoryId) throw new Error("Missing category id");
        const body = payload || {};
        await api.post(`/products/categories/${categoryId}`, body);
        if (toast) toast.success("Product created successfully");
        if (typeof setOpen === 'function') setOpen(false);
        if (typeof reset === 'function') reset();
        try { await dispatch(fetchProducts()); } catch (_) {}
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to create product";
        if (toast) toast.error(message);
    } finally {
        if (typeof setLoader === 'function') setLoader(false);
    }
};

// -------- ADMIN: Delete product from dashboard --------
export const deleteProductFromDashboard = (productId, toast, setLoader, setOpen) => async (dispatch) => {
    try {
        if (typeof setLoader === 'function') setLoader(true);
        if (!productId) throw new Error("Missing product id");
        await api.delete(`/products/${encodeURIComponent(productId)}`);
        if (toast) toast.success("Product deleted successfully");
        if (typeof setOpen === 'function') setOpen(false);
        // 刷新产品列表（不携带查询参数）
        try { await dispatch(fetchProducts()); } catch (_) {}
        return true;
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to delete product";
        if (toast) toast.error(message);
        return false;
    } finally {
        if (typeof setLoader === 'function') setLoader(false);
    }
};

// -------- ADMIN: Upload product image --------
export const uploadProductImage = (productId, file, toast, setLoader, setOpen) => async (dispatch) => {
    try {
        if (typeof setLoader === 'function') setLoader(true);
        if (!productId) throw new Error("Missing product id");
        if (!file) throw new Error("Please select an image file");
        const formData = new FormData();
        formData.append('image', file);
        await api.put(`/products/${encodeURIComponent(productId)}/image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (toast) toast.success("Image uploaded successfully");
        if (typeof setOpen === 'function') setOpen(false);
        // 刷新产品列表以显示新图片
        try { await dispatch(fetchProducts()); } catch (_) {}
        return true;
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to upload image";
        if (toast) toast.error(message);
        return false;
    } finally {
        if (typeof setLoader === 'function') setLoader(false);
    }
};

// -------- AUTH: Cookie-based session via backend --------

// -------- Proactive refresh & cleanup timers --------
let accessRefreshTimerId = null;
let refreshExpiryTimerId = null;

const clearAuthTimers = () => {
    try {
        if (accessRefreshTimerId) {
            clearTimeout(accessRefreshTimerId);
            accessRefreshTimerId = null;
        }
        if (refreshExpiryTimerId) {
            clearTimeout(refreshExpiryTimerId);
            refreshExpiryTimerId = null;
        }
    } catch (_) {}
};

const scheduleAuthTimers = (dispatch, expiresInSec, refreshExpiresInSec) => {
    // Clear existing timers first
    clearAuthTimers();

    const safeLeadForAccess = 30; // 提前 30s 触发刷新
    const safeLeadForRefresh = 5;  // 提前 5s 触发登出清理

    const accTtlSafe = Number(expiresInSec) - safeLeadForAccess;
    const refTtlSafe = Number(refreshExpiresInSec) - safeLeadForRefresh;

    if (Number.isFinite(accTtlSafe) && accTtlSafe > 0) {
        accessRefreshTimerId = setTimeout(() => {
            dispatch(refreshAccessToken());
        }, accTtlSafe * 1000);
    }

    if (Number.isFinite(refTtlSafe) && refTtlSafe > 0) {
        refreshExpiryTimerId = setTimeout(() => {
            dispatch(logout());
        }, refTtlSafe * 1000);
    }
};

// 取消应用启动时读取本地 token 与定时器初始化（改用 Cookie 会话）

// 统一将后端 UserInfoResponse 映射为前端使用的用户对象
const normalizeUser = (u) => {
    if (!u || typeof u !== 'object') return null;
    const firstName = String(u.firstName || '').trim();
    const lastName = String(u.lastName || '').trim();
    const hasNames = firstName || lastName;
    const name = hasNames
        ? `${firstName}${firstName && lastName ? ' ' : ''}${lastName}`
        : (u.name || u.username || '');
    return {
        id: u.id ?? u.userId ?? null,
        username: u.username ?? '',
        name,
        email: u.email ?? '',
        // 支持后端返回的单个 role 或数组 roles，统一为 roles 数组
        roles: Array.isArray(u.roles)
            ? u.roles
            : (u.roles ? [u.roles]
                : (u.role ? [u.role] : [])),
        enabled: u.enabled ?? true,
        deleted: u.deleted ?? false,
        createdAt: u.createdAt ?? null,
        updatedAt: u.updatedAt ?? null,
    };
};

export const loginWithPassword = (username, password) => async (dispatch) => {
    try {
        dispatch({ type: "AUTH_LOADING" });

        // 后端从 Cookie 写入令牌；请求体使用 username
        const payload = { username, password };
        const { data } = await api.post(`/users/login`, payload);

        const user = normalizeUser(data?.user || null);
        const accessTokenExpiresIn = data?.accessTokenExpiresIn; // seconds
        const refreshTokenExpiresIn = data?.refreshTokenExpiresIn; // seconds

        // 更新认证状态（不再管理前端 token），用占位符确保现有逻辑兼容
        dispatch({
            type: "AUTH_SUCCESS",
            payload: { accessToken: "session", idToken: null, refreshToken: null, user },
        });

        // 基于后端提供的 TTL 安排刷新与会话清理
        if (Number.isFinite(accessTokenExpiresIn) || Number.isFinite(refreshTokenExpiresIn)) {
            scheduleAuthTimers(dispatch, accessTokenExpiresIn, refreshTokenExpiresIn);
        }

        // 登录后初始化购物车徽标
        try { await dispatch(fetchCart()); } catch (_) {}
    } catch (error) {
        const status = error?.response?.status;
        // Login failure messages in English
        const message = status === 401
            ? "Incorrect username or password"
            : (error?.response?.data?.message || error?.message || "Login failed, please try again later");
        dispatch({ type: "AUTH_ERROR", payload: message });
    }
};

// 应用启动时尝试从 Cookie 会话获取当前用户
export const bootstrapSession = () => async (dispatch) => {
    try {
        dispatch({ type: "AUTH_LOADING" });
        // 后端会话查询接口：GET /users 返回 UserInfoResponse
        const { data } = await api.get(`/users`);
        const user = normalizeUser(data?.user || data || null);
        if (user) {
            dispatch({
                type: "AUTH_SUCCESS",
                payload: { accessToken: "session", idToken: null, refreshToken: null, user },
            });
        } else {
            dispatch({ type: "AUTH_LOGOUT" });
        }
    } catch (_) {
        // 会话不存在或请求失败则视为未登录
        dispatch({ type: "AUTH_LOGOUT" });
    }
};

// -------- USER SIGNUP --------
// Elegantly handle user registration via backend API
export const registerUser = (payload) => async (dispatch) => {
    // payload shape: { username, firstName, lastName, email, password }
    try {
        dispatch({ type: "REGISTER_LOADING" });
        // No specific redux state coupling needed; component handles loader/toast
        const { data } = await api.post(`/users/signup`, payload);
        // Expect backend to return created user or success message
        dispatch({ type: "REGISTER_SUCCESS" });
        return data || true;
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Registration failed, please try again later";
        dispatch({ type: "REGISTER_ERROR", payload: message });
        throw new Error(message);
    }
};

// -------- SELLER SIGNUP --------
// Register seller accounts via dedicated backend endpoint
export const registerSeller = (payload) => async (dispatch) => {
    // payload shape: { username, firstName, lastName, email, password }
    try {
        dispatch({ type: "REGISTER_LOADING" });
        const { data } = await api.post(`/users/signup/sellers`, payload);
        dispatch({ type: "REGISTER_SUCCESS" });
        return data || true;
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Seller registration failed, please try again later";
        dispatch({ type: "REGISTER_ERROR", payload: message });
        throw new Error(message);
    }
};

// -------- USER ADDRESSES (Checkout) --------
export const fetchUserAddresses = () => async (dispatch) => {
    try {
        dispatch({ type: "ADDRESSES_LOADING" });
        const { data } = await api.get(`/addresses/users`);
        dispatch({ type: "ADDRESSES_SUCCESS", payload: Array.isArray(data) ? data : (data?.items || []) });
        return data;
    } catch (error) {
        const statusCode = error?.response?.status || error?.response?.data?.statusCode;
        const backendMessage = error?.response?.data?.message || "";
        // Treat 404 (no addresses) as empty list rather than an error
        if (statusCode === 404 || /no addresses found/i.test(String(backendMessage))) {
            dispatch({ type: "ADDRESSES_SUCCESS", payload: [] });
            return [];
        }
        const message = backendMessage || error?.message || "Failed to fetch addresses";
        dispatch({ type: "ADDRESSES_ERROR", payload: message });
        throw new Error(message);
    }
};

export const createAddress = (address) => async (dispatch) => {
    try {
        dispatch({ type: "ADDRESS_SAVING" });
        const { data } = await api.post(`/addresses`, address);
        dispatch({ type: "ADDRESS_SAVE_SUCCESS" });
        // Refresh list to reflect new address
        try { await dispatch(fetchUserAddresses()); } catch (_) {}
        return data;
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to create address";
        dispatch({ type: "ADDRESS_SAVE_ERROR", payload: message });
        throw new Error(message);
    }
};

export const updateAddress = (addressId, address) => async (dispatch) => {
    try {
        dispatch({ type: "ADDRESS_SAVING" });
        const { data } = await api.put(`/addresses/${addressId}`, address);
        dispatch({ type: "ADDRESS_SAVE_SUCCESS" });
        // Refresh list to reflect updates
        try { await dispatch(fetchUserAddresses()); } catch (_) {}
        return data;
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to update address";
        dispatch({ type: "ADDRESS_SAVE_ERROR", payload: message });
        throw new Error(message);
    }
};

export const deleteAddress = (addressId) => async (dispatch) => {
    try {
        dispatch({ type: "ADDRESS_SAVING" });
        await api.delete(`/addresses/${addressId}`);
        dispatch({ type: "ADDRESS_SAVE_SUCCESS" });
        // Refresh list after deletion
        try { await dispatch(fetchUserAddresses()); } catch (_) {}
        return true;
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to delete address";
        dispatch({ type: "ADDRESS_SAVE_ERROR", payload: message });
        throw new Error(message);
    }
};

// -------- PAYMENT METHOD (Checkout) --------
export const addPaymentMethod = (method) => (dispatch) => {
    try {
        dispatch({ type: "PAYMENT_METHOD_SET", payload: method });
    } catch (_) {}
};

// -------- ORDER & PAYMENTS (Checkout) --------
// 创建订单（需登录）：POST /orders { addressId }
export const createOrder = (addressId) => async (dispatch, getState) => {
    try {
        const { user } = getState().auth || {};
        if (!user) {
            // 未登录：由拦截器统一重定向，这里抛错以便组件处理
            throw new Error("Please log in to place order");
        }
        dispatch({ type: "IS_FETCHING" });
        const payload = { addressId };
        const { data } = await api.post(`/orders`, payload);
        dispatch({ type: "IS_SUCCESS" });
        return data;
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to create order";
        dispatch({ type: "IS_ERROR", payload: message });
        throw new Error(message);
    }
};

// 旧接口 /payments/stripe-client-secret 已废弃（按 amount/currency），改为按订单 ID 获取

// 获取 Stripe client secret（按订单）：POST /payments/stripe/pay/orders/{orderId}
export const getStripeClientSecretByOrder = (orderId) => async (dispatch) => {
    try {
        if (!orderId) {
            throw new Error("Missing orderId");
        }
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.post(`/payments/stripe/pay/orders/${encodeURIComponent(orderId)}`);
        const secret = typeof data === 'string' ? data : (data?.clientSecret || "");
        if (!secret) throw new Error("Missing client secret");
        dispatch({ type: "CLIENT_SECRET_SET", payload: secret });
        try { localStorage.setItem("client-secret", secret); } catch (_) {}
        dispatch({ type: "IS_SUCCESS" });
        return secret;
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to get client secret";
        dispatch({ type: "IS_ERROR", payload: message });
        throw new Error(message);
    }
};

// 模拟支付完成并清理：POST /order/users/payments/online
export const stripePaymentConfirmation = (sendData, setErrorMesssage, setLoading, toast) => async (dispatch) => {
    try {
        setLoading?.(true);
        const { response } = await api.post(`/order/users/payments/online`, sendData);
        if (response?.data) {
            try { localStorage.removeItem("cartItems"); } catch (_) {}
            try { localStorage.removeItem("client-secret"); } catch (_) {}
            dispatch({ type: "CLIENT_SECRET_CLEAR" });
            dispatch({ type: "CART_CLEAR" });
            // 同步清空结账地址（兼容原示例动作名）
            dispatch({ type: "REMOVE_CLIENT_SECRET_ADDRESS" });
            toast?.success?.("Order Accepted");
        } else {
            setErrorMesssage?.("Payment Failed. Please try again.");
        }
    } catch (error) {
        setErrorMesssage?.("Payment Failed. Please try again.");
    } finally {
        setLoading?.(false);
    }
};

// 主动刷新会话（调用后端 /users/refresh）
export const refreshAccessToken = () => async (dispatch) => {
    try {
        await api.post(`/users/refresh`);
        // 如后端返回新的 TTL，可在此读取并重设定时器；否则保持原计划直到下一次刷新
    } catch (err) {
        // 刷新失败则登出
        dispatch(logout());
    }
};

export const logout = () => async (dispatch) => {
    try {
        // 立即清理定时器
        clearAuthTimers();
        try { await api.post(`/users/logout`); } catch (_) {}
    } finally {
        dispatch({ type: "AUTH_LOGOUT" });
        // Clear cart state so navbar badge resets to 0 immediately
        dispatch({ type: "CART_CLEAR" });
    }
};

// Add to Cart
export const addToCart = (productId, quantity) => async (dispatch) => {
    try {
        // Prefer POST for mutating the cart
        const { data } = await api.post(`/carts/products/${encodeURIComponent(productId)}/quantity/${encodeURIComponent(quantity)}`);
        // Optionally dispatch success to global state if needed
        // If backend returns full cart, set it; otherwise fetch
        if (data && typeof data === "object" && (Array.isArray(data.cartItems) || typeof data.totalPrice !== "undefined")) {
            const items = Array.isArray(data.cartItems) ? data.cartItems : [];
            const total = Number(data.totalPrice) || 0;
            dispatch({ type: "CART_SET", payload: { items, totalPrice: total } });
        } else {
            // Fallback: refresh cart from server
            dispatch(fetchCart());
        }
        return data || true;
    } catch (error) {
        const status = error?.response?.status;
        const message = error?.response?.data?.message || error?.message || "Failed to add to cart";
        if (status === 401) {
            dispatch({ type: "AUTH_ERROR", payload: "Unauthorized. Please login." });
        }
        throw new Error(message);
    }
};

// Fetch Cart (Redux)
export const fetchCart = () => async (dispatch) => {
    try {
        dispatch({ type: "CART_LOADING" });
        const { data } = await api.get(`/carts/users/cart`);
        const total = Number(data?.totalPrice) || 0;
        const items = Array.isArray(data?.cartItems) ? data.cartItems : [];
        dispatch({ type: "CART_SET", payload: { items, totalPrice: total } });
    } catch (error) {
        const statusCode = error?.response?.data?.statusCode || error?.response?.status;
        const backendMessage = error?.response?.data?.message || "";
        if (statusCode === 400 && /cart is empty/i.test(backendMessage)) {
            dispatch({ type: "CART_SET", payload: { items: [], totalPrice: 0 } });
        } else if (statusCode === 401) {
            // 未登录或会话失效
            dispatch({ type: "CART_CLEAR" });
        } else {
            const message = backendMessage || error?.message || "Failed to load cart";
            dispatch({ type: "CART_ERROR", payload: message });
        }
    }
};

// Increase cart item quantity by 1
export const increaseCartItem = (productId) => async (dispatch) => {
    try {
        await api.put(`/carts/products/${encodeURIComponent(productId)}/quantity/increase`);
        // Do not refetch entire cart; component will update its own state and patch Redux
        return true;
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to increase quantity";
        throw new Error(message);
    }
};

// Decrease cart item quantity by 1
export const decreaseCartItem = (productId) => async (dispatch) => {
    try {
        await api.put(`/carts/products/${encodeURIComponent(productId)}/quantity/decrease`);
        return true;
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to decrease quantity";
        throw new Error(message);
    }
};

// Delete product from cart
export const deleteCartItem = (productId) => async (dispatch) => {
    try {
        await api.delete(`/carts/product/${encodeURIComponent(productId)}`);
        return true;
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to remove item";
        throw new Error(message);
    }
};