// javascript for displaying a map in the spots form dialogue

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

