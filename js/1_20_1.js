const gallery = document.getElementById('gallery');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const playPauseBtn = document.getElementById('playPauseBtn'); // Button zum Pausieren und Starten

let images = [];
let currentIndex = 0;
let isPlaying = true; // Flag, um den Wiedergabestatus zu verfolgen
let intervalId;

// Bilder aus der JSON-Datei laden
fetch('../img/1_20_1/images.json') // Passe den Pfad zur JSON-Datei an
    .then(response => response.json())
    .then(data => {
        images = data.images.map(file => `../img/1_20_1/${file}`); // Bilderpfad für jedes Bild
        showImage(); // Zeigt das erste Bild an
        startSlideshow(); // Startet die automatische Wiedergabe
    })
    .catch(error => console.error('Error fetching images:', error));

// Funktion zum Anzeigen des aktuellen Bildes
function showImage() {
    gallery.innerHTML = '';
    const img = document.createElement('img');
    img.src = images[currentIndex];
    gallery.appendChild(img);
}

// Funktion zum Starten der automatischen Wiedergabe
function startSlideshow() {
    intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage();
    }, 3000); // Intervall auf 3 Sekunden gesetzt (3000 ms)
    isPlaying = true;
    playPauseBtn.textContent = "Pause"; // Button-Text auf "Pause" setzen
}

// Funktion zum Anhalten der Wiedergabe
function pauseSlideshow() {
    clearInterval(intervalId);
    isPlaying = false;
    playPauseBtn.textContent = "Play"; // Button-Text auf "Play" setzen
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
    pauseSlideshow(); // Pausiert die automatische Wiedergabe, wenn manuell geklickt wird
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage();
});

// Nächstes Bild anzeigen
nextBtn.addEventListener('click', () => {
    pauseSlideshow(); // Pausiert die automatische Wiedergabe, wenn manuell geklickt wird
    currentIndex = (currentIndex + 1) % images.length;
    showImage();
});
