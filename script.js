/* 
========================================
THEME MANAGEMENT SYSTEM - Handles switching between light and dark mode. Saves preference to browser's localStorage
========================================
*/

// Get references to DOM elements we'll need
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;  // The <html> element

// Load saved theme from localStorage, default to 'light' if none saved
// localStorage persists data even after closing the browser
const savedTheme = localStorage.getItem('theme') || 'light';

// Apply the saved theme immediately when page loads
htmlElement.setAttribute('data-theme', savedTheme);

// Listen for clicks on the theme toggle button
themeToggle.addEventListener('click', () => {
    // Get current theme from the HTML element
    const currentTheme = htmlElement.getAttribute('data-theme');
    
    // Toggle: if dark, switch to light; if light, switch to dark
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Apply new theme to HTML element (CSS will respond to this)
    htmlElement.setAttribute('data-theme', newTheme);
    
    // Save preference to localStorage so it persists
    localStorage.setItem('theme', newTheme);
});

/* 
========================================
PAGE NAVIGATION SYSTEM - Shows/hides different page sections. Updates URL hash and navigation highlighting
========================================
*/

// Get all page sections and navigation links
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');

/**
 * Function to show a specific page and hide others
 * @param {string} pageId - The ID of the page to show (without '-page' suffix)
 */
function showPage(pageId) {
    // Hide all pages and remove active state from all nav links
    pages.forEach(page => page.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Find the target page and nav link using the pageId
    const targetPage = document.getElementById(`${pageId}-page`);
    const targetNav = document.querySelector(`[data-page="${pageId}"]`);
    
    // Show the target page and highlight the nav link
    if (targetPage) targetPage.classList.add('active');
    if (targetNav) targetNav.classList.add('active');
    
    // Update URL hash (the part after # in the URL)
    // This allows users to bookmark specific pages
    window.location.hash = pageId;
}

/* 
Add click listeners to all navigation links
When clicked, show the corresponding page
*/
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();  // Prevent default link behavior (jumping to #)
        
        // Get which page to show from data-page attribute
        const pageId = link.getAttribute('data-page');
        showPage(pageId);
    });
});

/* 
Add click listeners to buttons with data-navigate attribute
Used for "View Projects" and "About Me" buttons on home page
*/
document.querySelectorAll('[data-navigate]').forEach(btn => {
    btn.addEventListener('click', () => {
        const pageId = btn.getAttribute('data-navigate');
        showPage(pageId);
    });
});

/* 
When page first loads:
1. Check URL hash to see if user navigated to specific page
2. Show that page (or home page if no hash)
3. Render dynamic content (projects and journal entries)
*/
window.addEventListener('load', () => {
    // Get hash from URL (e.g., "#projects" becomes "projects")
    // If no hash, default to "home"
    const hash = window.location.hash.slice(1) || 'home';
    
    showPage(hash);
    renderProjects();  // Generate project cards
    renderJournal();   // Generate journal entries

    // if this is a detail page, run the appropriate renderer
    const pathname = window.location.pathname;
    if (pathname.endsWith('project.html')) {
        renderProjectDetail();
    } else if (pathname.endsWith('journal.html')) {
        renderJournalDetail();
    }
});

/* 
========================================
PROJECT DATA - Array of objects containing all project information. This is where you'll add your actual projects.
========================================
*/
const projects = [
    {
        id: 1,
        title: "Digital Altimeter",
        description: "6-axis robotic arm with inverse kinematics and computer vision for pick-and-place operations.",
        image: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=800&h=600&fit=crop",
        tags: ["Arduino", "Python", "OpenCV", "C++"],
        link: "#"  // Replace with actual GitHub repo link
    },
    {
        id: 2,
        title: "Sleep Prevention Alarm System",
        description: "Real-time data visualization platform with interactive charts and customizable widgets for business intelligence.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        tags: ["React", "TypeScript", "D3.js", "Node.js", "PostgreSQL"],
        link: "#"
    },
    {
        id: 3,
        title: "Traffic Light Simulation",
        description: "Traffic light project done in my Microcontrollers Lab (ECE 3301L).",
        image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&h=600&fit=crop",
        tags: ["MPLAB", "PickIt5", "Microcontrollers", "AWS IoT"],
        link: "#"
    }
    // ADD MORE PROJECTS HERE following the same structure
];

/* 
========================================
JOURNAL DATA - Array of journal entries for documentation.
========================================
*/
const journalEntries = [
    {
        id: 1,
        date: "January 5, 2026",
        title: "Creating a portfolio website using GitHub Pages",
        category: "Portfolio Website",
        preview: "Finally have a cool space to showcase my work, YAY!.",
        link: "#"  // Link to full blog post or detailed GitHub markdown
    },
    {
        id: 2,
        date: "January 8, 2026",
        title: "Building the Altimeter - Week 1",
        category: "Digital Altimeter",
        preview: "Concieved the idea for digital altimeter project. Goal: Build a functional and accurate digital altimeter using a biometric pressure sensor, a microcontroller, and an LCD display.",
        link: "#"
    }
    // ADD MORE JOURNAL ENTRIES HERE
];

/* 
========================================
RENDER PROJECTS - Function that generates HTML for project cards and inserts them into the page
========================================
*/
function renderProjects() {
    // Get containers where we'll insert project cards
    const featuredContainer = document.getElementById('featured-projects');
    const allProjectsContainer = document.getElementById('all-projects');
    
    // Featured projects section (home page) - shows first 2 projects
    if (featuredContainer) {
        // slice(0, 2) gets first 2 items from array
        // map() transforms each project into HTML
        // join('') combines all HTML strings
        featuredContainer.innerHTML = projects
            .slice(0, 2)
            .map(project => createProjectCard(project))
            .join('');
    }
    
    // All projects section (projects page) - shows all projects
    if (allProjectsContainer) {
        allProjectsContainer.innerHTML = projects
            .map(project => createProjectCard(project))
            .join('');
    }
}

/**
 * Creates HTML for a single project card
 * @param {Object} project - Project object with title, description, etc.
 * @returns {string} HTML string for the project card
 */
function createProjectCard(project) {
    // Template literal (backticks) allows multi-line strings and ${} for variables
    return `
        <div class="project-card">
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                
                <!-- Generate tag badges -->
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                
                <!-- View Project button navigates to detail page -->
                <a href="project.html?id=${project.id}" class="project-link">
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

/* 
========================================
RENDER JOURNAL ENTRIES - Function that generates HTML for journal cards. Similar structure to project rendering
========================================
*/
function renderJournal() {
    const journalContainer = document.getElementById('journal-entries');
    
    if (journalContainer) {
        // Transform each journal entry into HTML
        journalContainer.innerHTML = journalEntries
            .map(entry => createJournalCard(entry))
            .join('');
    }
}

/**
 * Creates HTML for a single journal entry card
 * @param {Object} entry - Journal entry object
 * @returns {string} HTML string for the journal card
 */
function createJournalCard(entry) {
    return `
        <div class="journal-card">
            <!-- Top section with date and category -->
            <div class="journal-meta">
                <div class="journal-date">
                    <!-- Calendar icon SVG -->
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    ${entry.date}
                </div>
                <span class="journal-category">${entry.category}</span>
            </div>
            
            <!-- Entry title and preview -->
            <h2 class="journal-title">${entry.title}</h2>
            <p class="journal-preview">${entry.preview}</p>
            
            <!-- Read more link -->
            <!-- link to journal detail page -->
            <a href="journal.html?id=${entry.id}" class="read-more">
                Read more →
            </a>
        </div>
    `;
}

/* 
========================================
DETAIL PAGE HELPERS
========================================
*/

/**
 * Render the contents of a single project inside project.html
 */
function renderProjectDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const project = projects.find(p => p.id === id);
    const container = document.getElementById('project-detail');
    if (!container) return;

    if (!project) {
        container.innerHTML = '<p>Project not found.</p>';
        return;
    }

    container.innerHTML = `
        <div class="project-detail-card">
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <div class="project-content">
                <h1 class="project-title">${project.title}</h1>
                <p class="project-description">${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <a href="${project.link}" class="project-link">Go to repository</a>
            </div>
        </div>
    `;
}

/**
 * Render a single journal entry inside journal.html
 */
function renderJournalDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const entry = journalEntries.find(e => e.id === id);
    const container = document.getElementById('journal-detail');
    if (!container) return;

    if (!entry) {
        container.innerHTML = '<p>Entry not found.</p>';
        return;
    }

    container.innerHTML = `
        <div class="journal-detail-card">
            <div class="journal-meta">
                <div class="journal-date">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    ${entry.date}
                </div>
                <span class="journal-category">${entry.category}</span>
            </div>
            <h1 class="journal-title">${entry.title}</h1>
            <p class="journal-preview">${entry.preview}</p>
            <a href="${entry.link}" class="read-more">Source/More details →</a>
        </div>
    `;
}

/* 
========================================
HOW TO CUSTOMIZE THIS FILE
========================================

1. ADD YOUR PROJECTS:
   - Add objects to the 'projects' array above
   - Include your own images (upload to docs/ folder)
   - Update links to point to GitHub repos or live demos

2. ADD JOURNAL ENTRIES:
   - Add objects to the 'journalEntries' array
   - Link to full blog posts or GitHub markdown files

3. CUSTOMIZE FUNCTIONALITY:
   - Add filtering (e.g., filter projects by tag)
   - Add search functionality
   - Add sorting options
   - Add pagination for many projects

4. ENHANCE INTERACTIVITY:
   - Add lightbox for viewing images
   - Add smooth scroll animations
   - Add loading states
   - Add form handling for "New Project" buttons

EXAMPLE: Adding a new project
projects.push({
    id: 4,
    title: "Your New Project",
    description: "Description here",
    image: "./images/your-project.jpg",
    tags: ["Tag1", "Tag2"],
    link: "https://github.com/yourusername/project"
});
*/