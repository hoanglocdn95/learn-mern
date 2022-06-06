const customAlert = (prefix) => {
  const showAlert = (message = '') => {
    return alert(`${prefix}${message}`);
  };
  return showAlert;
};

const alertError = customAlert('ERROR:');
alertError('Test closure');

const localStorageFunc = () => {};
