import multer from 'multer';

// Stockage temporaire des fichiers sur le serveur avant de les uploader sur Cloudinary
const storage = multer.diskStorage({});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Vérifier que le fichier est une image
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});

export default upload;
