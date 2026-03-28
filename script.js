const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
const formatSelect = document.getElementById('formatSelect');
const downloadAllBtn = document.getElementById('downloadAllBtn');
const loader = document.getElementById('loader');

fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

async function handleFiles(files) {
    if (files.length === 0) return;
    
    fileList.innerHTML = '';
    loader.style.display = 'block'; // تشغيل السبينر
    downloadAllBtn.style.display = files.length > 1 ? 'block' : 'none';

    for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;

        const reader = new FileReader();
        await new Promise(resolve => {
            reader.onload = (e) => {
                renderCard(file, e.target.result);
                resolve();
            };
            reader.readAsDataURL(file);
        });
    }
    loader.style.display = 'none'; // إيقاف السبينر
}

function renderCard(file, src) {
    const div = document.createElement('div');
    div.className = 'file-card';
    div.innerHTML = `
        <img src="${src}" alt="Preview">
        <div style="font-size: 11px; margin-bottom: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${file.name}</div>
        <button class="btn-download">تحميل</button>
    `;
    div.querySelector('button').onclick = () => convertAndDownload(src, file.name);
    fileList.appendChild(div);
}

async function convertAndDownload(src, originalName) {
    const targetFormat = formatSelect.value;
    const ext = targetFormat.split('/')[1];
    
    const img = new Image();
    img.src = src;
    await img.decode();

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const dataUrl = canvas.toDataURL(targetFormat, 0.9);
    const link = document.createElement('a');
    link.download = originalName.split('.')[0] + '.' + ext;
    link.href = dataUrl;
    link.click();
}

// تحميل الكل ZIP
downloadAllBtn.onclick = async () => {
    loader.style.display = 'block';
    const zip = new JSZip();
    const targetFormat = formatSelect.value;
    const ext = targetFormat.split('/')[1];
    const images = document.querySelectorAll('.file-card img');

    for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const blob = await new Promise(res => canvas.toBlob(res, targetFormat, 0.9));
        zip.file(`image-${i+1}.${ext}`, blob);
    }

    const content = await zip.generateAsync({type: "blob"});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = "YoussefTools-Converted-Images.zip";
    link.click();
    loader.style.display = 'none';
};
