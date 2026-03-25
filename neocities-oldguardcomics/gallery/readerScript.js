const libraryData = [
    {
        title: "OGC Issue #1: The Bear",
        pdfUrl: "/neocities-oldguardcomics/_archive/1963_mlk_letter.pdf",
        totalPages: 11 
    },
    {
        title: "OGC Issue #2: Royal Debt",
        pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
        totalPages: 2
    }
];

// PDF.js Setup
const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

let pdfDoc = null;
let pageNum = 1;
let currentBook = null;
let favorites = JSON.parse(localStorage.getItem('ogc_favorites')) || [];

let viewMode = 'fit'; // Options: 'fit' or 'zoom'

// Canvas Context
const canvas = document.getElementById('pdf-render-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
    showLibrary();
    renderFavorites();

    // Check for share parameters in the URL (?book=0&page=5)
    const urlParams = new URLSearchParams(window.location.search);
    const bookParam = urlParams.get('book');
    const pageParam = urlParams.get('page');

    if (bookParam !== null) {
        const bookIndex = parseInt(bookParam);
        const pageNumber = parseInt(pageParam) || 1;
        loadBook(bookIndex);
        // Short delay to ensure PDF.js is ready to render
        setTimeout(() => goToChapter(pageNumber), 1000);
    }
});

// CORE READER FUNCTIONS
function showLibrary() {
    const list = document.getElementById('sidebar-list');
    const title = document.getElementById('current-view-title');
    const backBtn = document.getElementById('back-to-library');

    title.textContent = "The Grand Library";
    backBtn.classList.add('hidden');
    list.innerHTML = '';

    libraryData.forEach((book, index) => {
        const li = document.createElement('li');
        li.className = "book-item";
        li.innerHTML = `<span>📖</span> ${book.title}`;
        li.onclick = () => loadBook(index);
        list.appendChild(li);
    });

    // Bring back the placeholder
    const placeholder = document.getElementById('reader-placeholder');
    if (placeholder) placeholder.style.display = 'flex';
    
    // Clear the canvas so the old book doesn't sit behind the placeholder
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function loadBook(index) {
    const issue = libraryData[index];
    currentBook = issue;
    
    const list = document.getElementById('sidebar-list');
    const title = document.getElementById('current-view-title');
    const backBtn = document.getElementById('back-to-library');

    title.textContent = issue.title;
    backBtn.classList.remove('hidden');
    list.innerHTML = '';

    // Generate Sidebar Page Spreads
    const coverLi = document.createElement('li');
    coverLi.textContent = "Front Cover";
    coverLi.onclick = () => goToChapter(1);
    list.appendChild(coverLi);

    for (let i = 2; i <= issue.totalPages; i += 2) {
        const li = document.createElement('li');
        li.className = "chapter-item";
        const endPage = (i + 1 <= issue.totalPages) ? i + 1 : i;
        li.textContent = (i === endPage) ? `Page ${i}` : `Pages ${i}-${endPage}`;
        li.onclick = () => goToChapter(i);
        list.appendChild(li);
    }

    renderPDF(issue.pdfUrl);
}

function renderPDF(url) {
    // Hide the placeholder as soon as a book is picked
    const placeholder = document.getElementById('reader-placeholder');
    if (placeholder) placeholder.style.display = 'none'; 

    toggleLoader(true); 
    pdfjsLib.getDocument(url).promise.then(pdf => {
        pdfDoc = pdf;
        currentBook.totalPages = pdf.numPages; 
        renderPage(1);
    }).catch(err => {
        toggleLoader(false);
        // If it fails, maybe show the placeholder again?
        if (placeholder) placeholder.style.display = 'flex';
        console.error("Error loading PDF: ", err);
        alert("The archive could not be opened.");
    });
}
function renderPage(num) {
    if (!pdfDoc) return;
    toggleLoader(true);

    pdfDoc.getPage(num).then(page => {
        const container = document.getElementById('pdf-view-parent');
        
        // Use getViewport (WITHOUT the "Page" in the middle)
        const unscaledViewport = page.getViewport({ scale: 0.9 });
        let finalScale;

        if (viewMode === 'fit') {
            // "Fit to Screen" Logic (Container height minus padding)
            const availableHeight = container.clientHeight - 60; 
            finalScale = availableHeight / unscaledViewport.height;
            container.style.overflowY = "hidden"; 
        } else {
            // "Zoom / Original" Logic
            finalScale = 1.5; 
            container.style.overflowY = "auto";
        }

        const viewport = page.getViewport({ scale: finalScale });
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderCtx = {
            canvasContext: ctx,
            viewport: viewport
        };
        
        page.render(renderCtx).promise.then(() => {
            toggleLoader(false);
            pageNum = num;
            updateActiveUI(num);
        });
    });
}
// Re-render the page when the window is resized to keep it "Fit to Screen"
window.addEventListener('resize', () => {
    if (pdfDoc) {
        renderPage(pageNum);
    }
});

function toggleViewMode() {
    const btn = document.getElementById('zoom-toggle-btn');
    const container = document.getElementById('pdf-view-parent');
    
    if (viewMode === 'fit') {
        viewMode = 'zoom';
        btn.textContent = "📱 Fit Screen";
        btn.classList.add('active-zoom');
        // Snap to top when zooming in
        container.scrollTop = 0;
    } else {
        viewMode = 'fit';
        btn.textContent = "🔍 Zoom In";
        btn.classList.remove('active-zoom');
    }
    
    renderPage(pageNum);
}
// Helper function to handle the fade
function toggleLoader(show) {
    const loader = document.getElementById('loading-spinner');
    if (!loader) return;
    if (show) {
        loader.classList.remove('spinner-hidden');
    } else {
        loader.classList.add('spinner-hidden');
    }
}

function goToChapter(pageNumber) {
    if (pdfDoc) {
        renderPage(pageNumber);
        if (window.innerWidth <= 768) toggleMobileMenu();
    }
}

// -- SEARCH LOGIC --
function handleSearch() {
    const query = document.getElementById('sidebar-search').value.toLowerCase();
    const list = document.getElementById('sidebar-list');
    const backBtn = document.getElementById('back-to-library');
    
    if (query === "") {
        showLibrary();
        return;
    }

    list.innerHTML = '';
    backBtn.classList.remove('hidden');

    libraryData.forEach((book, bookIndex) => {
        if (book.title.toLowerCase().includes(query)) {
            const li = document.createElement('li');
            li.className = "book-item search-result";
            li.innerHTML = `<span>📖</span> ${book.title}`;
            li.onclick = () => loadBook(bookIndex);
            list.appendChild(li);
        }

        if (query.includes("page")) {
            const p = parseInt(query.replace(/\D/g, ""));
            if (p > 0 && p <= book.totalPages) {
                const li = document.createElement('li');
                li.className = "chapter-item search-result";
                li.innerHTML = `<small>${book.title}</small><br>📍 Jump to Page ${p}`;
                li.onclick = () => {
                    loadBook(bookIndex);
                    setTimeout(() => goToChapter(p), 1000);
                };
                list.appendChild(li);
            }
        }
    });
}

// -- FAVORITES & SHARING --
function saveCurrentPageToFavorites() {
    if (!pdfDoc || !currentBook) {
        alert("Please open a book first!");
        return;
    }

    const newFav = {
        bookIndex: libraryData.indexOf(currentBook),
        bookTitle: currentBook.title,
        page: pageNum, // Uses current PDF.js pageNum
        timestamp: new Date().toLocaleDateString()
    };

    const exists = favorites.find(f => f.bookTitle === newFav.bookTitle && f.page === newFav.page);
    if (!exists) {
        favorites.push(newFav);
        localStorage.setItem('ogc_favorites', JSON.stringify(favorites));
        renderFavorites();
        alert(`Bookmarked Page ${pageNum}!`);
    } else {
        alert("Already bookmarked.");
    }
}

function renderFavorites() {
    const list = document.getElementById('favorites-list');
    list.innerHTML = favorites.length === 0 ? 
        '<li style="color: #666; font-size: 0.8rem;">No bookmarks yet.</li>' : '';

    favorites.forEach((fav, index) => {
        const li = document.createElement('li');
        li.className = "fav-item";
        li.innerHTML = `
            <div>
                <strong>${fav.bookTitle}</strong><br>
                <span>Page ${fav.page}</span> <small>(${fav.timestamp})</small>
            </div>
            <button class="delete-fav" onclick="deleteFavorite(${index}, event)">×</button>
        `;
        li.onclick = () => {
            loadBook(fav.bookIndex);
            setTimeout(() => goToChapter(fav.page), 1000);
        };
        list.appendChild(li);
    });
}
function deleteFavorite(index, event) {
    event.stopPropagation();
    favorites.splice(index, 1);
    localStorage.setItem('ogc_favorites', JSON.stringify(favorites));
    renderFavorites();
}

function generateShareLink() {
    if (!pdfDoc || !currentBook) {
        alert("Open a book to share!");
        return;
    }
    const bookIndex = libraryData.indexOf(currentBook);
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?book=${bookIndex}&page=${pageNum}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
        alert("Link copied to clipboard!");
    });
}

// UI 
function toggleMobileMenu(event) {
    const sidebar = document.querySelector('.chapter-sidebar');
    if (!sidebar) return;
    
    sidebar.classList.toggle('mobile-open');
    const btn = document.getElementById('mobile-menu-toggle');
    if (btn) btn.textContent = sidebar.classList.contains('mobile-open') ? "✖ Close" : "📜 Menu";
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (!pdfDoc) return; // Don't do anything if no book is loaded

    // Don't flip pages if the user is typing in the search bar
    if (document.activeElement.id === 'sidebar-search') return;

    if (e.key === 'ArrowRight' || e.key === 'd') {
        if (pageNum < pdfDoc.numPages) {
            goToChapter(pageNum + 1);
        }
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        if (pageNum > 1) {
            goToChapter(pageNum - 1);
        }
    }
});

// Touch should be for the touch area not the whole document
const readerArea = document.getElementById('pdf-view-parent');
readerArea.addEventListener('touchend', (e) => {
    if (!pdfDoc) return;
    
    // If the sidebar is open, don't turn pages (prevents accidents)
    const sidebar = document.querySelector('.chapter-sidebar');
    if (sidebar.classList.contains('mobile-open')) return;

    // Ignore if the user is touching the menu button itself
    if (e.target.id === 'mobile-menu-toggle') return;

    const touch = e.changedTouches[0];
    const screenWidth = window.innerWidth;
    const touchX = touch.clientX;

    // Tap Zones (Left 30% / Right 30%)
    if (touchX < screenWidth * 0.3) {
        if (pageNum > 1) goToChapter(pageNum - 1);
    } else if (touchX > screenWidth * 0.7) {
        if (pageNum < pdfDoc.numPages) goToChapter(pageNum + 1);
    }
}, { passive: true });

function updateActiveUI(num) {
    // Maybe highlight the current page in the sidebar list
}