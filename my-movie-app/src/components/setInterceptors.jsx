// setupInterceptors.js
import api from './api';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export function setupInterceptors(getAccessToken, setAccessToken) {
  // リクエスト時にアクセストークンを追加
  api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // レスポンスのインターセプター
  api.interceptors.response.use(
    (response) => response, // 成功時はそのまま
    async (error) => {
      const originalRequest = error.config;

      // アクセストークンの期限切れ → 自動でリフレッシュを試みる
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // 他のリクエストがすでにリフレッシュ中なら待つ
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const res = await api.post('/user/refresh', null, {
            withCredentials: true, // Cookie を送る
          });
          const newAccessToken = res.data.accessToken;
          setAccessToken(newAccessToken);
          processQueue(null, newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest); // リトライ
        } catch (err) {
          processQueue(err, null);
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
}
