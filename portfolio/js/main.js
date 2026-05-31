/* ===== GOLD CURSOR TRAIL ===== */
(function() {
    const canvas = document.getElementById('cursor-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: -100, y: -100 };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3.5 + 1;
            this.speedX = (Math.random() - 0.5) * 2.5;
            this.speedY = (Math.random() - 0.5) * 2.5;
            this.life = 1;
            this.decay = Math.random() * 0.02 + 0.012;
            const h = 38 + Math.random() * 12;
            const s = 55 + Math.random() * 25;
            const l = 50 + Math.random() * 20;
            this.color = `hsl(${h}, ${s}%, ${l}%)`;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.speedY += 0.02; // slight gravity
            this.life -= this.decay;
            this.size *= 0.985;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < 3; i++) {
            particles.push(new Particle(mouse.x, mouse.y));
        }
        particles = particles.filter(p => {
            p.update();
            if (p.life > 0 && p.size > 0.2) { p.draw(); return true; }
            return false;
        });
        requestAnimationFrame(animate);
    }

    document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    if (!('ontouchstart' in window)) animate();
})();

/* ===== PRELOADER ===== */
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('preloader').classList.add('hidden'), 1200);
});

/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    document.getElementById('back-to-top').classList.toggle('visible', window.scrollY > 500);

    // Active nav link
    let current = '';
    const atBottom = (window.innerHeight + window.scrollY) >= document.body.scrollHeight - 50;
    if (atBottom) {
        current = 'contact';
    } else {
        sections.forEach(section => {
            const top = section.offsetTop - 150;
            if (window.scrollY >= top) current = section.getAttribute('id');
        });
    }
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
});

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});
navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            const offset = 70;
            window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        }
    });
});

/* ===== COUNTER ANIMATION ===== */
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-number').forEach(num => {
                const target = +num.dataset.target;
                const duration = 1500;
                const start = performance.now();
                function update(now) {
                    const progress = Math.min((now - start) / duration, 1);
                    num.textContent = Math.floor(progress * target);
                    if (progress < 1) requestAnimationFrame(update);
                    else num.textContent = target;
                }
                requestAnimationFrame(update);
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) counterObserver.observe(statsGrid);

/* ===== SCROLL REVEAL WITH STAGGER ===== */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    revealObserver.observe(el);
});

/* ===== PARALLAX ON SCROLL ===== */
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            // Hero parallax
            const hero = document.querySelector('.hero-split');
            if (hero) {
                hero.style.transform = `translateY(${scrollY * 0.2}px)`;
                hero.style.opacity = 1 - scrollY / 900;
            }
            // Project card images subtle parallax
            document.querySelectorAll('.project-card-image img, .hobby-card-image img').forEach(img => {
                const rect = img.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const offset = (rect.top - window.innerHeight / 2) * 0.05;
                    img.style.transform = `translateY(${offset}px) scale(1.05)`;
                }
            });
            ticking = false;
        });
        ticking = true;
    }
});

/* ===== CERT MODAL ===== */
const certModal = document.getElementById('cert-modal');
const certModalBody = document.getElementById('cert-modal-body');
document.querySelectorAll('.cert-card[data-cert]').forEach(card => {
    card.addEventListener('click', () => {
        const file = card.dataset.cert;
        if (file.endsWith('.pdf')) {
            certModalBody.innerHTML = `<iframe src="${file}"></iframe>`;
        } else {
            certModalBody.innerHTML = `<img src="${file}" alt="Certificate">`;
        }
        certModal.classList.add('active');
    });
});
document.getElementById('cert-modal-close').addEventListener('click', () => certModal.classList.remove('active'));
document.querySelector('.cert-modal-overlay').addEventListener('click', () => certModal.classList.remove('active'));

/* ===== FAQ ACCORDION ===== */
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
    });
});

/* ===== BACK TO TOP ===== */
document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== MUSIC TOGGLE ===== */
const music = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-toggle');
music.volume = 0.3;
musicBtn.addEventListener('click', () => {
    if (music.paused) {
        music.play();
        musicBtn.innerHTML = '<i class="fas fa-volume-high"></i>';
        musicBtn.classList.add('playing');
    } else {
        music.pause();
        musicBtn.innerHTML = '<i class="fas fa-volume-xmark"></i>';
        musicBtn.classList.remove('playing');
    }
});

/* ===== AUTO SCROLL ===== */
const scrollBtn = document.getElementById('autoscroll-toggle');
let autoScrolling = false;
let scrollRAF;

function autoScroll() {
    if (!autoScrolling) return;
    window.scrollBy(0, 1);
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
        window.scrollTo({ top: 0 });
    }
    scrollRAF = requestAnimationFrame(autoScroll);
}

scrollBtn.addEventListener('click', () => {
    autoScrolling = !autoScrolling;
    if (autoScrolling) {
        scrollBtn.innerHTML = '<i class="fas fa-pause"></i>';
        scrollBtn.classList.add('active');
        autoScroll();
    } else {
        scrollBtn.innerHTML = '<i class="fas fa-play"></i>';
        scrollBtn.classList.remove('active');
        cancelAnimationFrame(scrollRAF);
    }
});
