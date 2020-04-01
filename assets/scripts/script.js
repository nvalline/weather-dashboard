let searchLocations = [];

const APIKey = '166a433c57516f51dfab1f7edaed8413';


init();

// Click event for search button
$('#search-btn').on('click', function (event) {
    event.preventDefault();

    let searchLocationValue = $('#search-input').val().trim().toLowerCase();

    if (searchLocationValue === '') {
        return
    } else {
        searchLocations.unshift(searchLocationValue)
    }

    // else if (searchLocations != null && searchLocations.includes(searchLocationValue)) {
    //     // manipulate array for same value
    //     console.log('includes value')
    // }

    printSearchLocations()
    storeLocations()

    $('#search-input').val('')
})

// URL creation for database query
let queryURL = 'api.openweathermap.org/data/2.5/weather?q=' + searchLocations[0] + '&appid=' + APIKey;


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