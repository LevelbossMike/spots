// javascript for displaying a map in the spots form dialogue

var map;

// map, center is weberschule -->
var lon = 14.27887;
var lat = 48.30840;
var weberschule = new OpenLayers.LonLat(lon, lat);
var zoom = 17;

var osm;

var markers = new OpenLayers.Layer.Markers("Gefahrenstelle");
var wgs84 = new OpenLayers.Projection("EPSG:4326");

// when document is ready load map
$(document).ready(function() {

    // initialize map with some control options
    map = new OpenLayers.Map("form_map", {
	controls: [
	new OpenLayers.Control.Navigation(),
	new OpenLayers.Control.KeyboardDefaults(),
	new OpenLayers.Control.PanZoomBar()
	]
    });

    // define google satellite map layer
    var gsat = new OpenLayers.Layer.Google( "Google Satellite", {
	type: G_SATELLITE_MAP,
	'sphericalMercator': true,
	numZoomLevels: 23,
	isBaseLayer: false,
	visibility: true
    });

    // define OSM layer
    osm = new OpenLayers.Layer.OSM( "Simple OSM Map");
    // add OSM and google satellite layers to map
    map.addLayers([osm, gsat, markers]);
    // this sets center of map to coordinates of the Weberschule Linz
    var center = weberschule.clone().transform(wgs84, map.getProjectionObject());
    map.setCenter(center, zoom);

    OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
	defaultHandlerOptions: {
	    'single': true,
	    'double': false,
	    'pixelTolerance': 0,
	    'stopSingle': false,
	    'stopDouble': false
	},

	initialize: function(options) {
	    this.handlerOptions = OpenLayers.Util.extend(
	    {}, this.defaultHandlerOptions
		);
	    OpenLayers.Control.prototype.initialize.apply(
		this, arguments
		); 
	    this.handler = new OpenLayers.Handler.Click(
		this, {
		    'click': this.trigger
		}, this.handlerOptions
		);
	}, 

	trigger: function(e) {
	    if (markers.markers.length > 0) {
		markers.removeMarker(markers.markers[0]);
	    }
	    var lonlat = map.getLonLatFromViewPortPx(e.xy);
	    var marker = new OpenLayers.Marker(lonlat);
	    markers.addMarker(marker);
	    fillInPositionData(lonlat.clone().transform(map.getProjectionObject(), wgs84));
	}

    });
    var click = new OpenLayers.Control.Click();
    map.addControl(click);
    click.activate();

});

function fillInPositionData(lonlat){
    var lat = lonlat.lat;
    var lng = lonlat.lon;
    document.getElementById('spot_lat').value = lat;
    document.getElementById('spot_lng').value = lng;
}

/*// javascript for displaying a map in the spots form dialogue

// variables
// map, center is weberschule
var centerLat = 48.3084;
var centerLng = 14.2785;
var zoomVal = 17;

function init(){	
	var cloudmade = new CM.Tiles.CloudMade.Web({key: '8ad01bc75dc44e1e892962e5a81481f3'});
    var map = new CM.Map('form_map', cloudmade);
	<!-- this sets center of map to coordinates of Weberschule -->
	centerCoords = new CM.LatLng(centerLat, centerLng);
    map.setCenter(centerCoords, zoomVal);
	var ListenerCounter = 0;
	var dragMarker;
	CM.Event.addListener(map, 'click', function(latlng) {
		fillInPositionData(latlng);
		if (ListenerCounter > 0) {
			map.removeOverlay(dragMarker);
		};
			dragMarker = new CM.Marker(latlng, {
			title: 'This represents the position of a dangerous spot.',
			draggable: true
		});
		CM.Event.addListener(dragMarker, 'dragend', function() {
			var markerPosition = dragMarker.getLatLng();
			fillInPositionData(markerPosition);
		});
		map.addOverlay(dragMarker);	
		ListenerCounter++;

	});


}
function fillInPositionData(latlng){
	var lat = latlng.lat();
	var lng = latlng.lng();
	document.getElementById('spot_lat').value = lat;
	document.getElementById('spot_lng').value = lng;
}
    


// on load init the map
window.onload = init;

*/