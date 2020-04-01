let searchLocations = [];

$('#search-btn').on('click', function (event) {
    event.preventDefault();
    let searchLocationValue = $('#search-input').val().trim().toLowerCase();
    if (searchLocationValue === '') {
        return
    } else if (searchLocations.includes(searchLocationValue)) {
        // manipulate array for same value
        console.log('includes value')
    } else {
        searchLocations.unshift(searchLocationValue)
    }
    printSearchLocations()
})

// add searches to search history list
function printSearchLocations() {
    resetLocationState()
    console.log(searchLocations)
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