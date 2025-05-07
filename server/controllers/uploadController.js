import Upload from '../models/Upload.js';
import pkg from 'xlsx';
const { readFile, utils } = pkg;


export const uploadExcel = async (req, res) => {
  try {
    // 1. Check if file is present
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // 2. Read the uploaded Excel file
    const workbook = readFile(req.file.path);
    const sheetName = workbook.SheetNames[0]; // First sheet
    const sheet = workbook.Sheets[sheetName];

    // 3. Convert sheet to JSON format
    const data = utils.sheet_to_json(sheet);

    // 4. Save parsed data to MongoDB
    const newUpload = new Upload({
      user: req.user.id,
      filename: req.file.filename,
      data: data,
    });

    await newUpload.save();

    res.status(201).json({ message: 'File uploaded and parsed successfully', upload: newUpload });

  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

