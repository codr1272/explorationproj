import React, { useRef, useState, useEffect } from "react";
import { Popup, Marker, useMap } from "react-leaflet";
import markerLogo from "../../img/1.39z.png";
import markerImage from "../../img";
import L from "leaflet";
import "leaflet-rotatedmarker";
import RotateControl from "../RotateControl/RotateControl";

const defaultIcon = new L.Icon({
  iconUrl: markerLogo,
  iconRetinaUrl: markerLogo,
  iconSize: [60, 60],
  iconAngle: 100,
  iconAnchor: [30, 30],
});

const DraggableDzMarker = ({ handleMarkerPosition, setDraggableDzMarkerWKT, rotationAngle, setRotationAngle, newRowData }) => {
  const map = useMap();
  const [markerPosition, setMarkerPosition] = useState(map.getCenter());
  const selectMarkerRef = useRef(null);
  const [customIcon, setCustomIcon] = useState(defaultIcon);

  const handleDragEnd = (e) => {
    const newPosition = e.target.getLatLng();
    setMarkerPosition([newPosition.lat, newPosition.lng]);
    handleMarkerPosition(newPosition);
    setDraggableDzMarkerWKT([newPosition.lat, newPosition.lng]);
  };

  useEffect(() => {
    if (selectMarkerRef.current) {
      selectMarkerRef.current.openPopup();
    }
  }, []);

  useEffect(() => {
    if (selectMarkerRef.current) {
      selectMarkerRef.current.setRotationAngle(rotationAngle);
    }
  }, [rotationAngle]);

  useEffect(() => {
    if (newRowData.num_pdr !== undefined) {
      const iconUrl = markerImage[newRowData.num_pdr];
      setCustomIcon(
        new L.Icon({
          iconUrl: iconUrl,
          iconRetinaUrl: iconUrl,
          iconSize: [50, 50],
          iconAnchor: [30, 30],
          iconAngle: rotationAngle,
        })
      );
    }
  }, [newRowData, rotationAngle]);

  return (
    <Marker
      draggable={true}
      position={markerPosition}
      ref={selectMarkerRef}
      icon={customIcon}
      eventHandlers={{
        dragend: handleDragEnd,
      }}
    >
      <Popup openPopup={true}>Перемістіть знак у потрібне місце</Popup>
      <RotateControl
        rotationAngle={rotationAngle}
        setRotationAngle={setRotationAngle}
        markerPosition={markerPosition}
        map={map}
        setMarkerPosition={setMarkerPosition}
        handleMarkerPosition={handleMarkerPosition}
        setDraggableDzMarkerWKT={setDraggableDzMarkerWKT}
      />
    </Marker>
  );
};

export default DraggableDzMarker;
