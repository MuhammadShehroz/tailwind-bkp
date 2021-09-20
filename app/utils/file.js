const readAsDataURL = (file) => readFile('readAsDataURL', file);

const readFile = (method, file) => {
  return new Promise((resolve, reject) => {
    let fileReader = new FileReader();

    fileReader.onload = resolve;

    fileReader.onerror = reject;

    fileReader[method](file);
  });
};

export { readAsDataURL };
