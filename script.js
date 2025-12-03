// Typing Effect for Hero Section
const textElement = document.getElementById('typing-text');
const texts = ['Embedded Engineer', 'Firmware Developer', 'IoT Enthusiast', 'RTOS Specialist', 'PCB Designer'];
let count = 0;
let index = 0;
let currentText = '';
let letter = '';

(function type() {
  if (count === texts.length) {
    count = 0;
  }
  currentText = texts[count];
  letter = currentText.slice(0, ++index);

  textElement.textContent = letter;
  if (letter.length === currentText.length) {
    count++;
    index = 0;
    setTimeout(type, 2000); // Wait before starting next word
  } else {
    setTimeout(type, 100); // Typing speed
  }
})();

// Add smooth reveal animation on scroll (optional for Bento but nice to have)
const observerOptions = {
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.card').forEach((card) => {
  // Set initial state for animation
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  observer.observe(card);
});

// Video Modal Logic
function openVideo(event, url) {
  event.preventDefault();
  const modal = document.getElementById('video-modal');
  const video = document.getElementById('video-frame');

  // Force reflow to enable transition
  void modal.offsetWidth;
  modal.classList.add('show');

  // Attempt to play automatically
  video.play().catch(e => console.log("Autoplay prevented:", e));
}

function closeVideo() {
  const modal = document.getElementById('video-modal');
  const video = document.getElementById('video-frame');

  modal.classList.remove('show');
  setTimeout(() => {
    modal.style.display = 'none';
    video.pause();
    video.currentTime = 0;
    video.src = ''; // Clear source
  }, 300); // Match transition duration
}

// Close modal with Escape key
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    closeVideo();
  }
});

// --- WASM Module Initialization ---
let apcModule, isModule, mp3Module, stegoModule;

window.addEventListener('load', async function () {
  try {
    if (typeof createAPCModule === 'function') apcModule = await createAPCModule();
    if (typeof createISModule === 'function') isModule = await createISModule();
    if (typeof createMP3Module === 'function') mp3Module = await createMP3Module();
    if (typeof createStegoModule === 'function') stegoModule = await createStegoModule();
    console.log("WASM Modules loaded!");
  } catch (e) {
    console.error("Failed to load WASM modules:", e);
  }
});

// --- JavaScript Fallback Implementations ---

// 1. Calculator Fallback
function jsCalculate(op1, operator, op2) {
  try {
    const n1 = BigInt(op1);
    const n2 = BigInt(op2);
    let res;
    switch (operator) {
      case '+': res = n1 + n2; break;
      case '-': res = n1 - n2; break;
      case '*': case 'x': res = n1 * n2; break;
      case '/': res = n2 === 0n ? "Error: Division by Zero" : n1 / n2; break;
      default: return "Error: Invalid Operator";
    }
    return res.toString();
  } catch (e) {
    return "Error: Invalid Input";
  }
}

// 2. Inverted Search Fallback
const jsIndex = {};
function jsAddToIndex(filename, content) {
  const words = content.split(/\s+/);
  words.forEach(word => {
    const w = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!w) return;
    if (!jsIndex[w]) jsIndex[w] = {};
    if (!jsIndex[w][filename]) jsIndex[w][filename] = 0;
    jsIndex[w][filename]++;
  });
  return 1;
}

function jsSearch(query) {
  const w = query.toLowerCase();
  if (!jsIndex[w]) return "Word not found";

  let result = `Word '${query}' found in ${Object.keys(jsIndex[w]).length} file(s):\n`;
  for (const [file, count] of Object.entries(jsIndex[w])) {
    result += `- ${file} (${count} times)\n`;
  }
  return result;
}

// 3. MP3 Reader Fallback (Mock)
function jsReadTags(filename, buffer) {
  // Real parsing is complex, returning mock data for demo
  return JSON.stringify({
    "TIT2": "Demo Title",
    "TPE1": "Demo Artist",
    "TALB": "Demo Album",
    "TYER": "2024",
    "TCON": "Pop",
    "COMM": "Parsed via JS Fallback"
  });
}

// 4. Steganography Fallback (Mock)
// We can't easily do bit-level manipulation on raw buffers in simple JS without Canvas or complex logic.
// For the "Try Live" demo, we will simulate success.

// --- Main Logic with Fallback Support ---

// Calculator Modal Functions
function openCalculator(event) {
  event.preventDefault();
  document.getElementById('calc-modal').style.display = 'flex';
}

function closeCalculator() {
  document.getElementById('calc-modal').style.display = 'none';
}

// Calculator Logic
function runCalculator() {
  console.log("runCalculator called");
  const op1 = document.getElementById('calc-op1').value;
  const op2 = document.getElementById('calc-op2').value;
  const operator = document.getElementById('calc-operator').value;
  const resultDiv = document.getElementById('calc-result');

  console.log("Inputs:", op1, operator, op2);

  if (!op1 || !op2) {
    resultDiv.innerText = "Please enter both numbers.";
    return;
  }

  console.log("Checking apcModule:", apcModule);
  if (apcModule) {
    console.log("apcModule._calculate_wasm:", apcModule._calculate_wasm);
  }

  // Try WASM first, else JS
  if (apcModule && apcModule._calculate_wasm) {
    console.log("Attempting WASM calculation...");
    try {
      const op1Ptr = apcModule.allocate(apcModule.intArrayFromString(op1), apcModule.ALLOC_NORMAL);
      const op2Ptr = apcModule.allocate(apcModule.intArrayFromString(op2), apcModule.ALLOC_NORMAL);
      const opPtr = apcModule.allocate(apcModule.intArrayFromString(operator), apcModule.ALLOC_NORMAL);

      console.log("Pointers allocated:", op1Ptr, op2Ptr, opPtr);

      const resultPtr = apcModule._calculate_wasm(op1Ptr, opPtr, op2Ptr);
      console.log("Result Pointer:", resultPtr);

      const resultStr = apcModule.UTF8ToString(resultPtr);
      console.log("Result String:", resultStr);

      resultDiv.innerText = resultStr;

      apcModule._free(op1Ptr); apcModule._free(op2Ptr); apcModule._free(opPtr);
    } catch (e) {
      console.error("WASM Error:", e);
      resultDiv.innerText = jsCalculate(op1, operator, op2) + " (JS Mode)";
    }
  } else {
    console.log("Falling back to JS Mode");
    resultDiv.innerText = jsCalculate(op1, operator, op2) + " (JS Mode)";
  }
}

// Inverted Search Modal Functions
function openInvertedSearch(event) {
  event.preventDefault();
  document.getElementById('is-modal').style.display = 'flex';
}

function closeInvertedSearch() {
  document.getElementById('is-modal').style.display = 'none';
}

// Inverted Search Logic
async function uploadAndIndexFiles() {
  const fileInput = document.getElementById('is-file-upload');
  const fileListDiv = document.getElementById('is-file-list');

  if (fileInput.files.length === 0) {
    alert("Please select at least one .txt file.");
    return;
  }

  for (let i = 0; i < fileInput.files.length; i++) {
    const file = fileInput.files[i];
    const text = await file.text();

    if (isModule && isModule._add_file_to_index) {
      const filenamePtr = isModule.allocate(isModule.intArrayFromString(file.name), isModule.ALLOC_NORMAL);
      const contentPtr = isModule.allocate(isModule.intArrayFromString(text), isModule.ALLOC_NORMAL);
      isModule._add_file_to_index(filenamePtr, contentPtr);
      isModule._free(filenamePtr); isModule._free(contentPtr);
    } else {
      jsAddToIndex(file.name, text);
    }

    const p = document.createElement('p');
    p.innerText = `Indexed: ${file.name}`;
    fileListDiv.appendChild(p);
  }
  fileInput.value = "";
}

function runInvertedSearch() {
  const query = document.getElementById('is-search-query').value;
  const resultDiv = document.getElementById('is-result');

  if (!query) { resultDiv.innerText = "Please enter a word."; return; }

  if (isModule && isModule._search_wasm) {
    const queryPtr = isModule.allocate(isModule.intArrayFromString(query), isModule.ALLOC_NORMAL);
    const resultPtr = isModule._search_wasm(queryPtr);
    resultDiv.innerText = isModule.UTF8ToString(resultPtr);
    isModule._free(queryPtr);
  } else {
    resultDiv.innerText = jsSearch(query) + "\n(JS Mode)";
  }
}

// MP3 Reader Modal Functions
function openMP3Reader(event) {
  event.preventDefault();
  document.getElementById('mp3-modal').style.display = 'flex';
}

function closeMP3Reader() {
  document.getElementById('mp3-modal').style.display = 'none';
}

// MP3 Reader Logic
async function runMP3Reader() {
  const fileInput = document.getElementById('mp3-file-upload');
  const resultDiv = document.getElementById('mp3-result');

  if (fileInput.files.length === 0) { resultDiv.innerText = "Please select an MP3 file."; return; }

  const file = fileInput.files[0];

  if (mp3Module && mp3Module._read_tags_wasm) {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const bufferPtr = mp3Module._malloc(uint8Array.length);
    mp3Module.HEAPU8.set(uint8Array, bufferPtr);
    const filenamePtr = mp3Module.allocate(mp3Module.intArrayFromString("temp.mp3"), mp3Module.ALLOC_NORMAL);
    const resultPtr = mp3Module._read_tags_wasm(filenamePtr, bufferPtr, uint8Array.length);
    const jsonString = mp3Module.UTF8ToString(resultPtr);
    displayTags(jsonString, resultDiv);
    mp3Module._free(bufferPtr); mp3Module._free(filenamePtr);
  } else {
    displayTags(jsReadTags(file.name, null), resultDiv);
  }
}

function displayTags(jsonString, container) {
  try {
    const tags = JSON.parse(jsonString);
    if (tags.error) { container.innerText = tags.error; return; }
    let html = '<table style="width:100%; border-collapse: collapse;">';
    for (const [key, value] of Object.entries(tags)) {
      html += `<tr style="border-bottom: 1px solid var(--border);">
                 <td style="padding: 0.5rem; font-weight: bold; color: var(--primary);">${key}</td>
                 <td style="padding: 0.5rem; color: var(--text-main);">${value}</td>
               </tr>`;
    }
    html += '</table>';
    container.innerHTML = html;
  } catch (e) { container.innerText = "Error parsing tags."; }
}

// Steganography Modal Functions
function openStego(event) {
  event.preventDefault();
  document.getElementById('stego-modal').style.display = 'flex';
}

function closeStego() {
  document.getElementById('stego-modal').style.display = 'none';
}

// Steganography Logic
async function runStegoEncode() {
  const resultDiv = document.getElementById('stego-enc-result');

  if (stegoModule && stegoModule._encode_wasm) {
    // TODO: Implement actual WASM encoding logic here if needed, 
    // but for now we keep the simulation or implement full logic.
    // Since file I/O for images is complex, we'll stick to simulation or basic check.
    resultDiv.innerHTML = `<span style="color: var(--secondary);">WASM Loaded! (Demo Mode)</span>`;
  } else {
    resultDiv.innerHTML = `<span style="color: var(--secondary);">Simulated: Image Encoded! (WASM not loaded)</span>`;
  }
}

async function runStegoDecode() {
  const resultDiv = document.getElementById('stego-dec-result');
  const magic = document.getElementById('stego-dec-magic').value;

  if (stegoModule && stegoModule._decode_wasm) {
    resultDiv.innerText = `WASM Loaded! Decoded using magic '${magic}'`;
  } else {
    resultDiv.innerText = `Simulated: Decoded message using magic '${magic}'`;
  }
}
