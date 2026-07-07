document.addEventListener('DOMContentLoaded', () => {
    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Animate the outline slightly slower
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Add hover effect to links and buttons
    const hoverables = document.querySelectorAll('a, button');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('hovering');
        });
    });

    // --- Language Toggle ---
    const langToggleBtn = document.getElementById('lang-toggle');
    let currentLang = 'en';

    langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ar' : 'en';
        
        // Change HTML dir and lang
        document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = currentLang;

        // Change button text
        langToggleBtn.innerText = currentLang === 'en' ? 'عربي' : 'English';

        // Update Typing Effect strings
        currentTextArray = currentLang === 'ar' ? textArrayAr : textArray;
        clearTimeout(typeTimeout);
        isDeleting = false;
        charIndex = 0;
        textArrayIndex = 0;
        if(document.querySelector('.typed-text')) document.querySelector('.typed-text').textContent = '';
        setTimeout(type, 500);

        // Translate all elements with data-en and data-ar
        const translatableElements = document.querySelectorAll('[data-en][data-ar]');
        translatableElements.forEach(el => {
            el.innerHTML = el.getAttribute(`data-${currentLang}`);
        });
    });

    // --- Theme Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Scroll Progress Bar ---
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progressHeight = (window.scrollY / totalHeight) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = `${progressHeight}%`;
        }
    });

    // --- Intersection Observer for Fade-in Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach(el => observer.observe(el));

    // --- Typing Effect ---
    const typedTextSpan = document.querySelector('.typed-text');
    
    let textArray = ['Mobile Application Developer', 'UI/UX Enthusiast', 'Software Engineer'];
    let textArrayAr = ['مطور تطبيقات هواتف', 'مهتم بتجربة المستخدم', 'مهندس برمجيات'];
    
    let currentTextArray = currentLang === 'ar' ? textArrayAr : textArray;
    let textArrayIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeTimeout;

    function type() {
        if (!typedTextSpan) return;
        
        const currentText = currentTextArray[textArrayIndex];
        
        if (isDeleting) {
            typedTextSpan.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextSpan.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textArrayIndex++;
            if (textArrayIndex >= currentTextArray.length) {
                textArrayIndex = 0;
            }
            typeSpeed = 500; // Pause before typing next word
        }

        typeTimeout = setTimeout(type, typeSpeed);
    }
    
    if (typedTextSpan) {
        setTimeout(type, 1000);
    }

    // --- Contact Modal ---
    const contactModal = document.getElementById('contact-modal');
    const openModalBtns = document.querySelectorAll('.open-contact-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const contactForm = document.getElementById('contact-form');

    if(contactModal) {
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                contactModal.classList.add('active');
            });
        });

        closeModalBtn.addEventListener('click', () => {
            contactModal.classList.remove('active');
        });

        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                contactModal.classList.remove('active');
            }
        });

        if(contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = contactForm.querySelector('button');
                const originalText = btn.innerHTML;
                const lang = document.documentElement.lang;
                btn.innerHTML = lang === 'ar' ? 'جاري الإرسال...' : 'Sending...';
                
                setTimeout(() => {
                    btn.innerHTML = lang === 'ar' ? 'تم الإرسال بنجاح!' : 'Sent Successfully!';
                    btn.style.background = '#3ddc84';
                    setTimeout(() => {
                        contactModal.classList.remove('active');
                        contactForm.reset();
                        btn.innerHTML = originalText;
                        btn.style.background = '';
                    }, 2000);
                }, 1500);
            });
        }
    }

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Animate Skill Bars ---
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.skill-progress');
                progressBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                });
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        skillObserver.observe(skillsSection);
    }

    // --- Lightbox Gallery ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTargets = document.querySelectorAll('.lightbox-target');
    const closeLightboxBtn = document.querySelector('.close-lightbox');

    if(lightbox) {
        lightboxTargets.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
            });
        });

        closeLightboxBtn.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });
    }

    // --- Testimonials Carousel ---
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track ? track.children : []);
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');

    if(track && slides.length > 0) {
        let currentIndex = 0;
        
        const updateSlidePosition = () => {
            const direction = document.documentElement.dir === 'rtl' ? 1 : -1;
            track.style.transform = `translateX(${currentIndex * 100 * direction}%)`;
        };

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlidePosition();
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlidePosition();
        });
        
        langToggleBtn.addEventListener('click', () => {
            setTimeout(updateSlidePosition, 50);
        });
    }

    // --- GitHub Integration ---
    const githubReposContainer = document.getElementById('github-repos');
    const githubUsername = 'github'; // User can change this later

    if(githubReposContainer) {
        fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=3`)
            .then(response => response.json())
            .then(data => {
                githubReposContainer.innerHTML = '';
                if(data.length === 0) {
                    githubReposContainer.innerHTML = '<p class="text-center">No repositories found.</p>';
                    return;
                }
                data.forEach(repo => {
                    const repoCard = document.createElement('a');
                    repoCard.href = repo.html_url;
                    repoCard.target = '_blank';
                    repoCard.className = 'repo-card glass-card';
                    repoCard.innerHTML = `
                        <h3><i class="fab fa-github"></i> ${repo.name}</h3>
                        <p>${repo.description || 'No description available.'}</p>
                        <div class="repo-stats">
                            ${repo.language ? `<span><i class="fas fa-circle" style="color: var(--accent-primary); font-size: 0.6rem;"></i> ${repo.language}</span>` : ''}
                            <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                            <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                        </div>
                    `;
                    githubReposContainer.appendChild(repoCard);
                });
            })
            .catch(error => {
                githubReposContainer.innerHTML = '<p class="text-center" style="color: #ef4444;">Failed to load repositories.</p>';
                console.error('Error fetching GitHub repos:', error);
            });
    }

    // --- Particle Canvas Background ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    const numberOfParticles = window.innerWidth < 768 ? 40 : 100;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function connectParticles() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                if (distance < (canvas.width/7) * (canvas.height/7)) {
                    let opacityValue = 1 - (distance/20000);
                    ctx.strokeStyle = `rgba(168, 85, 247, ${opacityValue})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        connectParticles();
    }

    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });
});
