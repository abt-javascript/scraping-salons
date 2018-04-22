const locationModel = require('../location/model');
const salonCategoryModel = require('./model');
const categoryModel = require('../category/model');

var list = async function (request, h) {
  let catArr = [];
  Promise.each = async function(arr, fn) {
    for(const item of arr) {
      const catSal = await fn(item);

      //collect address to db
      catArr.push(catSal);
    }
  }

  function fn(item) {console.log('masuk');
    var arr = [];

   return new Promise((resolve, reject) => {
    salonCategoryModel.find({category:item._id}).populate('salon').exec((err, result) => {
      if(!err) {
        resolve({category:item.name, data:result});
      }
      else{
        reject(err)
      }
    });
   });
  }

  const data = await new Promise((resolve, reject) => {
    categoryModel.find().exec((err, category) => {
      if(category.length > 0) {
        Promise.each(category, fn).then(() =>{
          resolve(catArr);
        });
      }else {
        resolve(category)
      }
    });
  });

  return data;
}

module.exports = list;
