document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements for main display and modal
    const fileDisplay = document.getElementById('file-display');
    const fileModal = document.getElementById('file-modal');
    const modalBody = document.getElementById('modal-body');
    const modalTitle = document.getElementById('modal-title');
    const closeModalButton = document.getElementById('close-modal-button');
    
    let count = 0;
    let fileIndex = 0;

    // Mock file data using placeholder images
    const staticFiles = [
      { fileName: 'the_cooler_adam.png', fileUrl: 'https://cdn.discordapp.com/attachments/1261432509984673884/1423019666711908547/the_cooler_adam.png?ex=68e2be56&is=68e16cd6&hm=8c53141f91a1c8a81f7b030a1fbc96f5f4e9a1aa722a0ee8a87faf6ed4784087' },
      { fileName: 'incorrectQuotessketch.jpg', fileUrl: '/_archive/incorrectQuotessketch.jpg' },
      { fileName: 'smbuOriginalCS.jpg', fileUrl: '/_archive/smbuOriginalCS.jpg' },
      { fileName: 'smoke_bubble_characterSheet.jpg', fileUrl: '/_archive/smoke_bubble_characterSheet.jpg' },
      { fileName: 'trishca_concept.jpg', fileUrl: '/_archive/trishca_concept.jpg' },
      
      // { fileName: 'Document-1.pdf', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
      // { fileName: 'Unsupported-file.txt', fileUrl: 'somefile.txt' }
    ];

// --- Modal Functions ---
    const openModal = (url, fileName, extension) => {
        modalTitle.textContent = fileName;
        let contentHTML = '';

        if (extension === 'pdf') {
            // Use embed for PDFs inside the modal for full-screen viewing
            contentHTML = `<embed src="${url}" type="application/pdf" class="w-full h-full min-h-full" />`;
        } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
            // Use img for images
            contentHTML = `<img src="${url}" alt="${fileName}" />`;
        } else {
            // Fallback for unsupported types
            contentHTML = `<p class="text-xl text-red-500 p-8">Cannot preview unsupported file type: .${extension}</p>`;
        }

        modalBody.innerHTML = contentHTML;
        fileModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };
//Closes Modal
    const closeModal = () => {
        fileModal.classList.add('hidden');
        modalBody.innerHTML = ''; // Clear content
        document.body.style.overflow = ''; // Restore scrolling
    };

    // Event listeners for closing modal
    closeModalButton.addEventListener('click', closeModal);
    fileModal.addEventListener('click', (e) => {
        // Close modal if click is on the backdrop
        if (e.target === fileModal) {
            closeModal();
        }
    });
    document.addEventListener('keydown', (e) => {
        // Close modal on escape key press
        if (e.key === 'Escape' && !fileModal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // --- File Rendering Logic ---
    const createFileCard = (file) => {
        const fileExtension = file.fileName.split('.').pop().toLowerCase();
        let previewText = 'Click to View';
        let iconHtml = '';

        if (fileExtension === 'pdf') {
            // PDF Icon
            iconHtml = '<svg class="w-12 h-12 text-red-600 mx-auto" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 18H8v-2h8v2zm0-4H8v-2h8v2zm-2-4V9h-3V4.5L14.5 9h-3.99z"/></svg>';
            previewText = 'View PDF Document';
        } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
            // Image Preview
            iconHtml = `<img class="mx-auto h-24 w-auto object-contain rounded-lg shadow-inner" 
                            src="${file.fileUrl}" 
                            alt="Preview" 
                            onerror="this.onerror=null;this.src='https://placehold.co/100x100/A0AEC0/FFFFFF?text=Image';">`;
            previewText = 'View Image Concept';
        } else {
            // General File Icon
            iconHtml = '<svg class="w-12 h-12 text-gray-500 mx-auto" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/></svg>';
            previewText = 'Unsupported File Type';
        }

        return `<div class="file-card p-4 bg-gray-100 rounded-xl shadow-md cursor-pointer transition hover:shadow-xl hover:bg-white border-2 border-indigo-200" 
            data-url="${file.fileUrl}" 
            data-filename="${file.fileName}" 
            data-extension="${fileExtension}">
            ${iconHtml}
            <p class="text-xs text-indigo-600">${previewText}</p>
        </div>`;
    };

//Next
    const renderFiles = (file1, file2) => {
        let cardsHtml = '';
        // Use a standard button style for consistency
        let buttonHtml = `<button id="counter-button" class="mt-8 transition ease-in-out duration-300 bg-indigo-600 hover:bg-indigo-700 max-w-sm">Next Set (${count})</button>`;

        // Build the cards HTML
        if (file1) cardsHtml += createFileCard(file1);
        if (file2) cardsHtml += createFileCard(file2);
        
        // Set the inner HTML
        fileDisplay.innerHTML = `${cardsHtml}${buttonHtml}`;

// --- Re-attach Event Listeners (Crucial after innerHTML update) --- 1. Re-attach click listeners to all new file cards to open the modal
        document.querySelectorAll('.file-card').forEach(card => {
            card.addEventListener('click', function() {
                const url = this.getAttribute('data-url');
                const fileName = this.getAttribute('data-filename');
                const extension = this.getAttribute('data-extension');
                openModal(url, fileName, extension);
            });
        });

        // 2. Re-attach event listener to the 'Next' button
        const newCounterButton = document.getElementById('counter-button');
        if (newCounterButton) {
            newCounterButton.addEventListener('click', () => {
                count++;
                displayNextFile();
            });
        }
    };

    const displayNextFile = () => {
        // Determine the current two files to display, ensuring wrap-around logic
        const nextIndex1 = fileIndex % staticFiles.length;
        const nextIndex2 = (fileIndex + 1) % staticFiles.length;

        renderFiles(staticFiles[nextIndex1], staticFiles[nextIndex2]);

        // Move index forward by 2, looping back to 0
        fileIndex = (fileIndex + 2) % staticFiles.length;
    };

    // Initial display call
    displayNextFile();
});