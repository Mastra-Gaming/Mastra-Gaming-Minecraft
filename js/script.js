const servers = [
    { ip: "mc.mastra-gaming.de", port: 25565, playersElement: "players-server1", connectionElement: "connection-server1", nameElement: "server-name-1", motdElement: "server-motd-1", iconElement: "server-icon-1", entryElement: "picker-menu-1" },
    { ip: "atom.mastra-gaming.de", port: 25566, playersElement: "players-server2", connectionElement: "connection-server2", nameElement: "server-name-2", motdElement: "server-motd-2", iconElement: "server-icon-2", entryElement: "picker-menu-2" },
    { ip: "train.mastra-gaming.de", port: 25567, playersElement: "players-server3", connectionElement: "connection-server3", nameElement: "server-name-3", motdElement: "server-motd-3", iconElement: "server-icon-3", entryElement: "picker-menu-3" },
    { ip: "dev.mastra-gaming.de", port: 25568, playersElement: "players-server4", connectionElement: "connection-server4", nameElement: "server-name-4", motdElement: "server-motd-4", iconElement: "server-icon-4", entryElement: "picker-menu-4" },
    { ip: "paper.mastra-gaming.de", port: 25569, playersElement: "players-server5", connectionElement: "connection-server5", nameElement: "server-name-5", motdElement: "server-motd-5", iconElement: "server-icon-5", entryElement: "picker-menu-5" }
];

// Funktion zur Übersetzung der Minecraft-Farbcodes
function translateMinecraftColors(text) {
    const colorMap = {
        '§0': '#000000', '§1': '#0000AA', '§2': '#00AA00', '§3': '#00AAAA',
        '§4': '#AA0000', '§5': '#AA00AA', '§6': '#FFAA00', '§7': '#AAAAAA',
        '§8': '#555555', '§9': '#5555FF', '§a': '#55FF55', '§b': '#55FFFF',
        '§c': '#FF5555', '§d': '#FF55FF', '§e': '#FFFF55', '§f': '#FFFFFF',
        '§l': '', '§m': '', '§n': '', '§o': '', '§r': ''
    };
    return text.replace(/§[0-9a-fk-or]/g, match => colorMap[match] || '');
}

function scaleGUI(scale) {
    document.body.style.transform = `scale(${scale})`;
    document.body.style.transformOrigin = 'top center';
}

// Funktion zur Aktualisierung der Verbindungsbalken basierend auf der Latenz
function updateConnectionBars(latency, server) {
    const bars = document.getElementById(server.connectionElement).querySelectorAll('.bar');
    if (latency === null) {
        // Server ist offline, setze Balken auf Grau
        bars.forEach(bar => {
            bar.style.backgroundColor = "grey";
        });
    } else {
        // Server ist online, setze Balken basierend auf der Latenz
        const filledBars = Math.max(0, Math.min(5, Math.floor(5 - (latency / 200))));
        bars.forEach((bar, index) => {
            bar.style.backgroundColor = index < filledBars ? "limegreen" : "black";
        });
    }
}

// Funktion zur Serverstatus-Abfrage
async function fetchServerStatus(server) {
    try {
        const response = await fetch(`https://api.minetools.eu/ping/${server.ip}/${server.port}`);
        const data = await response.json();

        if (data && data.players) {
            // Update player count
            document.getElementById(server.playersElement).innerText = `${data.players.online}/${data.players.max}`;
        }
        
        document.getElementById(server.nameElement).textContent = server.ip;

        if (data && data.description) {
            // Update MOTD
            document.getElementById(server.motdElement).innerHTML = translateMinecraftColors(data.description);
        }

        if (data && data.latency) {
            // Update connection bars
            updateConnectionBars(data.latency, server);
            // Entferne die "offline"-Klasse, wenn der Server online ist
            document.getElementById(server.connectionElement).classList.remove('offline');
        } else {
            // Wenn keine Latenz verfügbar ist, setze die Balken auf Grau und markiere als offline
            updateConnectionBars(null, server);
            document.getElementById(server.connectionElement).classList.add('offline');
        }

        // Set server icon if available
        const iconElement = document.getElementById(server.iconElement);
        if (data.favicon) {
            iconElement.src = data.favicon;
            iconElement.alt = "";
        } else {
            iconElement.src = "../img/default-icon.png";
            iconElement.alt = "Server Icon";
        }

    } catch (error) {
        console.error(`Error fetching server status for ${server.ip}:`, error);
        // Server ist offline, setze Balken auf Grau und markiere als offline
        updateConnectionBars(null, server);
        document.getElementById(server.connectionElement).classList.add('offline');
    }
}

let selectedServerURL = null; // Variable zum Speichern der ausgewählten Server-URL
let isServerSelected = false; // Flag to check if a server is selected

// Funktion zum Auswählen eines Servers
function selectServer(element, serverURL) {
    selectedServerURL = serverURL; // Speichert die URL des ausgewählten Servers
    isServerSelected = true; // Setzt das Flag auf true, wenn ein Server ausgewählt ist

    // Aktivieren des "Server beitreten"-Buttons
    const joinButton = document.getElementById("join-server-button");
    joinButton.removeAttribute("disabled");

    // Visuelles Feedback, welcher Server ausgewählt wurde
    document.querySelectorAll('.server-entry').forEach(entry => entry.classList.remove('selected'));
    element.classList.add('selected');

    // Aktualisiere die Zustände der Bearbeiten- und Löschen-Buttons
    updateButtonStates();
}

// Funktion, um den ausgewählten Server zu betreten
function joinSelectedServer() {
    if (selectedServerURL) {
        // Zuerst zur Loading-Seite und die Server-URL als Parameter übergeben
        window.location.href = "../loading/index.html?server=" + encodeURIComponent(selectedServerURL);
    } else {
        alert("Bitte wähle zuerst einen Server aus.");
    }
}

// Funktion zum Aktualisieren der Zustände der Bearbeiten- und Löschen-Buttons
function updateButtonStates() {
    const editButton = document.getElementById("edit-server-button");
    const deleteButton = document.getElementById("delete-server-button");

    if (isServerSelected) {
        editButton.removeAttribute("disabled");
        deleteButton.removeAttribute("disabled");
    } else {
        editButton.setAttribute("disabled", "true");
        deleteButton.setAttribute("disabled", "true");
    }
}

// Funktion zum Deselecting des Servers
function deselectServer() {
    selectedServerURL = null; // Setzt die URL zurück
    isServerSelected = false; // Setzt das Flag auf false

    // Deaktiviert die Buttons
    const joinButton = document.getElementById("join-server-button");
    joinButton.setAttribute("disabled", "true");

    // Aktualisiere die Zustände der Bearbeiten- und Löschen-Buttons
    updateButtonStates();

    // Entferne visuelles Feedback
    document.querySelectorAll('.server-entry').forEach(entry => entry.classList.remove('selected'));
}

// Beispiel für die Verwendung des Deselect-Server (z.B. beim Klicken auf einen anderen Server)
function toggleSelection(element, serverURL) {
    if (element.classList.contains('selected')) {
        deselectServer(); // Wenn der Server bereits ausgewählt ist, deaktiviere die Auswahl
    } else {
        selectServer(element, serverURL); // Andernfalls wähle den Server aus
    }
}



// Funktion zum Abrufen der Serverdetails für alle Server
function fetchAllServerDetails() {
    servers.forEach(server => {
        fetchServerStatus(server);
    });
}

// Serverdetails beim Laden der Seite abrufen
fetchAllServerDetails();
