// Refactored main entry point
import { LibraryAPIClient } from './api.js';
import { getTranslations } from './translations.js';
import { initializeUI } from './ui.js';

// Initialize the API client
const apiClient = new LibraryAPIClient('https://script.google.com/macros/s/AKfycbwzbqTijTdpMjc-9ZRcOf_twDJ3xxxVu_-VCd9CEZArRaymCpefupk9OXHPw-IB4m71/exec');

// Initialize the UI
initializeUI(apiClient, getTranslations);
