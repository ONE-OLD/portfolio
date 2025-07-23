// Portfolio JavaScript - All website interactions and animations

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initBackgroundMusic();
    initSmoothScrolling();
    initSkillBars();
    initContactForm();
    initMobileMenu();
    initScrollAnimations();
    initParallaxEffects();
});

// Background Music Functionality
function initBackgroundMusic() {
    const audio = document.getElementById('backgroundMusic');
    
    if (audio) {
        // Set volume to 50%
        audio.volume = 0.5;
        
        // Try to play audio
        const playAudio = async () => {
            try {
                await audio.play();
                console.log('Background music started');
            } catch (error) {
                console.log('Audio autoplay prevented by browser');
            }
        };

        // Attempt autoplay on page load
        playAudio();

        // Try to play on first user interaction
        const handleUserInteraction = () => {
            playAudio();
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
            document.removeEventListener('touchstart', handleUserInteraction);
        };

        document.addEventListener('click', handleUserInteraction);
        document.addEventListener('keydown', handleUserInteraction);
        document.addEventListener('touchstart', handleUserInteraction);
    }
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Skill Bars Animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            const width = bar.dataset.width;
            if (width) {
                // Add a delay for staggered animation
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, Math.random() * 500);
            }
        });
    };

    // Use Intersection Observer to trigger animation when skills section is visible
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        observer.observe(skillsSection);
    }
}

// Contact Form Functionality
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Validate form
            if (!name || !email || !message) {
                showToast('Error', 'Please fill in all fields.');
                return;
            }
            
            
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            try {
                // Send email using EmailJS
                const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        service_id: 'service_t24rax8',
                        template_id: 'template_zt2ptrb',
                        user_id: 'H29aues5IzHpsK6Hs', // Replace with your EmailJS public key
                        template_params: {
                            from_name: name,
                            from_email: email,
                            message: message,
                            to_email: 'kwizerarsn@gmail.com'
                        }
                    })
                });

                if (response.ok) {
                    showToast('Message Sent!', 'Thank you for your message. I\'ll get back to you soon!');
                    form.reset();
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                console.error('Error sending email:', error);
                showToast('Error', 'Failed to send message. Please try again.');
            } finally {
                // Restore button state
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
            
            // Add submit animation
            if (submitButton) {
                submitButton.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    submitButton.style.transform = 'scale(1)';
                }, 150);
            }
        });
        
        // Add real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                // Remove error styling on input
                this.style.borderColor = '';
            });
        });
    }
}

// Field Validation
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
        }
    }
    
    // Visual feedback
    if (!isValid) {
        field.style.borderColor = 'hsl(0, 62.8%, 50%)';
    } else {
        field.style.borderColor = 'hsl(263, 70%, 50%)';
    }
    
    return isValid;
}

// Toast Notification System
function showToast(title, message) {
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toast && toastTitle && toastMessage) {
        toastTitle.textContent = title;
        toastMessage.textContent = message;
        
        toast.classList.remove('hidden');
        
        // Trigger show animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            hideToast();
        }, 5000);
    }
}

function hideToast() {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 300);
    }
}

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', function() {
            // Toggle mobile menu
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            
            // Animate hamburger menu
            const spans = mobileMenu.querySelectorAll('span');
            spans.forEach((span, index) => {
                span.style.transform = navLinks.style.display === 'flex' 
                    ? `rotate(${index === 1 ? 0 : index === 0 ? 45 : -45}deg)`
                    : 'rotate(0deg)';
            });
        });
        
        // Close mobile menu when clicking on a link
        const mobileNavLinks = navLinks.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.style.display = 'none';
                const spans = mobileMenu.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'rotate(0deg)';
                });
            });
        });
    }
}

// Scroll Animations
function initScrollAnimations() {
    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.glow-card, .project-card, .skill-item');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initialize elements
    const elements = document.querySelectorAll('.glow-card, .project-card, .skill-item');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // Add scroll listener
    window.addEventListener('scroll', animateOnScroll);
    
    // Initial check
    animateOnScroll();
}

// Parallax Effects
function initParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating');
        
        parallaxElements.forEach(element => {
            const speed = 0.1;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Navbar Background on Scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(13, 13, 18, 0.95)';
        } else {
            navbar.style.background = 'rgba(13, 13, 18, 0.8)';
        }
    }
});

// Project Card Hover Effects
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const image = card.querySelector('.project-image img');
        const overlay = card.querySelector('.project-overlay');
        
        card.addEventListener('mouseenter', function() {
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
            if (overlay) {
                overlay.style.opacity = '1';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (image) {
                image.style.transform = 'scale(1)';
            }
            if (overlay) {
                overlay.style.opacity = '0';
            }
        });
    });
});

// Typing Effect for Hero Title (Optional Enhancement)
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title .gradient-text');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing effect after a delay
        setTimeout(typeWriter, 1000);
    }
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll-heavy functions
const debouncedScrollHandler = debounce(() => {
    // Any scroll-heavy operations can go here
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScrollHandler);

// Keyboard Navigation Support
document.addEventListener('keydown', function(e) {
    // Add keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'h':
                e.preventDefault();
                document.querySelector('#home').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'p':
                e.preventDefault();
                document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'c':
                e.preventDefault();
                document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
                break;
        }
    }
});

// Loading Animation
window.addEventListener('load', function() {
    // Add any loading completion animations here
    document.body.style.opacity = '1';
    
    // Trigger initial animations
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Initialize hero animations
document.addEventListener('DOMContentLoaded', function() {
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
});

// Console Easter Egg
console.log(`
🎵 Portfolio Website
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Built with HTML, CSS & JavaScript
Features: Animations, Background Music, Contact Form
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Keyboard Shortcuts:
• Ctrl/Cmd + H: Go to Home
• Ctrl/Cmd + P: Go to Projects  
• Ctrl/Cmd + C: Go to Contact
`);

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Portfolio Error:', e.error);
});

// Service Worker Registration (Optional for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment to register service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}