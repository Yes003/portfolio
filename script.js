document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    /* ==========================================================================
       MOBILE NAVIGATION TOGGLE
       ========================================================================== */
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const toggleMenu = () => {
        mobileToggle.classList.toggle('open');
        mobileNav.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
    };

    mobileToggle.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNav.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    /* ==========================================================================
       NAVBAR SCROLL STATE & ACTIVE LINK MONITORING
       ========================================================================== */
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Toggle navbar scrolled style
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link tracking
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       SKILL PROGRESS BARS ANIMATION (ON INTERSECTION)
       ========================================================================== */
    const skillsSection = document.querySelector('.skills-section');
    
    if (skillsSection) {
        const skillsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillsSection.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        skillsObserver.observe(skillsSection);
    }

    /* ==========================================================================
       PROJECTS FILTERING
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Add fade-out transition
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95) translateY(5px)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'flex';
                        // Trigger fade-in
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    /* ==========================================================================
       CERTIFICATIONS SEARCH & FILTER
       ========================================================================== */
    const certTabs = document.querySelectorAll('.cert-tab-btn');
    const certSearch = document.getElementById('cert-search');
    const certCards = document.querySelectorAll('.cert-card');
    const certContainer = document.getElementById('certifications-container');

    // Create a "No Results" message placeholder
    const noResultsMsg = document.createElement('div');
    noResultsMsg.className = 'glass-card no-results-card';
    noResultsMsg.style.gridColumn = '1 / -1';
    noResultsMsg.style.textAlign = 'center';
    noResultsMsg.style.padding = '40px';
    noResultsMsg.style.display = 'none';
    noResultsMsg.innerHTML = `
        <i data-lucide="search-slash" style="width: 48px; height: 48px; color: var(--color-primary); margin: 0 auto 16px;"></i>
        <h4 style="font-family: var(--font-heading); margin-bottom: 8px;">No Certifications Found</h4>
        <p style="color: var(--color-text-muted); font-size: 0.85rem;">Try tweaking your search term or filtering categories.</p>
    `;
    certContainer.appendChild(noResultsMsg);
    lucide.createIcons({node: noResultsMsg});

    let activeTab = 'all';
    let searchQuery = '';

    const filterCertifications = () => {
        let visibleCount = 0;

        certCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const tags = card.getAttribute('data-tags') || '';
            const title = card.querySelector('h4').textContent.toLowerCase();
            const provider = card.querySelector('.cert-provider').textContent.toLowerCase();
            const content = card.querySelector('p').textContent.toLowerCase();
            
            const matchesTab = (activeTab === 'all' || category === activeTab);
            const matchesSearch = title.includes(searchQuery) || 
                                  provider.includes(searchQuery) || 
                                  content.includes(searchQuery) ||
                                  tags.includes(searchQuery);

            if (matchesTab && matchesSearch) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Toggle "No Results" placeholder
        if (visibleCount === 0) {
            noResultsMsg.style.display = 'block';
        } else {
            noResultsMsg.style.display = 'none';
        }
    };

    certTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            certTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeTab = tab.getAttribute('data-tab');
            filterCertifications();
        });
    });

    certSearch.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        filterCertifications();
    });

    /* ==========================================================================
       DYNAMIC GLASS-GLOW CURSOR EFFECT (HOVER INTERACTION)
       ========================================================================== */
    const glassCards = document.querySelectorAll('.glass-card');

    glassCards.forEach(card => {
        const glow = card.querySelector('.card-glow');
        if (!glow) return;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    /* ==========================================================================
       CONTACT FORM SUBMISSION
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Form data (can be used for further integration e.g. EmailJS, Netlify forms)
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Set loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = `Sending Message... <i class="fa-solid fa-spinner fa-spin"></i>`;
            formStatus.className = 'form-status';
            formStatus.textContent = '';

            // Simulate form submission API request
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
                
                // Show success message
                formStatus.className = 'form-status success';
                formStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, ${name}! Your message has been sent successfully.`;
                
                // Reset form
                contactForm.reset();

                // Clear success message after 5 seconds
                setTimeout(() => {
                    formStatus.style.opacity = '0';
                    setTimeout(() => {
                        formStatus.textContent = '';
                        formStatus.style.opacity = '1';
                        formStatus.className = 'form-status';
                    }, 500);
                }, 5000);
            }, 1800);
        });
    }
});
