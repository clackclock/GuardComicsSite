const libraryData = [
    {
        title: "OGC Issue #1: The Bear",
        pdfUrl: "_archive/1963_mlk_letter.pdf",
        totalPages: 11 // Add the total page count here
    },
    {
        title: "OGC Issue #2: Royal Debt",
        pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
        totalPages: 32
    }
];

let adobeDCView;
let currentBook = null;

// SEARCH LOGIC
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
        // 1. Search in Book Titles
        if (book.title.toLowerCase().includes(query)) {
            const li = document.createElement('li');
            li.className = "book-item search-result";
            li.innerHTML = `<span>📖</span> ${book.title}`;
            li.onclick = () => loadBook(bookIndex);
            list.appendChild(li);
        }

        // 2. Search in Page Numbers (Since chapters are gone)
        // If the user types "Page 5", let's help them find it
        if (query.includes("page")) {
            const pageNum = parseInt(query.replace(/\D/g, "")); // Extract numbers only
            if (pageNum > 0 && pageNum <= book.totalPages) {
                const li = document.createElement('li');
                li.className = "chapter-item search-result";
                li.innerHTML = `<small>${book.title}</small><br>📍 Jump to Page ${pageNum}`;
                li.onclick = () => {
                    loadBook(bookIndex);
                    // Jump to the specific page
                    setTimeout(() => goToChapter(pageNum), 1200);
                };
                list.appendChild(li);
            }
        }
    });

    // If no results were found at all
    if (list.innerHTML === '') {
        list.innerHTML = '<li style="color: #666; text-align: center; padding: 20px;">No scrolls found in the archives...</li>';
    }
}

// Initialize Library View on Load
document.addEventListener("DOMContentLoaded", showLibrary);

function showLibrary() {
    const list = document.getElementById('sidebar-list');
    const title = document.getElementById('current-view-title');
    const backBtn = document.getElementById('back-to-library');

    title.textContent = "The Grand Library";
    backBtn.classList.add('hidden'); // Hide back button
    list.innerHTML = ''; // Clear current list

    libraryData.forEach((book, index) => {
        const li = document.createElement('li');
        li.className = "book-item";
        li.innerHTML = `<span>📖</span> ${book.title}`;
        li.onclick = () => loadBook(index);
        list.appendChild(li);
    });
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

    // --- AUTO-GENERATE PAGE SPREADS ---
    // logic for "Cover + Spreads"
    // Page 1 (Cover)
    // Pages 2-3
    // Pages 4-5...
    const coverLi = document.createElement('li');
    coverLi.textContent = "Front Cover";
    coverLi.onclick = () => goToChapter(1);
    list.appendChild(coverLi);

    for (let i = 1; i <= issue.totalPages; i += 2) {
        const li = document.createElement('li');
        li.className = "chapter-item";
        
        // Check if there's a second page in the spread (handle odd total pages)
        const endPage = (i + 1 <= issue.totalPages) ? i + 1 : i;
        
        if (i === endPage) {
            li.textContent = `Page ${i}`;
        } else {
            li.textContent = `Pages ${i}-${endPage}`;
        }

        li.onclick = () => goToChapter(i);
        list.appendChild(li);
    }

    renderPDF(issue.pdfUrl, issue.title);
}

document.addEventListener("adobe_dc_view_sdk.ready", function() {
    adobeDCView = new AdobeDC.View({
        clientId: "YOUR_CLIENT_ID",
        divId: "adobe-dc-view"
    });
    // Optional: Load the first book automatically
    // loadBook(0); Nah let's wait for user input, feels more respectful to their agency
});

function renderPDF(url, fileName) {
    if (!adobeDCView) return; 

    adobeDCView.previewFile({
        content: { location: { url: url } },
        metaData: { fileName: fileName }
    }, {
        /* Mobile-friendly settings */
        defaultViewMode: window.innerWidth < 768 ? "FIT_WIDTH" : "TWO_COLUMN", 
        showAnnotationTools: false,
        showPageControls: true,
        enableFormFilling: false,
        /* This prevents Adobe from taking over the whole screen with its own UI */
        embedMode: "FULL_WINDOW" 
    });
}

// Initialize Adobe PDF Embed
document.addEventListener("adobe_dc_view_sdk.ready", function() {
    adobeDCView = new AdobeDC.View({
        clientId: "YOUR_CLIENT_ID", // Get this from Adobe's free dev console
        divId: "adobe-dc-view"
    });

    adobeDCView.previewFile({
        content: { location: { url: comicData.pdfUrl } },
        metaData: { fileName: comicData.title }
    }, {
        /* Settings for the Two-Page "Comic" feel */
        defaultViewMode: "TWO_COLUMN", 
        showAnnotationTools: false,
        showLeftHandPanel: false, 
        showPageControls: true,
        pageViewMode: "TWO_COLUMN_LEFT_TO_RIGHT", // Standard Western comic reading
        enableLinearization: true
    });
});

// The Navigation Function - Jumps to a specific page number in the PDF - AKA my captain my captain
function goToChapter(pageNumber) {
    adobeDCView.getAPIs().then(apis => {
        apis.gotoPage(pageNumber)
            .catch(error => console.error("Could not jump to page:", error));
    });

    // AUTO-CLOSE SIDEBAR ON MOBILE
    if (window.innerWidth <= 768) {
        toggleMobileMenu();
    }
    
    updateActiveUI(pageNumber);
}

// --- FAVORITES LOGIC ---

// Load favorites from browser storage on startup
let favorites = JSON.parse(localStorage.getItem('ogc_favorites')) || [];

function saveCurrentPageToFavorites() {
    if (!adobeDCView || currentBook === null) {
        alert("Please open a book first!");
        return;
    }

    adobeDCView.getAPIs().then(apis => {
        apis.getCurrentPage().then(pageNumber => {
            const newFav = {
                bookIndex: libraryData.indexOf(currentBook),
                bookTitle: currentBook.title,
                page: pageNumber,
                timestamp: new Date().toLocaleDateString()
            };

            // Prevent duplicates
            const exists = favorites.find(f => f.bookTitle === newFav.bookTitle && f.page === newFav.page);
            if (!exists) {
                favorites.push(newFav);
                localStorage.setItem('ogc_favorites', JSON.stringify(favorites));
                renderFavorites();
                alert(`Saved Page ${pageNumber} of ${currentBook.title}!`);
            } else {
                alert("This page is already bookmarked.");
            }
        });
    });
}

function renderFavorites() {
    const list = document.getElementById('favorites-list');
    list.innerHTML = '';

    if (favorites.length === 0) {
        list.innerHTML = '<li style="color: #666; font-size: 0.8rem;">No bookmarks yet.</li>';
        return;
    }

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
        
        // Click to jump to that book and page
        li.onclick = () => {
            loadBook(fav.bookIndex);
            // Delay to allow PDF to load before jumping
            setTimeout(() => goToChapter(fav.page), 1200);
        };
        list.appendChild(li);
    });
}

function deleteFavorite(index, event) {
    event.stopPropagation(); // Prevents the jump-to-page trigger
    favorites.splice(index, 1);
    localStorage.setItem('ogc_favorites', JSON.stringify(favorites));
    renderFavorites();
}

// Call this inside DOMContentLoaded listener
document.addEventListener("DOMContentLoaded", () => {
    showLibrary();
    renderFavorites();
});

//SHARE LINK LOGIC
function generateShareLink() {
    if (!adobeDCView || currentBook === null) {
        alert("Open a book to share a page!");
        return;
    }

    adobeDCView.getAPIs().then(apis => {
        apis.getCurrentPage().then(pageNumber => {
            const bookIndex = libraryData.indexOf(currentBook);
            
            // Build the URL with parameters
            const baseUrl = window.location.origin + window.location.pathname;
            const shareUrl = `${baseUrl}?book=${bookIndex}&page=${pageNumber}`;

            // Copy to clipboard
            navigator.clipboard.writeText(shareUrl).then(() => {
                alert("Link copied to clipboard! Share the lore.");
            }).catch(err => {
                console.error('Could not copy text: ', err);
            });
        });
    });
}
document.addEventListener("DOMContentLoaded", () => {
    showLibrary();
    renderFavorites();

    // Check for share parameters in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const bookParam = urlParams.get('book');
    const pageParam = urlParams.get('page');

    if (bookParam !== null) {
        const bookIndex = parseInt(bookParam);
        const pageNumber = parseInt(pageParam) || 1;

        // Wait for Adobe to be ready before jumping
        document.addEventListener("adobe_dc_view_sdk.ready", () => {
            loadBook(bookIndex);
            setTimeout(() => goToChapter(pageNumber), 1500);
        });
    }
});

// Toggle the Sidebar on Mobile
function toggleMobileMenu() {
    const sidebar = document.querySelector('.chapter-sidebar');
    sidebar.classList.toggle('mobile-open');
    
    // Change button text based on state
    const btn = document.getElementById('mobile-menu-toggle');
    btn.textContent = sidebar.classList.contains('mobile-open') ? "✖ Close" : "📜 Menu";
}
