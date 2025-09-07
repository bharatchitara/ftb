import { useEffect, useRef, useState } from 'react';

interface Driver {
  id: number;
  lat: number;
  lng: number;
}

interface MapViewProps {
  drivers: Driver[];
}

export default function MapView({ drivers }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const apiKey = import.meta.env.REACT_APP_GOOGLE_MAPS_API_KEY;


  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (window.google) {
        setMapLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 13.0827, lng: 80.2707 }, // Chennai
      zoom: 12,
    });

    drivers.forEach(driver => {
      new window.google.maps.Marker({
        position: { lat: driver.lat, lng: driver.lng },
        map,
        title: `Driver ${driver.id}`,
      });
    });
  }, [mapLoaded, drivers]);

  return <div ref={mapRef} style={{ height: '400px', width: '100%' }} />;
}
