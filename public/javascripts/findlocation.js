if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
} else {
    alert('Your browser does not support geolocation.');
}
function success (position) {
    console.log(position);
    var lat = document.getElementById('lat'),
        lng = document.getElementById('lng');  
    lat.value = position.coords.latitude;
    lng.value = position.coords.longitude;
  
}
function error (err) {
    alert(err);
}