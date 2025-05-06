
/**
 * Parses EDI X12 data into JSON format
 * This is a simplified parser for demonstration purposes
 * A production parser would need to handle all EDI segments and elements properly
 */
export function parseEDItoJSON(ediData: string): string {
  try {
    // Remove any leading/trailing whitespace
    const trimmedEdi = ediData.trim();
    
    // Basic validation checks
    if (!trimmedEdi) {
      throw new Error("EDI data is empty");
    }
    
    // Split the EDI data into segments (typically delimited by ~)
    // This is a simplification - real EDI might have different delimiters
    const segmentDelimiter = findSegmentDelimiter(trimmedEdi);
    const segments = trimmedEdi.split(segmentDelimiter).filter(Boolean);
    
    if (segments.length === 0) {
      throw new Error("No valid segments found in EDI data");
    }
    
    // Find the element delimiter (typically *) from the ISA segment
    const elementDelimiter = findElementDelimiter(segments[0]);
    
    // Process each segment
    const result: any = {
      interchangeHeader: {},
      functionalGroups: [],
      segments: []
    };
    
    // Keep track of current context
    let currentGroup: any = null;
    let currentTransaction: any = null;
    
    segments.forEach((segment) => {
      if (!segment.trim()) return; // Skip empty segments
      
      const elements = segment.split(elementDelimiter);
      const segmentId = elements[0];
      
      // Process based on segment ID
      switch (segmentId) {
        case "ISA":
          result.interchangeHeader = processISA(elements);
          break;
          
        case "GS":
          currentGroup = {
            functionalIdentifier: elements[1],
            applicationSender: elements[2],
            applicationReceiver: elements[3],
            date: elements[4],
            time: elements[5],
            groupControlNumber: elements[6],
            transactions: []
          };
          result.functionalGroups.push(currentGroup);
          break;
          
        case "ST":
          // Special handling for 850 Purchase Order
          const isX12_850 = elements[1] === "850";
          
          currentTransaction = {
            transactionSetId: elements[1],
            transactionSetControlNumber: elements[2],
            isX12_850: isX12_850,
            segments: []
          };
          
          if (currentGroup) {
            currentGroup.transactions.push(currentTransaction);
          }
          break;
          
        default:
          // Store other segments
          const segmentData = {
            id: segmentId,
            elements: elements.slice(1).map(e => e.trim())
          };
          
          if (currentTransaction) {
            currentTransaction.segments.push(segmentData);
          } else {
            result.segments.push(segmentData);
          }
      }
    });
    
    return JSON.stringify(result, null, 2);
  } catch (error) {
    console.error("Error parsing EDI data:", error);
    throw error;
  }
}

// Helper functions for the parser
function findSegmentDelimiter(ediData: string): string {
  // In X12, the segment delimiter is typically ~ or \n
  // For simplicity, we'll check for common delimiters
  const commonDelimiters = ['~', '\n'];
  
  for (const delimiter of commonDelimiters) {
    if (ediData.includes(delimiter)) {
      return delimiter;
    }
  }
  
  // Default to ~ if nothing else is found
  return '~';
}

function findElementDelimiter(isaSegment: string): string {
  // In X12, the element delimiter is typically * and is defined in the ISA segment
  // For simplicity, we'll check for common delimiters
  const commonDelimiters = ['*', '|', ',', '^'];
  
  for (const delimiter of commonDelimiters) {
    if (isaSegment.includes(delimiter)) {
      return delimiter;
    }
  }
  
  return '*'; // Default
}

function processISA(elements: string[]): any {
  // Ensure elements array has sufficient length to avoid undefined access
  const safeElements = Array(17).fill('').map((_, i) => 
    elements[i] !== undefined ? elements[i] : ''
  );

  return {
    authInfoQualifier: safeElements[1],
    authInfo: safeElements[2],
    securityInfoQualifier: safeElements[3],
    securityInfo: safeElements[4],
    senderIdQualifier: safeElements[5],
    senderId: safeElements[6],
    receiverIdQualifier: safeElements[7],
    receiverId: safeElements[8],
    date: safeElements[9],
    time: safeElements[10],
    standardsId: safeElements[11],
    versionNumber: safeElements[12],
    interchangeControlNumber: safeElements[13],
    acknowledgmentRequested: safeElements[14],
    usageIndicator: safeElements[15],
    componentSeparator: safeElements[16]
  };
}
