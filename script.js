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
  modal.style.display = 'flex'; // Ensure it's visible (overriding inline display: none from close)
  void modal.offsetWidth;
  modal.classList.add('show');

  video.src = url;

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
