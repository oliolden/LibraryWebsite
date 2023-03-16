class Book {
    title;
    author;
    ISBN;
    count;

    constructor(book) {
        Object.assign(this, book);
    };

    contains(search) {
        search = search.toLowerCase();
        console.log(search)
        if (this.title.toLowerCase().includes(search) || this.author.toLowerCase().includes(search) || this.ISBN.toString().includes(search)) return true;
        else return false;
    }

    getHTML() {
        return `
            <li id="${this.ISBN}" class="book">
                <div class="book-top"></div>
                <div class="book-side left"></div>
                <div class="book-side right"></div>
                <div class="book-front">
                    <p class="book-title">${this.title}</p>
                    <p class="book-author">${this.author}</p>
                </div>
            </li>
        `;
    };
}

export default Book;