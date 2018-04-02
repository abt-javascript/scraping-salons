'use strict';
const categoryModel = require('../src/category/model');

function filter() {
    categoryModel.find().exec((err, category) => {
        let text = 'Cut & Blow,Perm & SmoothingDigital WavePermanent BlowVolumagic Smoothing,Digital Wave,Permanent Blow,Volumagic Smoothing,ColorCrazy ColourColour PlayFashion Colour,Crazy Colour,Colour Play,Fashion Colour,Hair Spa,Kerastase,Waxing & ThreadingWaxing & Threading,Waxing & Threading,Hand, Foot, Nail,Makeup & Hairdo,Lash Extentions,Eyebrows & Lips Tattoo,Men ServicesMen’s Services,Men’s Services,Kiddy Cut'.toLowerCase();
        category.forEach((item) => {
            item.name = item.name.toLowerCase();
            //console.log(text.search(item.name), item.name);
        });
    });
}

module.exports = filter
