// Typing Effect for Hero Section
const textElement = document.getElementById('typing-text');
const texts = ["Embedded Engineer", "Firmware Developer", "IoT Enthusiast", "Linux Geek"];
let count = 0;
let index = 0;
let currentText = "";
let letter = "";

(function type() {
  if (count === texts.length) {
    count = 0;
  }
  currentText = texts[count];
  letter = currentText.slice(0, ++index);

  if (document.getElementById("typing-text")) {
    document.getElementById("typing-text").textContent = letter;
  }

  if (letter.length === currentText.length) {
    count++;
    index = 0;
    setTimeout(type, 2000);
  } else {
    setTimeout(type, 100);
  }
})();

// Add smooth reveal animation on scroll
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
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  observer.observe(card);
});


// Video Modal Logic (Robust & Netlify Safe)
function openVideo(event, url, poster = null) {
  if (event) event.preventDefault();

  const modal = document.getElementById('video-modal');
  const video = document.getElementById('video-frame');

  if (!modal || !video) return;

  // 1. Reset State (Defensive)
  video.pause();
  video.innerHTML = ''; // Clear any existing <source> tags

  // 2. Set Attributes
  if (poster) {
    video.setAttribute('poster', poster);
  } else {
    video.removeAttribute('poster');
  }

  // 3. Load Source Strictly
  video.src = url;
  video.load(); // Reset buffer

  // 4. Show Modal
  modal.classList.add('show');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // Lock scroll

  // 5. Attempt Play
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(error => {
      console.log('Autoplay prevented or load failed:', error);
    });
  }
}

function closeVideo() {
  const modal = document.getElementById('video-modal');
  const video = document.getElementById('video-frame');

  if (modal) {
    modal.classList.remove('show');
    modal.style.display = 'none';
  }

  if (video) {
    video.pause();
    video.src = ""; // Stop buffering
    video.removeAttribute('src'); // Clean up
    video.load(); // Reset to empty state
  }

  document.body.style.overflow = ''; // Restore scroll safely
}

// Centralized Keyboard Handler (Replacing inline onkeydown)
document.addEventListener('keydown', function (event) {
  if (event.key === 'Enter' || event.key === ' ') {
    const target = event.target;
    // Handle .skill-tag, .docker-container, .award-item, .btn-case-study
    if (target.classList.contains('skill-tag') ||
      target.classList.contains('docker-container') ||
      target.classList.contains('award-item') ||
      target.classList.contains('btn-case-study')) {

      event.preventDefault(); // Prevent scroll on Space
      target.click(); // Trigger the click handler
    }
  }
});

// Image Modal Logic
function openImage(src) {
  const modal = document.getElementById('image-modal');
  const img = document.getElementById('image-frame');

  if (modal && img) {
    img.src = src;
    modal.style.display = 'flex';
    // Force reflow
    void modal.offsetWidth;
    modal.classList.add('show');
  }
}

function closeImage() {
  const modal = document.getElementById('image-modal');
  if (modal) {
    modal.classList.remove('show');
    modal.style.display = 'none';
  }
}

// Copy Command Logic (Robust Fallback)
function copyDockerCommand(event, command) {
  if (event) event.stopPropagation();

  const container = event.target.closest('.docker-container') || event.currentTarget;

  let feedback = container.querySelector('.copy-feedback');
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.className = 'copy-feedback';
    feedback.innerText = 'Copied!';
    container.appendChild(feedback);
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(command).then(() => {
      showFeedback(feedback);
    }).catch(err => {
      console.error('Clipboard API failed', err);
      fallbackCopyTextToClipboard(command, feedback);
    });
  } else {
    fallbackCopyTextToClipboard(command, feedback);
  }
}

function fallbackCopyTextToClipboard(text, feedbackElement) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.top = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showFeedback(feedbackElement);
    } else {
      console.error('Fallback: Copy command failed');
    }
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

function showFeedback(el) {
  el.classList.add('show');
  setTimeout(() => {
    el.classList.remove('show');
  }, 2000);
}

// Case Study Data (Universal Technical Deep-Dive)
const caseStudies = {
  ironing: {
    title: "Smart Ironing Automation",
    sections: {
      problem: "Traditional ironing setups lack fail-safes, leading to fire hazards and energy waste if left unattended.",
      constraints: "Must operate with <200ms latency for presence detection. Zero-tolerance for false negatives (safety critical). Low-power idle state required.",
      design: "Architected a control loop using ESP32 & PIR sensors. Implemented a non-blocking state machine to handle sensor debounce and relay switching concurrently. Isolated High-Voltage AC from Low-Voltage DC logic using optocouplers.",
      challenges: "PIR sensor noise caused false triggers. Solved by implementing a software-based moving average filter and hardware capacitors.",
      outcome: "Achieved 100% reliable shut-off in testing. Reduced idle power consumption by 40%.",
      nextSteps: "Implement PID control for precise temperature regulation and integrate MQTT for remote status monitoring."
    }
  },
  inverted: {
    title: "Inverted Search Engine",
    sections: {
      problem: "Sequential file searching is O(N*M), which is non-viable for large datasets.",
      constraints: "System must run within strict memory bounds (embedded context). Fast lookup (O(1) average) required.",
      design: "Implemented an Inverted Index using Hash Tables with Separate Chaining for collision resolution. specific design choice: Linked Lists for dynamic bucket growth to handle non-uniform data distribution.",
      challenges: "Memory Leaks: Detected 15KB leak/run using Valgrind. Fixed by implementing recursive free() for all node chains. Segmentation Faults: Audit revealed improper NULL handling in boundary cases.",
      outcome: "Reduced search time complexity to O(1) (average). Verified memory safety with zero leaks under high load.",
      nextSteps: "Optimize storage using Tries (Prefix Trees) to reduce redundancy in storing common prefixes."
    }
  },
  apc: {
    title: "Arbitrary Precision Calculator",
    sections: {
      problem: "Standard data types (long long) are limited to 64-bits, insufficient for cryptography or astronomical calculations.",
      constraints: "Must support basic arithmetic (+, -, *, /) on numbers of theoretical infinite length (limited only by RAM).",
      design: "Utilized Doubly Linked Lists where each node stores a 4-digit segment (base-10000) for easy printing. Implemented 'grade-school' algorithms adjusted for list traversal.",
      challenges: "Complex carry/borrow propagation across dynamic nodes during subtraction and division. Solved by implementing a rigorous normalize() helper function.",
      outcome: "Successfully computed factorials of 100+ digits. Eliminated memory leaks via strict node deallocation tracking.",
      nextSteps: "Implement Karatsuba algorithm for faster multiplication of large numbers."
    }
  },
  mp3: {
    title: "MP3 Tag Reader",
    sections: {
      problem: "MP3 metadata (ID3v2) is binary encoded and often padded, making standard text reads impossible.",
      constraints: "Must parse binary files without corruption. strict adherence to ID3v2.3 specification frame structure.",
      design: "Used raw file pointers (`fseek`, `fread`) for byte-level traversal. Implemented a byte-swapping utility to convert Big-Endian (ID3 standard) to Little-Endian (Intel Architecture).",
      challenges: "Handling variable-length padding and unsynchronized tags. Reverse-engineered the header structure to calculate precise frame offsets.",
      outcome: "Created a robust CLI tool that accurately extracts Title, Artist, and Album art from binary blobs.",
      nextSteps: "Add support for writing/editing tags (ID3v2.4) and handling Unicode text encoding."
    }
  },
  stego: {
    title: "LSB Image Steganography",
    sections: {
      problem: "Securely transmitting data through public channels without arousing suspicion involved in cryptography.",
      constraints: "Must be lossless (BMP format). Changes to the image must be invisible to the naked eye.",
      design: "Implemented Least Significant Bit (LSB) manipulation. The 8th bit of every RGB byte is replaced with message bits. Added a 'Magic String' (#*) delimiter for decoding.",
      challenges: "Corrupting the BMP Header meant unreadable files. Solved by explicitly skipping the first 54 bytes (Standard Header) before injecting data.",
      outcome: "Achieved secure message payloads up to (ImageSize/8) bytes with zero visual artifacts.",
      nextSteps: "Implement bit randomization (PRNG) to prevent linear cryptanalysis detection."
    }
  }
};

// Tech Case Study Data (Deep Dive)
const techCaseStudies = {
  "c_cpp": {
    title: "C / C++",
    what: "The foundational language of embedded systems, offering direct mapping to machine instructions and zero-overhead abstractions.",
    usage: "Used for writing bare-metal firmware drivers, high-performance computing loops, and standard template library (STL) implementations in constrained environments.",
    challenges: "Managing manual memory allocation (malloc/free) to prevent leaks and navigating undefined undefined behavior in pointer arithmetic.",
    takeaways: "Mastered the importance of RAII (Resource Acquisition Is Initialization) in C++ and strict static analysis in C to ensure memory safety."
  },
  "embedded_c": {
    title: "Embedded C",
    what: "An extension of C standardized for embedded systems, focusing on fixed-point arithmetic, named address spaces, and hardware I/O addressing.",
    usage: "Implemented Board Support Packages (BSPs), Interrupt Service Routines (ISRs), and startup code `crt0.s` for ARM Cortex-M microcontrollers.",
    challenges: "Handling race conditions in shared global variables between main loop and ISRs. Ensuring atomic access to memory-mapped registers.",
    takeaways: "Deep understanding of the `volatile` keyword, memory barriers, and the critical importance of keeping ISRs short and deterministic."
  },
  "rtos": {
    title: "RTOS (FreeRTOS)",
    what: "Real-Time Operating System kernel responsible for task scheduling, inter-process communication, and resource management.",
    usage: "Designed multi-threaded firmware architectures using Task Notifications, Queues for message passing, and Binary Semaphores for hardware synchronization.",
    challenges: "Diagnosing stack overflows and debugging Priority Inversion scenarios where high-priority tasks were starved by lower ones.",
    takeaways: "Learned to design systems deterministically, calculating worst-case execution time (WCET) and appropriately sizing thread stacks."
  },
  "esp32": {
    title: "ESP32 Ecosystem",
    what: "A feature-rich MCU with dual-core Xtensa LX6 processors, integrated Wi-Fi/BT, and extensive peripheral interfaces.",
    usage: "Deployed IoT sensor nodes using ESP-IDF. Optimized power consumption using User Low Power (ULP) coprocessor during Deep Sleep modes.",
    challenges: "Managing dual-core concurrency issues and ensuring thread safety when accessing shared peripherals like WiFi middleware.",
    takeaways: "Gained expertise in event-driven programming and optimizing OTA (Over-The-Air) update partitions for reliable remote firmware deployment."
  },
  "linux": {
    title: "Linux System Programming",
    what: "Development within the Linux kernel and user-space, managing device drivers, system calls, and file operations.",
    usage: " wrote shell scripts for system automation, configured Device Trees (DTS) for custom hardware, and developed multi-process user-space applications.",
    challenges: "Debugging kernel panics caused by faulty loadable kernel modules (LKMs) and understanding the complex boot process.",
    takeaways: "Solidified knowledge of the User/Kernel space boundary, file descriptors, and the 'Everything is a File' philosophy of Unix systems."
  },
  "comms": {
    title: "UART / SPI / I2C",
    what: "Synchronous and Asynchronous serial communication protocols essential for inter-chip data exchange.",
    usage: "Interfaced accelerometers (SPI), EEPROMs (I2C), and GSM modules (UART). Implemented software-based bit-banging for non-standard protocols.",
    challenges: "Debugging signal integrity issues like bus capacitance on I2C lines and clock polarity mistmatches on SPI.",
    takeaways: "Proficiency in using Logic Analyzers to decode protocol frames and verify timing requirements against datasheets."
  },
  "pcb": {
    title: "PCB Debugging",
    what: "The physical verification layer of embedded engineering, ensuring hardware matches design intent.",
    usage: "Performed board bring-up, continuity testing, and signal verification using Oscilloscopes and Digital Multimeters.",
    challenges: "Identifying cold solder joints and troubleshooting power rail noise coupling into sensitive analog ADC lines.",
    takeaways: "Hardware issues often manifest as intermittent software bugs. Always verify power stability and clock quality first."
  },
  "git": {
    title: "Git & Version Control",
    what: "Distributed version control system for tracking changes and coordinating work among programmers.",
    usage: "Utilized Feature Branch workflows, interactive rebasing for clean commit history, and Git hooks for pre-commit linting.",
    challenges: "Resolving complex merge conflicts in auto-generated code files and managing submodule dependencies across projects.",
    takeaways: "A clean, atomic commit history is as important as the code itself for long-term maintainability and debugging (git bisect)."
  },
  "dsa": {
    title: "Data Structures & Algos",
    what: "The toolkit for organizing data efficiently to optimize performance and storage.",
    usage: "Implemented Circular Buffers for UART streams, Hash Tables for O(1) lookups, and Custom Allocators for deterministic memory usage.",
    challenges: "Adapting standard algorithms to run within Kilobytes of RAM without dynamic allocation overhead.",
    takeaways: "Choosing the right data structure (e.g., Ring Buffer vs Linked List) is the single biggest factor in system performance and reliability."
  }
};

const techDefinitions = {
  "c_cpp": "The foundation of embedded systems. Use it for low-level memory management, pointer arithmetic, and writing efficient firmware that interacts directly with hardware registers.",
  "embedded_c": "Specialized C for microcontrollers. Involves bitwise operations, interrupt service routines (ISRs), and optimizing code for constrained memory (RAM/ROM) environments.",
  "rtos": "Real-Time Operating Systems (FreeRTOS). Essential for multitasking on single-core MCUs, managing thread priorities, semaphores, and inter-task communication deterministically.",
  "esp32": "Dual-core tensilica Xtensa LX6 microprocessor. Usage: Wi-Fi/BLE connectivity, Deep Sleep power management, and heavy I/O handling (SPI, I2C, I2S).",
  "linux": "Embedded Linux development. Experience with shell scripting, kernel modules, device tree configuration, and user-space application development.",
  "comms": "Serial Communication Protocols. reliable data transmission between MCUs and peripherals (Sensors, EEPROMs, Displays) using precise timing and signal analysis.",
  "pcb": "Hardware debugging. Reading schematics, using logic analyzers/oscilloscopes to verify signal integrity, and soldering SMT components.",
  "git": "Version Control. Managing codebases, branching strategies for features/fixes, and collaborative workflows using GitHub/GitLab.",
  "dsa": "Core algorithmic problem solving. Optimizing time/space complexity for resource-constrained systems (e.g., custom buffers, circular queues)."
};

let lastFocusedElement = null;



// Helper for strict section rendering
function renderSection(label, text, colorClass) {
  if (!text) return '';
  return `
    <div class="case-section">
      <div class="case-label ${colorClass}">${label}</div>
      <p>${text}</p>
    </div>
  `;
}

function openCaseStudy(event, id) {
  if (event) event.preventDefault();

  // Save current focus
  lastFocusedElement = document.activeElement;

  const trigger = event.currentTarget || event.target;
  const modal = document.getElementById('case-modal');
  const titleEl = document.getElementById('case-modal-title');
  const bodyEl = document.getElementById('case-modal-body');
  const dialog = modal.querySelector('.case-modal__dialog');

  const data = caseStudies[id];

  // Lock Body Scroll
  document.body.style.overflow = 'hidden';

  if (modal && titleEl && bodyEl && data) {
    const s = data.sections; // Short alias

    titleEl.textContent = data.title;
    bodyEl.innerHTML = `
      <div class="case-study-body">
        ${renderSection('Problem', s.problem, 'text-red-400')}
        ${renderSection('Constraints', s.constraints, 'text-orange-400')}
        ${renderSection('Design Decisions', s.design, 'text-blue-400')}
        ${renderSection('Key Challenges', s.challenges, 'text-yellow-400')}
        ${renderSection('Outcome', s.outcome, 'text-green-400')}
        ${renderSection('What I\'d Improve Next', s.nextSteps, 'text-purple-400')}
      </div>
    `;

    // Instant Open (No Animation, No Highlight)
    modal.style.display = 'flex';
    modal.classList.add('show');

    // Focus management
    dialog.focus();
    dialog.scrollTop = 0;
  }
}

function closeCaseStudy() {
  const modal = document.getElementById('case-modal');
  if (modal) {
    modal.classList.remove('show');
    modal.style.display = 'none';

    // Restore Body Scroll
    document.body.style.overflow = '';

    // Restore Focus
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }
}

let lastTechFocusedElement = null;

function openTechCase(event, id) {
  if (event) event.preventDefault();
  lastTechFocusedElement = document.activeElement;

  // 1. Identify Trigger & Modal
  const trigger = event.currentTarget || event.target;
  const modal = document.getElementById('tech-case-modal');
  const titleEl = document.getElementById('tech-case-title');
  const bodyEl = document.getElementById('tech-case-body');

  const data = techCaseStudies[id];

  if (modal && titleEl && bodyEl && data) {
    // 2. Populate Content
    titleEl.textContent = data.title;
    bodyEl.innerHTML = `
      <div class="case-study-body">
        ${renderSection('What it is', data.what, 'text-blue-400')}
        ${renderSection('How I used it', data.usage, 'text-green-400')}
        ${renderSection('Key Challenges', data.challenges, 'text-yellow-400')}
        ${renderSection('Engineering Takeaways', data.takeaways, 'text-purple-400')}
      </div>
    `;

    document.body.style.overflow = 'hidden';

    // 3. Instant Open (No Animation)
    modal.style.display = 'flex';
    modal.classList.add('show');

    // 4. Focus
    const dialog = modal.querySelector('.case-modal__dialog');
    dialog.focus();
    dialog.scrollTop = 0;
  }
}

function closeTechCase() {
  const modal = document.getElementById('tech-case-modal');
  if (modal) {
    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Unlock scroll

    if (lastTechFocusedElement) {
      lastTechFocusedElement.focus();
    }
  }
}

function openTechInfo(event, key) {
  if (event) event.preventDefault();

  const techList = document.getElementById('tech-list');
  const techDetail = document.getElementById('tech-detail');
  const titleEl = document.getElementById('tech-title');
  const descEl = document.getElementById('tech-desc');
  const usesEl = document.getElementById('tech-use-cases');

  const data = techDefinitions[key];

  if (techList && techDetail && data) {
    // Map keys to readable titles
    const titles = {
      "c_cpp": "C / C++",
      "embedded_c": "Embedded C",
      "rtos": "RTOS",
      "esp32": "ESP32",
      "linux": "Linux System",
      "comms": "UART / SPI / I2C",
      "pcb": "PCB Debugging",
      "git": "Git & Version Control",
      "dsa": "Data Structures"
    };

    titleEl.textContent = titles[key] || "Tech Stack";
    descEl.textContent = data.desc;

    // Clear and populate uses
    usesEl.innerHTML = '';
    data.uses.forEach(use => {
      const li = document.createElement('li');
      li.textContent = use;
      usesEl.appendChild(li);
    });

    // Animate Switch
    techList.style.display = 'none';
    techDetail.style.display = 'flex';
    techDetail.classList.add('fade-in');
  }
}

function closeTechInfo() {
  const techList = document.getElementById('tech-list');
  const techDetail = document.getElementById('tech-detail');

  if (techList && techDetail) {
    techDetail.style.display = 'none';
    techList.style.display = 'flex'; // Restore original flex layout
    techDetail.classList.remove('fade-in');
  }
}


// Focus Trap Logic
document.addEventListener('keydown', function (e) {
  const modal = document.getElementById('case-modal');
  if (!modal || modal.style.display === 'none') return;

  if (e.key === 'Tab') {
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  }
});

// Wire up close button listeners
document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('case-modal-close');
  const overlay = document.getElementById('case-modal-overlay');
  if (closeBtn) closeBtn.addEventListener('click', closeCaseStudy);
  if (overlay) overlay.addEventListener('click', closeCaseStudy);
  const techCloseBtn = document.getElementById('tech-case-close');
  const techOverlay = document.getElementById('tech-case-overlay');

  if (techCloseBtn) techCloseBtn.addEventListener('click', closeTechCase);
  if (techOverlay) techOverlay.addEventListener('click', closeTechCase);
});

// Generic Escape key to close any active modal
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    const videoModal = document.getElementById('video-modal');
    const imageModal = document.getElementById('image-modal');
    const caseModal = document.getElementById('case-modal');
    const techModal = document.getElementById('tech-case-modal');

    // Simple check for visibility
    if (videoModal && videoModal.style.display !== 'none') closeVideo();
    if (imageModal && imageModal.style.display !== 'none') closeImage();
    if (caseModal && caseModal.style.display !== 'none') closeCaseStudy();
    if (techModal && techModal.style.display !== 'none') closeTechCase();
  }
});
