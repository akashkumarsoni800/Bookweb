document.addEventListener("DOMContentLoaded", () => {
    initNavbar();
});

async function initNavbar() {
    const userData = localStorage.getItem("user");
    const profileIconArea = document.getElementById("profileArea");
    const profilePopup = document.getElementById("profilePopup");
    const currentPath = window.location.pathname;
    const isHomePage = currentPath.endsWith("index.html") || currentPath === "/";

    // --- Profile Initialization ---
    if (userData) {
        const user = JSON.parse(userData);
        const name = user.name || "User";
        const firstLetter = name.charAt(0).toUpperCase();

        // Show Profile Circle
        profileIconArea.innerHTML = `<div class="profile-circle">${firstLetter}</div>`;
        
        // Fill Popup Data
        document.getElementById("popupName").innerText = name;
        document.getElementById("popupEmail").innerText = user.email || user.mobile || "";

        // Toggle Popup
        profileIconArea.addEventListener("click", (e) => {
            e.stopPropagation();
            profilePopup.classList.toggle("show");
        });
    } else {
        // Show default icon and redirect to home.html on click
        profileIconArea.innerHTML = `<i class="fa-solid fa-circle-user"></i>`;
        profileIconArea.addEventListener("click", () => {
            // Find relative path for login/home
            const pathPrefix = isHomePage ? "./HTML/" : "./";
            window.location.href = pathPrefix + "home.html";
        });
    }

    // Close popup on outside click
    document.addEventListener("click", (e) => {
        if (profilePopup && !profilePopup.contains(e.target) && e.target !== profileIconArea) {
            profilePopup.classList.remove("show");
        }
    });

    // --- Search Logic ---
    const searchInput = document.getElementById("searchInput");
    const searchCategory = document.getElementById("searchCategory");
    const searchBtn = document.getElementById("searchBtn");
    const suggestionsBox = document.getElementById("search-suggestions");

    // Load books for suggestions if on non-home page
    let allBooks = window.allBooks || [];
    if (!isHomePage && allBooks.length === 0) {
        try {
            const res = await fetch("https://bookweb-backend-vu2o.onrender.com/books");
            allBooks = await res.json();
        } catch (e) { console.error("Could not load books for suggestions", e); }
    }

    function performSearch() {
        const text = searchInput.value.toLowerCase();
        const cat = searchCategory.value.toLowerCase();

        if (isHomePage && typeof window.renderBooks === "function") {
            // Homepage: Dynamic Filter
             const filtered = allBooks.filter(book => {
                const bName = (book.bookname || "").toLowerCase();
                const bAuthor = (book.bookauthor || "").toLowerCase();
                const bClass = (book.bookclass || "").toLowerCase();
                const matchesText = bName.includes(text) || bAuthor.includes(text);
                const matchesCat = cat === "all" || bClass.includes(cat);
                return matchesText && matchesCat;
            });
            window.renderBooks(filtered);
        } else {
            // Other Pages: Redirect to Home with Query
            const homeUrl = isHomePage ? "index.html" : "../index.html";
            window.location.href = `${homeUrl}?q=${encodeURIComponent(text)}&cat=${encodeURIComponent(cat)}`;
        }
        if (suggestionsBox) suggestionsBox.style.display = "none";
    }

    if (searchBtn) searchBtn.addEventListener("click", performSearch);
    if (searchCategory) searchCategory.addEventListener("change", performSearch);
    if (searchInput) {
        searchInput.addEventListener("keypress", (e) => { if (e.key === "Enter") performSearch(); });
        searchInput.addEventListener("input", () => {
             const text = searchInput.value.toLowerCase();
             if (text === "") { suggestionsBox.style.display = "none"; return; }
             
             const matches = allBooks.filter(b => (b.bookname || "").toLowerCase().includes(text)).slice(0, 5);
             if (matches.length > 0) {
                 suggestionsBox.innerHTML = matches.map(b => `<div class="suggestion-item"><span>${b.bookname}</span><i class="fa-solid fa-book"></i></div>`).join("");
                 suggestionsBox.style.display = "block";
                 // Handle click on suggestions
                 suggestionsBox.querySelectorAll(".suggestion-item").forEach((item, idx) => {
                     item.addEventListener("click", () => {
                         searchInput.value = matches[idx].bookname;
                         performSearch();
                     });
                 });
             } else { suggestionsBox.style.display = "none"; }
        });
    }

    // Navbar Toggle (Mobile)
    const menuToggle = document.getElementById("menu-toggle");
    const menuList = document.getElementById("menu-list");
    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            menuList.classList.toggle("show");
        });
    }

    // Handle incoming search query from other pages
    if (isHomePage) {
        const params = new URLSearchParams(window.location.search);
        const q = params.get("q");
        const c = params.get("cat");
        if (q || c) {
            if (searchInput) searchInput.value = q || "";
            if (searchCategory) searchCategory.value = c || "all";
            // Wait for books to load then filter
            const checkBooks = setInterval(() => {
                if (window.allBooks && window.allBooks.length > 0) {
                    performSearch();
                    clearInterval(checkBooks);
                }
            }, 100);
        }
    }
}

// Global Category Setter (for homepage boxes)
window.setCategory = function(cat) {
    const searchCategory = document.getElementById("searchCategory");
    const searchInput = document.getElementById("searchInput");
    if (searchCategory) searchCategory.value = cat.toLowerCase();
    if (searchInput) searchInput.value = "";
    
    // Trigger search
    const searchBtn = document.getElementById("searchBtn");
    if (searchBtn) searchBtn.click();
};

window.logoutUser = function() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("user");
        alert("✅ Logged out successfully!");
        const currentPath = window.location.pathname;
        const isHomePage = currentPath.endsWith("index.html") || currentPath === "/";
        window.location.href = isHomePage ? "./index.html" : "../index.html";
    }
};

window.editProfile = function() {
    const currentPath = window.location.pathname;
    const isHomePage = currentPath.endsWith("index.html") || currentPath === "/";
    const pathPrefix = isHomePage ? "./HTML/" : "./";
    window.location.href = pathPrefix + "profile.html";
};
