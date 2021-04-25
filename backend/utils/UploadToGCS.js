const storage = require('@google-cloud/storage');

const gcs = storage({
  projectId: 'intelligent-213800',
  keyFilename: "../config/secretkey.json"
});
const bucketName = 'intelligentimgbucket'
const bucket = gcs.bucket(bucketName);


function getPublicUrl(filename) {
  return 'https://storage.googleapis.com/' + bucketName + '/' + filename;
}

let ImgUpload = {};

ImgUpload.uploadToGCS = (req, fileName) => {
  if(!req.file) return next();
  return new Promise(function(resolve, reject){
    const folderName =  "TicketApp/";
    // Can optionally add a path to the gcsname below by concatenating it before the filename
    const gcsname = folderName + fileName;
    const file = bucket.file(gcsname);

    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype
      }
    });

    stream.on('error', (err) => {
      console.error(err);
      reject(error);
    });

    stream.on('finish', () => {
      resolve(getPublicUrl(gcsname));
    });

    stream.end(req.file.buffer);

  })

}
module.exports = ImgUpload;
