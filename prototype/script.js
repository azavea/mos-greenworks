
var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

$('.sidebar').click(function() {
    $('body').toggleClass('explore');
    map.invalidateSize();
});

$('.marker').click(function() {
    $(this).toggleClass('inactive');
});

var demoMarker = L.marker([51.505, -0.09]).addTo(map);

var popupContent = '<div class="popup-left">' +
                       '<div class="popup-image" style="background-image: url(http://placehold.it/350x150)">' +
                       '</div>' +
                   '</div>' +
                   '<div class="popup-right">' +
                       '<h4 class="popup-header mode-background">City LEED Buildings</h4>' +
                       '<div class="popup-body">' +
                           '<h5 class="popup-heading mode-color">Address</h5>' +
                           '<div class="h5">4750 Grays Ferry Avenue</div>' +
                           '<h5 class="popup-heading mode-color">Target</h5>' +
                           '<div class="h5">Target 1 Lower City Government Energy Consumption by 30 Percent.</div>' +
                           '<h5 class="popup-heading mode-color">Description</h5>' +
                           '<div class="h5">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam euismod tincidunt.</div>' +
                       '</div>' +
                   '</div>';

demoMarker.bindPopup(popupContent, {minWidth: 600}).openPopup();
