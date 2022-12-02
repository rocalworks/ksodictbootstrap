let progress = 0;
let currentPage = 1;
let maxPage = 4;

// HTML Elements for progress bar
let btnLoader = document.querySelector('#table-loader');
let loaderContent = document.querySelector('#loader-content');
let progressBar = document.querySelector('.progress-bar');
// Snippets to append at DOM
let spinner = `
    <div class="spinner-border spinner-border-sm" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
`;

// HTML Elements for cloning
let tableContent = document.querySelector('#table-content');
let tableEntry = document.querySelector('#row-entry');

// HTML Elements for pagination 
let pagination = document.querySelector('.pagination');
let btnPrev = document.querySelector('#prev-btn');
let btnNext = document.querySelector('#next-btn');
let page1 = document.querySelector('#page-1');

// Shift button to spinner upon clicking
btnLoader.addEventListener('click', function (event) {
    event.preventDefault();

    // Disable button and show spinner
    btnLoader.setAttribute('disabled', 'disabled');
    loaderContent.innerHTML = spinner;

    // Start loading simulation  
    progLoop(progress);
});

// Pagination events go here
pagination.addEventListener('click', function (event) {
    event.preventDefault();

    // Set to current page first
    const btnPage = event.target.innerHTML;
    if (btnPage == 'Next' || btnPage == 'Prev') {
        // if (currentPage == 1 || currentPage == maxPage)
        //     return

        // Move page according to navigation
        currentPage = btnPage == 'Next' ? currentPage + 1 : currentPage - 1;
        // Check if current page is at the start (1) or end (maxPage)
        checkPageCorner(event);

        // Set active to current page + 1
        document.querySelectorAll('.page-link').forEach((item) => {
            if(item.innerHTML == currentPage) {
                switchActive(item);
            }
        });

        // Load page according to current page
        reloadData(currentPage);

    } else {
        // Set current page to what it has been clicked
        currentPage = event.target.innerHTML;

        // Then set page number of pagination to current page
        if (document.querySelector('.active') !== null)
            document.querySelector('.active').classList.remove('active');
        event.target.parentNode.classList.add('active');

        // Then reload table 
        reloadData(currentPage);
    }
});

// TODO: Disable Prev and Next if 
function checkPageCorner(event){
    if (currentPage <= 1) {
        currentPage = 1;
    } else if (currentPage >= maxPage) {
        currentPage = maxPage;
    }
};

// Switch active pagw 
function switchActive(element) {
    document.querySelector('.active').classList.remove('active');
    element.parentNode.classList.add('active');
}

/** FUNCTION HELPERS  */
// Simulate loading data using progress bars
function progLoop(progress) {
    setTimeout(() => {
        // Set bootstrap progress bar 
        progressBar.setAttribute('style', `width: ${progress}%`);
            progressBar.setAttribute('aria-valuenow', progress);

        // Run function again if not 100%
        if (progress < 100) {
            progLoop(progress + 10);
        }
        else {
            setTimeout(() => {
                loaderContent.innerHTML = 'Loading done!';
            }, 500);
            // Then add data (using loadData)
            loadData(currentPage);
            // Then enable pagination
            pagination.classList.remove('nav-disabled');
            page1.classList.add('active');
        }
    }, 200);
}

// Load data to table according to current page
function loadData(page) {
    let first = (page - 1) * 10;
    let last = first + 10;

    // Add clones 
    for (let x = first; x < last; x++) {
        // Clone row entry 
        const clone = tableEntry.cloneNode(true);

        clone.querySelector('#row-name').innerHTML = data[x].name
        clone.querySelector('#row-address').innerHTML = data[x].address
        clone.querySelector('#row-email').innerHTML = data[x].email
        clone.querySelector('#row-phone').innerHTML = data[x].phone

        // Append to table content
        tableContent.appendChild(clone)
    }
}

// Reload data wrt current page
function reloadData(page) {
    // Then remove all previous entries in table (by clearing them)
    tableContent.innerHTML = '';

    // Then add data (using loadData)
    loadData(page);
}