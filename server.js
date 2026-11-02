import http from 'http';

const port = 3000;

const books = [
    {
        id: 1,
        title: "Java Programming",
        author: "Hibert Schidt",
        category: "Programming",
        quantity: 5,
        available: 5
        
    },
    {
        id: 2,
        title: "MASTER OF PHYSICS",
        author: "HC VERMA",
        category: "science",
        quantity: 3,
        available: 3
    },
     {
        id: 3,
        title: "Atomic Habits",
        author: "James Clear",
        category: "Self Help",
        quantity: 4,
        available: 4
    }

   
];

const server = http.createServer((req, res) => {

    const url = req.url;
    const method = req.method;


    if (url === "/api/books" && method === "GET") {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(books));
    }
    else if (url.startsWith("/api/books/") && method === "GET") {
        const id = url.split("/")[3];
        const book = books.find((b) => b.id == id);
        if (!book) {
            res.statusCode = 404;
            return res.end("Book not found");
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(book));
    }
    else if (url === "/api/books" && method === "POST") {
        let body = "";
        req.on("data", (content) => {
            body += content;
        });
        req.on("end", () => {
            const newBook = JSON.parse(body);
            if (!newBook.title || !newBook.author ||
                !newBook.category || !newBook.quantity) {
                res.statusCode = 400;
                return res.end("All fields are required");
            }
            if (newBook.quantity <= 0) {

                res.statusCode = 400;
                return res.end("Quantity must be greater than 0");
            }
            newBook.id = books.length + 1;
            newBook.available = newBook.quantity;
            books.push(newBook);
            res.statusCode = 201;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({
                message: "Book added successfully",
                book: newBook
            }));
        });
    }

    else if (url.startsWith("/api/books/") && method === "PUT") {
        const id = url.split("/")[3];
        const index = books.findIndex((b) => b.id == id);
        if (index == -1) {
            res.statusCode = 404;
            return res.end("Book not found");
        }
        let body = "";
        req.on("data", (content) => {
            body += content;
        });
        req.on("end", () => {

            const updatedBook = JSON.parse(body);
            if (updatedBook.id && updatedBook.id != id) {

                res.statusCode = 400;
                return res.end("Book ID cannot be changed");
            }
            if (!updatedBook.title || !updatedBook.author ||
                !updatedBook.category || !updatedBook.quantity) {
                res.statusCode = 400;
                return res.end("All fields are required");
            }
            if (updatedBook.quantity <= 0) {
                res.statusCode = 400;
                return res.end("Quantity must be greater than 0");
            }
            books[index] = {
                id: books[index].id,
                title: updatedBook.title,
                author: updatedBook.author,
                category: updatedBook.category,
                quantity: updatedBook.quantity,
                available: updatedBook.quantity
            };
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({
                message: "Book updated successfully",
                book: books[index]
            }));
        });
    }
    else if (url.startsWith("/api/books/") && method === "DELETE") {
        const id = url.split("/")[3];
        const index = books.findIndex((b) => b.id == id);
        if (index == -1) {
            res.statusCode = 404;
            return res.end("Book not found");
        }
        books.splice(index, 1);
        res.statusCode = 200;
        res.end("Book deleted successfully");
    }
    else if (url.startsWith("/api/search") && method === "GET") {
        const value = url.split("=")[1];
        if (!value) {
            res.statusCode = 400;
            return res.end("Search value is required");
        }
        const result = books.filter((b) =>
            b.title.toLowerCase().includes(value.toLowerCase()) ||
            b.author.toLowerCase().includes(value.toLowerCase()) ||
            b.category.toLowerCase().includes(value.toLowerCase())
        );
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(result));
    }



    else if (url.endsWith("/issue") && method === "POST") {
        const id = url.split("/")[3];
        const book = books.find((b) => b.id == id);
        if (!book) {
            res.statusCode = 404;
            return res.end("Book not found");
        }
        if (book.available <= 0) {
            res.statusCode = 400;
            return res.end("Book not available");
        }
        book.available--;
        res.statusCode = 200;
        res.end("Book issued successfully");
    }
    else if (url.endsWith("/return") && method === "POST") {
        const id = url.split("/")[3];
        const book = books.find((b) => b.id == id);
        if (!book) {
            res.statusCode = 404;
            return res.end("Book not found");
        }
        if (book.available >= book.quantity) {
            res.statusCode = 400;
            return res.end("All books are already returned");
        }
        book.available++;
        res.statusCode = 200;
        res.end("Book returned successfully");
    }


    

});


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});