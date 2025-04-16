import React, { useEffect, useRef } from "react";
import { World } from "../World/World.js";

export default function Matrix() {
  const containerRef = useRef(null); 
  const audioFile = useRef(null);

  useEffect(() => {
    const world = new World(containerRef.current, audioFile.current);
    world.start();
    return () => {
      world.stop();
    };
  }, []); 

  return (
    <div>
      <h1>Matrix</h1>
      <input type="file" id="audioFile" ref={audioFile} accept="audio/*" />
      <div id="matrix" ref={containerRef} style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
}