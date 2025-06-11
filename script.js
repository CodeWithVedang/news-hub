const API_KEY = '74912b4c20fa7b2735c5a984345a753b'; // Replace with your GNews API key
const API_URL = `https://gnews.io/api/v4/top-headlines?token=${API_KEY}&lang=en`;

const newsContainer = document.getElementById('newsContainer');
const loader = document.getElementById('loader');
const searchInput = document.getElementById('searchInput');
let currentCategory = 'general';
let savedArticles = JSON.parse(localStorage.getItem('savedArticles')) || [];

// Show loader
function showLoader() {
    loader.style.display = 'block';
    newsContainer.style.display = 'none';
}

// Hide loader
function hideLoader() {
    loader.style.display = 'none';
    newsContainer.style.display = 'grid';
}

// Fetch news
async function fetchNews(category = 'general', query = '') {
    showLoader();
    let url = `${API_URL}&topic=${category}`;
    if (query) {
        url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&token=${API_KEY}&lang=en`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayNews(data.articles);
    } catch (error) {
        console.error('Error fetching news:', error);
        newsContainer.innerHTML = '<p>Error loading news. Please try again later.</p>';
    } finally {
        hideLoader();
    }
}

// Display news articles
function displayNews(articles) {
    newsContainer.innerHTML = '';
    if (!articles || articles.length === 0) {
        newsContainer.innerHTML = '<p>No news found.</p>';
        return;
    }

    articles.forEach(article => {
        const isSaved = savedArticles.some(saved => saved.url === article.url);
        const newsCard = document.createElement('div');
        newsCard.classList.add('news-card');
        newsCard.innerHTML = `
            <img src="${article.image || 'https://via.placeholder.com/300x200'}" alt="${article.title}">
            <div class="news-card-content">
                <h3>${article.title}</h3>
                <p>${article.description || 'No description available.'}</p>
                <p><strong>Source:</strong> ${article.source.name}</p>
                <a href="${article.url}" target="_blank">Read more</a>
                <button class="save-btn" data-article='${JSON.stringify(article)}'>
                    ${isSaved ? 'Unsave' : 'Save'} Article
                </button>
            </div>
        `;
        newsContainer.appendChild(newsCard);
    });

    // Add event listeners to save buttons
    document.querySelectorAll('.save-btn').forEach(button => {
        button.addEventListener('click', () => {
            const article = JSON.parse(button.getAttribute('data-article'));
            toggleSaveArticle(article);
        });
    });
}

// Filter news by category
function filterNews(category) {
    currentCategory = category;
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    fetchNews(category);
    // Close menu on mobile after selection
    if (window.innerWidth <= 768) {
        document.querySelector('.category-menu').classList.remove('active');
    }
}

// Search news
function searchNews() {
    const query = searchInput.value.trim();
    if (query) {
        fetchNews(currentCategory, query);
    } else {
        fetchNews(currentCategory);
    }
}

// Save or unsave article
function toggleSaveArticle(article) {
    const isSaved = savedArticles.some(saved => saved.url === article.url);
    if (isSaved) {
        savedArticles = savedArticles.filter(saved => saved.url !== article.url);
    } else {
        savedArticles.push(article);
    }
    localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
    fetchNews(currentCategory); // Refresh to update button text
}

// Show saved articles
function showSavedArticles() {
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    displayNews(savedArticles);
    // Close menu on mobile after selection
    if (window.innerWidth <= 768) {
        document.querySelector('.category-menu').classList.remove('active');
    }
}

// Toggle category menu on mobile
function toggleCategories() {
    const menu = document.querySelector('.category-menu');
    menu.classList.toggle('active');
}

// Initial load
fetchNews();