/*jslint browser*/

const boatTypes = ["", "Cargo", "Fishing", "Passenger", "Pleasure Craft",
"Special Craft", "Tanker", "Wing in Grnd", "Other"];

const boatImages = ["", "cargo.jpg", "fishing.jpg", "passenger.jpg",
"pleasure.jpg", "special.jpg", "tanker.jpg", "wingon.jpg", "other.jpg"];

const listFilter = ["Cargo", "Passenger", "Tanker", "Fishing",
"Special Craft", "Pleasure Craft", "Wing in Grnd", "Other"];

function moreInfo(thisBoatsInfo) {

    var i = 0;
    var moreInfoContent = "";
    var boatType = boatArray[10];
    var boatSRC = "photos/" + boatImages[boatTypes.indexOf(boatType)];

    try {

        boatArray = Object.values(thisBoatsInfo[0]);

    } catch {

        window.alert(`ERROR: More Information can't be retrieved at this time.
        Try again later.`);
        return;

    }

    boatArray.forEach(function(element) {

        if (element === "") {

            element = "N/A";

        }

        moreInfoContent = moreInfoContent + fullAttributes[i] +
        element + "<br>";

        i++;

    });

    if (boatTypes.indexOf(boatType) !== -1) {

        document.getElementById("boatImage").src = (boatSRC);

    } else {

        document.getElementById("boatImage").src = ("photos/other.jpg");

    }

    document.getElementById("selectedBoatInfo").innerHTML = moreInfoContent;

    document.getElementById("overlay").style.display = "block";
}

function removeOverlay() {

    document.getElementById("overlay").style.display = "none";

}

var map = L.map("map").setView([50, 0.15], 8);

L.RotatedMarker = L.Marker.extend({
  options: {
    rotationAngle: 0,
    rotationOrigin: "",
  },

  initialize: function (latlng, options) {
    L.Marker.prototype.initialize.call(this);

    L.Util.setOptions(this, options);
    this._latlng = L.latLng(latlng);

    var iconOptions = this.options.icon && this.options.icon.options;
    var iconAnchor = iconOptions && this.options.icon.options.iconAnchor;
    if (iconAnchor) {
      iconAnchor = iconAnchor[0] + "px " + iconAnchor[1] + "px";
    }

    this.options.rotationOrigin =
      this.options.rotationOrigin || iconAnchor || "center bottom";
    this.options.rotationAngle = this.options.rotationAngle || 0;

    this.on("drag", function (e) {
      e.target._applyRotation();
    });
  },

  onRemove: function (map) {
    L.Marker.prototype.onRemove.call(this, map);
  },

  _setPos: function (pos) {
    L.Marker.prototype._setPos.call(this, pos);
    this._applyRotation();
  },

  _applyRotation: function () {
    if (this.options.rotationAngle) {
      this._icon.style[L.DomUtil.TRANSFORM + "Origin"] =
        this.options.rotationOrigin;

      this._icon.style[L.DomUtil.TRANSFORM] +=
        " rotateZ(" + this.options.rotationAngle + "deg)";
    }
  },

  setRotationAngle: function (angle) {
    this.options.rotationAngle = angle;
    this.update();
    return this;
  },

  setRotationOrigin: function (origin) {
    this.options.rotationOrigin = origin;
    this.update();
    return this;
  },
});

L.rotatedMarker = function (latlng, options) {
  return new L.RotatedMarker(latlng, options);
}

L.Control.MousePosition = L.Control.extend({

    _pos: null,

    options: {
        position: "bottomleft",
        separator: " : ",
        emptyString: "Unavailable",
        lngFirst: false,
        numDigits: 5,
        lngFormatter: undefined,
        latFormatter: undefined,
        formatter: undefined,
        prefix: "",
        wrapLng: true,
    },

    onAdd: function (map) {
        this._container = L.DomUtil.create("div", "leaflet-control-mouseposition");
        L.DomEvent.disableClickPropagation(this._container);
        map.on("mousemove", this._onMouseMove, this);
        this._container.innerHTML = this.options.emptyString;
        return this._container;
    },

    onRemove: function (map) {
        map.off("mousemove", this._onMouseMove)
    },

    getLatLng: function() {
        return this._pos;
    },

    _onMouseMove: function (e) {
        this._pos = e.latlng.wrap();
        var lngValue = this.options.wrapLng ? e.latlng.wrap().lng : e.latlng.lng;
        var latValue = e.latlng.lat;
        var lng;
        var lat;
        var value;
        var prefixAndValue;

        if (this.options.formatter) {
            prefixAndValue = this.options.formatter(lngValue, latValue);
        } else {
            lng = this.options.lngFormatter ? this.options.lngFormatter(lngValue) : L.Util.formatNum(lngValue, this.options.numDigits);
            lat = this.options.latFormatter ? this.options.latFormatter(latValue) : L.Util.formatNum(latValue, this.options.numDigits);
            value = this.options.lngFirst ? lng + this.options.separator + lat : lat + this.options.separator + lng;
            prefixAndValue = this.options.prefix + " " + value;
        }

        this._container.innerHTML = prefixAndValue;
    }

});

L.Map.mergeOptions({
    positionControl: false
});

L.Map.addInitHook(function () {
    if (this.options.positionControl) {
        this.positionControl = new L.Control.MousePosition();
        this.addControl(this.positionControl);
    }
});

L.control.mousePosition = function (options) {
    return new L.Control.MousePosition(options);
};

var tiles = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZjkyMzAxamIiLCJhIjoiY2t6aWFqd3I5MWtsNjJub2NlYnYyMjYzNCJ9.QQZEWC408QPHTwtBiZ_FXA", {

    id: "OpenStreetMap",
    minZoom: 3,
    maxZoom: 12,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://map.openseamap.org/legend.php?lang=en&page=license">OpenSeaMap</a> & <a href="https://www.google.com/intl/en-GB_ALL/permissions/geoguidelines/">Google Maps</a>, ' +
       'Imagery © <a href="https://www.mapbox.com/">Mapbox</a> | ' + 
       'Additional Libraries: <a href="https://www.npmjs.com/package/leaflet-marker-rotation">leaflet-marker-rotation</a> and <a href="https://www.npmjs.com/package/leaflet-mouse-position">leaflet-mouse-position</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    noWrap: true,
    zoomOffset: -1

}).addTo(map);

var nautical = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {

    id: "OpenStreetMap",
    minZoom: 3,
    maxZoom: 12,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://map.openseamap.org/legend.php?lang=en&page=license">OpenSeaMap</a> & <a href="https://www.google.com/intl/en-GB_ALL/permissions/geoguidelines/">Google Maps</a>, ' +
       'Imagery © <a href="https://www.mapbox.com/">Mapbox</a> | ' + 
       'Additional Libraries: <a href="https://www.npmjs.com/package/leaflet-marker-rotation">leaflet-marker-rotation</a> and <a href="https://www.npmjs.com/package/leaflet-mouse-position">leaflet-mouse-position</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    noWrap: true,
    zoomOffset: -1

});

var satellite = L.tileLayer("http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}", {

    id: "OpenStreetMap",
    minZoom: 3,
    maxZoom: 12,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://map.openseamap.org/legend.php?lang=en&page=license">OpenSeaMap</a> & <a href="https://www.google.com/intl/en-GB_ALL/permissions/geoguidelines/">Google Maps</a>, ' +
       'Imagery © <a href="https://www.mapbox.com/">Mapbox</a> | ' + 
       'Additional Libraries: <a href="https://www.npmjs.com/package/leaflet-marker-rotation">leaflet-marker-rotation</a> and <a href="https://www.npmjs.com/package/leaflet-mouse-position">leaflet-mouse-position</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    noWrap: true,
    zoomOffset: -1

});

var layerRefresh = "tiles"

function changeLayer(layerChoice) {

    map.eachLayer(function (layer) {

       map.removeLayer(layer);

    });

    if (layerChoice === "tiles") {

        layerRefresh = "tiles";

        map.addLayer(tiles);

    }

    else if (layerChoice === "nautical") {

        layerRefresh = "nautical";

        map.addLayer(nautical);

    }
    else {

        layerRefresh = "satellite";

        map.addLayer(satellite);

    }

    accessAPI(document.getElementById('long').value, document.getElementById('lat').value, document.getElementById('rad').value);
}

function showMapKey() {

    if (document.getElementById("keyList").style.display === "none") {

        document.getElementById("keyList").style.display = "block";

    }

    else {

        document.getElementById("keyList").style.display = "none";

    }

}

var cargoIcon = L.icon({

    iconUrl: 'colourArrows/black.png',

    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [10, 10]

});

var fishingIcon = L.icon({

    iconUrl: 'colourArrows/purple.png',

    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [10, 10]

});

var passengerIcon = L.icon({

    iconUrl: 'colourArrows/dark green.png',

    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [10, 10]

});

var pleasureIcon = L.icon({

    iconUrl: 'colourArrows/green.png',

    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [10, 10]

});

var specialIcon = L.icon({

    iconUrl: 'colourArrows/grey.png',

    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [10, 10]

});

var tankerIcon = L.icon({

    iconUrl: 'colourArrows/orange.png',

    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [10, 10]

});

var wingIcon = L.icon({

    iconUrl: 'colourArrows/red.png',

    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [10, 10]

});

var otherIcon = L.icon({

    iconUrl: "colourArrows/pink.png",

    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [10, 10]

});

var boatIconArray = ["", cargoIcon, fishingIcon, passengerIcon, pleasureIcon, specialIcon, tankerIcon, wingIcon, otherIcon];

var attributes = ["Name: ", "Longitude: ", "Latitude: ", "Bearing: ", "MMSI: "]

var fullAttributes = ["Name: ", "ID: ", "MMSI: ", "Longitude: ", "Latitude: ", "Time Stamp: ", "IMO: ", "Call Sign: ", "Speed: ", "Area: ", "Vessel Type: ", "Destination: ", "Area Code: ", "Current Port ID: ", "Current Port: ", "Next Port ID: ", "Next Port: "];

var boatArray = []

function addBoats(boatData) {

    var i;
    var j;

    for (i = 0; i < boatData.length; i++) {

        boatArray = Object.values(boatData[i]);

        if (listFilter.includes(boatArray[10])) {

              var keyBoatInfo = [boatArray[0], parseFloat(boatArray[3]).toFixed(2), parseFloat(boatArray[4]).toFixed(2), (parseFloat(boatArray[8]) * 15).toFixed(2), parseInt(boatArray[2])];

              var content = "";

              if (boatIconArray[boatTypes.indexOf(boatArray[10])]) {

                var boatIcon = boatIconArray[boatTypes.indexOf(boatArray[10])];

              } else {

                var boatIcon = boatIconArray[8];

              }

              for (j = 0; j < (keyBoatInfo.length); j++) {

                content = content + "<strong>" + attributes[j] + "</strong>" + String(keyBoatInfo[j]) + (j > 0 & j !== 4 ? "°" : "") + "<br>";

              }

              var moreInfoButton = `<button value="1648050488" 
              onclick="getBoatDataByMMSI(this.value)" 
              style="background-color:white; border-radius:3px; 
              text-align:center; margin:auto;">
                <strong>More Information</strong>
              </button>`.replace("1648050488", keyBoatInfo[4].toString());

              content = content + moreInfoButton;

              marker = new L.RotatedMarker([keyBoatInfo[1], keyBoatInfo[2]], {icon: boatIcon, rotationAngle: (keyBoatInfo[3] - 42), rotationOrigin: "center"})
                .bindPopup(content)
                .addTo(map);

        }

    }

}

async function accessAPI(long, lat, rad) {

    const parsedLong = parseInt(long, 10);

    const parsedLat = parseInt(lat, 10);

    const parsedRad = parseInt(rad, 10);

    if (!(Number.isNaN(parsedLong) || Number.isNaN(parsedLat) || Number.isNaN(parsedRad))) {

        var api = ("https://web.cs.manchester.ac.uk/m31181jg/first_group_project/api/api.php/getArea/"+long+","+lat+","+rad);

        const response = await fetch(api);

        var data = await response.json();

        var length = data.length;

        document.getElementById("currentBoatNum").innerHTML = length;

        addBoats(data);

    }

    else {

        alert("ERROR: Invalid Input.\nHave you entered any values that aren't numbers?")

    }

}

async function getBoatNum() {

    var length = 0;
    var response;
    var data;
    var apiCalls = [];
    var i;

    for (i = 0; i < 4; i++) {

        api = ("https://web.cs.manchester.ac.uk/m31181jg/first_group_project/api/api.php/getArea/-90,-90,90");
        response = await fetch(api);
        data = await response.json();
        length += data.length;
        
    }

    var apiSW = ("https://web.cs.manchester.ac.uk/m31181jg/first_group_project/api/api.php/getArea/90,-90,90");

    var response = await fetch(apiSW);

    var data = await response.json();

    var length = length + data.length;

    var apiNE = ("https://web.cs.manchester.ac.uk/m31181jg/first_group_project/api/api.php/getArea/90,90,90");

    var response = await fetch(apiNE);

    var data = await response.json();

    var length = length + data.length;

    var apiSE = ("https://web.cs.manchester.ac.uk/m31181jg/first_group_project/api/api.php/getArea/-90,90,90");

    var response = await fetch(apiSE);

    var data = await response.json();

    var length = length + data.length;

    document.getElementById("totalBoatNum").innerHTML = length;

}


async function getBoatDataByName(name) {

    name = name.toUpperCase();

    var newName = name.replace(" ", "_")

    var api = ("https://web.cs.manchester.ac.uk/m31181jg/first_group_project/api/api.php/name/"+newName);

    const response = await fetch(api);

    var data = await response.json();

    moreInfo(data);
}

async function getBoatDataByMMSI(mmsi) {

    var api = ("https://web.cs.manchester.ac.uk/m31181jg/first_group_project/api/api.php/mmsi/"+mmsi);

    const response = await fetch(api);

    var data = await response.json();

    moreInfo(data);
}

function Refresh(long, lat, rad) {

    changeLayer(layerRefresh);
    accessAPI(long, lat, rad);

}

function RefreshMapPopup(long, lat) {

    var radForSearch; 

    document.getElementById("rad").value =
    document.getElementById("radPopup").value;
    changeLayer(layerRefresh);
    accessAPI(long, lat, document.getElementById("rad").value);

}

function applyFilters(type, index) {

    if (document.getElementById(type).checked) {

        listFilter[index] = type;

    }

    else {

        listFilter[index] = "";

    }

}

function onMapClick(e) {

    var latLongArray = Object.values(e.latlng);
    var lat = latLongArray[0].toString();
    var long = latLongArray[1].toString();

    var accessAPIParameter = lat + "," + long;

    document.getElementById("long").value = long;
    document.getElementById("lat").value = lat;
    document.getElementById("rad").value = "1";

    L.popup().setLatLng(e.latlng)
        .setContent(`<strong style="font-size:16px;">
        LOCATION: (` + e.latlng.toString().slice(7,-1) + `)</strong>
        <br>
        <label>Radius:</label>
        <input type="text" value="1" placeholder="rad" name="radPopup" 
        id="radPopup" class="refreshInput"><br>
        <button onclick= "RefreshMapPopup(` + accessAPIParameter + `);
        return false;" style="background-color:white; border-radius:3px;
        text-align:center; margin:auto; width:100%">
        <strong>Search Within Specified Radius</strong></button>`)
        .openOn(map);

}

document.getElementById("long").value = "0";

document.getElementById("lat").value = "50";

document.getElementById("rad").value = "1";

accessAPI("0", "50", "1");

getBoatNum();

L.control.mousePosition().addTo(map);

map.on("click", onMapClick);

map.fitBounds(map.getBounds());