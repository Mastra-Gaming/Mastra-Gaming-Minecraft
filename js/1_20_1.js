const gallery = document.getElementById('gallery');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const images = [];
let currentIndex = 0;

// Lade die Bilddateien von der JSON-Datei
fetch('../img/1_20_1/images.json') // Hier den Pfad zur JSON-Datei anpassen
    .then(response => response.json())
    .then(data => {
        // Füge die Bilddateinamen aus der JSON-Datei hinzu
        data.images.forEach(file => {
            images.push(`../img/1_20_1/${file}`);
        });
        // Initiales Bild anzeigen, wenn Bilder geladen sind
        showImages();
    })
    .catch(error => console.error('Error loading images:', error));

function showImages() {
    gallery.innerHTML = '';
    if (images.length > 0) { // Überprüfen, ob Bilder vorhanden sind
        const img = document.createElement('img');
        img.src = images[currentIndex];
        img.alt = `Image ${currentIndex + 1}`; // Setze einen Alt-Text für das Bild
        gallery.appendChild(img);
    }
}

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImages();
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    showImages();
});
