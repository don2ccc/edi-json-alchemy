
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

    // Log input for debugging (truncated for security if in production)
    console.log('EDI data received:', 
      process.env.NODE_ENV === 'production' 
        ? `${ediData.substring(0, 50)}... (truncated)` 
        : ediData
    );

    try {
      const jsonResult = parseEDItoJSON(ediData);
      // Parse the result to ensure it's valid JSON before sending
      const parsedResult = JSON.parse(jsonResult);
      return res.json({ 
        success: true, 
        result: parsedResult
      });
    } catch (parseError) {
      console.error('EDI parsing error details:', parseError);
      return res.status(422).json({ 
        error: 'Failed to parse EDI data', 
        details: parseError instanceof Error ? parseError.message : 'Unknown parsing error',
        errorType: parseError instanceof Error ? parseError.constructor.name : 'Unknown'
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Server error while processing request', 
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
