export const logMessage = message => {
  console.log(message);
};

export const logJsonData = async (message, data) => {
  const jsonString = JSON.stringify(data, null, 2);
  console.log(message, jsonString);
};
