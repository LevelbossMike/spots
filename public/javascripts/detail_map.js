var zoomVal = 17;

function init(){	
	var cloudmade = new CM.Tiles.CloudMade.Web({key: '8ad01bc75dc44e1e892962e5a81481f3'});
    var map = new CM.Map('map', cloudmade);
	<!-- this sets center of map to coordinates of Weberschule -->
	centerCoords = new CM.LatLng(spot.lat, spot.lng);
	var marker = new CM.Marker(centerCoords, {
		title: spot.description
	});
    map.setCenter(centerCoords, zoomVal);
	map.addOverlay(marker);
}

window.onload = init;