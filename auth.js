// Simulated database for users (in a real app, this would be on a server)
let users = JSON.parse(localStorage.getItem('users')) || [];

// Registration functionality
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const birthDate = document.getElementById('birthDate').value;
            const gender = document.querySelector('input[name="gender"]:checked')?.value;
            const errorMessage = document.getElementById('errorMessage');

            // Validation
            if (password !== confirmPassword) {
                showError(errorMessage, 'Password tidak cocok');
                return;
            }

            if (password.length < 8) {
                showError(errorMessage, 'Password harus minimal 8 karakter');
                return;
            }

            if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
                showError(errorMessage, 'Password harus mengandung huruf dan angka');
                return;
            }

            // Check if email already exists
            if (users.some(user => user.email === email)) {
                showError(errorMessage, 'Email sudah terdaftar');
                return;
            }

            // Create new user
            const newUser = {
                id: Date.now(),
                fullName,
                email,
                password,
                birthDate,
                gender,
                membershipLevel: 'Bronze',
                points: 100, // Initial points for signing up
                registrationDate: new Date().toISOString()
            };

            // Save user to localStorage
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Redirect to login page
            alert('Pendaftaran berhasil! Silakan login.');
            window.location.href = '/login.html';
        });
    }

    // Login functionality
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const errorMessage = document.getElementById('loginErrorMessage');

            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Find user
            const user = users.find(u => u.email === email);

            if (!user) {
                showError(errorMessage, 'Email tidak terdaftar');
                return;
            }

            if (user.password !== password) {
                showError(errorMessage, 'Password salah');
                return;
            }

            // Save logged in user
            localStorage.setItem('currentUser', JSON.stringify(user));

            // Redirect to membership page
            window.location.href = '/membership.html';
        });
    }

    // Update membership page if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && window.location.pathname === '/membership.html') {
        const welcomeMessage = document.getElementById('welcomeMessage');
        const membershipLevel = document.getElementById('membershipLevel');
        const memberPoints = document.getElementById('memberPoints');
        
        if (welcomeMessage) {
            welcomeMessage.textContent = `Selamat datang, ${currentUser.fullName}!`;
        }
        if (membershipLevel) {
            membershipLevel.textContent = currentUser.membershipLevel;
        }
        if (memberPoints) {
            memberPoints.textContent = currentUser.points;
        }

        // Update progress bar based on points
        const progressBar = document.querySelector('.bg-white');
        if (progressBar) {
            const pointsToSilver = 1000;
            const progress = (currentUser.points / pointsToSilver) * 100;
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }
    }
});

// Helper function to show error messages
function showError(element, message) {
    if (element) {
        element.textContent = message;
        element.classList.remove('hidden');
        setTimeout(() => {
            element.classList.add('hidden');
        }, 3000);
    }
}

// Check if user is logged in
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    const isLoginPage = window.location.pathname === '/login.html';
    const isRegisterPage = window.location.pathname === '/register.html';

    // If on membership page and not logged in, redirect to login
    if (!currentUser && window.location.pathname === '/membership.html') {
        window.location.href = '/login.html';
        return;
    }

    // If logged in and trying to access login/register page, redirect to membership
    if (currentUser && (isLoginPage || isRegisterPage)) {
        window.location.href = '/membership.html';
        return;
    }
}

// Logout functionality
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '/login.html';
}

// Initialize auth checks
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
});

// Export for use in other files
window.auth = {
    logout,
    checkAuth
};
