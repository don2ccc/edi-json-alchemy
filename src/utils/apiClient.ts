
/**
 * Utility functions to interact with the EDI Parser API
 */

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api/parse'  // Use relative URL in production
  : 'http://localhost:3001/api/parse'; // Use localhost in development

/**
 * Parse EDI data using the API
 * @param ediData The EDI data to parse
 * @returns A promise that resolves to the parsed JSON result
 */
export async function parseEDIWithAPI(ediData: string): Promise<any> {
  try {
    console.log('Sending request to API:', API_URL);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: ediData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('API response error:', data);
      throw new Error(data.details || data.error || 'API request failed');
    }

    return data.result;
  } catch (error) {
    console.error('API client error:', error);
    throw error;
  }
}
