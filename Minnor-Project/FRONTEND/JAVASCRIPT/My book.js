const backendURL = "https://bookweb-backend-vu2o.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    fetchMyBooks();
    
    // Existing menu toggle logic
    const menuToggle = document.getElementById("menu-toggle");
    if (menuToggle) {
        menuToggle.onclick = () => {
            const menuList = document.getElementById("menu-list");
            if (menuList) menuList.classList.toggle("show");
        };
    }
});

async function fetchMyBooks() {
    const container = document.getElementById("myBooksContainer");
    const userData = localStorage.getItem("user");
    
    if (!userData) {
        container.innerHTML = `<p style="text-align: center; width: 100%; color: red; padding: 20px;">Please <a href="./login.html" style="color: #6363f1; text-decoration: underline;">Login</a> to see your uploaded books.</p>`;
        return;
    }

    const user = JSON.parse(userData);
    const mobile = user.mobileno;

    if (!mobile) {
        container.innerHTML = `<p style="text-align: center; width: 100%; color: red; padding: 20px;">User mobile number not found. Please log in again.</p>`;
        return;
    }

    try {
        const res = await fetch(`${backendURL}/my-books?mobile=${mobile}`);
        const books = await res.json();

        if (!res.ok) throw new Error(books.message || "Failed to fetch");

        if (books.length === 0) {
            container.innerHTML = `<p style="text-align: center; width: 100%; color: #666; padding: 20px;">You haven't uploaded any books yet. <a href="./upload book.html" style="color: #6363f1; text-decoration: underline;">Upload now</a></p>`;
            return;
        }

        container.innerHTML = books.map(book => `
            <div class="book-card">
                <img src="${book.image || '../IMAGES/maths.jpg'}" alt="${book.bookname}">
                <h3 class="b-name">${book.bookname}</h3>
                <p class="b-author" hidden>${book.bookauthor || 'N/A'}</p>
                <p class="b-publication" hidden>${book.bookpublication || 'N/A'}</p>
                <p class="b-language" hidden>${book.booklanguage || 'N/A'}</p>
                <p class="b-volume" hidden>${book.bookvolume || 'N/A'}</p>
                <p class="b-class" hidden>${book.bookclass || 'N/A'}</p>
                <p class="b-price" hidden>${book.bookprice || '0'}</p>
                <button class="btn" onclick="showBookDetails(this)">Book Details</button>
            </div>
        `).join("");

    } catch (err) {
        console.error("Error fetching books:", err);
        container.innerHTML = `<p style="text-align: center; width: 100%; color: red; padding: 20px;">Error loading books: ${err.message}</p>`;
    }
}

window.showBookDetails = function(btn) {
    let card = btn.parentElement;

    document.getElementById("p_name").innerText = card.querySelector(".b-name").innerText;
    document.getElementById("p_author").innerText = card.querySelector(".b-author").innerText;
    document.getElementById("p_publication").innerText = card.querySelector(".b-publication").innerText;
    document.getElementById("p_language").innerText = card.querySelector(".b-language").innerText;
    document.getElementById("p_volume").innerText = card.querySelector(".b-volume").innerText;
    document.getElementById("p_class").innerText = card.querySelector(".b-class").innerText;
    document.getElementById("p_price").innerText = card.querySelector(".b-price").innerText;

    document.getElementById("popup").style.display = "block";
};

window.closePopup = function() {
    document.getElementById("popup").style.display = "none";
};
