var map;

var drawControls;
// map, center is weberschule -->
var lon = 14.27887;
var lat = 48.30840;
var weberschule = new OpenLayers.LonLat(lon, lat);
var zoom = 17;

var ListenerCounter = 0;
var dragMarker;
var directions;
var osm;

var wgs84 = new OpenLayers.Projection("EPSG:4326");
var mapprojection = new OpenLayers.Projection("EPSG:900913");
var vectorLayer;
var markers = new OpenLayers.Layer.Markers("Weberschule");
var dangers = new OpenLayers.Layer.Markers("Gefahrenstellen");

var routeStart;
var center;

// for getting destination of a spot's photo on the server
var photos_destination_on_server = "/system/datas/"


function dataLoaded(event) {
    this.map.zoomToExtent(event.object.getDataExtent());
}
// when document is ready load map
$(document).ready(function() {
	
    // initialize map with some control options
    map = new OpenLayers.Map("map", {
	controls: [
	new OpenLayers.Control.Navigation(),
	new OpenLayers.Control.KeyboardDefaults(),
	new OpenLayers.Control.PanZoomBar(),
	//new OpenLayers.Control.LayerSwitcher()
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

    vectorLayer = new OpenLayers.Layer.Vector("Schulwege", {
	eventListeners: {
	    "featuresadded": dataLoaded
	}
    });
    // add OSM and google satellite layers to map
    map.addLayers([osm, gsat, vectorLayer]);


    // this sets center of map to coordinates of the Weberschule Linz
    center = weberschule.clone().transform(wgs84, map.getProjectionObject());
    map.setCenter(center, zoom);

    // add marker for the Weberschule
    markers.addMarker(new OpenLayers.Marker(weberschule.clone().transform(wgs84, map.getProjectionObject()), new OpenLayers.Icon('images/school-icon.png', new OpenLayers.Size(40,40), new OpenLayers.Pixel(-40,-20))));


    map.addLayer(markers);
    map.addLayer(dangers);

    //addMarker(centerLat,centerLng,"Weberschule","This is Weberschule",map)
    // add Markers for Gefahrenstellen
    reloadMarkers(spots,map);

//enableRouting(map);

});


function addMarker(lat,lng,name,description,photo_id,photo_file_name,rating,map) {
    var lonLatMarker = new OpenLayers.LonLat(lng, lat).transform(wgs84, mapprojection);
    var feature = new OpenLayers.Feature(osm, lonLatMarker);
    feature.closeBox = true;

    feature.popupClass = OpenLayers.Class(OpenLayers.Popup.FramedCloud, {
	displayClass: 'dangerpopup'
    } );
		var img_src = photos_destination_on_server + photo_id + "/small/" + photo_file_name;
	    feature.data.popupContentHTML = '<h1 class="dangerheadline">' + name
	 									+ '</h1><img src="' + img_src + '" alt="' +
	 									name + ' /><p class="dangerdescription">' +
	 									description + '</p>';
	var icon = new OpenLayers.Icon();
	var marker = createMarker(lonLatMarker,rating,'/javascripts/OpenLayers-2.9.1/img/marker.png')
    marker.feature = feature;
    var markerDown = function(evt) {
	if (this.popup == null) {
	    this.popup = this.createPopup(this.closeBox);
	    map.addPopup(this.popup);
	    this.popup.show();
	} else {
	    this.popup.toggle();
	}
	OpenLayers.Event.stop(evt);
    };
    marker.events.register("mousedown", feature, markerDown);
    dangers.addMarker(marker);
}
function addMarkerDescOnly(lat,lng,name,description,rating,map) {
    var lonLatMarker = new OpenLayers.LonLat(lng, lat).transform(wgs84, mapprojection);
    var feature = new OpenLayers.Feature(osm, lonLatMarker);
    feature.closeBox = true;

    feature.popupClass = OpenLayers.Class(OpenLayers.Popup.FramedCloud, {
	displayClass: 'dangerpopup'
    } );
	    feature.data.popupContentHTML = '<h1 class="dangerheadline">' + name
	 									+ '</h1><p class="dangerdescription">' +
	 									description + '</p>';
	
	var marker = createMarker(lonLatMarker,rating,'/javascripts/OpenLayers-2.9.1/img/marker.png')
    marker.feature = feature;

    var markerDown = function(evt) {
	if (this.popup == null) {
	    this.popup = this.createPopup(this.closeBox);
	    map.addPopup(this.popup);
	    this.popup.show();
	} else {
	    this.popup.toggle();
	}
	OpenLayers.Event.stop(evt);
    };

    marker.events.register("mousedown", feature, markerDown);
    dangers.addMarker(marker);
}

function createMarker(position,rating,iconImgSrc){
	var icon = new OpenLayers.Icon(iconImgSrc);
	icon.size = new OpenLayers.Size(20*(1+rating/10),30*(1+rating/10));
    var marker = new OpenLayers.Marker(position,icon);
	return marker;
}

function reloadMarkers(spots,map){
	dangers.clearMarkers();
    if (spots.length > 0) {
	for (var i=0; i < spots.length; i++) {
		var spot = spots[i];
		if(spot.photos.length == 0){
			addMarkerDescOnly(spot.lat,spot.lng,spot.name,spot.description,spot.calc_rating,map);
		}
		else{
		    addMarker(spot.lat, spot.lng, spot.name, spot.description, spot.photos[0].id, spot.photos[0].data_file_name,spot.calc_rating, map);
		}
	};
    } else{
	//when only one marker should be displayed #show,edit, etc.
	addMarker(spots.lat, spots.lng, spots.name, spots.description, map);
	//		centerCoords = new CM.LatLng(spots.lat, spots.lng);
	centerCoords = new OpenLayers.LonLat(spots.lng, spots.lat);
	map.setCenter(centerCoords, zoom);
    };
}


function removeRoutes() { 
    if (routemarkers.markers[0]) {
	routemarkers.removeMarker(routemarkers.markers[0]);
    }
    if (vectors.features.length > 0) {
	vectors.destroyFeatures();
    }
}

function removeRoute(route) {
    if (route) {

	var routepoints = [];
	for (var i = 0; i < route.geometry.coordinates.length; i++) {
	    var point = new OpenLayers.Geometry.Point(
		route.geometry.coordinates[i][0],
		route.geometry.coordinates[i][1]
		);
	    routepoints.push(point.transform(wgs84, map.getProjectionObject()));
	}
	var routegeometry = new OpenLayers.Geometry.LineString(routepoints);

	for (var i=0; i < vectorLayer.features.length; i++) {
	    var cur = vectorLayer.features[i];
	    if ((routegeometry.getBounds().left == cur.geometry.getBounds().left) &&
		(routegeometry.getBounds().right == cur.geometry.getBounds().right) &&
		(routegeometry.getBounds().top == cur.geometry.getBounds().top) &&
		(routegeometry.getBounds().bottom == cur.geometry.getBounds().bottom)) {
		vectorLayer.removeFeatures(cur);
	    }
	}
    }
}

function drawRoute(route) {
    if (route) {
	var points = [];
	for (var i = 0; i < route.geometry.coordinates.length; i++) {
	    var point = new OpenLayers.Geometry.Point(
		route.geometry.coordinates[i][0],
		route.geometry.coordinates[i][1]
		);
	    points.push(point.transform(wgs84, map.getProjectionObject()));
	}
	var geometry = new OpenLayers.Geometry.LineString(points);
	var feature = new OpenLayers.Feature.Vector(geometry, null, {
	    strokeColor: "#0033ff",
	    strokeOpacity: 0.7,
	    strokeWidth: 5
	});

	vectorLayer.addFeatures(feature);
    //                 vectors.addFeatures(feature);

    }
}



DeleteFeature = OpenLayers.Class(OpenLayers.Control, {
    initialize: function(layer, options) {
	OpenLayers.Control.prototype.initialize.apply(this, [options]);
	this.layer = layer;
	this.handler = new OpenLayers.Handler.Feature(
	    this, layer, {
		click: this.clickFeature
	    }
	    );
    },
    clickFeature: function(feature) {
	// if feature doesn't have a fid, destroy it
	if(feature.fid == undefined) {
	    this.layer.destroyFeatures([feature]);
	} else {
	    feature.state = OpenLayers.State.DELETE;
	    this.layer.events.triggerEvent("afterfeaturemodified", {
		feature: feature
	    });
	    feature.renderIntent = "select";
	    this.layer.drawFeature(feature);
	}
    },
    setMap: function(map) {
	this.handler.setMap(map);
	OpenLayers.Control.prototype.setMap.apply(this, arguments);
    },
    CLASS_NAME: "OpenLayers.Control.DeleteFeature"
})


/*
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

*/