import { useState, useCallback } from 'react';
const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFunc(...args);
        setData(res.data);
        return res.data;
      } catch (err) {
        const message =
          err.response?.data?.message || err.message || 'Something went wrong';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { execute, data, loading, error, reset };
};

export default useApi;
