const API_KEY = '2f0ad3953411bdfb6c2964fa864b71d0';
//  I Keerti Krishna Sreenivas S is giving the API credit to Open Weather org

document.getElementById('search-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const city = document.getElementById('search-input').value;
    const weatherResult = document.getElementById('weather-result');

    if (!city) {
        weatherResult.innerHTML = '<p>Please enter a city name.</p>';
        return;
    }

    // Keerti Krishna Sreenivas S
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        const { name, main, weather } = data;

   
        weatherResult.innerHTML = `
            <h2>Weather in ${name}</h2>
            <p><strong>Temperature:</strong> ${main.temp}°C</p>
            <p><strong>Feels Like:</strong> ${main.feels_like}°C</p>
            <p><strong>Weather:</strong> ${weather[0].description}</p>
            <p><strong>Humidity:</strong> ${main.humidity}%</p>
        `;
    } catch (error) {
        weatherResult.innerHTML = `<p>${error.message}</p>`;
    }
});
