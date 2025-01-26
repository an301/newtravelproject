import React, { useEffect, useRef, useState } from "react";

const HERE_API_KEY = "v5iH85vmMKhZOP8KkEtw7Kg8DKuBlxvhNkCpfoe_f4A";

const loadHereMaps = () => {
  return new Promise((resolve, reject) => {
    if (window.H) {
      resolve(window.H);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.api.here.com/v3/3.1/mapsjs-core.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const serviceScript = document.createElement("script");
      serviceScript.src = "https://js.api.here.com/v3/3.1/mapsjs-service.js";
      serviceScript.async = true;
      serviceScript.defer = true;
      serviceScript.onload = () => {
        const uiScript = document.createElement("script");
        uiScript.src = "https://js.api.here.com/v3/3.1/mapsjs-ui.js";
        uiScript.async = true;
        uiScript.defer = true;
        uiScript.onload = () => {
          const eventsScript = document.createElement("script");
          eventsScript.src =
            "https://js.api.here.com/v3/3.1/mapsjs-mapevents.js";
          eventsScript.async = true;
          eventsScript.defer = true;
          eventsScript.onload = () => resolve(window.H);
          eventsScript.onerror = reject;
          document.body.appendChild(eventsScript);
        };
        uiScript.onerror = reject;
        document.body.appendChild(uiScript);
      };
      serviceScript.onerror = reject;
      document.body.appendChild(serviceScript);
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

const MapComponent = ({ location }) => {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [platform, setPlatform] = useState(null);

  useEffect(() => {
    if (!mapRef.current) return;

    loadHereMaps()
      .then((H) => {
        if (!platform) {
          const newPlatform = new H.service.Platform({
            apikey: HERE_API_KEY,
          });
          setPlatform(newPlatform);
        }

        if (!platform || !mapRef.current) return;

        if (mapInstance) {
          mapInstance.dispose();
        }

        const defaultLayers = platform.createDefaultLayers();
        const newMap = new H.Map(
          mapRef.current,
          defaultLayers.vector.normal.map,
          {
            center: { lat: 37.7749, lng: -122.4194 }, // Default location: San Francisco
            zoom: 12,
          }
        );

        new H.mapevents.Behavior(new H.mapevents.MapEvents(newMap));
        H.ui.UI.createDefault(newMap, defaultLayers);

        setMapInstance(newMap);
      })
      .catch((err) => {
        console.error("HERE Maps failed to load:", err);
      });

    return () => {
      if (mapInstance) {
        mapInstance.dispose();
      }
    };
  }, [platform]);

  useEffect(() => {
    if (!location || !mapInstance || !platform) return;

    const geocoder = platform.getSearchService();
    geocoder.geocode(
      { q: location },
      (result) => {
        if (result.items.length > 0) {
          const { lat, lng } = result.items[0].position;
          const newCenter = { lat, lng };

          mapInstance.setCenter(newCenter);
          mapInstance.setZoom(14);

          mapInstance.removeObjects(mapInstance.getObjects());

          const marker = new window.H.map.Marker(newCenter);
          mapInstance.addObject(marker);
        } else {
          alert("Location not found");
        }
      },
      (error) => {
        console.error("Geocoding error:", error);
        alert("Error in geocoding");
      }
    );
  }, [location]);

  return (
    <div>
      <div
        ref={mapRef}
        style={{
          width: "650px",
          height: "650px",
          marginTop: "10px",
          borderRadius: "10px",
          border: "2px solid #ccc",
        }}
      />
    </div>
  );
};

export default MapComponent;
