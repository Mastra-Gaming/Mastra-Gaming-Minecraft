// getImages.php
<?php
$directory = '../img/1_20_1/'; // Pfad zum Bildordner
$images = glob($directory . "*.png"); // Alle PNG-Dateien im Ordner finden
$imageURLs = array_map('basename', $images); // Nur Dateinamen zurückgeben
echo json_encode($imageURLs); // JSON-Ausgabe
?>