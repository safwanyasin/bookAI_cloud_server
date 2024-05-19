const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

function convertDateFormat(inputDate) {
    if (inputDate === '-' || inputDate.length !== 10) {
      return '-'; // If the date is not available, return '-'
    }
    
    const dateTime = new Date(inputDate);
    const day = String(dateTime.getDate()).padStart(2, '0');
    const month = String(dateTime.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JS
    const year = dateTime.getFullYear();
  
    const formattedDate = `${day}.${month}.${year}`;
    return formattedDate;
}

app.get('/search', async (req, res) => {
  try {
    const { query } = req.query;  // Get the search query from the request
    console.log(query);
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const googleBooksAPI = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40`;
    const response = await axios.get(googleBooksAPI);
    console.log(response.data);
    if (response.status !== 200) {
      return res.status(response.status).json({ error: 'Error fetching data from Google Books API' });
    }

    const books = response.data.items.map(item => ({
      bookId: item.id,
      bookName: item.volumeInfo.title,
      authorName: item.volumeInfo.authors ? item.volumeInfo.authors.join(", ") : 'Unknown Author',
      description: item.volumeInfo.description ?? 'No Description',
      language: item.volumeInfo.language ?? 'Unknown Language',
      pageCount: item.volumeInfo.pageCount ?? 0,
      reviewCount: item.volumeInfo.ratingsCount ?? 0,
      rating: item.volumeInfo.averageRating === null || item.volumeInfo.averageRating === undefined ? 0 : Number(item.volumeInfo.averageRating),
      imageUrl: item.volumeInfo.imageLinks === null || item.volumeInfo.imageLinks === undefined ? 'https://placehold.co/190x280.png' : item.volumeInfo.imageLinks.thumbnail ?? 'https://placehold.co/190x280.png',
      category: item.volumeInfo.categories === null || item.volumeInfo.cetegories === undefined ? 'None' : item.volumeInfo.categories.join(','),
      publisher: item.volumeInfo.publisher ?? 'none',
      publishDate: convertDateFormat(item.volumeInfo.publishedDate ?? '-'),
    }));

    res.status(200).json(books);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
