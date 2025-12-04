import { v2 as cloudinary } from 'cloudinary'
const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'dleqaxjuv',
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET

});
cloudinary.url("sample.jpg", {width: 100, height: 150, crop: "fill", fetch_format: "auto"}) ;
cloudinary.v2.uploader.upload("/home/my_image.jpg", {upload_preset: "my_preset"}, (error, result)=>{
  console.log(result, error);
});

export default cloudinary;