'use strict'

async function ValidateLatLng(lat, lng) {

  if (lat < -90 || lat > 90) {
      return{status:false, text:"Latitude must be between -90 and 90 degrees inclusive."};
  }
  else if (lng < -180 || lng > 180) {
      return{status:false, text:"Longitude must be between -180 and 180 degrees inclusive."};
  }
  else if (lat == "" || lng == "") {
    return{status:false, text:"Enter a valid Latitude or Longitude!"};
  }

  return {status:true};
}

module.exports = ValidateLatLng
