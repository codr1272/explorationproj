import React, { useState, useEffect } from "react";
import RefreshSVG from '../../img/refresh';

const RotateControl = ({ rotationAngle, setRotationAngle, markerPosition, map }) => {
  const [isRotating, setIsRotating] = useState(false);

  const rotationCoefficient = 0.5;

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    map.dragging.disable();
    setIsRotating(true);
  };

  const handleMouseUp = () => {
    setIsRotating(false);
    map.dragging.enable();
  };

  const handleMouseMove = (e) => {
    if (isRotating) {
      const rect = e.target.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      let degrees = (angle * (180 / Math.PI) + 360) % 360;
      setRotationAngle(degrees.toFixed());
    }
  };

  useEffect(() => {
    const handleMouseUpOutside = () => {
      setIsRotating(false);
    };

    document.addEventListener("mouseup", handleMouseUpOutside);

    return () => {
      document.removeEventListener("mouseup", handleMouseUpOutside);
    };
  }, []);

  return (
    <div
      className="rotate-control"
      style={{
        position: "absolute",
        top: `${map.latLngToContainerPoint(markerPosition).y - 35}px`,
        left: `${map.latLngToContainerPoint(markerPosition).x + 35}px`,
        transform: `translate(-50%, -50%) rotate(${rotationAngle}deg)`,
        cursor: 'drag',
        zIndex: 400,
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <RefreshSVG style={{ width: "70px", height: "70px", transform: `rotate(${-rotationAngle}deg)` }} />
    </div>
  );
};

export default RotateControl;
