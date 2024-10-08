import express from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv'; // Import dotenv for environment variables
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { Readable } from 'stream'
import { fileURLToPath } from 'url';

const router = express.Router();
const upload = multer()

// Load environment variables from .env file
dotenv.config();

// Get the directory name using the URL of the current module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const serviceAccountKey = JSON.parse(fs.readFileSync(path.join(__dirname, '../repositorio-salsys-422000-862b81ccf1bd.json'), 'utf8'));
const scopes = ['https://www.googleapis.com/auth/drive'];

// Create an Auth client
const auth = new google.auth.GoogleAuth({
  credentials: serviceAccountKey,
  scopes: scopes
})

const drive = google.drive({
  version: "v3",
  auth: auth,
});
/*
async function uploadFileToDrive(fileBuffer, fileName) {

  const FolderQuery = "name='imagens' and mimeType='application/vnd.google-apps.folder'";
  const FolderResponse = await drive.files.list({
    q: FolderQuery,
    fields: 'files(id)'
  });

  if (FolderResponse.data.files.length === 0) {
    // If the 'imagens' folder doesn't exist, handle the error
    return res.status(500).json({ error: "The 'imagens' folder doesn't exist in Google Drive." });
  }

  // Retrieve the ID of the 'imagens' folder
  const FolderId = FolderResponse.data.files[0].id;

  const stream = new Readable()
  stream.push(fileBuffer)
  stream.push(null)

  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      mimeType: 'image/*',
      parents: [FolderId]
    },
    media: {
      mimeType: 'image/*',
      body: stream,
    },
    fields: 'id'
  });

  await drive.permissions.create({
    fileId: response.data.id,
    requestBody: {
      role: 'reader',
      type: 'anyone'
    }
  })
  
  return `https://drive.google.com/uc?id=${response.data.id}`;
}
*/
import fetch from 'node-fetch';

async function uploadFileToGitHub(fileBuffer, fileName) {
  const owner = 'Joepbr'; 
  const repo = 'salsys-images'; 
  const path = `images/${fileName}`;
  const token = process.env.GITHUB_TOKEN; 

  const base64Content = fileBuffer.toString('base64'); 

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Upload image ${fileName}`,
      content: base64Content
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to upload image: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content.download_url; // URL to access the image
}

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer
    const fileName = req.file.originalname

    const fileUrl = await uploadFileToGitHub(fileBuffer, fileName)

    res.status(200).json({ imageUrl: fileUrl })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Image upload failed' })
  }
})

export { drive, router }
