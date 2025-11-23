import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACK_END_URL}`,
  withCredentials: true,
});

// 使用 Cookie 会话，不再附加 Authorization 头
api.interceptors.request.use((config) => {
  return config;
});

// -------- 会话刷新（基于后端 /users/refresh） --------
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (ok) => {
  refreshSubscribers.forEach((cb) => cb(ok));
  refreshSubscribers = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error || {};
    if (!response) return Promise.reject(error);
    if (response.status !== 401) return Promise.reject(error);

    // 登录/刷新/登出接口不参与 401 刷新，交由各自逻辑处理
    try {
      const url = String(config?.url || "");
      if (url.includes("/users/login") || url.includes("/users/refresh") || url.includes("/users/logout")) {
        return Promise.reject(error);
      }
    } catch (_) {}

    if (config._retry) return Promise.reject(error);
    config._retry = true;

    // 刷新中的请求加入队列
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((ok) => {
          if (ok) {
            resolve(api(config));
          } else {
            reject(error);
          }
        });
      });
    }

    isRefreshing = true;
    try {
      // 让后端基于 Cookie 刷新 access_token
      await api.post(`/users/refresh`);

      isRefreshing = false;
      onRefreshed(true);
      // 刷新成功后重试原始请求（Cookie 已更新）
      return api(config);
    } catch (refreshErr) {
      isRefreshing = false;
      onRefreshed(false);
      // 刷新失败，尝试登出并回到登录页
      try { await api.post(`/users/logout`); } catch (_) {}
      try {
        const { store } = await import("../store/reducers/store.js");
        store.dispatch({ type: "AUTH_LOGOUT" });
      } catch (_) {}
      try {
        if (typeof window !== "undefined") {
          const path = window.location.pathname;
          if (path !== "/login" && path !== "/register") {
            window.location.href = "/login";
          }
        }
      } catch (_) {}
      return Promise.reject(refreshErr);
    }
  }
);

export default api;