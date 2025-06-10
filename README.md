# Modern News Hub

A modern, responsive news portal built with HTML, CSS, and JavaScript using the NewsAPI.org service.  
Features include top headlines, keyword search, category filter, date filter, sorting, detailed article view, and a bookmark system (with localStorage).  
Designed with an elegant, mobile-friendly UI inspired by professional news websites.

## 🚀 Features

- **Search**: Find news by topic, publisher, or keywords.
- **Filters**:  
  - Category (e.g., Science, Sports, Technology, etc.)  
  - Sort by Latest, Relevancy, or Popularity  
  - Date range (From/To)
- **Filter & Bookmark Buttons**:  
  - Mobile-friendly, styled, and always visible  
  - Filter panel opens on clicking the "Filter" button and auto-applies when changed  
  - Bookmarks button shows your saved articles
- **Detailed View**: Click "Read More" to see a full article view with extended info and source link.
- **Bookmarks**: Save/remove articles to your local device (localStorage).
- **Responsive Design**: Looks great on desktop, tablet, and mobile.
- **No frameworks**: Pure HTML, CSS, and JS.

## 🛠️ Getting Started

1. **Clone or Download**
    ```sh
    git clone https://github.com/CodeWithVedang/news-hub.git
    cd news-hub
    ```

2. **Get a NewsAPI.org key**

    - Register for free at [https://newsapi.org](https://newsapi.org)
    - Copy your API key.

3. **Set your API key in `index.html`**

    Find the line:

    ```js
    const apiKey = 'YOUR_API_KEY_HERE';
    ```

    Replace `YOUR_API_KEY_HERE` with your NewsAPI key.

4. **Open `index.html` in your browser**

    - No build step required!
    - All features work out-of-the-box.

## 📱 Responsive Design

- Uses CSS Flexbox and Grid for adaptive layouts.
- Navigation and buttons adapt to all screen sizes.
- Filter and bookmark buttons are always accessible.

## ⭐ Bookmarks

- Click the star icon to save/remove articles.
- Bookmarked articles are stored in your browser's localStorage.
- View bookmarks anytime from the Bookmarks button or navigation.

## 📄 License

MIT License

---

> Powered by [NewsAPI.org](https://newsapi.org/)  
> Designed & Built by [CodeWithVedang](https://github.com/CodeWithVedang)