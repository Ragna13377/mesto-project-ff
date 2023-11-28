const BASE_URL = "https://nomoreparties.co/v1/wff-cohort-1";
const AUTH_TOKEN = "9c3c5c27-37ba-4290-8f1a-07fbcc8161b5";

const handleError = (err) => console.log(err)

const get = (uri) => {
  const targetUrl = BASE_URL + uri;
  return fetch(targetUrl, {
    headers: {
      "authorization": AUTH_TOKEN,
    }
  }).then(handleResponse)
}

const post = (uri, data, method = "POST") => {
  const targetUrl = BASE_URL + uri;
  return fetch(targetUrl, {
    method,
    headers: {
      "authorization": AUTH_TOKEN,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(handleResponse)
}

const handleResponse = (response) => {
  if(response.ok) {
    return response.json().then(res => { res.url = response.url; return Promise.resolve(res) })
  } else {
    return Promise.reject(response)
  }
}

const createElement = (url, data) => post(url, data);
const updateElement = (url, data, isPatch = false) => post(url, data, isPatch ? "PATCH" : "PUT");
const deleteElement = (url) => post(url, {}, "DELETE");

export { get, updateElement, createElement, deleteElement, handleError }