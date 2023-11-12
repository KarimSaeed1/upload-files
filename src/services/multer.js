// Libraries
const multer = require('multer');
const mime = require('mime-types')
const ffmpeg = require('fluent-ffmpeg');

// Features
const AppError = require("../services/appError");

// Constants
const server = process.env.SERVER;
const port = process.env.PORT;

class Multer {

constructor() {

    this.multerStorage = multer.memoryStorage();
    
}


// Filter files
multerFilter = type => { (req, file, cb) => {

const detectedFileType = mime.lookup(file.originalname);

if(type == "image") {
const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
];
if (!detectedFileType || !allowedMimeTypes.includes(detectedFileType.mime)){
    cb(new AppError(
        "Only image files are allowed!*#* مسموح بصور فقط",
        400
    ),
    false
    );
} else {
    cb(null, true);
}

}
else if(type == "file") {
const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

if (!detectedFileType || !allowedMimeTypes.includes(detectedFileType.mime)){
    cb(new AppError(
        "Only pdf&word&&excel files are allowed!*#*فقط pdf و word و excel مسموح بهم",
        400
    ),
    false
    );
} else {
    cb(null, true);
}

}
else if(type == "video") {
const allowedVideoMimeTypes = [
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
];
    
if (!detectedFileType || !allowedVideoMimeTypes.includes(detectedFileType.mime)) {
cb(new AppError(
    'Only video files are allowed!*#*فقط ملفات الفيديو مسموح بها',
    400
), false);
} else {
cb(null, true);
}

}
else if(type == "image&video") {
const allowedVideoMimeTypes = [
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'image/jpeg',
    'image/png',
];
    
if (!detectedFileType || !allowedVideoMimeTypes.includes(detectedFileType.mime)) {
cb(new AppError(
    'Only video and photo files are allowed!*#*فقط ملفات الفيديو والصور مسموح بها',
    400
), false);
} else {
cb(null, true);
}

}
else if(type == "image&file") {
const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

if (!detectedFileType || !allowedMimeTypes.includes(detectedFileType.mime)){
    cb(new AppError(
        "Only photo&pdf&word&&excel files are allowed!*#*و photoفقط pdf و word و excel  مسموح بهم",
        400
    ),
    false
    );
} else {
    cb(null, true);
}

}
else {
    return next(new AppError("This type not correct *#* هذا النوع غير صحيح",400))
}

}
};

// upload function
upload = (type , size) => {
    multer({
    storage: this.multerStorage,
    fileFilter: this.multerFilter(type),
    limits: {
        fileSize: size
    },
});
}

// filename function
multerFilename = () => {
    
const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

return uniqueSuffix ;

};

// prepare link of file
fileLink = (req , folder , filename ,format) => {
return `${req.protocol}://${server}:${port}/${folder}/${filename}.${format}?time=${Date.now()}`;
}

// sharp images
sharp = (req , size1 , size2 , format , destination) => {
 
if(format == "jpeg") {
    sharp(req.file.buffer)
    .resize(size1, size2, {
        fit: 'fill',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toFormat(format)
    .jpeg({ quality: 90 })
    .toFile(destination);
} else {
    sharp(req.file.buffer)
    .resize(size1, size2, {
        fit: 'fill',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toFormat(format)
    .toFile(destination);
}


}


videoProcessing = (file , outputFile , width , height) => {

ffmpeg()
.input(file.filename)
.outputOptions('-vf', `scale=${width}:${height}`)
.output(outputFile)
.on('end', () => {
    console.log('Video resizing finished');
})
.on('error', (err) => {
    console.error('Error:', err);
})
.run();

}

}

module.exports = Multer;