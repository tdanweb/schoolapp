import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeGenerator(props) {
  // Use either props.url OR local state
  const [text, setText] = useState(props.url || "hggghjkl;.com");

  return (
    <div style={{ textAlign: "center", marginLeft: "50pt" }}>

      <div style={{ marginTop: "" }}>
        {text && (
          <QRCodeCanvas
            value={text}
            size={120}       // size of QR
            fgColor="#000000" // QR color
            bgColor="#ffffff" // background
            level="H"        // error correction level
          />
        )}
      </div>
    </div>
  );
}