// Toggle filter panel
        const filterBtn = document.getElementById('toggleFilterBtn');
        const filterPanel = document.getElementById('filterPanel');
        filterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            filterPanel.classList.toggle('open');
            filterBtn.classList.toggle('active');
        });

        // Apply filter when filter-panel input changes
        const categorySelect = document.getElementById('categorySelect');
        const sortSelect = document.getElementById('sortSelect');
        const fromDate = document.getElementById('fromDate');
        const toDate = document.getElementById('toDate');
        [categorySelect, sortSelect, fromDate, toDate].forEach(el => {
            el.addEventListener('change', () => {
                filterPanel.classList.remove('open');
                filterBtn.classList.remove('active');
                fetchNews(getFilterValues());
            });
        });

        // Close filter panel on click outside
        document.addEventListener('click', (e) => {
            if (
                filterPanel.classList.contains('open') &&
                !filterPanel.contains(e.target) &&
                e.target !== filterBtn &&
                !filterBtn.contains(e.target)
            ) {
                filterPanel.classList.remove('open');
                filterBtn.classList.remove('active');
            }
        });

        const apiKey = '9a0eab12706f41d5819557f3e8f964f5'; // Replace with your NewsAPI key
        const newsGrid = document.getElementById('newsGrid');
        const loader = document.getElementById('loader');
        const errorDiv = document.getElementById('error');
        const searchInput = document.getElementById('searchInput');
        const bookmarksSection = document.getElementById('bookmarksSection');
        const bookmarksGrid = document.getElementById('bookmarksGrid');
        const newsSection = document.getElementById('newsSection');
        const detailPage = document.getElementById('detailPage');

        // Bookmarks in localStorage
        function getBookmarks() {
            return JSON.parse(localStorage.getItem('bookmarkedArticles') || '[]');
        }
        function saveBookmarks(bookmarks) {
            localStorage.setItem('bookmarkedArticles', JSON.stringify(bookmarks));
        }
        function isBookmarked(url) {
            return getBookmarks().some(article => article.url === url);
        }
        function toggleBookmark(article) {
            let bookmarks = getBookmarks();
            const index = bookmarks.findIndex(a => a.url === article.url);
            if (index === -1) {
                bookmarks.push(article);
            } else {
                bookmarks.splice(index, 1);
            }
            saveBookmarks(bookmarks);
            renderNewsArticles(lastFetchedArticles); // refresh icons
        }
        function showBookmarks() {
            hideDetailPage();
            bookmarksSection.style.display = 'block';
            newsSection.style.display = 'none';
            loader.style.display = 'none';
            errorDiv.style.display = 'none';
            renderNewsArticles(getBookmarks(), bookmarksGrid, true);
        }
        function hideBookmarks() {
            bookmarksSection.style.display = 'none';
            newsSection.style.display = '';
        }

        // Scroll to section by id
        function scrollToSection(id) {
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        // Store last fetched news articles for bookmark toggle
        let lastFetchedArticles = [];

        // Store last used filter values to apply
        let filterState = {
            category: "",
            sortBy: "publishedAt",
            from: "",
            to: "",
            searchQuery: ""
        };

        function getFilterValues() {
            return {
                category: categorySelect.value,
                sortBy: sortSelect.value,
                from: fromDate.value,
                to: toDate.value,
                searchQuery: searchInput.value.trim()
            };
        }

        async function fetchNews(queryParam) {
            hideDetailPage();
            loader.style.display = 'block';
            errorDiv.style.display = 'none';
            newsGrid.innerHTML = '';
            newsSection.style.display = '';
            hideBookmarks();

            // Use current filterState if not provided
            const filter = queryParam || filterState;
            filterState = filter; // save the new/current state

            let url;
            const { category, sortBy, from, to, searchQuery } = filter;

            if ((!searchQuery || searchQuery === 'top-headlines')) {
                url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
                if (category) url += `&category=${category}`;
            } else {
                url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&apiKey=${apiKey}`;
                if (from) url += `&from=${from}`;
                if (to) url += `&to=${to}`;
                if (sortBy) url += `&sortBy=${sortBy}`;
                if (category) url += `&category=${category}`;
            }

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('Failed to fetch news');
                const data = await response.json();

                // Error from API
                if (data.status !== 'ok') {
                    errorDiv.textContent = data.message || 'Error fetching news. Please try again later.';
                    errorDiv.style.display = 'block';
                    return;
                }

                if (!data.articles || data.articles.length === 0) {
                    errorDiv.textContent = 'No news found for this search.';
                    errorDiv.style.display = 'block';
                    return;
                }
                lastFetchedArticles = data.articles;
                renderNewsArticles(data.articles);
            } catch (error) {
                errorDiv.textContent = 'Error fetching news. Please try again later.';
                errorDiv.style.display = 'block';
            } finally {
                loader.style.display = 'none';
            }
        }

        function renderNewsArticles(articles, grid = newsGrid, isBookmarkView = false) {
            grid.innerHTML = '';
            articles.forEach((article, idx) => {
                const card = document.createElement('div');
                card.className = 'news-card';

                // Bookmark button
                const bookmarkBtn = document.createElement('button');
                bookmarkBtn.className = 'bookmark-btn' + (isBookmarked(article.url) ? ' bookmarked' : '');
                bookmarkBtn.title = isBookmarked(article.url) ? 'Remove Bookmark' : 'Add Bookmark';
                bookmarkBtn.innerHTML = isBookmarked(article.url) ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
                bookmarkBtn.onclick = (e) => {
                    e.stopPropagation();
                    toggleBookmark(article);
                    if (isBookmarkView) showBookmarks();
                };

                card.innerHTML = `
                    <img src="${article.urlToImage || 'https://via.placeholder.com/340x210/DFE6F6/5B6C82?text=No+Image'}" alt="News Image">
                    <div class="news-content">
                        <h3>${article.title}</h3>
                        <div class="meta">
                            ${article.source && article.source.name ? `<span><i class="fa-solid fa-bullhorn"></i> ${article.source.name}</span>` : ''}
                            ${article.author ? `<span> &nbsp; <i class="fa-solid fa-user"></i> ${article.author}</span>` : ''}
                            ${article.publishedAt ? `<br><span><i class="fa-solid fa-clock"></i> ${new Date(article.publishedAt).toLocaleString()}</span>` : ''}
                        </div>
                        <p>${article.description || 'No description available.'}</p>
                        <a href="#" class="read-more-link" data-idx="${idx}">Read More <i class="fa fa-arrow-right"></i></a>
                    </div>
                `;
                card.insertBefore(bookmarkBtn, card.firstChild);

                // Read More click (delegated)
                card.querySelector('.read-more-link').addEventListener('click', (e) => {
                    e.preventDefault();
                    showDetailPage(article);
                });

                grid.appendChild(card);
            });
            if (isBookmarkView && articles.length === 0) {
                grid.innerHTML = '<div style="text-align:center; color:#888; grid-column: 1/-1;">No bookmarks yet.</div>';
            }
        }

        // Detail Page Logic
        function showDetailPage(article) {
            // Hide all main sections
            newsSection.style.display = 'none';
            bookmarksSection.style.display = 'none';
            loader.style.display = 'none';
            errorDiv.style.display = 'none';
            // Fill detail page
            detailPage.innerHTML = `
                <span class="detail-back" onclick="hideDetailPage()"><i class="fa fa-arrow-left"></i> Back to News</span>
                <img class="detail-image" src="${article.urlToImage || 'https://via.placeholder.com/880x370/DFE6F6/5B6C82?text=No+Image'}" alt="News Image">
                <div class="detail-title">${article.title}</div>
                <div class="detail-meta">
                    ${article.source && article.source.name ? `<span><i class="fa-solid fa-bullhorn"></i> ${article.source.name}</span>` : ''}
                    ${article.author ? `<span><i class="fa-solid fa-user"></i> ${article.author}</span>` : ''}
                    ${article.publishedAt ? `<span><i class="fa-solid fa-clock"></i> ${new Date(article.publishedAt).toLocaleString()}</span>` : ''}
                </div>
                <div class="detail-desc">${article.description || ''}</div>
                <div class="detail-content">${article.content ? article.content.replace(/\[\+\d+ chars\]$/, "") : ''}</div>
                <a class="detail-visit" href="${article.url}" target="_blank">Visit Original Source <i class="fa fa-arrow-up-right-from-square"></i></a>
            `;
            detailPage.classList.add('active');
        }
        function hideDetailPage() {
            detailPage.classList.remove('active');
            detailPage.innerHTML = '';
            // Show section based on last visible
            if (bookmarksSection.style.display === 'block') {
                bookmarksSection.style.display = 'block';
            } else {
                newsSection.style.display = '';
            }
        }

        // Navigation bar links function
        function activateNavLink(id) {
            document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
            if (id === 'nav-home') document.getElementById('nav-home').classList.add('active');
            if (id === 'nav-bookmarks') document.getElementById('nav-bookmarks').classList.add('active');
        }
        document.getElementById('nav-home').addEventListener('click', (e) => {
            e.preventDefault();
            hideDetailPage();
            hideBookmarks();
            newsSection.style.display = '';
            activateNavLink('nav-home');
            scrollToSection('newsSection');
        });
        document.getElementById('nav-bookmarks').addEventListener('click', (e) => {
            e.preventDefault();
            hideDetailPage();
            showBookmarks();
            activateNavLink('nav-bookmarks');
            scrollToSection('bookmarksSection');
        });
        document.getElementById('footer-home').addEventListener('click', (e) => {
            e.preventDefault();
            hideDetailPage();
            hideBookmarks();
            newsSection.style.display = '';
            activateNavLink('nav-home');
            scrollToSection('newsSection');
        });
        document.getElementById('footer-bookmarks').addEventListener('click', (e) => {
            e.preventDefault();
            hideDetailPage();
            showBookmarks();
            activateNavLink('nav-bookmarks');
            scrollToSection('bookmarksSection');
        });

        // Search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && searchInput.value.trim()) {
                fetchNews(getFilterValues());
            }
        });

        // Search when clicking search button
        document.querySelector('.search-container button').addEventListener('click', () => {
            fetchNews(getFilterValues());
        });

        // Fetch news on page load with default filter
        fetchNews(getFilterValues());