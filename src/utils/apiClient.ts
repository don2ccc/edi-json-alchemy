
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
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: ediData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'API request failed');
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}
