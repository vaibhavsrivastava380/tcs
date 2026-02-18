// hamburger top logic for dropdown

let hideTimeout;
const whatTrigger = document.getElementById('nav-trigger-what');
const whatModal = document.getElementById('modal-what');

function showWhatModal() {
    clearTimeout(hideTimeout);
    document.querySelectorAll('.modal-nav').forEach(m => m.classList.remove('show'));
    whatModal.classList.add('show');
}

function hideWhatModal() {
    hideTimeout = setTimeout(() => {
        whatModal.classList.remove('show');
    }, 300);
}

if (whatTrigger) {
    whatTrigger.addEventListener('mouseenter', showWhatModal);
    whatTrigger.addEventListener('mouseleave', hideWhatModal);
    whatTrigger.addEventListener('click', showWhatModal);
    whatModal.addEventListener('mouseenter', showWhatModal);
    whatModal.addEventListener('mouseleave', hideWhatModal);
}

//WHO WE ARE
const whoTrigger = document.getElementById('nav-trigger-who');
const whoModal = document.getElementById('modal-who');

function showWhoModal() {
    clearTimeout(hideTimeout);
    document.querySelectorAll('.modal-nav').forEach(m => m.classList.remove('show'));
    whoModal.classList.add('show');
}

function hideWhoModal() {
    hideTimeout = setTimeout(() => {
        whoModal.classList.remove('show');
    }, 300);
}

if (whoTrigger) {
    whoTrigger.addEventListener('mouseenter', showWhoModal);
    whoTrigger.addEventListener('mouseleave', hideWhoModal);
    whoTrigger.addEventListener('click', showWhoModal);
    whoModal.addEventListener('mouseenter', showWhoModal);
    whoModal.addEventListener('mouseleave', hideWhoModal);
}

//INSIGHTS
const insightsTrigger = document.getElementById('nav-trigger-insights');
const insightsModal = document.getElementById('modal-insights');

function showInsightsModal() {
    clearTimeout(hideTimeout);
    document.querySelectorAll('.modal-nav').forEach(m => m.classList.remove('show'));
    insightsModal.classList.add('show');
}

function hideInsightsModal() {
    hideTimeout = setTimeout(() => {
        insightsModal.classList.remove('show');
    }, 300);
}

if (insightsTrigger) {
    insightsTrigger.addEventListener('mouseenter', showInsightsModal);
    insightsTrigger.addEventListener('mouseleave', hideInsightsModal);
    insightsTrigger.addEventListener('click', showInsightsModal);
    insightsModal.addEventListener('mouseenter', showInsightsModal);
    insightsModal.addEventListener('mouseleave', hideInsightsModal);
}

//CAREERS
const careersTrigger = document.getElementById('nav-trigger-careers');
const careersModal = document.getElementById('modal-careers');

function showCareersModal() {
    clearTimeout(hideTimeout);
    document.querySelectorAll('.modal-nav').forEach(m => m.classList.remove('show'));
    careersModal.classList.add('show');
}

function hideCareersModal() {
    hideTimeout = setTimeout(() => {
        careersModal.classList.remove('show');
    }, 300);
}

if (careersTrigger) {
    careersTrigger.addEventListener('mouseenter', showCareersModal);
    careersTrigger.addEventListener('mouseleave', hideCareersModal);
    careersTrigger.addEventListener('click', showCareersModal);
    careersModal.addEventListener('mouseenter', showCareersModal);
    careersModal.addEventListener('mouseleave', hideCareersModal);
}

//INVESTORS
const investorsTrigger = document.getElementById('nav-trigger-investors');
const investorsModal = document.getElementById('modal-investors');

function showInvestorsModal() {
    clearTimeout(hideTimeout);
    document.querySelectorAll('.modal-nav').forEach(m => m.classList.remove('show'));
    investorsModal.classList.add('show');
}

function hideInvestorsModal() {
    hideTimeout = setTimeout(() => {
        investorsModal.classList.remove('show');
    }, 300);
}

if (investorsTrigger) {
    investorsTrigger.addEventListener('mouseenter', showInvestorsModal);
    investorsTrigger.addEventListener('mouseleave', hideInvestorsModal);
    investorsTrigger.addEventListener('click', showInvestorsModal);
    investorsModal.addEventListener('mouseenter', showInvestorsModal);
    investorsModal.addEventListener('mouseleave', hideInvestorsModal);
}


// SIDEBAR here
const sidebarItems = document.querySelectorAll('.modal-nav__item');

sidebarItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        const parentModal = item.closest('.modal-nav');
        const items = parentModal.querySelectorAll('.modal-nav__item');
        const panes = parentModal.querySelectorAll('.modal-nav__pane');

        items.forEach(si => si.classList.remove('active'));
        panes.forEach(cp => cp.classList.remove('active'));

        item.classList.add('active');
        const targetId = item.getAttribute('data-target');
        const targetPane = document.getElementById(targetId);
        if (targetPane) {
            targetPane.classList.add('active');
        }
    });
});


//SCROLL & FILTERING 
let allCardData = [];
let filteredCardData = [];
let displayedCount = 0;
const cardsPerPage = 2;
let activeFilters = new Set(['All']);
let searchTerm = ''; 

const cardsContainer = document.querySelector('.cards');
const sentinel = document.getElementById('scroll-sentinel');
const filterBtns = document.querySelectorAll('.filters__feature');

// Search elements
const searchTrigger = document.getElementById('search-trigger');
const searchOverlay = document.getElementById('search-overlay');
const searchClose = document.getElementById('search-close');
const searchInput = document.getElementById('search-input');

const scrollObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && filteredCardData.length > displayedCount) {
        renderNextBatch();
    }
}, {
    threshold: 0.1
});

async function initCards() {
    try {
        const response = await fetch('./data.json');
        allCardData = await response.json();
        filteredCardData = [...allCardData];

        setupFilters();
        setupSearch(); 
        resetContainer();
        renderNextBatch();
    } catch (error) {
        console.error('Error loading card data:', error);
    }
}

function setupFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.textContent.trim();

            if (filterValue === 'All') {
                activeFilters.clear();
                activeFilters.add('All');
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            } else {
                if (activeFilters.has('All')) {
                    activeFilters.delete('All');
                    filterBtns[0].classList.remove('active');
                }

                if (activeFilters.has(filterValue)) {
                    activeFilters.delete(filterValue);
                    btn.classList.remove('active');
                } else {
                    activeFilters.add(filterValue);
                    btn.classList.add('active');
                }

                if (activeFilters.size === 0) {
                    activeFilters.add('All');
                    filterBtns[0].classList.add('active');
                }

                const specificTagsCount = filterBtns.length - 1;
                if (activeFilters.size === specificTagsCount && !activeFilters.has('All')) {
                    activeFilters.clear();
                    activeFilters.add('All');
                    filterBtns.forEach(b => b.classList.remove('active'));
                    filterBtns[0].classList.add('active');
                }
            }

            applyFiltering();
        });
    });
}

function setupSearch() {
    if (searchTrigger) {
        searchTrigger.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            setTimeout(() => searchInput.focus(), 400); 
        });
    }

    if (searchClose) {
        searchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
            searchInput.value = ''; 
            searchTerm = '';
            applyFiltering();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value.trim();
            applyFiltering();
        });
    }
}

function applyFiltering() {
    const isAll = activeFilters.has('All');
    const lowerCaseFilters = Array.from(activeFilters).map(f => f.toLowerCase());
    const lowerSearch = searchTerm.toLowerCase();

    filteredCardData = allCardData.filter(item => {
        const matchesTag = isAll || lowerCaseFilters.includes(item.tag.toLowerCase());
        const matchesSearch = item.title.toLowerCase().includes(lowerSearch) ||
            item.description.toLowerCase().includes(lowerSearch);

        return matchesTag && matchesSearch;
    });

    resetContainer();
    renderNextBatch();
}

function resetContainer() {
    displayedCount = 0;
    const sentinelElem = document.getElementById('scroll-sentinel');
    if (cardsContainer && sentinelElem) {
        cardsContainer.innerHTML = '';
        cardsContainer.appendChild(sentinelElem);
        sentinelElem.style.display = 'block';
        scrollObserver.unobserve(sentinelElem);
        scrollObserver.observe(sentinelElem);
    }
}

function renderNextBatch() {
    const nextLimit = displayedCount + cardsPerPage;
    const nextBatch = filteredCardData.slice(displayedCount, nextLimit);
    const currSentinel = document.getElementById('scroll-sentinel');

    if (nextBatch.length === 0 && displayedCount === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = 'No results found matching your search.';
        noResults.style.textAlign = 'center';
        noResults.style.padding = '50px';
        noResults.style.color = 'var(--no-results-text, #888)';
        cardsContainer.insertBefore(noResults, currSentinel);
        currSentinel.style.display = 'none';
        return;
    }

    nextBatch.forEach(data => {
        const cardHtml = `
            <div class="card">
                <div class="card__left">
                    <div class="card__left_img_wrapper">
                        <img src="${data.image}" alt="image of card" class="img__card">
                    </div>
                </div>
                <div class="card__right">
                    <div class="card__right__title">${data.title}</div>
                    <div class="card__right__disc">${data.description}</div>
                    <div class="card__right__tag">${data.tag}</div>
                </div>
            </div>
        `;
        currSentinel.insertAdjacentHTML('beforebegin', cardHtml);
    });

    displayedCount += nextBatch.length;

    if (displayedCount >= filteredCardData.length) {
        scrollObserver.unobserve(currSentinel);
        currSentinel.style.display = 'none';
    }
}

const hamburger = document.querySelector('.header__hamburger');
const nav = document.querySelector('.header__nav');
const header = document.querySelector('.header');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        header.classList.toggle('nav-active');
        nav.classList.toggle('active');
    });
}

const navItems = document.querySelectorAll('.header__nav--content');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth < 1024) {
            header.classList.remove('nav-active');
            nav.classList.remove('active');
        }
    });
});

initCards();
