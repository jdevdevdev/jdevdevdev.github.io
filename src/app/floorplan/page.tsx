"use client";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [positions, setPositions] = useState<GeolocationPosition[]>([]);

  useEffect(() => {
    const watchID = navigator.geolocation.watchPosition(
      (position) => {
        setPositions([...positions, position]);
      },
      () => { },
      { enableHighAccuracy: true }
    );

    return () => {
      navigator.geolocation.clearWatch(watchID);
    }
  }, [setPositions]);

  return (<div>
    {JSON.stringify(positions)}
  </div>);
}