function validateFile(file) {
    const maxFileSize = 50 * 1024 * 1024; // 50MB
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];

    if (file.size > maxFileSize) {
        showMessage('File size exceeds 50MB limit.');
        return false;
    }
    if (!validTypes.includes(file.type)) {
        showMessage('Invalid file type. Please upload JPEG, PNG, WebP, GIF, or BMP.');
        return false;
    }
    return true;
}

function showMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function formatFileSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

function dragOverHandler(event) {
    event.preventDefault();
    // Add visual feedback for drag-over state
    event.dataTransfer.dropEffect = 'copy';
}

function convertAndDownload(file) {
    try {
        // Implement conversion logic
        // ...
        // Example: Using toBlob() instead of toDataURL for better memory management
        let url = URL.createObjectURL(file);
        // Cleanup using revokeObjectURL
        URL.revokeObjectURL(url);
    } catch (error) {
        showMessage('Error during conversion: ' + error.message);
    }
}

function downloadAllAsZip(files) {
    // Improve with progress tracking
    let progress = 0;
    // ... download logic with error handling
}