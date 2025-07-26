"use client";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [position, setPosition] = useState<GeolocationPosition>();

  useEffect(() => {
    const watchID = navigator.geolocation.watchPosition(
      (position) => {
        setPosition(position);
      },
      () => { },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchID);
    }
  }, [setPosition]);

  return (<div>
    {JSON.stringify(position)}
  </div>);
}