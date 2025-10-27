// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = `
        <button class="theme-btn active" data-theme="dark">
            <i class="fas fa-moon"></i>
        </button>
        <button class="theme-btn" data-theme="light">
            <i class="fas fa-sun"></i>
        </button>
    `;
    document.body.appendChild(themeToggle);

    const themeBtns = document.querySelectorAll('.theme-btn');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Set initial theme
    document.body.classList.toggle('light-theme', currentTheme === 'light');
    themeBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === currentTheme);
    });

    // Theme toggle event listeners
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            document.body.classList.toggle('light-theme', theme === 'light');
            
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            localStorage.setItem('theme', theme);
        });
    });
}

// Mobile Navigation Toggle
function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Set active navigation link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === 'index.html' && linkHref === '#')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Booking form handling
function initBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const bookingData = Object.fromEntries(formData);
            
            // Show success message
            showNotification('Thank you for your booking! We will contact you soon to confirm your appointment.', 'success');
            this.reset();
        });
    }
}

// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const contactData = Object.fromEntries(formData);
            
            // Show success message
            showNotification('Thank you for your message! We will get back to you soon.', 'success');
            this.reset();
        });
    }
}

// Service price calculator
function initPriceCalculator() {
    const serviceSelect = document.getElementById('service');
    const priceDisplay = document.getElementById('priceDisplay');
    
    if (serviceSelect && priceDisplay) {
        const prices = {
            'exterior-wash': 45,
            'interior-detailing': 75,
            'premium-polish': 120,
            'full-detail': 200,
            'ceramic-coating': 350
        };
        
        serviceSelect.addEventListener('change', function() {
            const price = prices[this.value] || 0;
            priceDisplay.textContent = `$${price}`;
            priceDisplay.classList.add('pulse');
            setTimeout(() => priceDisplay.classList.remove('pulse'), 600);
        });
        
        // Set initial price
        const initialPrice = prices[serviceSelect.value] || 0;
        priceDisplay.textContent = `$${initialPrice}`;
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles for notification
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--bg-card);
                border: 1px solid var(--border);
                border-left: 4px solid var(--primary);
                border-radius: 8px;
                padding: 15px 20px;
                box-shadow: var(--shadow);
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                max-width: 300px;
            }
            .notification.success {
                border-left-color: var(--primary);
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
                color: var(--text-light);
            }
            .notification-content i {
                color: var(--primary);
            }
            .notification.show {
                transform: translateX(0);
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initMobileNavigation();
    initSmoothScrolling();
    setActiveNavLink();
    initScrollAnimations();
    initBookingForm();
    initContactForm();
    initPriceCalculator();
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
// Vehicle Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('vehicleForm');
    const output = document.getElementById('vehicleOutput');
    
    // Set minimum date to today for date inputs
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.min = today;
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const make = document.getElementById('make').value;
        const model = document.getElementById('model').value;
        const year = document.getElementById('year').value;
        const color = document.getElementById('color').value;
        const license = document.getElementById('license').value;
        const vin = document.getElementById('vin').value;
        const notes = document.getElementById('notes').value;
        
        // Validate required fields
        if (!make || !model) {
            alert('Please fill in all required fields (marked with *)');
            return;
        }
        
        // Display the submitted information
        output.innerHTML = `
            <h2>Vehicle Information Saved Successfully!</h2>
            <div class="vehicle-details">
                <div class="detail-item"><strong>Make:</strong> ${make}</div>
                <div class="detail-item"><strong>Model:</strong> ${model}</div>
                <div class="detail-item"><strong>Year:</strong> ${year}</div>
                <div class="detail-item"><strong>Color:</strong> ${color || 'Not specified'}</div>
                <div class="detail-item"><strong>License Plate:</strong> ${license || 'Not provided'}</div>
                <div class="detail-item"><strong>VIN:</strong> ${vin || 'Not provided'}</div>
            </div>
            ${notes ? `<div class="detail-item" style="grid-column: 1 / -1; margin-top: 15px;"><strong>Notes:</strong> ${notes}</div>` : ''}
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee;">
                <p>Your vehicle information has been saved. You can now proceed to <a href="booking.html" style="color: #3498db;">book a service</a>.</p>
            </div>
        `;
        output.style.display = 'block';
        
        // Scroll to output
        output.scrollIntoView({ behavior: 'smooth' });
        
        // Reset form
        form.reset();
        document.getElementById('year').value = '2020';
    });
    
    // Add some sample vehicle data for demonstration
    const sampleVehicles = [
        { make: 'Toyota', model: 'Camry', year: '2020' },
        { make: 'Honda', model: 'Civic', year: '2019' },
        { make: 'Ford', model: 'F-150', year: '2021' }
    ];
    
    // Populate form with sample data on double-click of the form title (for demo purposes)
    const formTitle = document.querySelector('.vehicle-form-card h2');
    formTitle.addEventListener('dblclick', function() {
        const randomVehicle = sampleVehicles[Math.floor(Math.random() * sampleVehicles.length)];
        document.getElementById('make').value = randomVehicle.make;
        document.getElementById('model').value = randomVehicle.model;
        document.getElementById('year').value = randomVehicle.year;
        document.getElementById('color').value = ['Red', 'Blue', 'Black', 'White', 'Silver'][Math.floor(Math.random() * 5)];
    });
});
// JavaScript for interactive functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    // Add click event listeners to buttons
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent;
            
            if (buttonText === 'Get Started') {
                // Handle Fleet Package signup
                alert('Thank you for your interest in our Fleet Package! You will be redirected to the signup page.');
                // In a real application, you would redirect to a signup page
                // window.location.href = '/signup/fleet';
            } else if (buttonText === 'Get Quote') {
                // Handle Custom Pricing request
                alert('We will contact you shortly to discuss custom pricing options for your needs.');
                // In a real application, you might open a contact form
            }
        });
    });
    
    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe pricing cards for animation
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});