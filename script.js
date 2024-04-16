const searchbox = document.getElementById('searchbox');

async function getWeather(country) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=b04164c4e2604ea99d424433241104&q=` + country + `&days=3&aqi=yes&alerts=no
        `, {mode: 'cors'});
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Something terrible happened here', error);
    }
};

window.onload = getWeather('tashkent');

searchbox.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        let searchedCountry = searchbox.value;
        getWeather(searchedCountry);
    }
});