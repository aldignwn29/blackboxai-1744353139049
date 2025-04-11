// Product database (in real application, this would come from a backend)
const products = [
    {
        id: 1,
        name: "Handball Spezial Shoes",
        category: "Pria Originals",
        price: 1700000,
        image: "https://www.adidas.co.id/media/catalog/product/cache/da73f7d26ad11f1980ada40c1f6e78fa/i/e/ie3402_2_footwear_photography_side20lateral20view_grey.jpg",
        tags: ["shoes", "handball", "originals", "pria"]
    },
    {
        id: 2,
        name: "Samba OG Shoes",
        category: "Pria Originals",
        price: 2000000,
        image: "https://www.adidas.co.id/media/catalog/product/cache/da73f7d26ad11f1980ada40c1f6e78fa/i/f/if9531_2_footwear_photography_side20lateral20view_grey.jpg",
        tags: ["shoes", "samba", "originals", "pria"]
    },
    {
        id: 3,
        name: "Gazelle Real Madrid",
        category: "Pria Sepak Bola",
        price: 1700000,
        image: "https://www.adidas.co.id/media/catalog/product/cache/da73f7d26ad11f1980ada40c1f6e78fa/j/s/js3041_1_footwear_photography_side20lateral20center20view_grey.jpg",
        tags: ["shoes", "gazelle", "real madrid", "sepak bola", "pria"]
    },
    {
        id: 4,
        name: "Gazelle Arsenal",
        category: "Pria Sepak Bola",
        price: 1700000,
        image: "https://www.adidas.co.id/media/catalog/product/cache/da73f7d26ad11f1980ada40c1f6e78fa/j/s/js3042_1_footwear_photography_side20lateral20center20view_grey.jpg",
        tags: ["shoes", "gazelle", "arsenal", "sepak bola", "pria"]
    }
];

// Search functionality
function searchProducts(query) {
    query = query.toLowerCase();
    return products.filter(product => {
        return product.name.toLowerCase().includes(query) ||
               product.category.toLowerCase().includes(query) ||
               product.tags.some(tag => tag.toLowerCase().includes(query));
    });
}

// Render search results
function renderSearchResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="text-center py-8">
                <p class="text-gray-500">Tidak ada produk yang ditemukan</p>
            </div>
        `;
        return;
    }

    results.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'bg-white p-4 rounded-lg shadow group';
        productCard.innerHTML = `
            <a href="/product-detail.html?id=${product.id}" class="block">
                <div class="relative overflow-hidden mb-4">
                    <img src="${product.image}" 
                         alt="${product.name}" 
                         class="w-full h-48 object-cover transform group-hover:scale-105 transition duration-500">
                </div>
                <div class="text-sm text-gray-600 mb-1">${product.category}</div>
                <h3 class="font-medium mb-2">${product.name}</h3>
                <div class="text-lg font-bold">Rp. ${product.price.toLocaleString()}</div>
            </a>
        `;
        resultsContainer.appendChild(productCard);
    });
}

// Initialize search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('input[type="text"]');
    const searchForm = document.querySelector('form.search-form');
    
    if (searchInput && searchForm) {
        let debounceTimeout;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                const results = searchProducts(e.target.value);
                renderSearchResults(results);
            }, 300);
        });

        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const results = searchProducts(searchInput.value);
            renderSearchResults(results);
        });
    }
});

// Export for use in other files
window.searchProducts = searchProducts;
window.renderSearchResults = renderSearchResults;
