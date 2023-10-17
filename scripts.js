import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";
import {  generateBookPreviews } from "./Modules/loading.js";
import { allHtmlElements } from "./Modules/helpers.js";

let page = 1;
let matches = books;
console.log (books[0])

generateBookPreviews(matches, page-1)

const genreHtml = document.createDocumentFragment();
const firstGenreElement = document.createElement("option");
firstGenreElement.value = "any";
firstGenreElement.innerText = "All Genres";
genreHtml.appendChild(firstGenreElement);

for (const [id, name] of Object.entries(genres)) {
  const element = document.createElement("option");
  element.value = id;
  element.innerText = name;
  genreHtml.appendChild(element);
}

document.querySelector("[data-search-genres]").appendChild(genreHtml);

allHtmlElements.dataSearchGenre.appendChild(genreHtml);

const authorsHtml = document.createDocumentFragment();

const firstAuthorElement = document.createElement("option");
firstAuthorElement.value = "any";
firstAuthorElement.innerText = "All Authors";
authorsHtml.appendChild(firstAuthorElement);

for (const [id, name] of Object.entries(authors)) {
  const element = document.createElement("option");
  element.value = id;
  element.innerText = name;
  authorsHtml.appendChild(element);
}
allHtmlElements.dataSearchAuthor.appendChild(authorsHtml);


if (matches.length - page * BOOKS_PER_PAGE > 0) {
  //dataListButton.disabled === true && matches.length - page * BOOKS_PER_PAGE;
  allHtmlElements.dataListButton.innerText = ` Show more ${
    matches.length - page * BOOKS_PER_PAGE
  }`;
} else {
  0;
}

allHtmlElements.dataListButton.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${
      matches.length - page * BOOKS_PER_PAGE > 0
        ? matches.length - page * BOOKS_PER_PAGE
        : 0
    })</span>
`;


const handleDatasearchOverlay = () => {
  allHtmlElements.dataSearchOverlay.open = false;
};
allHtmlElements.dataSearchCancel.addEventListener(
  "click",
  handleDatasearchOverlay
);

allHtmlElements.dataSettingCancel.addEventListener("click", () => {
  allHtmlElementsdataSettingOverlay.open = false;
});

document.querySelector("[data-header-search]").addEventListener("click", () => {
  document.querySelector("[data-search-overlay]").open = true;
  document.querySelector("[data-search-title]").focus();
});

document
  .querySelector("[data-header-settings]")
  .addEventListener("click", () => {
    document.querySelector("[data-settings-overlay]").open = true;
  });

document.querySelector("[data-list-close]").addEventListener("click", () => {
  document.querySelector("[data-list-active]").open = false;
});

/**
 * Handles the submission of a form.
 *
 * @param {Event} event - The form submission event object.
 */
const formHandle = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const theme = formData.get("theme");

  // Define color variables for day and night themes
  const dayColors = {
    "--color-dark": "10, 10, 20",
    "--color-light": "255, 255, 255",
  };

  const nightColors = {
    "--color-dark": "255, 255, 255",
    "--color-light": "10, 10, 20",
  };

  const themeColors = theme === "day" ? dayColors : nightColors;

  for (const [property, value] of Object.entries(themeColors)) {
    document.documentElement.style.setProperty(property, value);
  }
  allHtmlElements.dataSettingOverlay.open = false;
};

allHtmlElements.dataSettingForm.addEventListener("submit", formHandle);

const result = [];
page = 1;
matches = result;

/**
 * Handle form submission.
 *
 * @param {Event} event - The form submission event.
 */
const handleFormSubmission = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  const filteredBooks = filterBooks(books, filters);
  updateResults(filteredBooks);
};

/**
 * Filter an array of books based on criteria.
 *
 * @param {Array} books - The array of books to filter.
 * @param {Object} filters - An object containing filter criteria.
 * @returns {Array} - An array of filtered books.
 */
const filterBooks = (books, filters) => {
  return books.filter((book) => {
    const genreMatch =
      filters.genre === "any" || book.genres.includes(filters.genre);

    const titleMatch =
      filters.title.trim() === "" ||
      book.title.toLowerCase().includes(filters.title.toLowerCase());

    const authorMatch =
      filters.author === "any" || book.author === filters.author;

    return genreMatch && titleMatch && authorMatch;
  });
};
/**
 * Update the results based on the filtered books.
 *
 * @param {Array} filteredBooks - The array of filtered books.
 */
const updateResults = (filteredBooks) => {
  // Clear the existing results
  allHtmlElements.resultList.innerHTML = "";

  // Check if there are no filtered books
  if (filteredBooks.length === 0) {
    allHtmlElements.dataListMessage.classList.add("list__message_show");
  } else {
    allHtmlElements.dataListMessage.classList.remove("list__message_show");
  }

  // Determine the range of books to display based on pagination
 const startIndex = (page - 1) * BOOKS_PER_PAGE;
 const endIndex = startIndex + BOOKS_PER_PAGE;

  // Create and append elements for the filtered books within the specified range

  const fragment = document.createDocumentFragment();
  for (let i = startIndex; i < endIndex && i < filteredBooks.length; i++) {
    const book = filteredBooks[i];

    const element = document.createElement("button");
    element.classList = "preview";
    element.setAttribute("data-preview", book.id);

    element.innerHTML = `
      <img
        class="preview__image"
        src="${book.image}"
      />
      <div class="preview__info">
        <h3 class="preview__title">${book.title}</h3>
        <div class="preview__author">${authors[book.author]}</div>
      </div>
    `;

    fragment.appendChild(element);
  }

  allHtmlElements.resultList.appendChild(fragment);

  // Update the "Show more" button state
  const remainingBooks = filteredBooks.length - endIndex;
  allHtmlElements.showMoreButton.disabled = remainingBooks <= 0;
  allHtmlElements.showMoreButton.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${
      remainingBooks > 0 ? remainingBooks : 0
    })</span>
  `;


// Attach a click event listener to the "dataListButton"
allHtmlElements.dataListButton.addEventListener('click', () => {
  // Increment the page variable
  page++;

  // Generate previews for the next page of books
  const newBookPreviews = generateBookPreviews(matches, page - 1);

  // Append the new previews to the existing list
  document.querySelector('[data-list-items]').appendChild(newBookPreviews);

  // Check if there are more pages to display
  if (page * BOOKS_PER_PAGE < matches.length) {
    allHtmlElements.dataListButton.disabled = false; // Enable the button
  } else {
    allHtmlElements.dataListButton.disabled = true; // Disable the button if no more books
  }
});




  // Scroll to the top of the page
  window.scrollTo({ top: 0, behavior: "smooth" });
  allHtmlElements.dataSearchOverlay.open = false;
};
allHtmlElements.dataSearchForm.addEventListener("submit", handleFormSubmission);



/**
 * Handles the click event on preview items, displaying additional book details.
 *
 * This function is designed to be triggered when a preview item is clicked. It searches for
 * the clicked item's data-preview attribute in the event path and retrieves the corresponding
 * book's information from the 'books' array. It then updates the details view elements to
 * display the book's image, title, author, publication year, and description.
 *
 * @function
 * @param {Event} event - The click event that triggered this function.
 * @returns {void}
 */
const newDataListItemsHandle = (event) => {
  const pathArray = Array.from(event.path || event.composedPath());
  let active = null;

  for (const node of pathArray) {
    if (active) break;

    if (node?.dataset?.preview) {
      let result = null;

      for (const singleBook of books) {
        if (result) break;
        if (singleBook.id === node?.dataset?.preview) result = singleBook;
      }

      active = result;
    }
  }

  if (active) {
    document.querySelector("[data-list-active]").open = true;
    document.querySelector("[data-list-blur]").src = active.image;
    document.querySelector("[data-list-image]").src = active.image;
    document.querySelector("[data-list-title]").innerText = active.title;
    document.querySelector("[data-list-subtitle]").innerText = `${
      authors[active.author]
    } (${new Date(active.published).getFullYear()})`;
    document.querySelector("[data-list-description]").innerText =
      active.description;
  }
};

allHtmlElements.dataListItems.addEventListener("click", newDataListItemsHandle);
