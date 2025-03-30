
// Mobile device detection
if (window.innerWidth < 500) {
    document.addEventListener("DOMContentLoaded", function() {
        const blockDiv = document.createElement("div");
        blockDiv.id = "mobile-block";
        blockDiv.innerHTML = `
            <i class="fas fa-mobile-alt"></i>
            <h2>Enhanced Desktop Experience</h2>
            <p>For the best experience with Climate 25, please access this website from a desktop or tablet device. Our advanced weather visualization tools require a larger display.</p>
            <p>Thank you for your understanding.</p>
            <p><small>- Keerti Krishna Sreenivas S</small></p>
        `;
        document.body.appendChild(blockDiv);
        document.body.classList.add("blocked");
    });
}

// Weather App Functionality
document.addEventListener('DOMContentLoaded', function() {
    const API_KEY = '2f0ad3953411bdfb6c2964fa864b71d0';
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const weatherResult = document.getElementById('weather-result');
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    
    // Set current date in last updated
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('update-date').textContent = new Date().toLocaleDateString('en-US', options);
    
    // Fetch weather data from OpenWeatherMap API
    async function fetchWeather(city) {
        try {
            // Show loading state
            loading.style.display = 'block';
            weatherResult.style.display = 'none';
            errorMessage.style.display = 'none';
            
            // Validate input
            if (!city || !/^[a-zA-Z\s,]+$/.test(city)) {
                throw new Error('Please enter a valid city name');
            }
            
            // Call OpenWeatherMap API
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'City not Found');
            }
            
            const data = await response.json();
            updateWeatherUI(data);
            
        } catch (error) {
            console.error('Error fetching weather data:', error);
            loading.style.display = 'none';
            errorMessage.style.display = 'block';
            document.getElementById('error-text').textContent = error.message || 'Failed to fetch weather data. Please try again later.';
        }
    }
    
    // Update UI with weather data
    function updateWeatherUI(data) {
        const { name, sys, main, weather, wind, clouds, visibility, dt } = data;
        
        // Convert timestamp to local date/time
        const date = new Date(dt * 1000);
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        const dateTimeString = date.toLocaleString('en-US', options);
        
        // Update all weather elements
        document.getElementById('location').textContent = `${name}, ${sys.country}`;
        document.getElementById('date-time').textContent = dateTimeString;
        document.getElementById('temperature').textContent = `${Math.round(main.temp)}°C`;
        document.getElementById('description').textContent = weather[0].description;
        document.getElementById('feels-like').textContent = `${Math.round(main.feels_like)}°C`;
        document.getElementById('humidity').textContent = `${main.humidity}%`;
        document.getElementById('wind-speed').textContent = `${(wind.speed * 3.6).toFixed(1)} km/h`;
        document.getElementById('pressure').textContent = `${main.pressure} hPa`;
        document.getElementById('visibility').textContent = visibility ? `${(visibility/1000).toFixed(1)} km` : 'N/A';
        document.getElementById('cloud-cover').textContent = `${clouds.all}%`;
        
        // Update weather icon
        const iconCode = weather[0].icon;
        document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        document.getElementById('weather-icon').alt = weather[0].description;
        
        // Show weather result
        loading.style.display = 'none';
        weatherResult.style.display = 'block';
    }
    
    // Event listeners
    searchButton.addEventListener('click', function(e) {
        e.preventDefault();
        const city = searchInput.value.trim();
        if (city) {
            fetchWeather(city);
        } else {
            errorMessage.style.display = 'block';
            document.getElementById('error-text').textContent = 'Please enter a city name';
        }
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const city = searchInput.value.trim();
            if (city) {
                fetchWeather(city);
            } else {
                errorMessage.style.display = 'block';
                document.getElementById('error-text').textContent = 'Please enter a city name';
            }
        }
    });
    
    // Fetch weather for default location on initial load
    fetchWeather('Bangalore');
});
