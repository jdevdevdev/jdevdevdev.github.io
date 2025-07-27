"use client";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [positions, setPositions] = useState<GeolocationPosition[]>([]);
  const [updateCount, setUpdateCount] = useState<number>(0);

  useEffect(() => {
    const watchID = navigator.geolocation.watchPosition(
      (position) => {
        setPositions([position, ...positions]);
        setUpdateCount(updateCount + 1);
      },
      () => { },
      { enableHighAccuracy: true }
    );

    return () => {
      navigator.geolocation.clearWatch(watchID);
    }
  }, [setPositions]);

  return (<div>
    <div>{updateCount}</div>
    {positions.map((pos, index) => {
      const coords = pos.coords
      const coordEntries: [keyof GeolocationCoordinates, number | null][] = [
        ['latitude', coords.latitude],
        ['longitude', coords.longitude],
        ['altitude', coords.altitude],
        ['accuracy', coords.accuracy],
        ['altitudeAccuracy', coords.altitudeAccuracy],
        ['heading', coords.heading],
        ['speed', coords.speed],
      ];

      return <div style={{border: "1px solid white", padding: "10px"}} key={index}>
        {coordEntries.map(([key, value]) => (
          <div key={key}>
            <strong>{key}:</strong> {value === null ? 'N/A' : value}
          </div>
        ))}
      </div>
    })}
  </div>);
}