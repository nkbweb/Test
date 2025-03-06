// Custom cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
const links = document.querySelectorAll('a, button');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

// Cursor movement
document.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    
    // Add slight delay to follower
    setTimeout(() => {
        cursorFollower.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }, 100);
});

// Cursor effects on hover
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) scale(1.5)`;
        cursorFollower.style.width = '60px';
        cursorFollower.style.height = '60px';
        cursorFollower.style.backgroundColor = 'rgba(255, 209, 0, 0.2)';
        cursorFollower.style.border = 'none';
    });
    
    link.addEventListener('mouseleave', () => {
        cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) scale(1)`;
        cursorFollower.style.width = '40px';
        cursorFollower.style.height = '40px';
        cursorFollower.style.backgroundColor = 'transparent';
        cursorFollower.style.border = '1px solid rgba(255, 209, 0, 0.5)';
    });
});

// Hide cursor when it leaves the window
document.addEventListener('mouseout', (e) => {
    if (e.relatedTarget === null) {
        cursor.style.opacity = '0';
        cursorFollower.style.opacity = '0';
    }
});

document.addEventListener('mouseover', () => {
    cursor.style.opacity = '1';
    cursorFollower.style.opacity = '1';
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Parallax effect on floating shapes
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.shape');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    shapes.forEach((shape, index) => {
        const factor = (index + 1) * 10;
        const x = factor * (0.5 - mouseX);
        const y = factor * (0.5 - mouseY);
        
        shape.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Text scramble effect for the project title
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    
    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble">${char}</span>`;
            } else {
                output += from;
            }
        }
        
        this.el.innerHTML = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Initialize text scramble on project title
const projectTitle = document.querySelector('.project-title');
const textScramble = new TextScramble(projectTitle);

// Add scroll reveal animation
document.addEventListener('DOMContentLoaded', function() {
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const projectSection = document.querySelector('.featured-project');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideUp 0.8s forwards';
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(projectSection);
    }
    
    // Add hover effect to the project preview
    const projectImage = document.querySelector('.project-image');
    
    projectImage.addEventListener('mousemove', (e) => {
        const rect = projectImage.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) - 0.5;
        const y = ((e.clientY - rect.top) / rect.height) - 0.5;
        
        projectImage.style.transform = `scale(1.05) perspective(1000px) rotateY(${x * 10}deg) rotateX(${y * -10}deg)`;
    });
    
    projectImage.addEventListener('mouseleave', () => {
        projectImage.style.transform = 'scale(1) rotateY(0) rotateX(0)';
    });
    
    // Text scramble effect on hover
    const phrases = [
        'Immersive Experience',
        'Digital Artistry',
        'Creative Solution',
        'Visual Storytelling'
    ];
    
    let counter = 0;
    
    const nextPhrase = () => {
        textScramble.setText(phrases[counter]).then(() => {
            setTimeout(nextPhrase, 4000);
        });
        counter = (counter + 1) % phrases.length;
    };
    
    nextPhrase();
});