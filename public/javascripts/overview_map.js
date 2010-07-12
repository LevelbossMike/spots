

// when document is ready load map
$(document).ready(function() {
	init();
});

<!-- variables -->
<!-- map, center is weberschule -->
var centerLat = 48.3084;
var centerLng = 14.2785;
var zoomVal = 16;
// array of markers to make it possible to change the map-markers dynamically
var markers =[];

// just for routing
var ListenerCounter = 0;
var dragMarker;
var directions;
var map;

// for getting destination of a spot's photo on the server
var photos_destination_on_server = "/system/datas/"


function init(){	
	var cloudmade = new CM.Tiles.CloudMade.Web({key: '8ad01bc75dc44e1e892962e5a81481f3'});
    map = new CM.Map('map', cloudmade);
	<!-- this sets center of map to coordinates of Linz -->
	centerCoords = new CM.LatLng(centerLat, centerLng);
    map.setCenter(centerCoords, zoomVal);
	<!-- adding controls -->
	<!-- This adds the scroll bar on the top left corner -->
	map.addControl(new CM.LargeMapControl());
	//add marker
	//addMarker(centerLat,centerLng,"Weberschule","This is Weberschule",map)
	reloadMarkers(spots,map);
	enableRouting(map);
}

function addMarker(lat,lng,name,description,photo_id,photo_file_name,map) {	
	var img_src = photos_destination_on_server + photo_id + "/small/" + photo_file_name;	
	var markerLatLng = new CM.LatLng(lat,lng);
	var marker = new CM.Marker(markerLatLng, {
		title: name
	});
	<!-- add an EventListener to the marker, to make it respond when clicked -->
	CM.Event.addListener(marker, 'click', function() {
		marker.openInfoWindow("<img height='100%' width='100%' src='"+img_src+"'><br />" + description)
		map.setCenter(markerLatLng, zoomVal);
	});
	markers.push(marker);
	map.addOverlay(marker);
}
function addMarkerDescriptionOnly(lat,lng,name,description,map) {		
	var markerLatLng = new CM.LatLng(lat,lng);
	var marker = new CM.Marker(markerLatLng, {
		title: name
	});
	<!-- add an EventListener to the marker, to make it respond when clicked -->
	CM.Event.addListener(marker, 'click', function() {
		marker.openInfoWindow(description)
		map.setCenter(markerLatLng, zoomVal);
	});
	markers.push(marker);
	map.addOverlay(marker);
}

function enableRouting(map){
	CM.Event.addListener(map, 'click', function(latlng){
		if (ListenerCounter == 0){
			dragMarker = new CM.Marker(latlng, {
				title: 'This represents your home.',
				draggable: true
			});
			CM.Event.addListener(dragMarker, 'click', function(){
				directions= new CM.Directions(map, 'panel','8ad01bc75dc44e1e892962e5a81481f3');
				var waypoints = [dragMarker.getLatLng(), centerCoords];
				var options = {
					travelMode: 'foot',
					lang: 'de'
				}
				directions.loadFromWaypoints(waypoints,options);
				CM.Event.addListener(directions, 'load', function(){
					var poly = directions.getPolyline();
					//poly.enableEditing();
					poly.enableDrawing();
				});
			});
			map.addOverlay(dragMarker);
			ListenerCounter++;
		} else{
			map.removeOverlay(dragMarker);
			if(directions !=null){
				map.removeOverlay(directions.getMarker(1));
				map.removeOverlay(directions.getMarker(0));
				map.removeOverlay(directions.getPolyline());	
			}
			directions = null;
			ListenerCounter--;
		}
	});
}

function reloadMarkers(spots,map){
	// loops through all markers in markers and removes them from the map
	for (var i=0; i < markers.length; i++) {
		map.removeOverlay(markers[i]);
	};
	// reinitialize the markers array to free space in array‚
	markers = [];
	if (spots.length > 0) {
		for (var i=0; i < spots.length; i++) {
			var spot = spots[i];
			// no photo can be displayed, when there's no photo for a spot thus
			// addMarkerDescriptionOnly(lat,lng,name,description,map)
			if (spot.photos.length == 0){
				addMarkerDescriptionOnly(spot.lat,spot.lng,spot.name,spot.description,map);
			}
			else {
				// addMarker(lat,lng,name,description,photo_id,photo_file_name,map)
				addMarker(spot.lat, spot.lng, spot.name,
					 	  spot.description, spot.photos[0].id,
					 	  spot.photos[0].data_file_name, map);
			}
		};
	} else{
		//when only one marker should be displayed #show,edit, etc.
		addMarker(spots.lat, spots.lng, spots.name, spots.description, map);
		centerCoords = new CM.LatLng(spots.lat, spots.lng);
		map.setCenter(centerCoords, zoomVal);
	};
}

