const {Storage} = require('@google-cloud/storage');

const gcs = new Storage({
  projectId: 'intelligent-213800',
  keyFilename: "./config/secretkey.json"
});
const bucketName = 'intelligentimgbucket'
const bucket = gcs.bucket(bucketName);


function getPublicUrl(filename) {
  return 'https://storage.googleapis.com/' + bucketName + '/' + filename;
}

let ImgUpload = {};

ImgUpload.uploadToGCS = (files, fileName, next) => {
  if(!files) return next();
  return new Promise(function(resolve, reject){
    const folderName =  "TicketApp/";
    // Can optionally add a path to the gcsname below by concatenating it before the filename
    const gcsname = folderName + fileName;
    const file = bucket.file(gcsname);

    const stream = file.createWriteStream({
      metadata: {
        contentType: files.mimetype
      }
    });

    stream.on('error', (err) => {
      console.error(err);
      reject(err);
    });

    stream.on('finish', () => {
      resolve(getPublicUrl(gcsname));
    });

    stream.end(files.buffer);

  })

}
module.exports = ImgUpload;