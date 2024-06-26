const searchBox = document.getElementById('searchbox');
const area = document.getElementById('area');
const time = document.getElementById('time');
const condition = document.getElementById('condition');
const conditionIconElement = document.getElementById('condition-icon');
const temp = document.getElementById('temp');
const dayHigh = document.getElementById('day-high');
const dayLow = document.getElementById('day-low');
const uv = document.getElementById('uv');
const feels = document.getElementById('feels');
const precip = document.getElementById('precip');
const humid = document.getElementById('humid');
const wind = document.getElementById('wind');
const dailyForecastContainer = document.querySelector('.daily-tile-container');
const hourlyForecastContainer = document.querySelector('.hourly-container');
const degreeButton = document.querySelector('.degrees');
const buttonSwitch = document.querySelector('.button-switch');


let weatherData;

let degreeFahrenheit = true;

async function getWeather(country) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=b04164c4e2604ea99d424433241104&q=` 
        + country + `&days=3&aqi=yes&alerts=no`, {mode: 'cors'});
        const data = await response.json();
        weatherData = data;
        return data;
    } catch (error) {
        alert('Something terrible happened here', error);
        return null;
    }
};

window.onload = getWeather('Vancouver').then(updateDOM);

degreeButton.addEventListener('click', function() {
    buttonSwitch.textContent = '';

    if (degreeButton.classList.contains('button-before-click')) {
        degreeButton.classList.remove('button-before-click');
        degreeButton.classList.add('button-after-click');
        buttonSwitch.textContent = '°c';
        degreeFahrenheit = false;
        updateDOM(weatherData);
    } else {
        degreeButton.classList.remove('button-after-click');
        degreeButton.classList.add('button-before-click');
        buttonSwitch.textContent = '°f';
        degreeFahrenheit = true;
        updateDOM(weatherData);
    }
});

searchBox.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        let searchedCountry = searchBox.value;
        getWeather(searchedCountry).then(updateDOM);
    }
});

function getDay() {
    const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const currentDay = new Date().getDay();

    const today = week[currentDay];
    const tomorrow = week[(currentDay + 1) % 7];
    const nextDay = week[(currentDay + 2) % 7]

    return { today, tomorrow, nextDay };
}

function updateDOM(data) {

    const { today } = getDay();

    if (data) {

        // top section - current weather info

        const city = data.location.name;
        const region = data.location.region;
        const country = data.location.country;

        const localtime = data.current.last_updated;

        const conditionText = data.current.condition.text;
        const conditionIcon = data.current.condition.icon;
        const tempF = data.current.temp_f;
        const tempC = data.current.temp_c;
        const maxTempF = data.forecast.forecastday[0].day.maxtemp_f;
        const maxTempC = data.forecast.forecastday[0].day.maxtemp_c;
        const minTempF = data.forecast.forecastday[0].day.mintemp_f;
        const minTempC = data.forecast.forecastday[0].day.mintemp_c;

        const feelsLikeC = data.current.feelslike_c;
        const feelsLikeF = data.current.feelslike_f;
        const precipitationIN = data.current.precip_in;
        const precipitationMM = data.current.precip_mm;
        const humidity = data.current.humidity;
        const windSpeedKPH = data.current.wind_kph;
        const windSpeedMPH = data.current.wind_mph;
        const uvIndex = data.current.uv;

        const [date, hour] = localtime.split(' ');
        const [year, month, day] = date.split('-');

        area.textContent = `${city}, ${region}, ${country}`;
        time.textContent = `${today}, ${month}-${day}-${year}, ${hour}`;

        condition.textContent = conditionText;
        conditionIconElement.src = `https:${conditionIcon}`;

        if (degreeFahrenheit) {
            temp.textContent = `Now: ${tempF}°f`;
            dayHigh.textContent = `High: ${maxTempF}°f`;
            dayLow.textContent = `Low: ${minTempF}°f`;
            feels.textContent = `Feels Like: ${feelsLikeF}°f`;   
        }; 

        if (!degreeFahrenheit) {
            temp.textContent = `Now: ${tempC}°c`;
            dayHigh.textContent = `High: ${maxTempC}°c`;
            dayLow.textContent = `Low: ${minTempC}°c`;
            feels.textContent = `Feels Like: ${feelsLikeC}°c`;   

        };

        precip.textContent = `Precipitation:\n${precipitationIN}in. / ${precipitationMM}mm.`;  
        humid.textContent = `Humidity:\n${humidity}%`;   
        wind.textContent = `Wind Speed:\n${windSpeedMPH}mph / ${windSpeedKPH}kph`;    
        uv.textContent = `UV Index:\n${uvIndex}`;

        //mid-section - daily forecast info

        const threeDayForecast = data.forecast.forecastday;

        update3DayForecastDOM(threeDayForecast);

        //bottom section - hourly forecast info

        const hourlyForecastToday = data.forecast.forecastday[0].hour;

        udpateHourlyForecastDOM(hourlyForecastToday);

    } else {
        alert('No data available');
    }
}

function update3DayForecastDOM (array) {

    dailyForecastContainer.textContent = '';

    const { tomorrow, nextDay } = getDay();

    let classCounter = 0;

    return array.forEach(element => {

        let dayForecastDate;

        if (classCounter === 0) dayForecastDate = 'Today';
        if (classCounter === 1) dayForecastDate = tomorrow;
        if (classCounter === 2) dayForecastDate = nextDay;

        let dayForecastImageURL = element.day.condition.icon;
        let dayAverageTempC = element.day.avgtemp_c;
        let dayAverageTempF = element.day.avgtemp_f;

        let dayForecastIcon = `https:${dayForecastImageURL}`;

        const subTileDiv = document.createElement('button');
        subTileDiv.classList.add('sub-tile');
        dailyForecastContainer.appendChild(subTileDiv);
        subTileDiv.classList.add(`forecast-day`);
        subTileDiv.classList.add(`day-${classCounter}`);
        
        classCounter++;

        const subTileHeader = document.createElement('h3');
        subTileHeader.textContent = dayForecastDate;
        subTileDiv.appendChild(subTileHeader);

        const subTileImageContainer = document.createElement('div');
        subTileImageContainer.classList.add('forecast-icon-container');
        const subTileImage = document.createElement('img');
        subTileImage.alt = 'weather-icon';
        subTileImage.src = dayForecastIcon;
        subTileDiv.appendChild(subTileImageContainer);
        subTileImageContainer.appendChild(subTileImage);

        const subTileFooter = document.createElement('h3');

        if (degreeFahrenheit) subTileFooter.textContent = `${dayAverageTempF}°f`;
        if (!degreeFahrenheit) subTileFooter.textContent = `${dayAverageTempC}°c`;
        
        subTileDiv.appendChild(subTileFooter);
    });
};

function udpateHourlyForecastDOM(array) {      

    hourlyForecastContainer.textContent = '';

    return array.forEach((element) => {
        let [date, hour] = element.time.split(' ');
        let tempF = element.temp_f;
        let tempC = element.temp_c;
        let iconURL = element.condition.icon;
        let icon = `https:${iconURL}`;

        const subTileDiv = document.createElement('div');
        subTileDiv.classList.add('sub-tile');
        hourlyForecastContainer.appendChild(subTileDiv); 

        const subTileHeader = document.createElement('h3');
        subTileHeader.textContent = hour;
        subTileDiv.appendChild(subTileHeader);

        const subTileBody = document.createElement('h3');

        if (degreeFahrenheit) subTileBody.textContent = `${tempF}°f`;
        if (!degreeFahrenheit) subTileBody.textContent = `${tempC}°c`;

        subTileDiv.appendChild(subTileBody);

        const subTileImageContainer = document.createElement('div');
        subTileImageContainer.classList.add('forecast-icon-container');
        const subTileImage = document.createElement('img');
        subTileImage.alt = 'weather-icon';
        subTileImage.src = icon;
        subTileDiv.appendChild(subTileImageContainer);
        subTileImageContainer.appendChild(subTileImage);
    });
};

dailyForecastContainer.addEventListener('click', (e) => {

    const hourlyForecastToday = weatherData.forecast.forecastday[0].hour;
    const hourlyForecastTomorrow = weatherData.forecast.forecastday[1].hour;
    const hourlyForecastLast = weatherData.forecast.forecastday[2].hour;

    if (e.target.closest('.forecast-day')) {
        
        if (e.target.closest('.day-0')) udpateHourlyForecastDOM(hourlyForecastToday);
        if (e.target.closest('.day-1')) udpateHourlyForecastDOM(hourlyForecastTomorrow);
        if (e.target.closest('.day-2')) udpateHourlyForecastDOM(hourlyForecastLast);
        return;
    }
});