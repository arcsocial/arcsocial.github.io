// api.js - Handles API logic for ARC Social

export class LibraryAPIClient {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.language = 'en'; // Default language
  }

  setLanguage(language) {
    this.language = language;
  }

  async makeRequest(action, params = {}) {
    try {
      params.apiKey = "ARCvCZVYHN89ZO6zPLwTedKosWgXXgdcEdKusW";
      params.origin = window.location.origin;
      params.language = this.language;
      params.action = action;
      const url = new URL(this.apiUrl);
      Object.keys(params).forEach(key => {
        if (params[key]) url.searchParams.append(key, params[key]);
      });
      const response = await fetch(url, {
        redirect: 'follow',
        method: 'GET',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        }
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      if (result.status === 'error') {
        throw new Error(`API returned error: ${result.message}`);
      }
      return result.data;
    } catch (error) {
      console.error(`Error in ${action} request:`, error);
      throw error;
    }
  }

  async getFilteredBooks(filters = {}) {
    return this.makeRequest('getFilteredBooks', filters);
  }

  async getBookDetails(title, author) {
    return this.makeRequest('getBookDetails', { title, author });
  }

  async getDistinctValues(field) {
    return this.makeRequest('getDistinctValues', { field });
  }

  async getAuthors() {
    return this.makeRequest('getAuthors');
  }

  async getSheetData(sheetname) {
    return this.makeRequest('getSheetData', { sheetname });
  }
} 