/*var zoomVal = 17;

function init(){	
	var cloudmade = new CM.Tiles.CloudMade.Web({key: '8ad01bc75dc44e1e892962e5a81481f3'});
    var map = new CM.Map('detail_map', cloudmade);
	<!-- this sets center of map to coordinates of Weberschule -->
	centerCoords = new CM.LatLng(spot.lat, spot.lng);
	var marker = new CM.Marker(centerCoords, {
		title: spot.description
	});
    map.setCenter(centerCoords, zoomVal);
	map.addOverlay(marker);
}

window.onload = init;
*/


var map;

var zoom = 17;

var osm;

var markers = new OpenLayers.Layer.Markers("Gefahrenstelle");
var wgs84 = new OpenLayers.Projection("EPSG:4326");

// when document is ready load map
$(document).ready(function() {

    // initialize map with some control options
    map = new OpenLayers.Map("detail_map", {
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
    var lonlat = new OpenLayers.LonLat(spot.lng, spot.lat);

    var center = lonlat.clone().transform(wgs84, map.getProjectionObject());
    map.setCenter(center, zoom);

    var marker = new OpenLayers.Marker(center);
    markers.addMarker(marker);

});
