var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema ({
    name: {type: String, required: false},
    type: {type: String, required: false},
    info: {type: String, required: false},
    user_id: {type: String, required: false},

    payable: {type: String, required: false},
    pay: {type: Number, required: false},
    
    //om in de lijst weer te geven, de prijs of "vrijwillig
    payabletopublish: {type: String, required: false},

    //pay of volunteer voor de radiobuttons
    topay: {type: String, required: false},
    tovolunteer: {type: String, required: false},
    

    locationentered: {type: String, required: false}, //Yes or No
    //Yes
    location: {type: String, required: false},
    coordinateslocation: {type: [Number, Number], required: false},//Long,Lat,
    //No
    geolocation:{type: String, required: false},
    coordinates: {type: [Number, Number], required: false}, //Long,Lat,
    
    
    //afhankelijk van Yes of No, definitieve adres:
    address: {type: String, required: false},
    addresscoordinates: {type: [Number, Number], required: false, index: '2dsphere'},

    //om in de lijst weer te geven: enkel postcode en plaats
    placetopublish: {type: String, required: false},

    candidates: [Schema.Types.Mixed]
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Job', schema);