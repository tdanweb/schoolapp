import React, { Profiler } from "react"
import {useState, useEffect, useRef} from "react"
import html2canvas from "html2canvas"; 

export default function Snap(elm){
const captureRef = useRef(null);
  const handleCapture = async () => {
    if (!elm.current) return;
    // Capture the element
    const canvas = await html2canvas(elm, {
      scale: 3.0, // increase for sharper images
      useCORS: true,
    });

    //Convert to image & download
    const imgData = canvas.toDataURL("image/png", 1.0);
    const link = document.createElement("a");
    link.href = imgData;
    link.download = "title.png";
    link.click();
  };
}