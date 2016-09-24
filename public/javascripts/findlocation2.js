if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
} else {
    alert('Your browser does not support geolocation.');
}
function success (position) {
    console.log(position);
    
    var lt = document.getElementById('lt'),
        lg = document.getElementById('lg');
    
    lt.value = position.coords.latitude;
    lg.value = position.coords.longitude;
}
function error (err) {
    alert(err);
}