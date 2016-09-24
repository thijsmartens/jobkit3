//Google maps

function initMap() {



    // coördinaten België indien geolocation niet werkt
    var map = new google.maps.Map(document.getElementById('jobmap'), {
        center: {lat: 50.85045, lng: 4.34878},
        zoom: 13,
        fullscreenControl: true
    });


    // geolocation

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            var marker = new google.maps.Marker({
                position: pos,
                icon: {
                    url: "images/ic_gps_fixed_black_24px.svg",
                    scale: 3
                },
                draggable: false,
                map: map
            });

            map.setCenter(pos);

            // center to my location button

            addYourLocationButton(map, marker);

            function addYourLocationButton(map, marker)
            {
                var controlDiv = document.createElement('div');

                var firstChild = document.createElement('button');
                firstChild.style.backgroundColor = '#fff';
                firstChild.style.border = 'none';
                firstChild.style.outline = 'none';
                firstChild.style.width = '28px';
                firstChild.style.height = '28px';
                firstChild.style.borderRadius = '2px';
                firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
                firstChild.style.cursor = 'pointer';
                firstChild.style.marginRight = '10px';
                firstChild.style.padding = '0px';
                firstChild.title = 'Your Location';
                controlDiv.appendChild(firstChild);

                var secondChild = document.createElement('div');
                secondChild.style.margin = '5px';
                secondChild.style.width = '18px';
                secondChild.style.height = '18px';
                secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)';
                secondChild.style.backgroundSize = '180px 18px';
                secondChild.style.backgroundPosition = '0px 0px';
                secondChild.style.backgroundRepeat = 'no-repeat';
                secondChild.id = 'you_location_img';
                firstChild.appendChild(secondChild);

                google.maps.event.addListener(map, 'dragend', function() {
                    $('#you_location_img').css('background-position', '0px 0px');
                });

                firstChild.addEventListener('click', function() {
                    var imgX = '0';
                    var animationInterval = setInterval(function(){
                        if(imgX == '-13') imgX = '0';
                        else imgX = '-13';
                        $('#you_location_img').css('background-position', imgX+'px 0px');
                    }, 500);
                    if(navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(position) {
                            var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                            marker.setPosition(latlng);
                            map.setCenter(latlng);
                            clearInterval(animationInterval);
                            $('#you_location_img').css('background-position', '-144px 0px');
                        });
                    }
                    else{
                        clearInterval(animationInterval);
                        $('#you_location_img').css('background-position', '0px 0px');
                    }
                });

                controlDiv.index = 1;
                map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
            }



        }, function () {
            handleLocationError(true, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, map.getCenter());
    }



    // extra legendes met uitleg

    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push
    (document.getElementById("legend"));

    // ophalen jobs met coördinaten en info

    var jobslegend= [];

    $.getJSON('/jobs', function(jobs){
            jobslegend = jobs;
            var LatLng = google.maps.LatLng;
            jobs.forEach(function(d){

                //als locationentered = Yes, locatie adres opgeven, anders geolocatie opgeven

                if (d.locationentered == "Yes") {
                    var pos = new LatLng (d.coordinateslocation[1],d.coordinateslocation[0]);
                } else {
                    pos = new LatLng(d.coordinates[1], d.coordinates[0]);
                }

                //als pay = 0, gaat het over vrijwilligersjobs

                if (d.payable == "No") {
                    conditionalcontent = "V";
                } else {
                    conditionalcontent = d.pay + "€"
                }

                //afhankelijk van het type job, een ander kleur

                var labelstyle = "";

                switch (d.type) {
                    case "Huis":
                        labelstyle = "labelhuis";
                        break;
                    case "Tuin":
                        labelstyle = "labeltuin";
                        break;
                    case d.type="Dienst":
                        labelstyle = "labeldienst";
                        break;
                }

                var marker = new MarkerWithLabel({
                    position: pos,
                    draggable: false,
                    raiseOnDrag: true,
                    map: map,
                    labelContent : conditionalcontent,
                    labelClass: labelstyle, // the CSS class for the label                    
                    icon: " "                    
                });

                //bij het klikken op de marker naar de jobomschrijving gaan
                marker.addListener('click', function() {
                    location.href = "/job-info/"+d._id;
                });

            });


    });


    //legende met type jobs, bij het klikken blijft enkel dat type over



    var icons = {
        huis: {
            name: 'Huis',
            icon: {
                url: "images/huis.svg",
                scale: 3
            }
        },
        tuin: {
            name: 'Tuin',
            icon: {
                url: "images/tuin.svg",
                scale: 3
            }
        },
        dienst: {
            name: 'Dienst',
            icon: {
                url: "images/dienst.svg",
                scale: 3
            }
        }
    };

    var legendtypes = document.getElementById("legendtypes");

    var i=0;
    for (var key in icons) {
        var type = icons[key];
        var icon = type.icon.url;
        var div = document.createElement('div');
        div.innerHTML = '<input type="image" src="' + icon + '" onclick="myfunction()" alt="'+type.name+'" title="'+type.name+'" data-toggle="tooltip" data-placement="right">';
        //div.innerHTML = '<img onclick="showmarkertype(this)" src="' + icon + '">';
        //div.innerHTML = '<input checked="checked" type="checkbox" onchange="toggleType(this, event, \'' + features[i].type + '\')"><img src="' + icon + '"> ' + name;
        legendtypes.appendChild(div);
        i++;
    }
    function myfunction() {
        console.log("test");
    }

    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legendtypes);












    }




    google.maps.event.addDomListener(window, 'load', initMap);





function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}




