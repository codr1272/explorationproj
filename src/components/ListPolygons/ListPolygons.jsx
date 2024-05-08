import React from "react";

const ListPolygons = ({
  clickedPolygons,
  setPolygonTableRowClick,
  setSelectedMarkerId,
  setSelectedPolygonApp,
  setClickedPolygons,
  setSelectedPolygonIdFromList,
  setSelectedPolygon,
  setSelectedPolygonMarkers,
  filterMarkersWithinPolygon,
}) => {
  const handleRowClick = (polygon) => {
    setSelectedMarkerId(null);
    setSelectedPolygonApp(null);
    setSelectedPolygonIdFromList(polygon.objectid);
    setSelectedPolygon(polygon);
    setPolygonTableRowClick(polygon);
    setClickedPolygons([]);
    
    const polygonCoordinates = polygon.geom.coordinates;
    const filteredMarkers = filterMarkersWithinPolygon(polygonCoordinates);
    setSelectedPolygonMarkers(filteredMarkers);
  };

  return (
    <table className="map-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Назва</th>
        </tr>
      </thead>
      <tbody>
        {clickedPolygons.map((polygon) => (
          <tr key={polygon.objectid} onClick={() => handleRowClick(polygon)}>
            <td>{polygon.objectid}</td>
            <td>{polygon.pro_name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ListPolygons;
