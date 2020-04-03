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
    }

    getCurrentWeather()
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

        $('#current-city > span').text('currentDate')

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

function init() {
    let storedLocations = localStorage.getItem('searchLocations')
    let parsedLocations = JSON.parse(storedLocations)

    if (parsedLocations != null) {
        searchLocations = parsedLocations;
        printSearchLocations();
        getCurrentWeather()
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
