// Reviews database (in a real application, this would be stored in a backend database)
const reviews = {
    1: [ // Product ID 1 (Handball Spezial Shoes)
        {
            id: 1,
            username: "John D.",
            rating: 5,
            title: "Sepatu yang sangat nyaman",
            review: "Saya sangat puas dengan pembelian ini. Sepatu ini sangat nyaman dipakai dan kualitasnya bagus.",
            date: "2024-04-10",
            verified: true
        },
        {
            id: 2,
            username: "Sarah M.",
            rating: 4,
            title: "Desain klasik yang bagus",
            review: "Desainnya sangat klasik dan cocok untuk berbagai kesempatan. Ukurannya sedikit besar.",
            date: "2024-04-09",
            verified: true
        }
    ]
};

// Review functionality
class ReviewSystem {
    constructor() {
        this.reviews = reviews;
    }

    // Get reviews for a product
    getReviews(productId) {
        return this.reviews[productId] || [];
    }

    // Add a new review
    addReview(productId, review) {
        if (!this.reviews[productId]) {
            this.reviews[productId] = [];
        }
        
        const newReview = {
            id: this.reviews[productId].length + 1,
            ...review,
            date: new Date().toISOString().split('T')[0],
            verified: true
        };
        
        this.reviews[productId].unshift(newReview);
        this.renderReviews(productId);
    }

    // Calculate average rating
    getAverageRating(productId) {
        const productReviews = this.reviews[productId] || [];
        if (productReviews.length === 0) return 0;
        
        const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / productReviews.length).toFixed(1);
    }

    // Render stars
    renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star text-yellow-400"></i>';
            } else {
                stars += '<i class="far fa-star text-yellow-400"></i>';
            }
        }
        return stars;
    }

    // Render reviews
    renderReviews(productId) {
        const reviewsContainer = document.getElementById('productReviews');
        if (!reviewsContainer) return;

        const productReviews = this.getReviews(productId);
        const averageRating = this.getAverageRating(productId);

        // Update average rating display
        const ratingDisplay = document.getElementById('averageRating');
        if (ratingDisplay) {
            ratingDisplay.innerHTML = `
                <div class="flex items-center mb-2">
                    <div class="text-3xl font-bold mr-2">${averageRating}</div>
                    <div class="flex">
                        ${this.renderStars(Math.round(averageRating))}
                    </div>
                </div>
                <div class="text-sm text-gray-600">${productReviews.length} reviews</div>
            `;
        }

        // Update reviews list
        reviewsContainer.innerHTML = productReviews.map(review => `
            <div class="border-b py-6">
                <div class="flex items-center justify-between mb-2">
                    <div>
                        <div class="flex items-center">
                            ${this.renderStars(review.rating)}
                        </div>
                        <div class="font-bold mt-2">${review.title}</div>
                    </div>
                    <div class="text-sm text-gray-500">${review.date}</div>
                </div>
                <p class="text-gray-600 mb-2">${review.review}</p>
                <div class="flex items-center text-sm">
                    <span class="text-gray-500">${review.username}</span>
                    ${review.verified ? `
                        <span class="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            <i class="fas fa-check-circle mr-1"></i>Verified Purchase
                        </span>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    // Initialize review form
    initReviewForm(productId) {
        const form = document.getElementById('reviewForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const review = {
                username: document.getElementById('reviewName').value,
                rating: parseInt(document.querySelector('input[name="rating"]:checked').value),
                title: document.getElementById('reviewTitle').value,
                review: document.getElementById('reviewText').value
            };

            this.addReview(productId, review);
            form.reset();
        });
    }
}

// Initialize review system
document.addEventListener('DOMContentLoaded', function() {
    const reviewSystem = new ReviewSystem();
    
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id')) || 1;

    // Initialize reviews if we're on a product page
    if (document.getElementById('productReviews')) {
        reviewSystem.renderReviews(productId);
        reviewSystem.initReviewForm(productId);
    }
});

// Export for use in other files
window.ReviewSystem = ReviewSystem;
