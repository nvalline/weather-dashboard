let searchLocations = [];

init();

// Click event for search button
$('#search-btn').on('click', function (event) {
    event.preventDefault();
    let searchLocationValue = $('#search-input').val().trim().toLowerCase();
    if (searchLocationValue === '') {
        return
    } else if (searchLocations != null && searchLocations.includes(searchLocationValue)) {
        // manipulate array for same value
        console.log('includes value')
    } else {
        searchLocations.unshift(searchLocationValue)
    }
    printSearchLocations()
    storeLocations()
})

// add searches to search history list
function printSearchLocations() {
    resetLocationState()
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