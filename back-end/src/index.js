import express from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv'; // Import dotenv for environment variables

const router = express.Router();

// Load environment variables from .env file
dotenv.config();

const scopes = ['https://www.googleapis.com/auth/drive'];
import serviceAccountKey from '../repositorio-salsys-422000-862b81ccf1bd.json' assert { type: "json" }

// Create an OAuth2 client
const auth = new google.auth.GoogleAuth({
  credentials: serviceAccountKey,
  scopes: scopes
})

const drive = google.drive({
  version: "v3",
  auth: auth,
});


export { drive, router }
