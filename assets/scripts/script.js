let searchLocations = [];

$('#search-btn').on('click', function (event) {
    event.preventDefault();
    let searchLocationValue = $('#search-input').val();
    if (searchLocationValue === '') {
        return
    } else {
        searchLocations.unshift(searchLocationValue)
    }
    printSearchLocations()
})

function printSearchLocations() {
    console.log(searchLocations)
    for (let i = 0; i < searchLocations.length; i++) {
        let location = searchLocations[i]
        let newLiElement = $('<li>').addClass('search-results')
        newLiElement.text(location)
        $('#search-history-ul').prepend(newLiElement)
    }
}