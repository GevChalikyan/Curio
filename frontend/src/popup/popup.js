const API_BASE_URL = "https://api-connection-pdoi.onrender.com"

// DOM Elements
const loginForm = document.getElementById('loginFormElement');
const welcomeMessage = document.getElementById('welcomeMessage');
const loginContainer = document.getElementById('loginForm');
const usernameDisplay = document.getElementById('usernameDisplay');
const logoutButton = document.getElementById('logoutButton');
const errorMessage = document.createElement('div');
errorMessage.className = 'error-message';
loginContainer.appendChild(errorMessage);

// Check if user is already logged in
function checkAuthStatus() {
  chrome.storage.local.get(['jwtToken', 'username'], function(result) {
    if (result.jwtToken && result.username) {
      showWelcomeMessage(result.username);
    } else {
      showLoginForm();
    }
  });
}

// Show login form
function showLoginForm() {
  loginContainer.style.display = 'block';
  welcomeMessage.style.display = 'none';
  errorMessage.style.display = 'none';
  document.getElementById('loginFormElement').reset();
}

// Show welcome message
function showWelcomeMessage(username) {
  loginContainer.style.display = 'none';
  welcomeMessage.style.display = 'block';
  usernameDisplay.textContent = username;
}

// Set loading state
function setLoading(isLoading) {
  const submitButton = document.querySelector('.login-button');
  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading ? 'Signing in...' : 'Sign In';
}

// Handle login form submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Basic validation
  if (!username || !password) {
    errorMessage.textContent = 'Please enter both username and password';
    errorMessage.style.display = 'block';
    return;
  }

  setLoading(true);
  errorMessage.style.display = 'none';

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || 'Login failed');
    }
    
    // Store JWT token and username
    chrome.storage.local.set({
      jwtToken: responseData.token,
      username: responseData.user.username
    }, function() {
      showWelcomeMessage(responseData.user.username);
    });

  } catch (error) {
    console.error('Login error:', error);
    errorMessage.textContent = error.message;
    errorMessage.style.display = 'block';
  } finally {
    setLoading(false);
  }
});

// Handle logout
logoutButton.addEventListener('click', () => {
  chrome.storage.local.remove(['jwtToken', 'username'], function() {
    showLoginForm();
  });
});

// Initialize the popup
document.addEventListener('DOMContentLoaded', checkAuthStatus);