import Book from "./Book.js";
import booksImport from "./books.json" assert { type: "json" };

const books = [];
var activeBooks = [];
var bookElements = []

// Create book objects
booksImport.forEach(element => {
    books.push(new Book(element));
});

// Book List
const bookList = document.querySelector(".book-list");
let currentBook;
// Modal
const modalContainer = document.querySelector(".modal-container");
const modal = document.querySelector(".modal-pivot");
const modalTitle = document.querySelector(".modal .title");
const modalAuthor = document.querySelector(".modal .author");
const modalButton = document.querySelector(".modal-button");
const modalAmount = document.querySelector(".modal .amount");
// Search
const search = document.querySelector("#search");

activeBooks = books;
showBooks();



// Search 
search.addEventListener("input", () => {
    if (search.value == "") {
        activeBooks = books;
        showBooks();
        return;
    };
    activeBooks = [];
    books.forEach(book => {
        if (book.contains(search.value)) activeBooks.push(book);
    });
    showBooks();
});



// Modal

// Close
modalContainer.addEventListener("click", (e) => {
    if (e.target != modalContainer) return;
    modalContainer.classList.remove("active");
    bookElements.forEach(activeBook => {
        activeBook.classList.remove("active");
    });
});

// 3D Rotation
modalContainer.addEventListener("mousemove", (e) => {
    var strength = 8;
    var rect = modal.getBoundingClientRect()
    var x = ((e.clientX - rect.left) * 2 / rect.width - 1) * strength
    var y = ((e.clientY - rect.top) * 2 / rect.height - 1) * -strength
    modal.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
});

// Open
function showBooks() {
    bookList.innerHTML = "";
    activeBooks.forEach(book => {
        bookList.innerHTML += book.getHTML();
    });
    bookElements = document.querySelectorAll(".book");
    
    // Add openBook function to book element click event
    bookElements.forEach(bookElement => {
        bookElement.addEventListener("click", (e) => {
            bookElements.forEach(activeBook => {
                activeBook.classList.remove("active");
            });
            
            bookElement.classList.add("active");
        
            currentBook = GetFromISBN(bookElement.id);
            modalTitle.textContent = currentBook.title;
            modalAuthor.textContent = currentBook.author;  
            modalAmount.textContent = currentBook.count;

            if (currentBook.count <= 0) {
                modalButton.classList.add("unavailable");
                modalButton.innerHTML = "Unavailable"
            } else {
                modalButton.classList.remove("unavailable");
                modalButton.innerHTML = "Borrow"
            }
            
            modalContainer.classList.add("active");
        });
    });
}

function GetFromISBN(ISBN) {
    var returnBook;
    books.forEach(book => {
        if(book.ISBN == ISBN) {
            returnBook = book; 
        }
    })
    return returnBook;
}



// Background
const canvas = document.querySelector("#background");
const ctx = canvas.getContext("2d");
let mouse = {x: 0, y: 0};
let particles;

function distSqr(x1, y1, x2, y2) {
    return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)
}

class Particle {
    x;
    y;
    opacity;
    fade;
    increase = true;
    xVel;
    yVel;

    constructor(x, y, opacity, fade, xVel, yVel) {
        this.x = x;
        this.y = y;
        this.opacity = opacity;
        this.fade = fade;
        this.xVel = xVel;
        this.yVel = yVel;
    }

    update(dt) {
        if (this.increase) this.opacity += dt * this.fade; 
        else this.opacity -= dt * this.fade; 
        if (this.opacity >= .5) { this.opacity = .5; this.increase = false; }
        else if (this.opacity <= 0) { this.opacity = 0; this.increase = true; }

        this.x += this.xVel * dt;
        if (this.x < 0) this.x += canvas.width + 1
        if (this.x > canvas.width) this.x -= canvas.width + 1
        this.y += this.yVel * dt;
        if (this.y < 0) this.y += canvas.height + 1
        if (this.y > canvas.height) this.y -= canvas.height + 1
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1.5, 0, 2 * Math.PI);
        let dist = distSqr(this.x, this.y, mouse.x, mouse.y);
        ctx.globalAlpha = this.opacity + (1 / (dist / 10000));
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

let last;

function draw(time) {
    if (time === undefined) time = 0;
    if (last === undefined || last > time) last = time;
    const dt = (time - last) / 1000;
    last = time;

    particles.forEach(particle => {
        particle.update(dt);
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
        particle.draw();
    });

    requestAnimationFrame(draw);
}

window.addEventListener("mousemove", (e) => {
    mouse = {x: e.clientX, y: e.clientY}
})

window.addEventListener("resize", init);

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = "#fff";
    
    particles = [];
    
    for (let i = 0; i < 1000; i++) {
        particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height, Math.random(), Math.random() * .5 + .2, Math.random() * 3 + 5, Math.random() * 3 + 1))
    }
}

init();
draw();