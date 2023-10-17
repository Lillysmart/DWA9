import { authors, books, BOOKS_PER_PAGE } from "../data.js";
import { allHtmlElements } from "./helpers.js";

/**
 * Create a book preview object with a method to generate preview HTML.
 *
 * @param {object} bookData - The data for the book.
 * @returns {object} - An object with a 'generatePreviewHTML' method.
 */
const createBookPreview = (bookData) => {
  
  const privateData = {
    title: bookData.title || "No Title",
    author: bookData.author || "Unknown Author",
    image: bookData.image || "",
  };

  return {
    /**
     * Generate HTML for a book preview.
     * @returns {HTMLElement} - The HTML element representing the book preview.
     */
    generatePreviewHTML: () => {
      const element = document.createElement("button");
      element.classList = "preview";
      element.setAttribute("data-preview", bookData.id);

      element.innerHTML = `
        <img
          class="preview__image"
          src="${bookData.image}"
        />
        
        <div class="preview__info">
          <h3 class="preview__title">${bookData.title}</h3>
          <div class="preview__author">${authors[bookData.author]}</div>
        </div>
      `;

      return element;
    },
     /**
      * Get the title of the book preview
      * @returns {string} - The title of the book preview
      */
    get Title() {
      privateData.title;
    },

    /**
     * Set the title of the book preview.
     *
     * @param {string} newTitle - The new title to set.
     */
    set title(newTitle) {
      privateData.title = newTitle;
    },

    get author() {
      privateData.author;
    },
    set author(newAuthor) {
      privateData.author = newAuthor;
    },

    get image() {
      privateData.image;
    },
    set image(newImage) {
      privateData.image = newImage;
    },
  };
};
/**
 * Creates book previews and append them to the HTML element.
 *
 * @param {Array} matches - An array of book data objects to create previews from.
 * @param {number} page - The current page number
 */
const generateBookPreviews = (matches, page) => {
  const starting = document.createDocumentFragment();

  for (const bookData of matches.slice(
    page * BOOKS_PER_PAGE,
    (page + 1) * BOOKS_PER_PAGE
  )) {
    const bookPreview = createBookPreview(bookData);
    const element = bookPreview.generatePreviewHTML();
    starting.appendChild(element);
  }

  allHtmlElements.dataListItems.appendChild(starting);
};

export { generateBookPreviews };

