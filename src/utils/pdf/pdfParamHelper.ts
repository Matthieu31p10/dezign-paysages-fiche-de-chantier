
/**
 * Utility functions to help with PDF parameter management
 * These are helper functions to ensure the correct number of parameters
 * are passed to the PDF generation functions
 */

// Function to ensure we have the right number of parameters for infoBoxesSection
export const fixInfoBoxesParams = (params: any[]) => {
  // If we have 5 parameters but expect 4, remove the last one
  if (params.length === 5) {
    return params.slice(0, 4);
  }
  return params;
};

// Function to ensure we have the right number of parameters for detailsSection
export const fixDetailsParams = (params: any[]) => {
  // If we have 5 parameters but expect 6, add a null as the 6th parameter
  if (params.length === 5) {
    return [...params, null];
  }
  return params;
};

// Function to fix any other parameter count mismatches
export const fixPDFParams = (expectedCount: number, params: any[]) => {
  if (params.length < expectedCount) {
    // Add null parameters until we reach the expected count
    return [...params, ...Array(expectedCount - params.length).fill(null)];
  } else if (params.length > expectedCount) {
    // Remove excess parameters
    return params.slice(0, expectedCount);
  }
  return params;
};
