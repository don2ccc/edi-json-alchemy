
# EDI JSON Alchemy

Convert EDI X12 data to JSON format with ease.
you can try it from:  https://edi-json-alchemy.lovable.app/

## Features

- Convert EDI X12 data to JSON format
- Client-side parsing for immediate results
- Server-side API for more complex processing
- Upload files or paste EDI directly
- Copy results to clipboard

## Getting Started

### Running the Frontend

```bash
npm install
npm run dev
```

### Running the API Server

```bash
# In a separate terminal
npm run server
```

### Usage

1. Upload an EDI file or paste EDI data into the text area
2. Toggle "Use API endpoint" if you want to use the server-side parser
3. Click "Convert to JSON"
4. View and copy the JSON result

## API Documentation

### POST /api/parse

Parses EDI X12 data into JSON format.

**Request:**
- Content-Type: text/plain
- Body: Raw EDI X12 data

**Response:**
```json
{
  "success": true,
  "result": {
    // Parsed JSON data
  }
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```
