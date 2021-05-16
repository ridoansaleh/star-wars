const lowerCase = (text) => {
  if (!text) return "";
  return text.toLowerCase();
};

const createArray = (totalItem = 0) => {
  return Array.from({ length: totalItem }, (_, idx) => ++idx);
};

// const getUrlID = (url) => {
//   if (!url) return "";
//   const strArr = url.split("/").filter((d) => d);
//   return strArr[strArr.length - 1];
// };

export { lowerCase, createArray };
