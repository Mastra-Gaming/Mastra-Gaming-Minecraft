const gallery = document.getElementById('gallery');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const playPauseBtn = document.getElementById('playPauseBtn');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeBtn = document.getElementById('closeBtn');
const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
const lightboxNextBtn = document.getElementById('lightboxNextBtn');

let images = [];
let currentIndex = 0;
let isPlaying = true;
let intervalId;

// Bilder aus der JSON-Datei laden
fetch('../img/1_20_1/images.json')
    .then(response => response.json())
    .then(data => {
        images = data.images.map(file => `../img/1_20_1/${file}`);
        showImage();
        startSlideshow();
    })
    .catch(error => console.error('Error fetching images:', error));

// Funktion zum Anzeigen des aktuellen Bildes
function showImage() {
    gallery.innerHTML = '';
    const img = document.createElement('img');
    img.src = images[currentIndex];
    img.alt = 'Galeriebild';
    img.addEventListener('click', () => openLightbox(currentIndex)); // Klick-Event für die Lightbox mit Index
    gallery.appendChild(img);
}

// Lightbox öffnen und Bild anzeigen
function openLightbox(index) {
    currentIndex = index;
    lightbox.style.display = 'block';
    lightboxImg.src = images[currentIndex];
}

// Lightbox schließen
function closeLightbox() {
    lightbox.style.display = 'none';
}

// Nächstes Bild in der Lightbox anzeigen
function showNextLightboxImage() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.src = images[currentIndex];
}

// Vorheriges Bild in der Lightbox anzeigen
function showPrevLightboxImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentIndex];
}

// Event-Listener für die Lightbox-Navigation
lightboxNextBtn.addEventListener('click', showNextLightboxImage);
lightboxPrevBtn.addEventListener('click', showPrevLightboxImage);
closeBtn.addEventListener('click', closeLightbox);

// Funktion zum Starten der automatischen Wiedergabe
function startSlideshow() {
    intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage();
    }, 3000);
    isPlaying = true;
    playPauseBtn.textContent = "Pause";
}

// Funktion zum Anhalten der Wiedergabe
function pauseSlideshow() {
    clearInterval(intervalId);
    isPlaying = false;
    playPauseBtn.textContent = "Play";
}

// Play/Pause-Button Funktion
playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseSlideshow();
    } else {
        startSlideshow();
    }
});

// Vorheriges Bild anzeigen
prevBtn.addEventListener('click', () => {
    pauseSlideshow();
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage();
});

// Nächstes Bild anzeigen
nextBtn.addEventListener('click', () => {
    pauseSlideshow();
    currentIndex = (currentIndex + 1) % images.length;
    showImage();
});
