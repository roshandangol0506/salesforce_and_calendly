// app/calendly/page.tsx

"use client";

import React, { useEffect } from "react";

export default function CalendlyPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <h1>Book a Meeting</h1>
      <div
        className="calendly-inline-widget"
        data-url="https://calendly.com/roshan-dangol00"
        style={{ minWidth: "320px", height: "630px" }}
      ></div>
    </div>
  );
}
