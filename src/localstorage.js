const saveData = (key, value, expireDay) => {
  const dayInMiliseconds = expireDay * 60 * 60 * 1000;
  const now = new Date();
  const item = {
    value,
    expiry: now.getTime() + dayInMiliseconds,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

const getData = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
};

export { saveData, getData };
