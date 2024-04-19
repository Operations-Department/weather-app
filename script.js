const searchbox = document.getElementById('searchbox');
const area = document.getElementById('area');
const time = document.getElementById('time');
const condition = document.getElementById('condition');
const conditionIconElement = document.getElementById('condition-icon');
const temp = document.getElementById('temp');


async function getWeather(country) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=b04164c4e2604ea99d424433241104&q=` + country + `&days=3&aqi=yes&alerts=no
        `, {mode: 'cors'});
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Something terrible happened here', error);
        return null;
    }
};

function updateDOM(data) {
    if (data) {

        const city = data.location.name;
        const region = data.location.region;
        const country = data.location.country;

        const localtime = data.current.last_updated;

        const conditionText = data.current.condition.text;
        const conditionIcon = data.current.condition.icon;

        const tempF = data.current.temp_f;
        const tempC = data.current.temp_c;

        area.textContent = `${city}, ${region}, ${country}`;
        time.textContent = localtime;
        condition.textContent = conditionText;
        conditionIconElement.src = `https:${conditionIcon}`;
        temp.textContent = `${tempF}°F / ${tempC}°C`;

    } else {
        console.log('No data available');
    }
}

window.onload = getWeather('tashkent').then(updateDOM);

searchbox.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        let searchedCountry = searchbox.value;
        getWeather(searchedCountry).then(updateDOM);
    }
});