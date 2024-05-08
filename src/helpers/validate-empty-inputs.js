export const validateEmptyInputs = (obj) => {
  const emptyInputsKeys = [];

  for (const [key, value] of Object.entries(obj)) {
    if (value === "") {
      emptyInputsKeys.push(key);
    }
  }

  return emptyInputsKeys;
};
