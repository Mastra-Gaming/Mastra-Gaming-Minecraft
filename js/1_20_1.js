// Vollständiges JavaScript für die dynamische Galerie
ddocument.addEventListener("DOMContentLoaded", function() {
    const gallery = document.getElementById('gallery');
    const leftArrow = document.querySelector('.arrow.left');
    const rightArrow = document.querySelector('.arrow.right');
    let scrollAmount = 0;
    const baseURL = "../img/1_20_1/"; // URL zum Bildverzeichnis
  
    // Abruf der Bilddateien und Anzeige in der Galerie
    fetch('../php/getImages.php')
      .then(response => response.json())
      .then(images => {
        // Prüfen, ob die Bildliste korrekt geladen wurde
        console.log("Bilderliste:", images);
        
        images.forEach(imageName => {
          // Galerie-Element erstellen
          const imgDiv = document.createElement('div');
          imgDiv.classList.add('gallery-item');
          imgDiv.innerHTML = `<img src="${baseURL + imageName}" alt="${imageName}">`;
          gallery.appendChild(imgDiv);
        });
      })
      .catch(error => console.error('Fehler beim Laden der Bilder:', error));
  
    function updateGalleryPosition() {
      gallery.style.transform = `translateX(-${scrollAmount}%)`;
    }
  
    rightArrow.addEventListener('click', () => {
      if (scrollAmount < (gallery.children.length - 1) * 100) {
        scrollAmount += 100;
        updateGalleryPosition();
      }
    });
  
    leftArrow.addEventListener('click', () => {
      if (scrollAmount > 0) {
        scrollAmount -= 100;
        updateGalleryPosition();
      }
    });
  });
  