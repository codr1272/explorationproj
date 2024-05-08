import { useEffect, useRef } from "react";
import { useMapEvents } from "react-leaflet";

const MapBoundsHandler = ({ setMapBounds }) => {
  const mapRef = useRef();

  useEffect(() => {
    const map = mapRef.current;
    if (map != null) {
      const bounds = map.getBounds();
      const initialBounds = {
        _southWest: [bounds._southWest.lat, bounds._southWest.lng],
        _northEast: [bounds._northEast.lat, bounds._northEast.lng],
      };
      setMapBounds(initialBounds);
    }
  }, [setMapBounds]);

  useMapEvents({
    moveend: (event) => {
      const map = event.target;
      const bounds = map.getBounds();
      const updatedBounds = {
        _southWest: [bounds._southWest.lat, bounds._southWest.lng],
        _northEast: [bounds._northEast.lat, bounds._northEast.lng],
      };
      setMapBounds(updatedBounds);
    },
  });

  return null;
};

export default MapBoundsHandler;
