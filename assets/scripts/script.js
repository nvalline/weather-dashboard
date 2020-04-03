let searchLocations = [];

const APIKey = '166a433c57516f51dfab1f7edaed8413';

init();

// Click event for search button
$('#search-btn').on('click', newSearch)
// Click event on search history
$('#search-history-ul').on('click', previousSearch)

function newSearch(event) {
    event.preventDefault();

    let searchLocationValue = $('#search-input').val().trim().toLowerCase();

    if (searchLocationValue === '') {
        return
    } else {
        searchLocations.unshift(searchLocationValue)
        if (searchLocations.length > 10) {
            searchLocations.pop();
        }
    }

    getCurrentWeather()
    getForecast()
    printSearchLocations()
    storeLocations()

    $('#search-input').val('')
}


function previousSearch(event) {
    let targetText = event.target.innerHTML;
    let targetIndex = searchLocations.indexOf(targetText)

    if (targetIndex > 0) {
        searchLocations.splice(targetIndex, 1)
        searchLocations.unshift(targetText)
    }
    getCurrentWeather()
    getForecast()
    printSearchLocations()
    storeLocations()
}

// Get API database info for current weather
function getCurrentWeather() {
    // URL creation for database query
    let queryURLCurrent = 'https://api.openweathermap.org/data/2.5/weather?q=' + searchLocations[0] + '&units=imperial' + '&appid=' + APIKey;

    $.ajax({
        url: queryURLCurrent,
        method: 'GET'
    }).then(function (response) {
        let lat = response.coord.lat;
        let lon = response.coord.lon;

        getUVIndex(lat, lon)

        let currentDate = moment(response.weather.dt).format('MMMM Do, YYYY');
        let weatherIcon = 'https://openweathermap.org/img/w/' + response.weather[0].icon + '.png';
        $('#current-city').html(function () {
            return '<h2>' + response.name + ' | <span>' + currentDate + '</span></h2>';
        })

        $('#weather-icon').attr('src', weatherIcon).attr('alt', 'Weather Icon')

        $('#current-temp').text(response.main.temp)
        $('#current-humidity').text(response.main.humidity)
        $('#current-wind').text(response.wind.speed)
    }).catch(function (error) {
        console.log(error.responseJSON.message)
        // ** Modal **
    })
}

// get current UV Index
function getUVIndex(lat, lon) {
    let queryURLUVIndex = 'https://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&appid=' + APIKey;

    $.ajax({
        url: queryURLUVIndex,
        method: 'GET'
    }).then(function (UVIresponse) {
        let UVIndex = UVIresponse.value;
        $('#current-uvi').text(UVIndex)
    }).catch(function (error) {
        console.log(error)
    })
}

// get 5 day forecast
function getForecast() {
    let queryURLForecast = 'https://api.openweathermap.org/data/2.5/forecast/daily?q=' + searchLocations[0] + '&cnt=6&units=imperial&appid=' + APIKey;

    $.ajax({
        url: queryURLForecast,
        method: 'GET'
    }).then(function (forecastResponse) {
        $('#weather-forecast > h2 > span').text(searchLocations[0])

        // reset forecast cards
        resetForecastCards()

        for (let k = 1; k < forecastResponse.list.length; k++) {
            let nextDay = forecastResponse.list[k]
            let momentDate = moment.unix(nextDay.dt)
            let newDivElement = $('<div>').addClass('forecast-card')
            let newPDate = $('<p>').addClass('future-date')
            let newPTemp = $('<p>').addClass('future-temp')
            let newPHum = $('<p>').addClass('future-humidity')
            let newImgElement = $('<img>')
            let forecastIcon = 'https://openweathermap.org/img/w/' + nextDay.weather[0].icon + '.png';
            let forecastDate = momentDate.format('MM/DD/YYYY');

            newPDate.text(forecastDate)
            newImgElement.attr('src', forecastIcon)
            newPTemp.html('Temp: <span></span> &#8457')
            newPTemp.children().text(nextDay.temp.day)
            newPHum.html('Humidity: <span></span> %')
            newPHum.children().text(nextDay.humidity)

            newDivElement.append(newPDate)
            newDivElement.append(newImgElement)
            newDivElement.append(newPTemp)
            newDivElement.append(newPHum)

            $('#forecast-container').append(newDivElement)
        }
    }).catch(function (error) {
        console.log(error)
    })
}

// add searches to search history list
function printSearchLocations() {
    resetLocationState()
    removeArrayDuplicates(searchLocations)

    for (let i = 0; i < searchLocations.length; i++) {
        let location = searchLocations[i]
        let newLiElement = $('<li>').addClass('search-results')
        newLiElement.text(location)
        $('#search-history-ul').append(newLiElement)
    }
}

// reset search history list
function resetLocationState() {
    if ($('#search-history-ul').has('li')) {
        $('li').remove()
    }
}

// reset forecast cards
function resetForecastCards() {
    if ($('#forecast-container').has('div')) {
        $('#forecast-container > div').remove()
    }
}

function init() {
    let storedLocations = localStorage.getItem('searchLocations')
    let parsedLocations = JSON.parse(storedLocations)

    if (parsedLocations != null) {
        searchLocations = parsedLocations;
        printSearchLocations();
        getCurrentWeather()
        getForecast()
    } else {
        searchLocations = [];
    }
}

// save search locations to local storage
function storeLocations() {
    localStorage.setItem('searchLocations', JSON.stringify(searchLocations))
}

// remove duplicate search locations from array
function removeArrayDuplicates(arr) {
    let cleanedArray = arr.filter(function (v, i, self) {
        return i == self.indexOf(v);
    });
    searchLocations = cleanedArray;
    return searchLocations;
}
