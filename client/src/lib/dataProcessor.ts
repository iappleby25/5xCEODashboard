// Interface for Survey Data
export interface SurveyData {
  companyName: string;
  role: string;
  responses: Record<string, any>;
}

// Types for filter levels
export type ViewLevelType = 'individual' | 'team' | 'company' | 'holding';

/**
 * Function to filter survey data based on view level and filters
 * @param data Array of survey data objects
 * @param viewLevel Level at which to view the data (individual, team, company, holding)
 * @param selectedCompany Selected company for company or team view
 * @param selectedRole Selected role for team view
 * @returns Filtered array of survey data objects
 */
export function filterSurveyData(
  data: SurveyData[], 
  viewLevel: ViewLevelType,
  selectedCompany?: string,
  selectedRole?: string
): SurveyData[] {
  
  // Return unfiltered data for holding level
  if (viewLevel === 'holding') {
    return data;
  }
  
  // Filter by company for company view
  if (viewLevel === 'company' && selectedCompany) {
    return data.filter(item => item.companyName === selectedCompany);
  }
  
  // Filter by company and role for team view
  if (viewLevel === 'team' && selectedCompany && selectedRole) {
    return data.filter(
      item => item.companyName === selectedCompany && item.role === selectedRole
    );
  }
  
  // Individual view (future implementation)
  if (viewLevel === 'individual') {
    // For now, return empty array as we're not implementing individual view yet
    return [];
  }
  
  // Default: return unfiltered data
  return data;
}

/**
 * Function to extract unique company names from survey data
 * @param data Array of survey data objects
 * @returns Array of unique company names
 */
export function getUniqueCompanies(data: SurveyData[]): string[] {
  const companySet = new Set<string>();
  
  data.forEach(item => {
    if (item.companyName) {
      companySet.add(item.companyName);
    }
  });
  
  return Array.from(companySet).sort();
}

/**
 * Function to extract unique roles from survey data
 * @param data Array of survey data objects
 * @returns Array of unique roles
 */
export function getUniqueRoles(data: SurveyData[]): string[] {
  const roleSet = new Set<string>();
  
  data.forEach(item => {
    if (item.role) {
      roleSet.add(item.role);
    }
  });
  
  return Array.from(roleSet).sort();
}

/**
 * Function to convert API data to the expected SurveyData format
 * @param apiData Survey data from the API
 * @returns Array of SurveyData objects
 */
export function transformApiData(apiData: any[]): SurveyData[] {
  return apiData.map(item => ({
    companyName: item['Company name'] || '',
    role: item['Role'] || '',
    responses: { ...item } // Include all fields in responses
  }));
}