/*
========================================
THEME MANAGEMENT - light/dark toggle, persisted to localStorage.
Defaults to dark since that's this site's primary look.
========================================
*/
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const newTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

/*
========================================
SECTION NAVIGATION (index.html only) - shows/hides Home, About, Contact.
Projects lives on its own page (projects.html), so it's a plain link.
========================================
*/
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link[data-page]');

function showPage(pageId) {
    pages.forEach(page => page.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active'));

    const targetPage = document.getElementById(`${pageId}-page`);
    const targetNav = document.querySelector(`.nav-link[data-page="${pageId}"]`);

    if (targetPage) targetPage.classList.add('active');
    if (targetNav) targetNav.classList.add('active');

    window.location.hash = pageId;
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const pageId = link.getAttribute('data-page');
        // Only hijack the click if that section actually exists on this page
        // (e.g. on projects.html these links should just navigate to index.html normally).
        if (!document.getElementById(`${pageId}-page`)) return;
        e.preventDefault();
        showPage(pageId);
    });
});

document.querySelectorAll('[data-navigate]').forEach(el => {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(el.getAttribute('data-navigate'));
    });
});

// Only run section show/hide on pages with multiple sections (index.html).
// Standalone pages (e.g. projects.html) have a single already-active section
// and shouldn't have it touched.
if (pages.length > 1) {
    const hash = window.location.hash.slice(1) || 'home';
    showPage(hash);
}

/*
========================================
COPY EMAIL - copies the contact email to the clipboard and briefly shows a
checkmark on the button as confirmation.
========================================
*/
const copyEmailBtn = document.querySelector('.copy-email-btn');

if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
        const email = copyEmailBtn.getAttribute('data-email');
        try {
            await navigator.clipboard.writeText(email);
        } catch (err) {
            return;
        }

        copyEmailBtn.classList.add('copied');
        copyEmailBtn.setAttribute('title', 'Copied!');
        clearTimeout(copyEmailBtn._copyTimeout);
        copyEmailBtn._copyTimeout = setTimeout(() => {
            copyEmailBtn.classList.remove('copied');
            copyEmailBtn.setAttribute('title', 'Copy email address');
        }, 1500);
    });
}

/*
========================================
SITE COUNTER - LED button in the footer that logs a global click count, plus
a once-per-session visit count. Backed by Abacus, a free no-auth counting API.
Fails silently (shows "--") if the API is unreachable, so it never blocks the
rest of the page.
========================================
*/
const COUNTER_NAMESPACE = 'lancetaningco-github-io';
const COUNTER_API = 'https://abacus.jasoncameron.dev';

async function hitCounter(key) {
    const res = await fetch(`${COUNTER_API}/hit/${COUNTER_NAMESPACE}/${key}`);
    if (!res.ok) throw new Error('counter hit failed');
    const data = await res.json();
    return data.value;
}

async function readCounter(key) {
    const res = await fetch(`${COUNTER_API}/get/${COUNTER_NAMESPACE}/${key}`);
    if (res.status === 404) return 0; // key hasn't been hit yet
    if (!res.ok) throw new Error('counter read failed');
    const data = await res.json();
    return data.value;
}

const visitCountEl = document.getElementById('visit-count');
if (visitCountEl) {
    const visitPromise = sessionStorage.getItem('siteVisitCounted')
        ? readCounter('site-visits')
        : hitCounter('site-visits').then(value => {
            sessionStorage.setItem('siteVisitCounted', '1');
            return value;
        });

    visitPromise
        .then(value => { visitCountEl.textContent = value; })
        .catch(() => { visitCountEl.textContent = '--'; });
}

const ledBtn = document.getElementById('led-btn');
const ledCountEl = document.getElementById('led-count');
if (ledBtn && ledCountEl) {
    readCounter('led-clicks')
        .then(value => { ledCountEl.textContent = value; })
        .catch(() => { ledCountEl.textContent = '--'; });

    let litTimeout;
    ledBtn.addEventListener('click', () => {
        clearTimeout(litTimeout);
        ledBtn.classList.remove('lit');
        void ledBtn.offsetWidth;
        ledBtn.classList.add('lit');
        litTimeout = setTimeout(() => ledBtn.classList.remove('lit'), 1200);

        hitCounter('led-clicks')
            .then(value => { ledCountEl.textContent = value; })
            .catch(() => {});
    });
}

/*
========================================
PROJECT DATA - the single source of truth for every project card, on both
index.html's "Featured Projects" preview and the full projects.html grid.

TO ADD A PROJECT: copy one of the objects below and fill in your own
title/description/tags/link. That's it — no new HTML files needed.
========================================
*/
const PROJECTS = [
    {
        title: "Digital Altimeter",
        description: "Reads real-time altitude using a BMP280 barometric pressure sensor wired to an Arduino, with live readings on an LCD display.",
        tags: ["Arduino", "C++", "BMP280 Sensor"],
        link: "https://github.com/lancetaningco"
    },
    {
        title: "Sleep Prevention Alarm System",
        description: "Drowsiness-detection alarm that uses OpenCV for real-time face/eye tracking to alert a user before they fall asleep.",
        tags: ["Python", "OpenCV", "Arduino"],
        link: "https://github.com/lancetaningco"
    },
    {
        title: "Traffic Light Simulation",
        description: "Traffic light controller simulation built for Microcontrollers Lab (ECE 3301L), programmed and flashed with MPLAB and a PICkit 5.",
        tags: ["MPLAB", "PICkit 5", "Microcontrollers"],
        link: "https://github.com/lancetaningco"
    }
    // ADD MORE PROJECTS HERE — same shape: { title, description, tags: [...], link }
];

function projectCard(project, index) {
    return `
        <div class="project-card">
            <div class="project-content">
                <span class="project-index">${String(index + 1).padStart(2, '0')} /</span>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <a href="${project.link}" target="_blank" rel="noopener" class="project-link">
                    View Project
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </a>
            </div>
        </div>
    `;
}

function renderProjects() {
    const featuredContainer = document.getElementById('featured-projects');
    if (featuredContainer) {
        featuredContainer.innerHTML = PROJECTS
            .slice(0, 2)
            .map((project, i) => projectCard(project, i))
            .join('');
    }

    const allProjectsContainer = document.getElementById('all-projects');
    if (allProjectsContainer) {
        allProjectsContainer.innerHTML = PROJECTS
            .map((project, i) => projectCard(project, i))
            .join('');
    }
}

renderProjects();
