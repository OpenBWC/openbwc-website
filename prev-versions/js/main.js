/* assets/js/main.js */

document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- 2. Theme Toggle Logic ---
    const themeToggle = document.getElementById('checkbox');
    
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark');
            if (themeToggle) themeToggle.checked = true;
        } else {
            document.body.classList.remove('dark');
            if (themeToggle) themeToggle.checked = false;
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                localStorage.setItem('theme', 'dark');
                applyTheme('dark');
            } else {
                localStorage.setItem('theme', 'light');
                applyTheme('light');
            }
        });
    }

    // Apply saved theme on initial load
    const savedTheme = localStorage.getItem('theme') || 'light'; 
    applyTheme(savedTheme);


    // --- 3. Typing Animation (Index Page Only) ---
    // We check if the element exists to avoid errors on other pages
    const typedElement = document.getElementById('typed-headline');
    
    if (typedElement && typeof Typed !== 'undefined') {
        const typed = new Typed('#typed-headline', {
            strings: [
                'Open Source Insights for <span style="color: var(--accent-color);">Intelligent Policing</span>'
            ],
            typeSpeed: 80,
            startDelay: 500,
            loop: false,
            showCursor: true,
            cursorChar: '|',
            contentType: 'html',
            onComplete: (self) => {
                if (self.cursor) {
                    self.cursor.style.display = 'none';
                }
            },
        });
    }
});