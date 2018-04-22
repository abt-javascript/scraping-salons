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

  function fn(item) {
    var arr = [];
    Promise.each2 = async function(arr, fn2) {
      for(const item of arr) {
        const catSal = await fn2(item);
      }
    }

    function fn2(item) {
      return new Promise((resolve, reject) => {
        locationModel.find({salon:item.salon._id}).exec((err, loc)=> {
          if(!err) {
            item.salon.branch=loc;
            resolve(item);
          }

          return reject(err);
        });
      });

    }

   return new Promise((resolve, reject) => {
    salonCategoryModel.find({category:item._id}).populate('salon').exec((err, result) => {
      if(!err) {
        if(result.length > 0) {
          Promise.each2(result, fn2).then(() => {
            resolve({category:item.name, data:result})
          });
        }
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
      }
    });
  });

  return data;
}

module.exports = list;
