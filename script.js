const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
const formatSelect = document.getElementById('formatSelect');
const dropZone = document.getElementById('dropZone');

// التعامل مع اختيار الملفات
fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

// دعم خاصية السحب والإفلات (Drag & Drop)
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.background = "rgba(56, 189, 248, 0.2)";
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.background = "transparent";
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.background = "transparent";
    handleFiles(e.dataTransfer.files);
});

function handleFiles(files) {
    fileList.innerHTML = ''; 
    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            renderFileItem(file, event.target.result);
        };
    });
}

function renderFileItem(file, src) {
    const div = document.createElement('div');
    div.className = 'file-item';
    div.innerHTML = `
        <img src="${src}"/>
        <div class="name">${file.name}</div>
        <button class="btn-download">تحويل وتحميل</button>
    `;
    
    // إضافة الحدث للزر يدوياً لتجنب مشاكل النطاق
    div.querySelector('.btn-download').onclick = () => convertAndDownload(src, file.name);
    
    fileList.appendChild(div);
}

function convertAndDownload(src, originalName) {
    const targetFormat = formatSelect.value;
    const extension = targetFormat.split('/')[1];
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        // رسم الصورة على الكانفاس
        ctx.drawImage(img, 0, 0);
        
        // التحويل للجودة والصيغة المطلوبة
        const dataUrl = canvas.toDataURL(targetFormat, 0.9); 
        
        // عملية التحميل التلقائي
        const link = document.createElement('a');
        link.download = originalName.substring(0, originalName.lastIndexOf('.')) + '.' + extension;
        link.href = dataUrl;
        link.click();
    };
}
