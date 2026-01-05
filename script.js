// 1. SETUP LENIS SMOOTH SCROLL (Optimized for Mobile Touch)
const lenis = new Lenis({ 
    duration: 1.2, 
    smooth: true,
    smoothTouch: true, // IMPORTANT: Enables smooth "gliding" on touch devices
    touchMultiplier: 2, // Makes scrolling feel faster and more responsive on phone
});

function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// 2. PRELOADER & TEXT SCRAMBLE
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const loaderBar = document.querySelector('.bar-fill');
const loaderCounter = document.querySelector('.counter');
let progress = 0;

const loadInt = setInterval(() => {
    progress += Math.random() * 10;
    if(progress > 100) progress = 100;
    
    loaderCounter.innerText = `${Math.floor(progress)}%`;

    if(progress === 100) {
        clearInterval(loadInt);
        document.body.classList.add('loaded');
        
        // Trigger hero animations after loader finishes
        animateHero();
    }
}, 100);

// Hero Reveal Animation
function animateHero() {
    gsap.from(".hero-content > *", {
        y: 100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power4.out",
        delay: 0.5
    });
}

// Scramble Text Effect on Hover
document.querySelectorAll('.scramble-text').forEach(el => {
    el.addEventListener('mouseenter', () => {
        const originalText = el.innerText;
        let iterations = 0;
        const interval = setInterval(() => {
            el.innerText = el.innerText.split("").map((letter, index) => {
                if(index < iterations) return originalText[index];
                return chars[Math.floor(Math.random() * 36)];
            }).join("");
            
            if(iterations >= originalText.length) clearInterval(interval);
            iterations += 1 / 3;
        }, 30);
    });
});

// 3. CURSOR & MAGNETIC BUTTONS (Desktop Only)
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener('mousemove', e => {
        gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.1 });
        gsap.to(cursorRing, { x: e.clientX, y: e.clientY, duration: 0.3 });
    });

    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const strength = btn.getAttribute('data-strength') || 50;
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, { x: x * (strength / 100), y: y * (strength / 100), duration: 0.3 });
            document.body.classList.add('hovered');
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
            document.body.classList.remove('hovered');
        });
    });

    // Floating Image Reveal (Services)
    const serviceRows = document.querySelectorAll('.service-row');
    const floatContainer = document.querySelector('.service-img-float');
    const floatImg = document.querySelector('.img-inner');

    serviceRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            const imgUrl = row.getAttribute('data-img');
            floatImg.style.backgroundImage = `url(${imgUrl})`;
            gsap.to(floatContainer, { opacity: 1, scale: 1, duration: 0.3 });
        });
        
        row.addEventListener('mouseleave', () => {
            gsap.to(floatContainer, { opacity: 0, scale: 0.8, duration: 0.3 });
        });
        
        row.addEventListener('mousemove', e => {
            gsap.to(floatContainer, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    });
}

// 4. RESPONSIVE HORIZONTAL SCROLL (Protocol Section)
let mm = gsap.matchMedia();

mm.add("(min-width: 769px)", () => {
    const sections = gsap.utils.toArray(".p-panel");
    
    gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
            trigger: ".protocol",
            pin: true,
            scrub: 1,
            snap: 1 / (sections.length - 1),
            end: "+=3000", 
        }
    });
});

// 5. METRICS COUNTER ANIMATION
const counters = document.querySelectorAll('.counter-anim');
counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    
    // Create a proxy object to animate
    let obj = { value: 0 };
    
    gsap.to(obj, {
        value: target,
        duration: 2.5,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".metrics",
            start: "top 80%", // Start animation when metrics section hits 80% of viewport
            once: true // Run only once
        },
        onUpdate: () => {
            counter.innerText = Math.floor(obj.value);
        }
    });
});

// 6. FAQ ACCORDION LOGIC (One open at a time)
const detailsElements = document.querySelectorAll("details");

detailsElements.forEach((detail) => {
    detail.addEventListener("click", () => {
        detailsElements.forEach((otherDetail) => {
            if (otherDetail !== detail) {
                otherDetail.removeAttribute("open");
            }
        });
    });
});

// 7. MENU TOGGLE
const menuTrig = document.querySelector('.menu-trigger');
const fsMenu = document.querySelector('.fs-menu');
let menuOpen = false;

menuTrig.addEventListener('click', () => {
    menuOpen = !menuOpen;
    if(menuOpen) {
        fsMenu.classList.add('active');
        document.querySelector('.scramble-text').innerText = "CLOSE";
    } else {
        fsMenu.classList.remove('active');
        document.querySelector('.scramble-text').innerText = "MENU";
    }
});

document.querySelectorAll('.fs-link').forEach(link => {
    link.addEventListener('click', () => {
        menuOpen = false;
        fsMenu.classList.remove('active');
        document.querySelector('.scramble-text').innerText = "MENU";
    });

});
