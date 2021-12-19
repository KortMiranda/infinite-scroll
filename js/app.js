//refrenced by this tutorial: https://www.javascripttutorial.net/javascript-dom/javascript-infinite-scroll/

(function () {

const quotesE1 = document.querySelector('.quotes');
const loader = document.querySelector('.loader');

// function calls the API and returns the quotes
//since this function uses the await keyword, it has to be an async function
const getQuotes = async (page, limit) => {
    const API_URL = `https://api.javascripttutorial.net/v1/quotes/?page=${page}&limit=${limit}`;
    const response = await fetch(API_URL)
    // handle 404
    if (!response.ok) {
        throw new Error(`An error occurred: ${response.status}`);
    }
    return await response.json();
}

const showQuotes = (quotes) => {
    quotes.forEach(quote => {
        const quoteE1 = document.createElement('blockquote');
        //For each quote object, it creates the <blockquote> element with the quote class
        quoteE1.classList.add('quote');

        quoteE1.innerHTML = `
            <span>${quote.id}</span>
            ${quote.quote}
            <footer>${quote.author}</footer>
        `;
        //At the end of each iteration, the function appends the <blockquote> element to the child elements of the quotesE1 element by using the appendChild() method
        quotesE1.appendChild(quoteE1)
    })
}

const hideLoader = () => {
    loader.classList.remove('show');
};
// To hide the loading indicator, you remove the show class from the loading indicator element. Similarly, to show the loading indicator, you add the show class to its class list. 
const showLoader = () => {
    loader.classList.add('show');
};



const hasMoreQuotes = (page, limit, total) => {
    const startIndex = (page - 1) * limit + 1;
    return total === 0 || startIndex < total;
}

// load quotes
const loadQuotes = async (page, limit) => {

    // show the loader
    showLoader();

    // 0.5 second later
    setTimeout(async () => {
        try {
            if(hasMoreQuotes(page, limit, total)) {
                // call teh API to get quotes
                const response = await getQuotes(page, limit);
                // show quotes
                showQuotes(response.data);
                // update the total
                total = response.total;
            }
        } catch (error) {
            console.log(error.message)
        } finally {
            hideLoader();
        }
    }, 500);
}

//Define control variables

let currentPage = 1;
const limit = 10;
let total = 0;

window.addEventListener('scroll', () => {
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 5 &&
        hasMoreQuotes(currentPage, limit, total)) {
        currentPage++;
        loadQuotes(currentPage, limit);
    }
}, {
    passive: true
});

//When the page loads for the first time, you need to call the loadQuotes() function to load the first batch of quotes
loadQuotes(currentPage, limit);

})();