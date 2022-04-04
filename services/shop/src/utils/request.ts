import axios, { AxiosRequestHeaders, Method } from 'axios';

export const callApi = <D>(
  url = '/',
  method: Method = 'GET',
  data: D,
  headers?: AxiosRequestHeaders,
) => {
  const config = {
    method,
    url,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
    data,
  };

  // if we need to check response status, should do it here
  // axios.interceptors.response.use(response => response, error => Promise.reject(error));

  return axios(config).then((response) => response && response.data);
};
