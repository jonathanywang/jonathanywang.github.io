// Get the name element
const nameElement = document.getElementById('name');
const contentSection = document.getElementById('content');

// Get star containers for parallax effect
const starsContainer = document.querySelector('.stars-container');
const shootingStarsContainer = document.querySelector('.shooting-stars-container');

// Parallax effect for stars
let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function animateParallax() {
    // Smooth interpolation for natural movement
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;
    
    // Apply subtle parallax to stars (slower movement)
    if (starsContainer) {
        starsContainer.style.transform = `translate(${currentX * 15}px, ${currentY * 15}px)`;
    }
    
    // Apply slightly faster parallax to shooting stars
    if (shootingStarsContainer) {
        shootingStarsContainer.style.transform = `translate(${currentX * 25}px, ${currentY * 25}px)`;
    }
    
    requestAnimationFrame(animateParallax);
}

// Start parallax animation
animateParallax();

// Force scroll to top on page load/refresh
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

// Immediately scroll to top on page load
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Lock scrolling on page load
document.body.classList.add('no-scroll');
let scrollUnlocked = false;

// Function to unlock scrolling
function unlockScroll() {
    if (!scrollUnlocked) {
        document.body.classList.remove('no-scroll');
        scrollUnlocked = true;
    }
}

// Function to create a soft ocean-like click sound
function playOceanClick() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create oscillators for a soft, layered ocean sound
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Set frequencies for a soft, water-like tone
    oscillator1.type = 'sine';
    oscillator1.frequency.setValueAtTime(220, audioContext.currentTime);
    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(330, audioContext.currentTime);
    
    // Create a soft envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    // Connect nodes
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Play sound
    oscillator1.start(audioContext.currentTime);
    oscillator2.start(audioContext.currentTime);
    oscillator1.stop(audioContext.currentTime + 0.3);
    oscillator2.stop(audioContext.currentTime + 0.3);
}

// Add click event listener to the name
nameElement.addEventListener('click', () => {
    // Unlock scrolling
    unlockScroll();
    
    // Play ocean click sound
    playOceanClick();
    
    // Wait for unlock to take effect, then scroll
    setTimeout(() => {
        contentSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }, 10);
});

// Add smooth scrolling to navbar links
document.querySelectorAll('#navbar a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // Skip external links (like resume)
        if (this.classList.contains('resume-link') || this.getAttribute('target') === '_blank') {
            return;
        }
        
        e.preventDefault();
        
        // Unlock scrolling
        unlockScroll();
        
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Change navbar color based on scroll position
const navbar = document.getElementById('navbar');
const landingSection = document.getElementById('landing');

window.addEventListener('scroll', () => {
    const landingHeight = landingSection.offsetHeight;
    
    if (window.scrollY > landingHeight - 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Add a subtle animation when hovering
nameElement.addEventListener('mouseenter', () => {
    nameElement.style.animation = 'pulse 0.5s ease';
});

nameElement.addEventListener('mouseleave', () => {
    nameElement.style.animation = '';
});

// Add CSS animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
`;
document.head.appendChild(style);

// Random shooting star appearance (5% chance per check)
const shootingStars = document.querySelectorAll('.shooting-star');
let activeShootingStar = null;

function triggerRandomShootingStar() {
    // Only trigger if no shooting star is currently active
    if (activeShootingStar) return;
    
    // 5% chance to trigger a shooting star
    if (Math.random() < 0.05) {
        // Pick a random shooting star
        const randomIndex = Math.floor(Math.random() * shootingStars.length);
        const star = shootingStars[randomIndex];
        
        activeShootingStar = star;
        star.classList.add('active');
        
        // Remove after animation completes (3 seconds)
        setTimeout(() => {
            star.classList.remove('active');
            activeShootingStar = null;
        }, 3000);
    }
}

// Check every second for a possible shooting star
setInterval(triggerRandomShootingStar, 1000);
