
<!-- variables -->
<!-- map, center is weberschule -->
var centerLat = 48.3084;
var centerLng = 14.2785;
var zoomVal = 16;

// just for routing
var ListenerCounter = 0;
var dragMarker;
var directions;

function init(){	
	var cloudmade = new CM.Tiles.CloudMade.Web({key: '8ad01bc75dc44e1e892962e5a81481f3'});
    var map = new CM.Map('map', cloudmade);
	<!-- this sets center of map to coordinates of Linz -->
	centerCoords = new CM.LatLng(centerLat, centerLng);
    map.setCenter(centerCoords, zoomVal);
	<!-- adding controls -->
	<!-- This adds the scroll bar on the top left corner -->
	map.addControl(new CM.LargeMapControl());
	//add marker
	//addMarker(centerLat,centerLng,"Weberschule","This is Weberschule",map)
	if (spots.length > 0) {
		for (var i=0; i < spots.length; i++) {
			addMarker(spots[i].lat, spots[i].lng, spots[i].name, spots[i].description, spots[i].id, spots[i].photo_file_name, map);
		};
	} else{
		addMarker(spots.lat, spots.lng, spots.name, spots.description, map);
		centerCoords = new CM.LatLng(spots.lat, spots.lng);
		map.setCenter(centerCoords, zoomVal);
	};
	enableRouting(map);
}

function addMarker(lat,lng,name,description,id,file_name,map) {	
	var img_src = "/system/photos/"+ id + "/small/" + file_name;	
	var markerLatLng = new CM.LatLng(lat,lng);
	var marker = new CM.Marker(markerLatLng, {
		title: name
	});
	<!-- add an EventListener to the marker, to make it respond when clicked -->
	CM.Event.addListener(marker, 'click', function() {
		marker.openInfoWindow("<img height='60%' width='60%' src='"+img_src+"'><br />" + description)
		map.setCenter(markerLatLng, zoomVal);
	});
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


window.onload = init;

