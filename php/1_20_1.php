<?php
$directory = '../img/1_20_1/'; // Verzeichnis mit den Bildern
$images = glob($directory . '*.{jpg,jpeg,png,gif}', GLOB_BRACE); // Holt alle Bilddateien im Verzeichnis

// Extrahiere nur die Dateinamen ohne den Pfad
$imageFiles = array_map('basename', $images);

// Erstelle ein Array für die JSON-Daten
$jsonData = [
    'images' => $imageFiles // Die Bilddateinamen in ein Array packen
];

// Erstelle eine JSON-Datei
$jsonFilePath = '../img/1_20_1/images.json'; // Hier den gewünschten Speicherort für die JSON-Datei anpassen

if (file_put_contents($jsonFilePath, json_encode($jsonData, JSON_PRETTY_PRINT))) {
    echo 'JSON-Datei erfolgreich erstellt: ' . $jsonFilePath;
} else {
    echo 'Fehler beim Erstellen der JSON-Datei.';
}
?>
