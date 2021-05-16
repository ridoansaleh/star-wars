const lowerCase = (text) => {
  if (!text) return "";
  return text.toLowerCase();
};

const createArray = (totalItem = 0) => {
  return Array.from({ length: totalItem }, (_, idx) => ++idx);
};

export { lowerCase, createArray };
