document.addEventListener('DOMContentLoaded', () => {
    // --- Preloader Typewriter ---
    const preloader = document.getElementById('preloader');
    const typewriterText = document.querySelector('.typewriter-text');
    const typewriterCursor = document.querySelector('.typewriter-cursor');
    const percentageEl = document.querySelector('.loader-percentage');
    const progressBar = document.querySelector('.loader-progress-bar');
    const nameToType = "Ahmed M. ElDardery";
    
    let heroGSAPTriggered = false;

    if (preloader && typewriterText) {
        const startPreloader = () => {
            const totalDuration = 2200; // 2.2 seconds for a premium feel
            const intervalTime = 20;
            const totalSteps = totalDuration / intervalTime;
            let currentStep = 0;

            const preloaderInterval = setInterval(() => {
                currentStep++;
                let progress = (currentStep / totalSteps);
                
                // Add easing to progress (easeOutExpo)
                let easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                
                let currentPercent = Math.min(Math.floor(easedProgress * 100), 100);
                
                if (percentageEl) {
                    percentageEl.textContent = currentPercent.toString().padStart(2, '0') + "%";
                }
                if (progressBar) {
                    progressBar.style.width = currentPercent + "%";
                }
                
                // Typing effect mapping
                let charsToShow = Math.floor(easedProgress * nameToType.length);
                typewriterText.textContent = nameToType.substring(0, charsToShow);

                if (currentStep >= totalSteps) {
                    clearInterval(preloaderInterval);
                    typewriterText.textContent = nameToType;
                    
                    setTimeout(() => {
                        if (typewriterCursor) typewriterCursor.style.opacity = '0';
                        
                        const tl = gsap.timeline();
                        
                        tl.to('.loader-content', {
                            y: -30,
                            opacity: 0,
                            duration: 0.6,
                            ease: "power2.inOut"
                        });
                        
                        tl.to(preloader, {
                            yPercent: -100,
                            duration: 1.2,
                            ease: "expo.inOut",
                            onComplete: () => {
                                if(!heroGSAPTriggered) {
                                    window.dispatchEvent(new Event('startHeroAnimation'));
                                    heroGSAPTriggered = true;
                                }
                            }
                        }, "-=0.3");
                        
                    }, 500); // Pause at 100%
                }
            }, intervalTime);
        };

        if (document.readyState === 'complete') {
            startPreloader();
        } else {
            window.addEventListener('load', startPreloader);
        }
    } else {
        const startImmediate = () => {
            setTimeout(() => {
                window.dispatchEvent(new Event('startHeroAnimation'));
            }, 500);
        };
        
        if (document.readyState === 'complete') {
            startImmediate();
        } else {
            window.addEventListener('load', startImmediate);
        }
    }

    // --- Sound Effects ---
    const generatePopSoundBase64 = () => {
        const sampleRate = 44100;
        const duration = 0.05;
        const numSamples = Math.floor(sampleRate * duration);
        const buffer = new ArrayBuffer(44 + numSamples * 2);
        const view = new DataView(buffer);
        
        const writeString = (offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };
        
        writeString(0, 'RIFF');
        view.setUint32(4, 36 + numSamples * 2, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(36, 'data');
        view.setUint32(40, numSamples * 2, true);
        
        let offset = 44;
        for (let i = 0; i < numSamples; i++) {
            const t = i / sampleRate;
            const envelope = Math.exp(-t * 100);
            const freq = 800 - (600 * (i / numSamples));
            const val = Math.floor(envelope * Math.sin(2 * Math.PI * freq * t) * 32767);
            view.setInt16(offset, val, true);
            offset += 2;
        }
        
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return 'data:audio/wav;base64,' + btoa(binary);
    };

    const clickSoundBase64 = generatePopSoundBase64();
    const playClickSound = () => {
        const audio = new Audio(clickSoundBase64);
        audio.volume = 0.3;
        audio.play().catch(() => {});
    };

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
        }, { duration: 100, fill: "forwards" });
    });

    // Add hover effect to links and buttons
    const hoverables = document.querySelectorAll('a, button');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('hovering');
            // Reset magnetic transform if any
            gsap.to(el, { duration: 0.3, x: 0, y: 0, ease: "power2.out" });
        });
        
        // Magnetic effect for primary buttons (Removed based on user request)
    });

    // --- Dynamic Glass Card Glow ---
    const glassCards = document.querySelectorAll('.glass-card');
    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // --- GSAP Animations ---
    gsap.registerPlugin(ScrollTrigger);

    // Hero Section Entrance
    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    window.addEventListener('startHeroAnimation', () => {
        heroTimeline
            .fromTo('.greeting', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })
            .fromTo('.glitch-text', 
                { y: 50, opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }, 
                { y: 0, opacity: 1, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: 0.6 }, "-=0.3"
            )
            .fromTo('.role', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.4")
            .fromTo('.bio-short', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3")
            .fromTo('.hero-actions', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3")
            .fromTo('.social-links a', 
                { y: 20, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 }, 
                "-=0.3"
            )
            .fromTo('.hero-image', 
                { scale: 0.8, opacity: 0, rotation: -5 }, 
                { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: "back.out(1.5)" }, 
                0
            )
            .fromTo('.floating-badge', 
                { scale: 0, opacity: 0 }, 
                { scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, ease: "back.out(2)" }, 
                "-=0.4"
            );
            
        // Hero Image Parallax on Scroll
        gsap.to('.hero-image', {
            y: 100,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero-section",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // Section Scroll Animations and Staggered Timeline Items have been removed based on user request.

    // --- Language Toggle ---
    const langToggleBtn = document.getElementById('lang-toggle');
    let currentLang = 'en';

    langToggleBtn.addEventListener('click', () => {
        playClickSound();
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
        playClickSound();
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

    // --- Navbar Scroll Effect & Mobile Menu ---
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinksContainer) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            playClickSound();
        });

        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                playClickSound();
            });
        }

        // Close mobile menu when a link is clicked
        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
            });
        });
    }

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

    // --- Animated Timeline ---
    const experienceTimeline = document.getElementById('experience-timeline');
    const timelineProgress = document.getElementById('timeline-progress');

    if (experienceTimeline && timelineProgress) {
        window.addEventListener('scroll', () => {
            const timelineRect = experienceTimeline.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (timelineRect.top < windowHeight && timelineRect.bottom > 0) {
                const scrollableDistance = timelineRect.height;
                const scrolledDistance = (windowHeight / 2) - timelineRect.top;
                
                let progress = (scrolledDistance / scrollableDistance) * 100;
                if (progress < 0) progress = 0;
                if (progress > 100) progress = 100;
                
                timelineProgress.style.height = `${progress}%`;
            }
        });
    }

    // --- Intersection Observer for Fade-in Animations (Disabled in favor of GSAP) ---
    // The previous fade-in logic is replaced by GSAP ScrollTrigger above.

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

        let typeSpeed = isDeleting ? 30 : 50;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 1000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textArrayIndex++;
            if (textArrayIndex >= currentTextArray.length) {
                textArrayIndex = 0;
            }
            typeSpeed = 300; // Pause before typing next word
        }

        typeTimeout = setTimeout(type, typeSpeed);
    }
    
    if (typedTextSpan) {
        setTimeout(type, 500);
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
                
                // Simulate Formspree/EmailJS submission
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

    // --- Animate Skill Bars (Removed based on user request) ---
    // Skill bars will be statically filled based on their inline width.
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

    // --- Terminal Easter Egg ---
    const terminalOverlay = document.getElementById('terminal-overlay');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const closeTerminalBtn = document.getElementById('close-terminal');
    const terminalBody = document.getElementById('terminal-body');

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === '`') {
            e.preventDefault();
            if(terminalOverlay) {
                terminalOverlay.classList.toggle('active');
                if (terminalOverlay.classList.contains('active') && terminalInput) {
                    terminalInput.focus();
                }
            }
        }
    });

    if (closeTerminalBtn && terminalOverlay) {
        closeTerminalBtn.addEventListener('click', () => {
            terminalOverlay.classList.remove('active');
        });
    }

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = terminalInput.value.trim().toLowerCase();
                if (command) {
                    processCommand(command);
                }
                terminalInput.value = '';
            }
        });
    }

    function processCommand(cmd) {
        let response = '';
        switch (cmd) {
            case 'help':
                response = 'Available commands: whoami, skills, clear, exit, contact';
                break;
            case 'whoami':
                response = 'Ahmed M. ElDardery - Senior Software Engineer & Mobile Developer';
                break;
            case 'skills':
                response = 'Flutter, React Native, Node.js, Firebase, AWS, JS, Python';
                break;
            case 'contact':
                response = 'Email: your-email@example.com | LinkedIn: /in/your-profile';
                break;
            case 'clear':
                terminalOutput.innerHTML = '';
                return;
            case 'exit':
                terminalOverlay.classList.remove('active');
                return;
            default:
                response = `Command not found: ${cmd}. Type 'help' for available commands.`;
        }

        const cmdLine = document.createElement('p');
        cmdLine.innerHTML = `<span style="color:#fff;">guest@ahmed-cv:~$</span> ${cmd}`;
        
        const resLine = document.createElement('p');
        resLine.textContent = response;

        terminalOutput.appendChild(cmdLine);
        terminalOutput.appendChild(resLine);
        terminalBody.scrollTop = terminalBody.scrollHeight;
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
    const githubUsername = 'ahmedeldardery'; // Updated to an assumed real username

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

    // --- 3D Skills Cloud ---
    if (typeof TagCloud !== 'undefined') {
        const cloudContainer = '#skills-cloud';
        const texts = [
            'Flutter', 'Dart', 'React Native',
            'JavaScript', 'Swift', 'Kotlin',
            'Node.js', 'Firebase', 'Supabase',
            'Figma', 'Git', 'Redux', 'AWS'
        ];
        
        const skillsCloudContainer = document.querySelector('.skills-cloud');
        if(skillsCloudContainer) {
            skillsCloudContainer.innerHTML = '';
            const radius = window.innerWidth < 768 ? 110 : 140;
            TagCloud(cloudContainer, texts, {
                radius: radius,
                maxSpeed: 'normal',
                initSpeed: 'slow',
                direction: 135,
                keep: true
            });
        }
    }

    // --- 3D Tilt Effect ---
    // VanillaTilt functionality has been removed as requested.

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

    // Mouse interaction for particles
    let mouse = {
        x: null,
        y: null,
        radius: 150
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });
    
    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function connectParticles() {
        for (let a = 0; a < particlesArray.length; a++) {
            // Mouse Repel Effect
            if (mouse.x != null && mouse.y != null) {
                let dx = particlesArray[a].x - mouse.x;
                let dy = particlesArray[a].y - mouse.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    particlesArray[a].x += forceDirectionX * force * 3;
                    particlesArray[a].y += forceDirectionY * force * 3;
                }
            }

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
