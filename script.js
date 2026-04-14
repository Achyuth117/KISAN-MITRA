// script.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            if (navLinks.classList.contains('nav-active')) {
                hamburger.innerHTML = '<i class="fa-solid fa-xmark"></i>';
                // Append actions to mobile menu
                if(navActions && !document.querySelector('.mobile-actions-added')) {
                    const clonedActions = navActions.cloneNode(true);
                    clonedActions.classList.add('mobile-actions-added');
                    clonedActions.style.display = 'flex';
                    clonedActions.style.flexDirection = 'column';
                    clonedActions.style.width = '100%';
                    clonedActions.style.gap = '1rem';
                    navLinks.appendChild(clonedActions);
                }
            } else {
                hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
        });
    }

    // 2. Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // offset for sticky nav
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Intersection Observer for Scroll Animations (fade-up)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-up');
    animatedElements.forEach(el => observer.observe(el));
    
    // Add fade-up to common elements dynamically if not explicitly added
    const autoAnimate = document.querySelectorAll('.card, .flow-step, .stat-card, .section-title');
    autoAnimate.forEach(el => {
        if(!el.classList.contains('fade-up')) {
            el.classList.add('fade-up');
            observer.observe(el);
        }
    });

    // 4. API & Auth Logic
    checkNavAuth();
});

// Global API Helper
const API_URL = "/api";

function setAuth(user) {
    localStorage.setItem('km_user', JSON.stringify(user));
}

function getAuth() {
    const data = localStorage.getItem('km_user');
    return data ? JSON.parse(data) : null;
}

function logout() {
    localStorage.removeItem('km_user');
    window.location.href = 'index.html';
}

function checkNavAuth() {
    const user = getAuth();
    if(user) {
        const navActions = document.querySelector('.nav-actions');
        if(navActions) {
            navActions.innerHTML = `
                <span style="font-weight: 600; color: var(--primary-dark); margin-right: 0.5rem;">Hi, ${user.name}</span>
                <a href="${user.role === 'admin' ? 'admin-dashboard.html' : 'buyer-dashboard.html'}" class="btn btn-outline" style="padding: 0.4rem 1rem; font-size: 0.875rem;">Dashboard</a>
                <button onclick="logout()" class="btn btn-primary" style="padding: 0.4rem 1rem; font-size: 0.875rem; border: none;">Logout</button>
            `;
        }
    }
}
