import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, Popup, Marker, WMSTileLayer, LayersControl, FeatureGroup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import 'react-leaflet-markercluster/dist/styles.min.css';
import markerImage from "../../img";
import isEqual from 'lodash/isEqual';
import MouseCoordinates from "../CursorCoordinates/MapEvents";
import ListPolygons from "../ListPolygons/ListPolygons";
import DraggableDzMarker from "../DraggableDzMarker/DraggableDzMarker";
import MapBoundsHandler from "../../helpers/getBounds";
import { BeatLoader } from 'react-spinners';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
  iconUrl: require("leaflet/dist/images/marker-icon.png").default,
  shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
});
const { Overlay } = LayersControl;
const coordinatesStyle = {
  position: "absolute",
  bottom: "20px",
  right: "10px",
  padding: "5px",
  backgroundColor: "white",
  borderRadius: "5px",
  zIndex: 1000,
};
const LeafletMap = ({
  handlePolygonClick,
  handleDzClick,
  handleAddMarkerData,
  handleAddFromPolygon,
  focusMarker,
  setPolygonTableRowClick,
  setSelectedMarkerId,
  setSelectedPolygonApp,
  buttonAddDocPressed,
  handleMarkerDzDragend,
  showDraggableDzMarker,
  setDraggableDzMarkerWKT,
  pushToDZCalled,
  setPushToDZCalled,
  isChecked,
  setFocusMarker,
  rotationAngle,
  setRotationAngle,
  newRowData,
  dzList,
}) => {
  const containerStyle = {
    height: "calc(100vh - 40px)",
    position: 'relative',
  };
  const center = {
    lat: 50.3865,
    lng: 30.4695,
  };
  const [polygons, setPolygons] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [selectedPolygonId, setSelectedPolygonId] = useState(null);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [mapBounds, setMapBounds] = useState({
    _southWest: [50.36, 30.46],
    _northEast: [50.39, 30.48],
  });
  const [filteredPolygons, setFilteredPolygons] = useState([]);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [coordinaetes, setCoordinates] = useState();
  // eslint-disable-next-line no-unused-vars
  const [selectedPolygonMarkers, setSelectedPolygonMarkers] = useState([]);
  const [clickedPolygons, setClickedPolygons] = useState([]);
  const [selectedPolygonIdFromList, setSelectedPolygonIdFromList] = useState(null);
  const [prevMapBounds, setPrevMapBounds] = useState(null);
  const [loading, setLoading] = useState(false);
  const refs = markers.reduce((acc, marker) => {
    acc[marker.id] = React.createRef();
    return acc;
  }, {});

  useEffect(() => {
    const fetchPolygons = async () => {
      try {
        setLoading(true);
        if (isChecked && !buttonAddDocPressed) {
          const polygonsResponse = await fetch(
            `http://localhost:3001/doc_plg`
          );
          const polygonsData = await polygonsResponse.json();
          const filteredPolygons = polygonsData.map((polygon) => ({
            ...polygon,
            pro_name: polygon.pro_name,
            geom: {
              ...polygon.geom,
              coordinates: polygon.geom.coordinates[0].filter(
                (coordinate) => coordinate[0] !== null && coordinate[1] !== null
              ),
            },
          }));
          setPolygons(filteredPolygons);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching polygons data", error);
        setLoading(false);
      }
    };
    if (!prevMapBounds || !isEqual(prevMapBounds, mapBounds)) {
      fetchPolygons();
      setPrevMapBounds(mapBounds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMarkers = async () => {
    try {
      setLoading(true);
      const markersResponse = await fetch(
        `http://localhost:3001/dz?minLat=${mapBounds._southWest[0]}&minLng=${mapBounds._southWest[1]}&maxLat=${mapBounds._northEast[0]}&maxLng=${mapBounds._northEast[1]}`
      );
      const markersData = await markersResponse.json();

      const dzMarkers = markersData.map((marker) => ({
        id: marker.id,
        coordinates: marker.geom.coordinates[0],
        num_pdr: marker.num_pdr,
        ang_map: marker.ang_map,
      }));

      const allMarkers = [...dzMarkers, ...dzList];

      setMarkers(allMarkers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching markers data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!prevMapBounds || !isEqual(prevMapBounds, mapBounds)) {
      fetchMarkers();
      setPrevMapBounds(mapBounds);
      setPushToDZCalled(false);
    }
  }, [dzList, mapBounds, prevMapBounds, setMarkers, setPushToDZCalled]);

  useEffect(() => {
    fetchMarkers();
  }, [dzList]);

  useEffect(() => {
    const focusedMarker = markers.find((marker) => marker.id === focusMarker);
    const markerRef = focusedMarker ? refs[focusedMarker.id] : null;
    if (markerRef && markerRef.current && typeof markerRef.current.openPopup === 'function') {
      markerRef.current.openPopup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusMarker]);

  const filterMarkersWithinPolygon = (polygonCoordinates) => {
    if (!markers || markers.length === 0) {
      return [];
    }
    const filtered = markers.filter((marker) => {
      if (!marker.coordinates || !Array.isArray(marker.coordinates) || marker.coordinates.length < 2) {
        return false;
      }
      const point = L.latLng(marker.coordinates[1], marker.coordinates[0]);
      return isPointWithinPolygon(point, polygonCoordinates);
    });
    setFilteredMarkers(filtered);
    handleAddFromPolygon(filtered);
  };

  const isPointWithinPolygon = (point, polygonCoordinates) => {
    const x = point.lng;
    const y = point.lat;
    let isInside = false;
    for (
      let i = 0, j = polygonCoordinates.length - 1;
      i < polygonCoordinates.length;
      j = i++
    ) {
      const xi = polygonCoordinates[i][0];
      const yi = polygonCoordinates[i][1];
      const xj = polygonCoordinates[j][0];
      const yj = polygonCoordinates[j][1];
      const intersect =
        (yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) isInside = !isInside;
    }
    return isInside;
  };

  const handleClick = (e, polygon) => {
    e.target.openPopup();
    handlePolygonClick(polygon.objectid);
    setSelectedPolygonId(polygon.objectid);
    setSelectedPolygon(polygon);
    setSelectedPolygonIdFromList(null);

    const handleAsyncClick = async () => {
      const lat = e.latlng?.lat;
      const lng = e.latlng?.lng;

      try {
        const response = await fetch(`http://localhost:3001/doc_plg/filteredPolygons/${lat}/${lng}`);
        const data = await response.json();
        const filteredPolygons = data.map((polygon) => ({
          ...polygon,
          pro_name: polygon.pro_name,
          geom: {
            ...polygon.geom,
            coordinates: polygon.geom.coordinates[0].filter(
              (coordinate) => coordinate[0] !== null && coordinate[1] !== null
            ),
          },
        }));
        setClickedPolygons(filteredPolygons);
      } catch (error) {
        console.error("Error fetching clicked polygons data", error);
      }
    };
    handleAsyncClick();
    const polygonCoordinates = polygon.geom.coordinates;
    const filteredMarkers = filterMarkersWithinPolygon(polygonCoordinates);
    setSelectedPolygonMarkers(filteredMarkers);
  };

  const handleMarkerClick = (markerId) => {
    if (buttonAddDocPressed) {
      setFocusMarker(markerId);
    }
    handlePolygonClick(markerId);
    handleDzClick(markerId);
    const markerData = markers.find((marker) => marker.id === markerId);
    handleAddMarkerData(markerData);
  };

  const filterMarkersByMapBounds = (polygonsInView) => {
    return markers.filter((marker) =>
      polygonsInView.some((polygon) =>
        isPointWithinPolygon(marker, polygon.geom.coordinates)
      )
    );
  };

  const isPolygonWithinMapBounds = (polygon) => {
    if (mapBounds) return true;
  };
  
  const handleMarkerDragEnd = (position) => {
    handleMarkerDzDragend(position);
  };

  useEffect(() => {
    const polygonsInView = polygons.filter((polygon) =>
      isPolygonWithinMapBounds(polygon)
    );
    setFilteredPolygons(polygonsInView);
    setFilteredMarkers(filterMarkersByMapBounds(polygonsInView));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polygons]);

  const createMarkerIcon = (num_pdr, ang_map, isFocused) => {
    let rotationClass = 'rotate-0';

    if (ang_map !== undefined) {
      const roundedAngle = Math.round(ang_map / 45) * 45;
      rotationClass = `rotate-${roundedAngle}`;
    }

    const iconSize = isFocused ? [45, 45] : [35, 35];

    return L.divIcon({
      className: `custom-icon ${rotationClass}`,
      html: `
      <img 
        src="${markerImage[num_pdr]}" 
        class="custom-icon-img" 
        style="transform: rotate(${ang_map}deg); width: ${iconSize[0]}px; height: ${iconSize[0]}px;"
      />`,
      iconSize,
      iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
      popupAnchor: [0, 0],
    });
  };

  const wmsLayerUrl = 'http://192.168.1.3/cgi-bin/mapserv?map=/var/www/html/map/kyivcl.map';

  return (
    <div className="LeafletMapContainer ">
      <MapContainer
        center={center}
        maxZoom={20}
        zoom={17}
        style={containerStyle}
        preferCanvas={true}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OSM">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              noWrap={true}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="WMS">
            <WMSTileLayer
              layers="dz"
              url={wmsLayerUrl}
              format="image/png"
              transparent={true}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Dark">
            <TileLayer
              url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}"
              minZoom={0}
              maxZoom={20}
              attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              ext="png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Building Map">
            <TileLayer
              url="https://tiles.stadiamaps.com/tiles/stamen_toner_background/{z}/{x}/{y}{r}.{ext}"
              minZoom={0}
              maxZoom={20}
              attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              ext="png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Real">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            />
          </LayersControl.BaseLayer>
          <Overlay name="Markers" checked>
            <MarkerClusterGroup disableClusteringAtZoom={18}>
              {isChecked ? (
                filteredMarkers.map((marker) => (
                  <Marker
                    key={marker.id}
                    position={marker.coordinates}
                    icon={createMarkerIcon(
                      marker.num_pdr,
                      marker.ang_map,
                      marker.id === focusMarker
                    )}
                    zIndexOffset={marker.id === focusMarker ? 999000 : 100}
                    eventHandlers={{
                      click: () => {
                        handleMarkerClick(marker.id);
                      },
                    }}
                    ref={refs[marker.id]}
                  >
                    <Popup position={marker.coordinates} autoClose={true}>
                      {`${marker.num_pdr} [${marker.id}]`}
                    </Popup>
                  </Marker>
                ))
              ) : (
                markers.map((marker) => (
                  <Marker
                    key={marker.id}
                    position={marker.coordinates}
                    icon={createMarkerIcon(
                      marker.num_pdr,
                      marker.ang_map,
                      marker.id === focusMarker
                    )}
                    zIndexOffset={marker.id === focusMarker ? 1000 : 100}
                    eventHandlers={{
                      click: () => {
                        handleMarkerClick(marker.id);
                      },
                    }}
                    ref={refs[marker.id]}
                  >
                    <Popup position={marker.coordinates} autoClose={true}>
                      {`${marker.num_pdr}[${marker.id}]`}
                    </Popup>
                  </Marker>
                ))
              )}
            </MarkerClusterGroup>
          </Overlay>
          <Overlay name="Polygons" checked>
            <FeatureGroup>
              {isChecked && selectedPolygon && selectedPolygon.geom && (
                <Polygon
                  key={selectedPolygonId}
                  positions={selectedPolygon.geom.coordinates || []}
                  pathOptions={{
                    color: "red",
                    zIndex: "2147483647",
                    opacity: "1",
                  }}
                  eventHandlers={{
                    click: (e) => handleClick(e, selectedPolygon),
                  }}
                >
                  <Popup>{selectedPolygon.pro_name}</Popup>
                </Polygon>
              )}
              {!buttonAddDocPressed && filteredPolygons.map((polygon) => (
                <Polygon
                  key={polygon.objectid}
                  positions={polygon.geom.coordinates}
                  pathOptions={{
                    color:
                      selectedPolygon === polygon || selectedPolygonIdFromList === polygon.objectid
                        ? "red"
                        : "purple",
                    zIndex:
                      selectedPolygon === polygon || selectedPolygonIdFromList === polygon.objectid
                        ? '2147483647'
                        : '',
                    opacity:
                      selectedPolygon === polygon || selectedPolygonIdFromList === polygon.objectid
                        ? '1'
                        : '0.7',
                  }}
                  eventHandlers={{
                    click: (e) => handleClick(e, polygon),
                  }}
                >
                  <Popup>{polygon.pro_name}</Popup>
                </Polygon>
              ))}
            </FeatureGroup>
          </Overlay>
        </LayersControl>
        <MapBoundsHandler setMapBounds={setMapBounds} />
        {showDraggableDzMarker && (
          <DraggableDzMarker
            handleMarkerPosition={handleMarkerDragEnd}
            setDraggableDzMarkerWKT={setDraggableDzMarkerWKT}
            rotationAngle={rotationAngle}
            setRotationAngle={setRotationAngle}
            newRowData={newRowData}
          />
        )}
        <MouseCoordinates setCoordinates={setCoordinates} />
        {coordinaetes ? <div style={coordinatesStyle}>{coordinaetes}</div> : ""}
        {clickedPolygons.length > 1 && !buttonAddDocPressed &&
          <ListPolygons
            clickedPolygons={clickedPolygons}
            setPolygonTableRowClick={setPolygonTableRowClick}
            setSelectedMarkerId={setSelectedMarkerId}
            setSelectedPolygonApp={setSelectedPolygonApp}
            setClickedPolygons={setClickedPolygons}
            setSelectedPolygonIdFromList={setSelectedPolygonIdFromList}
            setSelectedPolygon={setSelectedPolygon}
            filterMarkersWithinPolygon={filterMarkersWithinPolygon}
            setSelectedPolygonMarkers={setSelectedPolygonMarkers}
          />
        }
        {loading && (
          <div className={`loader-overlay ${loading ? 'show' : ''}`}>
            <BeatLoader color="#36d7b7" loading={true} size={50} />
          </div>
        )}
      </MapContainer>
    </div >
  );
};
export default LeafletMap;