// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // ==========================================
    // 0. THEME TOGGLER (LIGHT/DARK)
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Check saved theme
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-theme');
    }
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            
            // Save state
            if (document.body.classList.contains('light-theme')) {
                localStorage.setItem('theme', 'light');
            } else {
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // ==========================================
    // 1. CUSTOM SPATIAL CURSOR WITH PHYSICS
    // ==========================================
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('custom-cursor-dot');

    let mouseX = 0, mouseY = 0; // Target position
    let cursorX = 0, cursorY = 0; // Current lagged position
    const speed = 0.15; // Interpolation factor (lower = more lag)

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Inner dot follows mouse instantly
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    // Physics loop for lagged outer glass bubble
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * speed;
        cursorY += dy * speed;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover states for interactive elements
    const interactives = document.querySelectorAll('a, button, .nav-item, .social-icon, .concept-tag, input, textarea, .filter-btn, .btn-more-info');
    
    interactives.forEach(element => {
        element.addEventListener('mouseenter', () => {
            document.body.classList.add('hovered-interactive');
        });
        element.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovered-interactive');
        });
    });

    // ==========================================
    // 2. RADIAL GLOW TRACKING FOR GLASS CARDS
    // ==========================================
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

    // ==========================================
    // 3. TYPEWRITER SUBTITLE EFFECT
    // ==========================================
    const words = [
        "Full Stack Developer",
        "Backend Specialist",
        "Data Science Undergraduate",
        "AI/ML Enthusiast"
    ];
    let i = 0; // word index
    let timer;
    
    function typingEffect() {
        const word = words[i].split("");
        const loopTyping = () => {
            if (word.length > 0) {
                document.getElementById('typing-text').innerHTML += word.shift();
            } else {
                timer = setTimeout(deletingEffect, 2000);
                return false;
            }
            timer = setTimeout(loopTyping, 100);
        };
        loopTyping();
    }

    function deletingEffect() {
        const word = words[i].split("");
        const loopDeleting = () => {
            if (word.length > 0) {
                word.pop();
                document.getElementById('typing-text').innerHTML = word.join("");
            } else {
                if (words.length > (i + 1)) {
                    i++;
                } else {
                    i = 0;
                }
                timer = setTimeout(typingEffect, 500);
                return false;
            }
            timer = setTimeout(loopDeleting, 60);
        };
        loopDeleting();
    }
    
    // Start typing cycle
    typingEffect();

    // ==========================================
    // 4. 3D CARD TILT EFFECT (SPATIAL FLOATING)
    // ==========================================
    const tiltCards = document.querySelectorAll('[data-tilt]');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x coordinate within client
            const y = e.clientY - rect.top;  // y coordinate within client
            
            // Calculate tilt based on center point
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Max tilt angle (degrees)
            const maxTilt = 8;
            const rotateX = ((centerY - y) / centerY) * maxTilt;
            const rotateY = ((x - centerX) / centerX) * maxTilt;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
        });
    });

    // ==========================================
    // 5. PROJECT FILTER LOGIC
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state class
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    // Trigger fade in animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    // Delay display:none to let transition finish
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ==========================================
    // 6. SCROLL SPY FOR FLOATING NAV DOCK
    // ==========================================
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section fills mid-screen
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Custom smooth scroll click overrides to adjust for offsets
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href');
            const targetSec = document.querySelector(targetId);
            
            if (targetSec) {
                window.scrollTo({
                    top: targetSec.offsetTop - 40,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// ==========================================
// 7. INTERACTIVE PROJECT DETAILS MODAL
// ==========================================
const projectDetails = {
    spectrashield: {
        title: "SpectraShield",
        subtitle: "Deepfake Audio Detection System",
        year: "2026",
        gradient: "shield-gradient",
        icon: "shield-check",
        github: "https://github.com/vemchinna",
        stats: [
            { label: "ML Accuracy", value: "92%" },
            { label: "REST Latency", value: "<200ms" },
            { label: "Sample Pipeline", value: "10,000" },
            { label: "Optimization", value: "GridSearchCV" }
        ],
        techs: ["Python", "Flask", "XGBoost", "Librosa", "Scikit-learn", "REST API", "GridSearchCV"],
        description: [
            "Engineered a high-performance machine learning classification pipeline to identify synthesized, cloned, or manipulated deepfake audio footprints.",
            "Utilized Librosa to extract Mel-Spectrogram features and MFCC structures representing underlying voice characteristics.",
            "Achieved a 92% classification accuracy rate trained on a custom dataset of 10,000 distinct samples.",
            "Boosted classification F1-score performance from 0.78 to 0.91 leveraging iterative parameter runs with GridSearchCV.",
            "Deployed the model as a production-grade JWT-authenticated Flask API demonstrating average response latencies under 200ms."
        ]
    },
    fuelshot: {
        title: "FuelShot",
        subtitle: "Emergency Fuel Delivery Platform",
        year: "2025",
        gradient: "fuel-gradient",
        icon: "fuel",
        github: "https://github.com/vemchinna",
        stats: [
            { label: "MySQL Tables", value: "8 Tables" },
            { label: "API Speed", value: "<300ms" },
            { label: "Architecture", value: "Full Stack" },
            { label: "Role Portals", value: "Role-Based" }
        ],
        techs: ["Python (Flask)", "MySQL", "REST APIs", "HTML5", "CSS3", "JavaScript", "RBAC"],
        description: [
            "Conceived and implemented a full-stack on-demand fuel delivery marketplace matching emergency petrol/diesel delivery requests with dispatchers.",
            "Designed and normalized a robust MySQL schema structure consisting of 8 connected table architectures with strict foreign key constraints.",
            "Programmed fully responsive HTML5 & CSS3 client portals, courier mapping terminals, and system administrator dashboards.",
            "Exposed secure Flask RESTful backend endpoints with average response times clocking in below 300ms.",
            "Developed strict role-based dashboard redirection states mapping user sessions cleanly to authorized database interactions."
        ]
    },
    financialinsights: {
        title: "Financial Insights",
        subtitle: "Financial Literacy & Analysis Platform",
        year: "2025",
        gradient: "finance-gradient",
        icon: "trending-up",
        github: "https://github.com/vemchinna",
        stats: [
            { label: "Pipeline Size", value: "50,000+ Rows" },
            { label: "KPI Load Time", value: "-60% Time" },
            { label: "Interactive Viz", value: "Chart.js" },
            { label: "Query Optimize", value: "SQL Tuning" }
        ],
        techs: ["Python", "Pandas", "NumPy", "MySQL", "SQL", "HTML5/CSS3", "JavaScript", "Chart.js"],
        description: [
            "Built a web-based educational dashboard designed to simplify compound computations including EMI metrics, loan comparison, insurance models, and gold loans.",
            "Coded automated data processing pipelines with Pandas & NumPy cleaning and transforming structural dataset files of 50,000+ transaction rows.",
            "Optimized heavy-join MySQL reporting queries, cutting execution overhead and report compile times by 60%.",
            "Created responsive visualization cards utilizing Chart.js to map interactive financial trends with real-time slider controls."
        ]
    },
    traffic: {
        title: "AI Traffic Management System",
        subtitle: "Computer Vision Intelligent Grid",
        year: "2025",
        gradient: "traffic-gradient",
        icon: "car",
        github: "#",
        stats: [
            { label: "Detection Accuracy", value: "88%" },
            { label: "Inference Speed", value: "25 FPS" },
            { label: "Sim Congestion", value: "-45%" },
            { label: "Core Model", value: "YOLOv8" }
        ],
        techs: ["Python", "YOLOv8", "OpenCV", "NumPy", "Computer Vision"],
        description: [
            "Designed and simulated a computer vision system analyzing video feeds to adjust physical traffic control lights dynamically.",
            "Trained a customized YOLOv8 object detection model, achieving an 88% overall accuracy metric in locating vehicles in multi-lane layouts.",
            "Optimized frame-grabbing loops using OpenCV to run real-time inference checks smoothly at 25 frames per second.",
            "Formulated an adaptive scheduling algorithm that processes queue density inputs to reduce congestion delays by 45% in simulated test layouts."
        ]
    }
};

function openProjectModal(key) {
    const data = projectDetails[key];
    if (!data) return;

    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');

    // Build stats HTML
    let statsHTML = '';
    data.stats.forEach(st => {
        statsHTML += `
            <div class="metric-box">
                <span class="metric-num">${st.value}</span>
                <span class="metric-lbl">${st.label}</span>
            </div>
        `;
    });

    // Build description bullets HTML
    let bulletsHTML = '';
    data.description.forEach(bullet => {
        bulletsHTML += `<li>${bullet}</li>`;
    });

    // Build tech badges HTML
    let techHTML = '';
    data.techs.forEach(t => {
        techHTML += `<span>${t}</span>`;
    });

    // Build link button HTML
    const linkHTML = data.github !== '#' 
        ? `<a href="${data.github}" target="_blank" class="btn btn-secondary glass-btn"><i data-lucide="github"></i> View GitHub Repository</a>`
        : `<button class="btn btn-secondary glass-btn" disabled><i data-lucide="lock"></i> Repository Private</button>`;

    // Populate body
    modalBody.innerHTML = `
        <div class="modal-header-gradient ${data.gradient}">
            <i data-lucide="${data.icon}" style="width: 50px; height: 50px;"></i>
        </div>
        <div class="modal-title-sec">
            <h3>${data.title}</h3>
            <span class="modal-subtitle">${data.subtitle} (${data.year})</span>
        </div>
        
        <div class="modal-stats-row">
            ${statsHTML}
        </div>

        <div class="modal-details-grid">
            <div>
                <h4>Project Scope & Implementation</h4>
                <ul class="modal-desc-list">
                    ${bulletsHTML}
                </ul>
            </div>
            <div>
                <div class="modal-sidebar-card">
                    <h5>Technologies Utilized</h5>
                    <div class="modal-tech-list">
                        ${techHTML}
                    </div>
                </div>
                <div style="margin-top: 25px;">
                    ${linkHTML}
                </div>
            </div>
        </div>
    `;

    // Re-initialize Lucide inside modal
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Add cursor hover trackers for new buttons in modal
    const modalInteractives = modalBody.querySelectorAll('a, button');
    modalInteractives.forEach(element => {
        element.addEventListener('mouseenter', () => {
            document.body.classList.add('hovered-interactive');
        });
        element.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovered-interactive');
        });
    });

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Unlock scroll
}

// Esc key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
});

// ==========================================
// 8. CONTACT FORM SUBMISSION
// ==========================================
function handleFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Simulate sending message with spatial alert
    const formCard = document.querySelector('.contact-form-card');
    const originalContent = formCard.innerHTML;
    
    // Animate sending state
    formCard.innerHTML = `
        <div class="glass-card" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; text-align: center; border: none; background: transparent; box-shadow: none;">
            <i data-lucide="loader-2" class="animate-spin" style="width: 48px; height: 48px; color: var(--neon-blue); margin-bottom: 20px;"></i>
            <h3>Securing Data Channel...</h3>
            <p style="color: var(--text-muted);">Encrypting and dispatching message packets.</p>
        </div>
    `;
    
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Add keyframe for spin to styling inline
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .animate-spin {
            animation: spin 1.5s linear infinite;
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        formCard.innerHTML = `
            <div class="glass-card" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; text-align: center; border: none; background: transparent; box-shadow: none; animation: scaleUp 0.4s ease-out;">
                <i data-lucide="check-circle" style="width: 48px; height: 48px; color: #38ef7d; margin-bottom: 20px; filter: drop-shadow(0 0 8px #38ef7d);"></i>
                <h3 style="color: #38ef7d;">Transmission Successful</h3>
                <p style="color: var(--text-secondary); margin-bottom: 25px;">Thank you, ${name}! Your message regarding "${subject}" has been successfully dispatched to Vemula Sathvik.</p>
                <button onclick="resetContactForm()" class="btn btn-secondary glass-btn">Send Another Message</button>
            </div>
        `;
        
        if (window.lucide) {
            window.lucide.createIcons();
        }

        // Store original form layout to restore it later
        window.savedFormHTML = originalContent;
    }, 1800);
}

function resetContactForm() {
    const formCard = document.querySelector('.contact-form-card');
    if (window.savedFormHTML) {
        formCard.innerHTML = window.savedFormHTML;
        if (window.lucide) {
            window.lucide.createIcons();
        }
        
        // Re-bind cursor events for form controls
        const formInteractives = formCard.querySelectorAll('input, textarea, button');
        formInteractives.forEach(element => {
            element.addEventListener('mouseenter', () => {
                document.body.classList.add('hovered-interactive');
            });
            element.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovered-interactive');
            });
        });
    }
}
