document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileNav = document.querySelector('#mobile-menu');
    const menuIcon = mobileMenuButton?.querySelector('i');

    function toggleMobileMenu(event) {
        if (event) {
            event.stopPropagation();
        }
        
        const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
        mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        
        if (!isExpanded) {
            mobileNav.classList.remove('hidden');
            mobileNav.classList.add('block');
            mobileNav.classList.remove('translate-y-1', 'opacity-0');
            mobileNav.classList.add('translate-y-0', 'opacity-100');
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-times');
            document.body.style.overflow = 'hidden';
        } else {
            mobileNav.classList.add('translate-y-1', 'opacity-0');
            mobileNav.classList.remove('translate-y-0', 'opacity-100');
            setTimeout(() => {
                mobileNav.classList.add('hidden');
                mobileNav.classList.remove('block');
            }, 300);
            menuIcon.classList.add('fa-bars');
            menuIcon.classList.remove('fa-times');
            document.body.style.overflow = '';
        }
    }

    if (mobileMenuButton && mobileNav && menuIcon) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);

        document.addEventListener('click', (e) => {
            if (!mobileNav.contains(e.target) && !mobileMenuButton.contains(e.target) && 
                mobileMenuButton.getAttribute('aria-expanded') === 'true') {
                toggleMobileMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenuButton.getAttribute('aria-expanded') === 'true') {
                toggleMobileMenu();
            }
        });
    }

    // Hero Slider
    const slides = document.querySelectorAll('.hero-slide');
    const prevButton = document.getElementById('prevSlide');
    const nextButton = document.getElementById('nextSlide');
    const dots = document.querySelectorAll('.absolute.bottom-8 button');
    let currentSlide = 0;
    let slideInterval;
    let isTransitioning = false;

    function showSlide(index, direction = null) {
        if (isTransitioning) return;
        isTransitioning = true;

        const currentSlideElement = slides[currentSlide];
        const nextSlideElement = slides[index];

        // Reset classes
        slides.forEach(slide => {
            slide.style.transition = 'none';
            slide.classList.remove('active');
            slide.style.transform = 'translateX(0)';
            slide.style.opacity = '0';
        });

        // Set initial positions
        currentSlideElement.style.opacity = '1';
        nextSlideElement.style.opacity = '1';
        
        if (direction === 'next' || (direction === null && index > currentSlide)) {
            nextSlideElement.style.transform = 'translateX(100%)';
        } else {
            nextSlideElement.style.transform = 'translateX(-100%)';
        }

        // Force reflow
        nextSlideElement.offsetHeight;

        // Add transitions
        currentSlideElement.style.transition = 'all 0.5s ease-in-out';
        nextSlideElement.style.transition = 'all 0.5s ease-in-out';

        // Animate slides
        if (direction === 'next' || (direction === null && index > currentSlide)) {
            currentSlideElement.style.transform = 'translateX(-100%)';
        } else {
            currentSlideElement.style.transform = 'translateX(100%)';
        }
        nextSlideElement.style.transform = 'translateX(0)';

        // Update active state
        nextSlideElement.classList.add('active');
        
        // Update dots
        dots.forEach(dot => {
            dot.classList.remove('bg-opacity-100');
            dot.classList.add('bg-opacity-50');
        });
        dots[index].classList.remove('bg-opacity-50');
        dots[index].classList.add('bg-opacity-100');

        // Update current slide index
        currentSlide = index;

        // Reset transition flag
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex, 'next');
    }

    function prevSlide() {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex, 'prev');
    }

    function startSlideShow() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
        slideInterval = setInterval(nextSlide, 5000);
    }

    // Add click handlers
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            prevSlide();
            startSlideShow(); // Reset interval after manual navigation
        });
        
        nextButton.addEventListener('click', () => {
            nextSlide();
            startSlideShow(); // Reset interval after manual navigation
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (index !== currentSlide) {
                showSlide(index, index > currentSlide ? 'next' : 'prev');
                startSlideShow(); // Reset interval after manual navigation
            }
        });
    });

    // Start the slideshow
    if (slides.length > 0) {
        showSlide(0);
        startSlideShow();
    }

    // Add keyboard navigation for accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            startSlideShow();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            startSlideShow();
        }
    });

    // Add touch support for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;
    
    const slider = document.querySelector('.relative');
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const difference = touchStartX - touchEndX;
        
        if (Math.abs(difference) > swipeThreshold) {
            if (difference > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            startSlideShow();
        }
    }

    // Cart Functionality
    const quantityButtons = document.querySelectorAll('.w-8.h-8.border.rounded-full');
    quantityButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const quantitySpan = e.target.parentElement.querySelector('span');
            let quantity = parseInt(quantitySpan.textContent);
            
            if (e.target.textContent === '+') {
                quantity++;
            } else if (e.target.textContent === '-' && quantity > 1) {
                quantity--;
            }
            
            quantitySpan.textContent = quantity;
            updateCartTotal();
        });
    });

    function updateCartTotal() {
        const quantities = document.querySelectorAll('.flex.items-center.space-x-2 span');
        const prices = document.querySelectorAll('.font-bold:not(.text-xl):not(.mb-4)');
        let subtotal = 0;

        quantities.forEach((qty, index) => {
            const quantity = parseInt(qty.textContent);
            const price = parseInt(prices[index].textContent.replace(/[^0-9]/g, ''));
            subtotal += quantity * price;
        });

        const tax = Math.round(subtotal * 0.1);
        const total = subtotal + tax;

        // Update display
        document.querySelector('.mb-2:nth-child(1) span:last-child').textContent = 
            `Rp. ${subtotal.toLocaleString()}`;
        document.querySelector('.mb-4 span:last-child').textContent = 
            `Rp. ${tax.toLocaleString()}`;
        document.querySelector('.font-bold.text-lg.border-t.pt-4.mb-6 span:last-child').textContent = 
            `Rp. ${total.toLocaleString()}`;
    }
});
