export const getFromLocalStorage = (itemName: string) => {
  if (!itemName) return null;
  let value = localStorage.getItem(itemName);
  if (!value) return null;
  return value;
};

export const setToLocalStorage = (itemName: string, value: any = null) => {
  if (itemName) {
    localStorage.setItem(itemName, value);
  }
};

export const getArrayFromLocalStorage = (itemName: string) => {
  if (!itemName) return null;
  let values = localStorage.getItem(itemName);
  if (!values) return undefined;
  return JSON.parse(values);
};

export const setArrayToLocalStorage = (itemName: string, value: any = null) => {
  if (itemName) {
    localStorage.setItem(itemName, JSON.stringify(value));
  }
};
