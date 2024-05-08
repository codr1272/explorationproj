import React, { useState, useEffect, useRef } from "react";

const DraggablePopup = ({ children }) => {
  const [dragging, setDragging] = useState(false);
  const [relX, setRelX] = useState(0);
  const [relY, setRelY] = useState(0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const divRef = useRef(null);

  const excludedElementsToClick = ["INPUT", "SELECT", "TEXTAREA"];

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    } else {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging]);

  const centerComponent = () => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const componentWidth = rect.width;
      const componentHeight = rect.height;
      setX((screenWidth - componentWidth) / 2);
      setY((screenHeight - componentHeight) / 2);
    }
  };

  useEffect(() => {
    centerComponent();
  }, []);

  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    if (excludedElementsToClick.includes(e.target.tagName)) return;
  
    const { clientX, clientY } = e;
    const rect = divRef.current.getBoundingClientRect();
  
    setDragging(true);
    setRelX(clientX - rect.left);
    setRelY(clientY - rect.top);
  
    e.stopPropagation();
    e.preventDefault();
  };
  

  const onMouseMove = (e) => {
    if (!dragging) return;
    const { clientX, clientY } = e;
    const newX = clientX - relX;
    const newY = clientY - relY;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const componentWidth = divRef.current.offsetWidth;
    const componentHeight = divRef.current.offsetHeight;
    const maxX = screenWidth - componentWidth;
    const maxY = screenHeight - componentHeight;

    setX(Math.max(0, Math.min(newX, maxX)));
    setY(Math.max(0, Math.min(newY, maxY)));

    e.stopPropagation();
    e.preventDefault();
  };

  const onMouseUp = () => {
    setDragging(false);
  };

  return (
    <div
      ref={divRef}
      style={{ position: "absolute", left: x, top: y, cursor: "move" }}
      onMouseDown={onMouseDown}
    >
      {children}
    </div>
  );
};

export default DraggablePopup;