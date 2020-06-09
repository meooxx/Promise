const Promise = require("./promise");

let obj = {
  then(r) {
    r(3);
  },
};

new Promise((r) => {
  console.log(1);
  r(obj);
})
  .then((r) => {
    console.log(r);
    return 2;
  })
  .then((r) => {
    console.log(r);
    return obj;
  })
  .then((r) => {
    console.log(r);
  });
