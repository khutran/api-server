var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

export const singleFileMiddleware = name => {
  return upload.single(name);
};

export const multiFileMiddleware = (name, amount) => {
  return upload.array(name, amount);
};
