// function checkBody(body, keys) {
//   let isValid = true;

//   for (const field of keys) {
//     if (!body[field] || body[field] === "") {
//       isValid = false;
//     }
//   }

//   return isValid;
// }

function checkBodyReturnMissing(body, keys) {
  let isValid = true;
  let missingKeys = [];

  for (const field of keys) {
    if (!body[field] || body[field] === "") {
      isValid = false;
      missingKeys.push(field);
    }
  }

  return { isValid, missingKeys };
}

module.exports = {
  // checkBody,
  checkBodyReturnMissing,
};
