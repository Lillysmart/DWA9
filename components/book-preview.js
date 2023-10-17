//import { authors, books, BOOKS_PER_PAGE } from "../data.js";
//import { allHtmlElements } from "./helpers.js";

/*const template = document.createElement('template')
template.innerHTML=`
<div id="bookPreviewContainer">
        <button class="preview" data-preview>
            <img class="preview__image" src="book-image.jpg" />
            <div class="preview__info">
                <h3 class="preview__title">Sample Book</h3>
                <div class="preview__author">Author 1</div>
            </div>
        </button>
    </div>
`
console.log(template)

export class BookPreview extends HTMLElement {

    
    constructor(){
        super()
        const shadow = this.attachShadow({mode: "open"})
        this.innerHTML='hello'
        shadow.appendChild(template.content.cloneNode(true))
        this.book = {}
    }

    connectedCallback(book){
 this.updatedInfo()

    }



    // Define a method to update the book information.
    updateBookInfo() {
        const elements = this.shadowRoot.querySelectorAll('.preview__image, .preview__title, .preview__author');
        if (elements.length === 3) {
            elements[0].src = this.book.image || 'book-image.jpg';
            elements[1].textContent = this.book.title || 'Sample Book';
            elements[2].textContent = this.book.author ? authors[this.book.author] : 'Author 1';
        }
    }

    // Define a setter for the 'book' property to automatically update the information when 'book' is set.
    set bookData(book) {
        this.book = book;
        this.updateBookInfo();
    }
}




customElements.define("book-preview", BookPreview)

export default BookPreview*/
import { authors, books, BOOKS_PER_PAGE } from "../data.js";
//import {page} from "./scripts.js"

//import { allHtmlElements } from "./Modules/helpers.js"
export class BookPreviews extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.matches = [];
      this.page = 1;
      this.initHTML();
    }
  
    initHTML() {
      this.shadowRoot.innerHTML = `
        <style>
     
.preview {
    border-width: 0;
    width: 100%;
    font-family: Roboto, sans-serif;
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    cursor: pointer;
    text-align: left;
    border: 1px solid rgba(var(--color-dark), 0.15);
    background: rgba(var(--color-light), 1);
  }
  
  @media (min-width: 60rem) {
    .preview {
      padding: 1rem;
    }
  }
  
  .preview_hidden {
    display: none;
  }
  
  .preview:hover {
    background: rgba(var(--color-blue), 0.05);
  }
  
  .preview__image {
    width: 48px;
    height: 70px;
    object-fit: cover;
    background: grey;
    border-radius: 2px;
    box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
      0px 1px 1px 0px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
  }
  
  .preview__info {
    padding: 1rem;
  }
  
  .preview__title {
    margin: 0 0 0.5rem;
    font-weight: bold;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;  
    overflow: hidden;
    color: rgba(var(--color-dark), 0.8)
  }
  
  .preview__author {
    color: rgba(var(--color-dark), 0.4);
  }

  
.list {
  padding-bottom: 10rem;
 
  } 
  
  .list__message {
    display: none;
    padding: 10rem 4rem 2rem;
    text-align: center;
  }
  
  .list__message_show {
    display: block;
  }
  
  .list__items {
    display: grid;
    padding: 2rem 1rem;
    grid-template-columns: 1fr;
    grid-column-gap: 0.5rem;
    grid-row-gap: 0.5rem;
    margin: 0 auto;
    width: 100%;
  }
  
  @media (min-width: 50rem) {
    .list__items{
      grid-template-columns: repeat(2, 1fr);
      grid-column-gap: 0.75rem;
      grid-row-gap: 0.75rem;
    }
  }
  @media (min-width: 100rem) {
    .list__items{
      grid-template-columns: repeat(4, 1fr);
      grid-column-gap: 0.75rem;
      grid-row-gap: 0.75rem;
    }
  }
  
  @media (min-width: 150rem) {
    .list__items{
      grid-template-columns: repeat(8, 1fr);
      grid-column-gap: 0.75rem;
      grid-row-gap: 0.75rem;
    }
  }
  
  .list__button {
    font-family: Roboto, sans-serif;
    transition: background-color 0.1s;
    border-width: 0;
    border-radius: 6px;
    height: 2.75rem;
    cursor: pointer;
    width: 50%;
    background-color: rgba(var(--color-blue), 1);
    color: rgba(var(--color-force-light), 1);
    font-size: 1rem;
    border: 1px solid rgba(var(--color-blue), 1);
    max-width: 10rem;
    margin: 0 auto;
    display: block;
  }
  
  .list__remaining {
    opacity: 0.5;
  }
  
  .list__button:not(:disabled) hover {
    background-color: rgba(var(--color-blue), 0.8);
    color: rgba(var(--color-force-light), 1);
  }
  
  .list__button:disabled {
    cursor: not-allowed;
    opacity: 0.2;
  }

  
        </style>
       
    
       
        <div class="list__items" data-list-items></div>
      `;
    }
  
    connectedCallback() {
      this.updateBookPreviews();
    }
  
    createBookPreview(bookData) {
      const element = document.createElement('button');
      element.classList = 'preview';
      element.setAttribute('data-preview', bookData.id);
  
      element.innerHTML = `
        <img class="preview__image" src="${bookData.image}" />
        <div class="preview__info">
          <h3 class="preview__title">${bookData.title}</h3>
          <div class="preview__author">${authors[bookData.author]}</div>
        </div>
      `;
  
      return element;
    }
    updateBookPreviews() {
        const dataListItems = this.shadowRoot.querySelector('[data-list-items]');
        dataListItems.innerHTML = ''; // Clear the existing content

        const starting = document.createDocumentFragment();

        for (const bookData of this.matches.slice(
            (this.page - 1) * BOOKS_PER_PAGE,
            this.page * BOOKS_PER_PAGE
        )) {
            const bookPreview = this.createBookPreview(bookData);
            starting.appendChild(bookPreview);
        }

        dataListItems.appendChild(starting);
    }
  
    set Matches(newMatches) {
      this.matches = newMatches;
      this.updateBookPreviews();
    }
  
    set Page(newPage) {
      this.page = newPage;
      this.updateBookPreviews();
    }
  }

  customElements.define("book-previews", BookPreviews);
  