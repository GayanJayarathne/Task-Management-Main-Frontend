import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  LoadScriptProps,
  Marker,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";

interface Coordinates {
  lat: number;
  lng: number;
}

type Libraries = LoadScriptProps["libraries"];
type MapRef = google.maps.Map;
type GeocoderRef = google.maps.Geocoder;
type GeocoderResult = google.maps.GeocoderResult;
type GeocoderStatus = google.maps.GeocoderStatus;
type MapMouseEvent = google.maps.MapMouseEvent;
type SearchBoxRef = google.maps.places.SearchBox;

interface AddressType {
  formatted: string;
  latitude: number;
  longitude: number;
}

interface MapModelProps {
  onChange: (address: string, coordinate: Coordinates) => void;
  value: AddressType;
}

const MapModel: React.FC<MapModelProps> = ({ onChange, value }) => {
  const apiKey = "AIzaSyBNZnJBfSKDf5ysfXcEsxI6p2xgRr1gxxA";
  const initialZoom = 14;
  const mapHeight = "500px";
  const [address, setAddress] = useState<string>("");
  const [coordinates, setCoordinates] = useState<Coordinates>({
    lat: 6.927079,
    lng: 79.861243,
  });
  const [map, setMap] = useState<MapRef | null>(null);
  const [searchBox, setSearchBox] = useState<SearchBoxRef | null>(null);
  const geocoderRef = useRef<GeocoderRef | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const mapContainerStyle = {
    width: "100%",
    height: mapHeight,
  };

  const libraries: Libraries = ["places"];

  const onMapLoad = (map: MapRef): void => {
    setMap(map);
    geocoderRef.current = new window.google.maps.Geocoder();
  };

  const onSearchBoxLoad = (ref: SearchBoxRef): void => {
    setSearchBox(ref);
  };

  useEffect(() => {
    if (value) {
      setAddress(value.formatted);
      setCoordinates({ lat: value.latitude, lng: value.longitude });
    }
  }, [value]);

  const handlePlacesChanged = (): void => {
    if (searchBox) {
      const places = searchBox.getPlaces();

      if (places && places.length > 0) {
        const place = places[0];

        if (place.formatted_address) {
          setAddress(place.formatted_address);
        }

        if (place.geometry && place.geometry.location) {
          const newCoordinates = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };

          setCoordinates(newCoordinates);
          if (place.formatted_address) {
            onChange(place.formatted_address, newCoordinates);
          }

          if (map) {
            map.panTo(place.geometry.location);
            map.setZoom(initialZoom);
          }
        }
      }
    }
  };

  const handleMapClick = (event: MapMouseEvent): void => {
    if (!event.latLng) return;

    const clickedLat = event.latLng.lat();
    const clickedLng = event.latLng.lng();

    setCoordinates({ lat: clickedLat, lng: clickedLng });

    if (geocoderRef.current) {
      geocoderRef.current.geocode(
        { location: { lat: clickedLat, lng: clickedLng } },
        (results: GeocoderResult[] | null, status: GeocoderStatus) => {
          if (status === "OK" && results && results[0]) {
            setAddress(results[0].formatted_address);

            if (results[0].formatted_address) {
              onChange(results[0].formatted_address, {
                lat: clickedLat,
                lng: clickedLng,
              });
            }

            if (searchInputRef.current) {
              searchInputRef.current.value = results[0].formatted_address;
            }
          } else {
            console.error("Geocoding failed due to: " + status);
            setAddress("Address not found");
          }
        },
      );
    }
  };

  return (
    <div className="map-address-finder">
      <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
        <div
          className="search-container"
          style={{ marginBottom: "10px", position: "relative" }}
        >
          <StandaloneSearchBox
            onLoad={onSearchBoxLoad}
            onPlacesChanged={handlePlacesChanged}
          >
            <Input
              prefix={<SearchOutlined />}
              placeholder="Enter an address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </StandaloneSearchBox>
        </div>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={coordinates}
          zoom={initialZoom}
          onLoad={onMapLoad}
          onClick={handleMapClick}
        >
          <Marker position={coordinates} />
        </GoogleMap>
      </LoadScript>

      <div className="result-container">
        <div>
          <strong>Address:</strong>{" "}
          {address || "Click on the map or search for an address"}
        </div>
        <div>
          <strong>Coordinates:</strong> {coordinates.lat.toFixed(6)},{" "}
          {coordinates.lng.toFixed(6)}
        </div>
      </div>
    </div>
  );
};

export default MapModel;
