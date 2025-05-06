
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { parseEDItoJSON } from '../utils/ediParser';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.text({ type: '*/*', limit: '10mb' })); // Accept raw text for EDI data
app.use(express.json());

// API endpoint to parse EDI data
app.post('/api/parse', (req, res) => {
  try {
    const ediData = req.body;
    
    if (!ediData || typeof ediData !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid input. Please provide EDI data as plain text in the request body.' 
      });
    }

    const jsonResult = parseEDItoJSON(ediData);
    return res.json({ 
      success: true, 
      result: JSON.parse(jsonResult)  // Convert string JSON to object
    });
  } catch (error) {
    console.error('Error parsing EDI data:', error);
    return res.status(500).json({ 
      error: 'Failed to parse EDI data', 
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
