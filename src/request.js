const request = (url) => {
  return fetch(url)
    .then((res) => res.json())
    .then((res) => res?.results || [])
    .catch((err) => {
      console.log("Server is down");
      return err;
    });
};

export default request;
