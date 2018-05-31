const locationModel = require('../location/model');
const salonCategoryModel = require('./model');
const categoryModel = require('../category/model');

var list = async function (request, h) {
  let catArr = [];

  const data  = await new Promise((resolve, reject) => {
    categoryModel.find().populate({path:'salons', populate:[{path:'location'}, {path:'review', populate:{path:'user', select:{password:0}}}]}).exec((err, category) => {
      if(err){
        return reject(err)
      }

      resolve(category)
    });
  });

  return data

}

module.exports = list;
