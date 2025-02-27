const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const brushOpacity = document.getElementById("brushOpacity"); // Opacity slider
const clearCanvas = document.getElementById("clearCanvas");
const saveCanvas = document.getElementById("saveCanvas");
const loadCanvas = document.getElementById("loadCanvas");

// Function to set canvas size to 80% of the viewport
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
}

// Initial canvas setup
resizeCanvas();

// Resize canvas when the window resizes
window.addEventListener("resize", resizeCanvas);

let painting = false;
let lastX, lastY;

function startPosition(e) {
    painting = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function endPosition() {
    painting = false;
    ctx.beginPath();
}

function draw(e) {
    if (!painting) return;
    ctx.lineWidth = brushSize.value;
    ctx.lineCap = "round";

    // Get color and opacity
    const color = colorPicker.value;
    const opacity = brushOpacity.value; // Get opacity value (0 to 1)
    
    ctx.strokeStyle = hexToRGBA(color, opacity);

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();

    [lastX, lastY] = [e.offsetX, e.offsetY];
}

// Convert HEX color to RGBA
function hexToRGBA(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}

// Event Listeners for mouse
canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", draw);

// Touch support
canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    lastX = touch.clientX - rect.left;
    lastY = touch.clientY - rect.top;
    painting = true;
});

canvas.addEventListener("touchend", () => (painting = false));

canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (!painting) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    ctx.lineWidth = brushSize.value;
    ctx.lineCap = "round";

    const color = colorPicker.value;
    const opacity = brushOpacity.value;
    ctx.strokeStyle = hexToRGBA(color, opacity);

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastX = x;
    lastY = y;
});

// Clear canvas
clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Save drawing to Local Storage
saveCanvas.addEventListener("click", () => {
    localStorage.setItem("savedCanvas", canvas.toDataURL());
    alert("Drawing saved!");
});

// Load drawing from Local Storage
loadCanvas.addEventListener("click", () => {
    const savedCanvas = localStorage.getItem("savedCanvas");
    if (savedCanvas) {
        const img = new Image();
        img.src = savedCanvas;
        img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    } else {
        alert("No saved drawing found.");
    }
});
