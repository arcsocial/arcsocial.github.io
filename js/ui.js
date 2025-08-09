// ui.js - Handles UI and DOM manipulation for ARC Social

let currentLanguage = 'en';
let currentPage = 'home';
let translations = {};

export function initializeUI(apiClient, getTranslations) {
  // --- UI and DOM manipulation functions ---

  async function showNewBooks() {
    try {
      const books = await getFileData('newbooks.csv', '|');
      displayNewBooks(books);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function getFileData(filename, seperator) {
    try {
      const response = await fetch('data/' + filename);
      const data = await response.text();
      const rows = data.split('\n');
      if (rows.length > 2) {
        if (seperator) {
          const headers = rows[0].split(seperator);
          const items = rows.slice(1)
            .filter(row => row !== '')
            .map(row => {
              const values = row.split(seperator);
              return headers.reduce((obj, header, index) => {
                obj[header] = values[index];
                return obj;
              }, {});
            });
          return items;
        } else {
          return rows;
        }
      } else {
        const items = rows[0].split(seperator);
        return items;
      }
    } catch (error) {
      console.error('Error fetching CSV:', error, ' filename', filename);
      return [];
    }
  }

  async function getCSVData(filename) {
    try {
      const response = await fetch('data/' + filename);
      const data = await response.text();
      const rows = data.split('\n');
      const headers = rows[0].split('|');
      const items = rows.slice(1)
        .filter(row => row !== '')
        .map(row => {
          const values = row.split('|');
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
          }, {});
        });
      return items;
    } catch (error) {
      console.error('Error fetching CSV:', error, ' filename', filename);
      return [];
    }
  }

  async function showEvents() {
    try {
      const items = await getFileData('events.csv', '|');
      displayEvents(items);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function displayEvents(items) {
    const itemList = document.getElementById('activitiesList');
    if (!items.length) return;
    let html = '';
    itemList.innerHTML = '';
    items.forEach(item => {
      html += `<li><strong>${item.Date}</strong> - ${item.Event}</li>`;
    });
    itemList.innerHTML += html;
  }

  function initialize() {
    setLanguage(currentLanguage);
    showNewBooks();
    showEvents();
    document.getElementById('searchContainer').style.display = 'none';
  }

  function setLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    document.title = lang === 'mr' ? 'ARC Social वाचनालय - औंध, पुणे' : 'ARC Social Library - Aundh, Pune';
    apiClient.setLanguage(currentLanguage);
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('selected', btn.id === `lang${lang.toUpperCase()}`);
    });
    updateTranslations(getTranslations(lang));
    if (currentPage !== 'home') {
      updateFilters();
      searchBooks();
    }
  }

  function updateTranslations(trans) {
    translations = trans;
    document.getElementById('searchBtn').textContent = translations.search;
    document.getElementById('searchTextBtn').textContent = translations.search;
    document.getElementById('clearBtn').textContent = translations.clear;
    document.getElementById('authorSearch').value = '';
    document.getElementById('authorSearch').placeholder = translations.searchtext;
    document.getElementById('processingMsg').textContent = translations.processing;
    document.getElementById('bdProcessingMsg').textContent = translations.processing;
    document.getElementById('title').textContent = translations.title;
    document.getElementById('label-genre').textContent = translations.genre;
    document.getElementById('label-author').textContent = translations.author;
    document.getElementById('label-ageGroup').textContent = translations.ageGroup;
    document.getElementById('searchBox').value = '';
    document.getElementById('searchBox').placeholder = translations.searchtext;
    document.getElementById('searchButton').innerText = translations.search;
    document.getElementById('browseButton').innerText = translations.browse;
    document.getElementById('newBooksTitle').innerText = translations.newBooks;
    document.getElementById('activitiesTitle').innerText = translations.activities;
    document.getElementById('timing').innerText = translations.timing;
    document.getElementById('address').innerHTML = translations.address;
    document.getElementById('contact').innerHTML = translations.contact;
    document.getElementById('mail').innerHTML = translations.mail;
    document.getElementById('instragram').innerHTML = translations.instagram;
    document.getElementById('pmbooklistTitle').innerText = 'Pune Marathi Book List';
  }

  async function updateFilters() {
    try {
      let age = [];
      if (currentLanguage === 'en') {
        age = ['Young Children', 'Children', 'Teen', 'Young Adult (16+)', 'Adult'];
      } else {
        age = ['प्रौढ', 'सर्व वयोगट', 'पालकांसाठी'];
      }
      updateSelect('ageGroupSelect', age);
      const genre = await getFileData('genre' + currentLanguage);
      updateSelect('genreSelect', genre);
      const authors = await getFileData('authors' + currentLanguage);
      updateSelect('authorSelect', authors);
    } catch (error) {
      console.error('Error populating filters:', error);
    }
  }

  async function searchBooksText() {
    let searchText = '';
    try {
      if (currentPage !== 'search') {
        showSearch();
        searchText = document.getElementById('searchBox').value;
        document.getElementById('authorSearch').value = searchText;
        updateFilters();
      } else {
        searchText = document.getElementById('authorSearch').value;
      }
      showProcessing();
      if (currentLanguage === 'mr' && isEnglish(searchText)) {
        searchText = await transliterate(searchText);
      }
      const filters = {
        language: currentLanguage,
        query: searchText
      };
      const books = await apiClient.getFilteredBooks(filters);
      displayBooks(books);
    } catch (error) {
      handleError(error);
    }
    hideProcessing();
  }

  async function searchBooks() {
    try {
      clearResults();
      showProcessing();
      let searchText = document.getElementById('authorSearch').value;
      if (currentLanguage === 'mr' && isEnglish(searchText)) {
        searchText = await transliterate(searchText);
      }
      const filters = {
        language: currentLanguage,
        genre: document.getElementById('genreSelect').value,
        ageGroup: document.getElementById('ageGroupSelect').value,
        author: document.getElementById('authorSelect').value,
        query: searchText
      };
      const books = await apiClient.getFilteredBooks(filters);
      displayBooks(books);
    } catch (error) {
      handleError(error);
    }
    hideProcessing();
  }

  function updateSelect(selectId, values) {
    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="">All</option>' +
      values.map(value => `<option value="${value}">${value}</option>`).join('');
  }

  function displayBooks(books) {
    const bookList = document.getElementById('bookList');
    const alphabetNav = document.getElementById('alphabetNav');
    if (!books.length) {
      bookList.innerHTML = `<div class="no-results">${translations.noResults}</div>`;
      alphabetNav.style.display = 'none';
      return;
    }
    const uniqueLetters = [...new Set(
      books.map(book => book.LName.charAt(0).toUpperCase())
    )].sort();
    let currentLetter = '';
    let html = '';
    let bookid = '';
    bookList.innerHTML = '';
    books.forEach(book => {
      const letterHeader = book.LName.charAt(0).toUpperCase();
      if (letterHeader !== currentLetter) {
        if (currentLetter !== '') {
          html += '</div>';
          bookList.innerHTML += html;
          html = '';
        }
        currentLetter = letterHeader;
        html += `<div id="section${currentLetter}" class="letter-section"><div class="letter-header">${currentLetter}</div>`;
      }
      bookid = book.Age + "-";
      if (book.Number !== '') {
        bookid += book.Number;
      } else {
        bookid += "NA";
      }
      html += `<div id="${bookid}" class="book-item"><strong>${book.Title}</strong> | ${book.Author} | <strong>${book.Genre}</strong>`;
      if (isPMGBookNumber(book.Number)) {
        html += ` * </div>`;
      } else {
        html += `</div>`;
      }
    });
    if (currentLetter !== '') {
      html += '</div>';
    }
    bookList.innerHTML += html;
    if (books.length >= 10 && uniqueLetters.length >= 3) {
      alphabetNav.innerHTML = uniqueLetters
        .map(letter => `<div class="letter" data-letter="${letter}">${letter}</div>`)
        .join('');
      alphabetNav.style.display = 'flex';
      // Attach event listeners for each letter
      alphabetNav.querySelectorAll('.letter').forEach(el => {
        el.addEventListener('click', (e) => {
          const letter = el.getAttribute('data-letter');
          scrollToLetter(letter);
        });
      });
    } else {
      alphabetNav.style.display = 'none';
    }
  }

  function isPMGBookNumber(str) {
    if (str !== '') return /^-?\d+(\.\d+)?$/.test(str[0]);
  }

  async function showBookDetails(event) {
    let bookString = '';
    let bookid = '';
    if (event.target) {
      if (event.target.nodeName === "STRONG") {
        bookString = event.target.parentNode.textContent;
        bookid = event.target.parentNode.id;
      } else {
        bookString = event.target.textContent;
        bookid = event.target.id;
      }
    }
    let title = '';
    let author = '';
    let genre = '';
    const parts = bookString.split("|");
    if (parts.length >= 3) {
      title = parts[0].trim();
      author = parts[1].trim();
      genre = parts[2].trim();
    }
    if (title === '') return;
    document.getElementById('bookAge').textContent = '';
    document.getElementById('bookGenre').textContent = '';
    document.getElementById('bookNumber').textContent = '';
    document.getElementById('bookSynopsis').textContent = '';
    document.getElementById('bookCover').src = '';
    document.getElementById('bookCover').alt = '';
    document.getElementById('searchContainer').style.display = 'none';
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('bookdetails').style.display = 'block';
    document.getElementById('bookTitle').textContent = title;
    document.getElementById('bookAuthor').textContent = "Author: " + author;
    document.getElementById('bookGenre').textContent = "Genre: " + genre;
    if (bookid) {
      const idparts = bookid.split("-");
      document.getElementById('bookAge').textContent = "Age: " + idparts[0];
      if (idparts.length > 1) document.getElementById('bookNumber').textContent = "ID Number: " + idparts[1];
    }
    document.getElementById('bdProcessingMsg').style.display = 'block';
    const bookInfo = await getBookInfo(title, author);
    if (bookInfo.success) {
      document.getElementById('bookSynopsis').textContent = bookInfo.synopsis;
      if (bookInfo.coverImage) {
        const coverEl = document.getElementById('bookCover');
        coverEl.src = bookInfo.coverImage;
        coverEl.alt = `Book cover for ${title} by ${author}`;
        coverEl.style.display = 'block';
      } else {
        const coverEl = document.getElementById('bookCover');
        coverEl.style.display = 'none';
        coverEl.alt = '';
      }
    } else {
      document.getElementById('bookSynopsis').textContent = "No further information available";
    }
    document.getElementById('bdProcessingMsg').style.display = 'none';
  }

  async function getBookInfo(title, author) {
    const query = encodeURIComponent(`intitle:${title} inauthor:${author}`);
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`;
    document.getElementById('bdProcessingMsg').style.display = 'block';
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.totalItems > 0) {
        const book = data.items[0].volumeInfo;
        const gtitle = book.title;
        let testTitleParts = title.split('-');
        if (testTitleParts.length > 1) title = testTitleParts[1];
        if (gtitle.trim().toLowerCase().includes(title.trim().toLowerCase())) {
          const description = book.description ?
            book.description.substring(0, 450) + "..." :
            "No description available.";
          const imageUrl = book.imageLinks ? book.imageLinks.thumbnail : null;
          return {
            success: true,
            title: title,
            synopsis: description,
            coverImage: imageUrl
          };
        } else {
          return {
            success: false,
            message: "No books found matching that title and author."
          };
        }
      } else {
        return {
          success: false,
          message: "No books found matching that title and author."
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Error fetching book information: " + error.toString()
      };
    }
    document.getElementById('bdProcessingMsg').style.display = 'none';
  }

  function backfromdetails() {
    hideBookDetails();
    if (currentPage === 'search') {
      document.getElementById('searchContainer').style.display = 'block';
    } else {
      document.getElementById('homePage').style.display = 'block';
    }
  }

  function displayNewBooks(items) {
    const itemList = document.getElementById('newBooksList');
    if (!items.length) return;
    let html = '';
    itemList.innerHTML = '';
    items.forEach(book => {
      html += `<li><strong>${book.Title}</strong> | ${book.Author} | <strong>${book.Genre}</strong></li>`;
    });
    itemList.innerHTML += html;
  }

  function clearFilters() {
    document.getElementById('genreSelect').value = '';
    document.getElementById('ageGroupSelect').value = '';
    document.getElementById('authorSelect').value = '';
    document.getElementById('authorSearch').value = '';
    clearResults();
  }

  function clearResults() {
    document.getElementById('bookList').innerHTML = '';
    document.getElementById('alphabetNav').style.display = 'none';
  }

  function scrollToLetter(letter) {
    const section = document.getElementById(`section${letter}`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function browseBooks() {
    showSearch();
    updateFilters();
    searchBooks();
  }

  function homePage() {
    currentPage = 'home';
    hideSearch();
    hideBookDetails();
  }

  function showProcessing() {
    document.getElementById('processingMsg').style.display = 'block';
  }

  function hideProcessing() {
    document.getElementById('processingMsg').style.display = 'none';
  }

  function showSearch() {
    currentPage = 'search';
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('searchContainer').style.display = 'block';
    document.getElementById('searchContainer').style.width = '95%';
  }

  function hideSearch() {
    clearResults();
    document.getElementById('searchContainer').style.display = 'none';
    document.getElementById('homePage').style.display = 'initial';
  }

  function hideBookDetails() {
    document.getElementById('bookAge').textContent = '';
    document.getElementById('bookGenre').textContent = '';
    document.getElementById('bookNumber').textContent = '';
    document.getElementById('bookSynopsis').textContent = '';
    document.getElementById('bookCover').src = '';
    document.getElementById('bookdetails').style.display = 'none';
  }

  function handleError(error) {
    console.error('Error:', error);
    hideProcessing();
    alert('An error occurred. Please try again.');
  }

  function isEnglish(text) {
    const letterCount = (text.match(/[a-zA-Z]/g) || []).length;
    const totalChars = text.replace(/\s/g, '').length;
    return totalChars > 0 && (letterCount / totalChars) > 0.6;
  }

  async function transliterate(text) {
    const response = await fetch('https://inputtools.google.com/request?text=' +
      encodeURIComponent(text) + '&itc=mr-t-i0-und&num=5&cp=0&cs=1&ie=utf-8&oe=utf-8', {
      method: 'GET'
    });
    const data = await response.json();
    if (data[0] === 'SUCCESS') {
      return data[1][0][1][0];
    } else {
      return text;
    }
  }

  // --- Event listeners ---
  document.getElementById('searchBtn').onclick = searchBooks;
  document.getElementById('clearBtn').onclick = clearFilters;
  document.getElementById('searchTextBtn').onclick = searchBooksText;
  document.getElementById('searchButton').onclick = searchBooksText;
  document.getElementById('browseButton').onclick = browseBooks;
  document.getElementById('logoHome').onclick = homePage;
  document.getElementById('title').onclick = homePage;
  document.getElementById('bookdetail-back').onclick = backfromdetails;
  document.getElementById('bookList').onclick = showBookDetails;
  document.getElementById('newBooksList').onclick = showBookDetails;
  document.getElementById('langEN').onclick = () => setLanguage('en');
  document.getElementById('langMR').onclick = () => setLanguage('mr');

  // --- Initialize UI ---
  initialize();
} 