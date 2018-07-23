var currentPosition = null;
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showMap, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
function showMap(position) {
    var myLatLng = {lat: position.coords.latitude, lng: position.coords.longitude};
    var map = new google.maps.Map(document.getElementById("google-map"), {
            center : myLatLng,
            zoom : 15,
        });
    var marker = new google.maps.Marker({
          position : myLatLng,
          map : map,
          title : "My Location",
          draggable : true,
          animation : google.maps.Animation.DROP
        });
    var contentString = "<div>New Location</div>";
    var infowindow = new google.maps.InfoWindow({
          content : contentString
        });
    marker.addListener("click", function() {
        infowindow.open(map, marker);
    });
    markerCoords(map, marker);
}

function markerCoords(map, markerobject){
     google.maps.event.addListener(markerobject, "dragend", function(evt){
         currentPosition = evt;
     });
 }
function getCurrentLocation() {
    if(currentPosition != null) {
        $("#current-location").text("Marker dropped: Current Lat: " + currentPosition.latLng.lat().toFixed(3) + " Current Lng: " + currentPosition.latLng.lng().toFixed(3));
    }
    else {
        alert("Please get the map and drag the marker");
    }
}
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}
