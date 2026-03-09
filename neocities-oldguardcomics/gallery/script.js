// tab button scripts
function showContent(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "flex";
    evt.currentTarget.className += " active";
}


function getProcessedUrl(url) {
    // If the URL is external (like discord CDN), use it directly
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return url;
}

function openModal(url, type) {
    const modal = document.getElementById('fileModal');
    const content = document.getElementById('modalContent');

    // Clear previous content
    content.innerHTML = '';

    // Create the element to display the content
    let mediaElement;

    // Disables right-click context menu (not foolproof, but a deterrent)
    // const contextMenuProtection = 'oncontextmenu="return false;"'; 

    if (type === 'image') {
        mediaElement = document.createElement('img');
        mediaElement.src = getProcessedUrl(url);
        mediaElement.alt = 'Gallery Item';
        mediaElement.setAttribute('style', 'pointer-events: none;'); // Stronger protection against drag/save
        mediaElement.setAttribute('oncontextmenu', 'return false;');
    } else if (type === 'pdf') {
        // Note: PDFs are inherently easier to download/print. Embedding provides a view.
        mediaElement = document.createElement('embed');
        mediaElement.src = getProcessedUrl(url);
        mediaElement.type = 'application/pdf';
        mediaElement.setAttribute('style', 'width: 100%; height: 80vh;');
    }

    if (mediaElement) {
        content.appendChild(mediaElement);
        modal.style.display = 'block';
    }
    }

    function closeModal(event) {
    // Only close if the close button or the dark background is clicked
    if (event.target.classList.contains('close-btn') || event.target.id === 'fileModal') {
        document.getElementById('fileModal').style.display = 'none';
    }
}

// Function to set the initial active tab
function initializeTabs() {
    // Default to 'Gallery'
    const defaultTab = 'Comics'; // Change this to 'Concepts' or 'Gallery' if you want a different default
    const defaultButton = document.querySelector(`.tab button[onclick*="'${defaultTab}'"]`);

    if (defaultButton) {
        // Manually trigger the tab display for the default tab
        // Passing an object that mimics the required event structure
        showContent({ currentTarget: defaultButton }, defaultTab);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const galleryContainerConcepts = document.getElementById('Concepts');

    // Define the array of files to display
    const filesConcepts = [
        { name: 'SMH - Power Concept Comic', type: 'image', url: '/_archive/Power_Concept.jpg' },
        { name: 'SMH - OLD Concept Sheet', type: 'image', url: '/_archive/smbuOriginalCS.jpg' },
        { name: 'SMH - NEW SB Concept', type: 'image', url: '/_archive/smoke_bubble_characterSheet.jpg' },
        { name: 'SMH - NEW Trish Concept', type: 'image', url: '/_archive/trishca_concept.jpg' },
        { name: 'SMH - IncorrectQuotes1 Sketch', type: 'image', url: '/_archive/incorrectQuotessketch.jpg' },
        { name: 'D.tv @sockpot21 Collab - Adam Concept 1', type: 'image', url: '/_archive/adam.png' },
        { name: 'D.tv @sockpot21 Collab - Adam Concept 2', type: 'image', url: '/_archive/Edited_Adam_comm.png' },
        { name: 'D.tv @sockpot21 Collab - Concept Sketch', type: 'image', url: '/_archive/Detox_V1_comm.png' },
        { name: 'D.tv @sockpot21 Collab - Concept Sketch 2', type: 'image', url: '/_archive/Detox_V2_comm.png' },
        { name: 'D.tv @sockpot21 Collab - Concept Skecth 3', type: 'image', url: '/_archive/Detox_V3_comm.png' },
        { name: 'SMH - Royal Accountant Concept', type: 'image', url: '/_archive/advisorDesign.jpg' },
        { name: 'SMH - Fantasy Pork Tongue', type: 'image', url: '/_archive/porkTongueDish.jpg' }

    ];

    filesConcepts.forEach(file => {
        const galleryItem = createGalleryItem(file);
        galleryContainerConcepts.appendChild(galleryItem);
    });

    // Comics tab generation
    const galleryContainerComics = document.getElementById('Comics');
    const filesComics = [
        // Add bookIndex here so the code knows which PDF to load in the reader
        { name: 'Go To Reader', type: 'comic', bookIndex: -1, thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Search_Icon.svg' },
        { name: 'Issue #1: The Bear', type: 'comic', bookIndex: 0, thumbnail: '/_archive/covers/issue1.jpg' },
        { name: 'Issue #2: Royal Debt', type: 'comic', bookIndex: 1, thumbnail: '/_archive/covers/issue2.jpg' },
    ];

    filesComics.forEach(file => {
        const galleryItem = createGalleryItem(file);
        galleryContainerComics.appendChild(galleryItem);
    });


    // Helper function to create a gallery item (to avoid repeating code)
    function createGalleryItem(file) {
        let galleryItem;
        
        if (file.type === 'comic') {
            
            galleryItem = document.createElement('a');
            // If it's the "Search/Go To" icon, just go to the reader without a specific book
            galleryItem.href = file.bookIndex === -1 ? `reader.html` : `reader.html?book=${file.bookIndex}`;
            galleryItem.classList.add('comic-card');
            
            // Special case: Search icon styling
            if (file.bookIndex === -1) {
                galleryItem.style.borderStyle = "dashed";
                galleryItem.style.opacity = "0.8";
            }
        } else {
            galleryItem = document.createElement('div');
            galleryItem.classList.add('gallery-item');
            galleryItem.addEventListener('click', () => openModal(file.url, file.type));
        }

        const mediaElement = document.createElement('img');
        mediaElement.src = file.thumbnail || file.url;
        mediaElement.alt = file.name;
        // For the Search Icon, don't use object-fit: cover
        if (file.bookIndex === -1) mediaElement.style.objectFit = "contain";

        const titleElement = document.createElement('div');
        titleElement.classList.add('title');
        titleElement.textContent = file.name;

        galleryItem.appendChild(mediaElement);
        galleryItem.appendChild(titleElement);
        
        return galleryItem;
    }

    // Add keyboard support to close modal with ESC key (kept separate for clarity)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('fileModal').style.display === 'block') {
        closeModal({
            target: document.getElementById('fileModal')
        });
        }
    });

    // Finally, initialize the tabs to show the default one
    initializeTabs();
});
