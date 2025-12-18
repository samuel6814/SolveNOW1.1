const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse'); // This will now work correctly

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// File Filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

const processPdf = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        const filePath = req.file.path;
        const dataBuffer = fs.readFileSync(filePath);

        // Standard usage of pdf-parse v1.1.1
        const data = await pdf(dataBuffer);
        
        res.status(200).json({
            message: 'File processed successfully',
            filename: req.file.filename,
            originalName: req.file.originalname,
            pageCount: data.numpages,
            textLength: data.text.length,
            preview: data.text.substring(0, 200) + '...' 
        });

    } catch (error) {
        console.error('PDF Processing Error:', error);
        res.status(500).json({ error: 'Failed to process PDF.' });
    }
};

module.exports = {
    uploadMiddleware: upload.single('pdf'),
    processPdf
};