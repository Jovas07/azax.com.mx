$(function() {
    var mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(-34.397, 150.644)
    };
    var map = new google.maps.Map($("#map")[0], mapOptions);

    // listen for the window resize event & trigger Google Maps to update too
    $(window).resize(function() {
        // (the 'map' here is the result of the created 'var map = ...' above)
        google.maps.event.trigger(map, "resize");
    });
});
