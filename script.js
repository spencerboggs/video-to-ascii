// Const variables taken fron the HTML file
const asciiElement = document.getElementById("ascii");
const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");
const applyButton = document.getElementById("apply");

// ASCII characters to represent pixel brightness
const ASCII_CHARS = " .:-=+*#%@";

// Default dimensions for the ASCII display
let asciiWidth = parseInt(widthInput.value, 10);
let asciiHeight = parseInt(heightInput.value, 10);

// Convert a pixel's brightness to an ASCII character
function pixelToAscii(r, g, b) {
    const brightness = (r + g + b) / 3;
    const index = Math.floor((brightness / 255) * (ASCII_CHARS.length - 1));
    return ASCII_CHARS[index];
}

// Process the video frame to ASCII
function videoToAscii(video, canvas, context) {
    // Resize canvas to the ASCII dimensions
    canvas.width = asciiWidth;
    canvas.height = asciiHeight;

    // Draw the current video frame on the canvas
    context.drawImage(video, 0, 0, asciiWidth, asciiHeight);

    // Get pixel data
    const imageData = context.getImageData(0, 0, asciiWidth, asciiHeight);
    const pixels = imageData.data;

    let asciiFrame = "";
    for (let y = 0; y < asciiHeight; y++) {
        for (let x = 0; x < asciiWidth; x++) {
            const i = (y * asciiWidth + x) * 4;
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            asciiFrame += pixelToAscii(r, g, b);
        }
        asciiFrame += "\n";
    }
    return asciiFrame;
}

// Start the video and ASCII conversion
async function startAsciiVideo() {
    const video = document.createElement("video");
    video.autoplay = true;

    // Request access to the webcam
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        // Continuously convert frames to ASCII
        video.addEventListener("play", () => {
            function render() {
                if (!video.paused && !video.ended) {
                    const asciiFrame = videoToAscii(video, canvas, context);
                    asciiElement.textContent = asciiFrame;
                    requestAnimationFrame(render);
                }
            }
            render();
        });
    } catch (err) {
        console.error("Error accessing webcam:", err);
        asciiElement.textContent = "Could not access webcam.";
    }
}

// Update the ASCII dimensions when the "Apply" button is clicked
applyButton.addEventListener("click", () => {
    asciiWidth = parseInt(widthInput.value, 10);
    asciiHeight = parseInt(heightInput.value, 10);
    console.log(`Updated dimensions: ${asciiWidth}x${asciiHeight}`);
});

// Initialize the program
startAsciiVideo();
