//const BASE_URL = "http://192.168.43.220:8000/api";
const BASE_URL = 'https://bestlocalchef.com/api';

export const api = async (url, method, body = null, headers = {}) => {
  try {
    const endPoint = BASE_URL.concat(url);

    const reqBody = body ? JSON.stringify(body) : null;

    const fetchParams = {method, headers};

    // if((method === "POST" || method === "PUT")) {
    //     throw new Error("Request body required");
    // }

    if (reqBody) {
      fetchParams.body = reqBody;
    }
    fetchParams.headers['Accept'] = 'application/json';
    fetchParams.headers['Content-Type'] = 'application/json';

    const fetchPromise = fetch(endPoint, fetchParams);

    const timeOutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('Request Timeout');
      }, 20000);
    });

    const response = await Promise.race([fetchPromise, timeOutPromise]);

    return response;
  } catch (e) {
    return e;
  }
};

export const fetchApi = async (
  url,
  method,
  body,
  statusCode,
  token = null,
  loader = false,
) => {
  console.log(body, 'datas');

  try {
    const headers = {};
    const result = {
      token: null,
      success: false,
      responseBody: null,
    };
    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
    }

    const response = await api(url, method, body, headers);
    console.log(response, 'raw res');
    if (typeof response == 'string' || typeof response !== 'object') {
      alert(response.toString() + 'server not respond propes');
      throw response;
    }
    if (response.status === statusCode) {
      result.success = true;

      let responseBody;
      const responseText = await response.text();
      console.log(JSON.parse(responseText), 'true res');

      try {
        responseBody = JSON.parse(responseText);
      } catch (e) {
        responseBody = responseText;
      }

      result.responseBody = responseBody;

      if (responseBody.access_token) {
        result.token = responseBody.access_token;
      }

      return result;
    }

    let errorBody;
    const errorText = await response.text();

    try {
      errorBody = JSON.parse(errorText);
    } catch (e) {
      errorBody = errorText;
    }

    result.responseBody = errorBody;

    throw result;
  } catch (error) {
    return error;
  }
};

export const getApi = async (url, method, body, statusCode, token) => {
  console.log(token);

  try {
    const headers = {};
    const result = {
      success: false,
      responseBody: null,
    };

    headers['Authorization'] = 'Bearer ' + token;

    const response = await api(url, method, body, headers);
    console.log(response);
    if (typeof response == 'string' || typeof response !== 'object') {
      alert(response.toString() + 'server not respond propes');
      throw response;
    }
    if (response.status === statusCode) {
      result.success = true;

      let responseBody;
      const responseText = await response.text();
      console.log(JSON.parse(responseText), 'true res');

      try {
        responseBody = JSON.parse(responseText);
      } catch (e) {
        responseBody = responseText;
      }

      result.responseBody = responseBody;

      return result;
    }

    let errorBody;
    const errorText = await response.text();

    try {
      errorBody = JSON.parse(errorText);
    } catch (e) {
      errorBody = errorText;
    }

    result.responseBody = errorBody;

    throw result;
  } catch (error) {
    return error;
  }
};
