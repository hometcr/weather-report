import 'regenerator-runtime/runtime';
import axios from 'axios';


const currentState = {
    city: "Herndon",
    latitude: 38.9696,
    longitude: 77.3861,
    temp: 50,
    weather: "sunny"
}


////////// API calls //////////
const getWeatherFromCity = () => {
    axios
        .get(`https://caitlyns-weather-report.herokuapp.com/location`, {
            params: {
                q: currentState.city
            },
        })
        .then((response) => {
            currentState.latitude = response.data[0]['lat'];
            currentState.longitude = response.data[0]['lon'];
            console.log(`getting weather for ${currentState.city}`)
            // call the other api
            getWeatherFromCoords();

        })
        .catch((error) => {
            console.log(`error getting coords from ${currentState.city}`)
            console.log(error)
        });
    }


    const getWeatherFromCoords = () => {
        axios 
            .get(`https://caitlyns-weather-report.herokuapp.com/weather`, {
                params: {
                    lat: currentState.latitude,
                    lon: currentState.longitude
                }
            })
            .then((response) => {
                // get temp and update
                kelvinTemp = response.data["main"]["temp"]
                tempDegF = kelvinToDegF(kelvinTemp)
                console.log(`finding temp from ${currentState.city} as ${tempDegF}`)
                updateTemp(tempDegF);
    
                // get weather and update
                weather = response.data["weather"][0]["description"];
                currentState.weather = weather;
                updateSky(weather);
            })
            .catch((error) => {
                console.log(`error getting weather from coors for ${currentState.city}`)
            })
    }


////////// helper functions //////////
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


const kelvinToDegF = (kelvinTemp) => {
    let tempDegF = (kelvinTemp - 273.15) * (9 / 5) + 32
    return tempDegF
}


// choose which drop down option is displayed
const selectElement = (id, valueToSelect) => {    
    let element = document.getElementById(id);
    element.value = valueToSelect;
}


////////// functions to update site //////////
const updateCity = (city) => {
    city = capitalizeFirstLetter(city)
    const currentCity = document.getElementById('city');
    currentCity.textContent = city
    currentState.city = city
    getWeatherFromCity();
    updateTemp(currentState.temp);
}


const updateTemp = (temp) => {
    let currentTemp = document.getElementById('temp');
    currentState.temp = temp
    currentTemp.textContent = `${Math.floor(temp)}°`
    let tempColor = findTempColor();
    currentTemp.style.color = tempColor;
    updateLandscape(temp);
}


const findTempColor = () => {
    temp = currentState.temp;

    let color;
    if (temp < 20) {
        color = "#482e5c";  // dark purple
    } else if (temp < 40) {
        color = "#2c4485";  // dark blue
    } else if (temp < 60) {
        color = "#396344"  // dark green
    } else if (temp < 80) {
        color = "#665542"  // brown
    } else {
        color = "#824146"  // wine red
    };

    return color;
}


const raiseTemp = () => {
    let currentTemp = currentState.temp
    let newTemp = temp + 1;
    currentState.temp = newTemp
    updateTemp(newTemp)
}


const lowerTemp = () => {
    let currentTemp = currentState.temp
    let newTemp = temp - 1;
    currentState.temp = newTemp
    updateTemp(newTemp);
}


const updateSky = (weather) => {
    const currentSky = document.getElementById('sky_photo')
    if (weather.includes("snow")) {
        currentState.weather = "snowy"
        currentSky.src = "https://github.com/hometcr/weather-report/blob/deployment/assets/snowy-sky.jpg?raw=true"
        // update drop-down selection automatically
        selectElement("sky_options", "snowy");
    } else if (weather.includes("cloud")) {
        currentState.weather = "cloudy"
        currentSky.src = "https://github.com/hometcr/weather-report/blob/deployment/assets/cloudy-sky.jpg?raw=true"
        selectElement("sky_options", "cloudy");
    } else if (weather.includes("rain") || weather.includes("storm")) {
        currentState.weather = "rainy"
        currentSky.src = "https://github.com/hometcr/weather-report/blob/deployment/assets/stormy-sky.jpg?raw=true"
        selectElement("sky_options", "rainy");
    } else {
        currentState.weather = "sunny"
        currentSky.src = "https://github.com/hometcr/weather-report/blob/deployment/assets/sunny-sky.jpg?raw=true"
        selectElement("sky_options", "sunny");
    }
}


const updateLandscape = (temp) => {
    const currentLandscape = document.getElementById('landscape_photo');
    if (temp < 40) {
        currentLandscape.src = "https://github.com/hometcr/weather-report/blob/main/assets/snowy-landscape.jpg?raw=true"
    } else if (temp < 75) {
        currentLandscape.src = "https://github.com/hometcr/weather-report/blob/main/assets/green-landscape.jpg?raw=true"
    } else if (temp < 90) {
        currentLandscape.src = "https://github.com/hometcr/weather-report/blob/main/assets/beach-landscape.jpg?raw=true"
    } else {
        currentLandscape.src = "https://github.com/hometcr/weather-report/blob/main/assets/desert-landscape.jpg?raw=true"
    }
}


const registerEventHandlers = () => {

    // reset search bar when page is reloaded (wave 3)
    const searchBar = document.getElementById("search_bar")
    searchBar.value = ""

    // fill site based on current city (wave 2)
    const currentCity = document.getElementById('city');
    updateCity(currentCity.textContent)

    // update temp when arrow buttons are click (wave 2)
    const raiseTempButton = document.getElementById('up_arrow');
    raiseTempButton.addEventListener('click', raiseTemp)
    const lowerTempButton = document.getElementById('down_arrow');
    lowerTempButton.addEventListener('click', lowerTemp)

    // update sky when drop-down selection is changed (wave 5)
    const skyOptions = document.getElementById("sky_options")
    let changeSky;
    skyOptions.addEventListener('change', changeSky = (event) => {
        updateSky(event.target.value)
    })
    
    // update page when mag glass is clicked
    const magGlass = document.getElementById("mag_glass")
    let updatePage;
    magGlass.addEventListener('click', updatePage = () => {
        let newCity
        // if search bar is empty, reset page for current city (wave 6)
        if (searchBar.value === "") {
            newCity = currentCity.textContent
        // if search bar is full, update page for new city (wave 4)
        } else {
            newCity = searchBar.value
        }
        updateCity(newCity)
    })
};


// when site loads, run registerEventHandlers function
document.addEventListener('DOMContentLoaded', registerEventHandlers);