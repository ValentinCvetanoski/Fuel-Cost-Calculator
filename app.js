import React, { useState } from "react";
import { LoadScript, GoogleMap, Marker, DistanceMatrixService } from "@react-google-maps/api";

const libraries = ["places"]; // Required libraries for Google Maps

function App() {
  const [startLocation, setStartLocation] = useState(null); // Point A
  const [destination, setDestination] = useState(null); // Point B
  const [distance, setDistance] = useState(0); // Distance in kilometers
  const [fuelEfficiency, setFuelEfficiency] = useState(7.0); // L/100km
  const [fuelPrice, setFuelPrice] = useState(90); // Price per liter in Macedonian Denar

  const handleMapClick = (event) => {
    if (!startLocation) {
      setStartLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    } else if (!destination) {
      setDestination({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    }
  };

  const calculateFuelCost = () => {
    const litersUsed = (distance / 100) * fuelEfficiency;
    const cost = litersUsed * fuelPrice;
    return cost.toFixed(2); // Format to 2 decimal places
  };

  const handleDistanceResponse = (response) => {
    if (
      response &&
      response.rows &&
      response.rows[0].elements &&
      response.rows[0].elements[0].distance
    ) {
      const distanceInMeters = response.rows[0].elements[0].distance.value;
      setDistance(distanceInMeters / 1000); // Convert to kilometers
    }
  };

  return (
    <div style={styles.appContainer}>
      <h1 style={styles.header}>🚗 Fuel Cost Calculator</h1>
      <LoadScript
        googleMapsApiKey="*************************" // Replace with your API key
        libraries={libraries}
      >
        <GoogleMap
          mapContainerStyle={styles.mapContainer}
          center={{ lat: 41.1171, lng: 20.8016 }} // Ohrid, North Macedonia
          zoom={10}
          onClick={handleMapClick}
        >
          {/* Marker for Start Location */}
          {startLocation && (
            <Marker
              position={startLocation}
              label="A"
              title="Starting Point"
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              }}
            />
          )}

          {/* Marker for Destination */}
          {destination && (
            <Marker
              position={destination}
              label="B"
              title="Destination"
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
              }}
            />
          )}

          {/* Distance Matrix Service */}
          {startLocation && destination && (
            <DistanceMatrixService
              options={{
                origins: [startLocation],
                destinations: [destination],
                travelMode: "DRIVING",
              }}
              callback={handleDistanceResponse}
            />
          )}
        </GoogleMap>
      </LoadScript>

      <div style={styles.controlsContainer}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Fuel Efficiency (L/100km):</label>
          <input
            type="number"
            value={fuelEfficiency}
            onChange={(e) => setFuelEfficiency(parseFloat(e.target.value))}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Fuel Price (Denar/Liter):</label>
          <input
            type="number"
            value={fuelPrice}
            onChange={(e) => setFuelPrice(parseFloat(e.target.value))}
            style={styles.input}
          />
        </div>

        <h2 style={styles.subHeader}>Calculated Distance</h2>
        <p style={styles.infoText}>
          Distance between Point A and Point B:{" "}
          <strong>{distance > 0 ? `${distance} km` : "Not calculated yet"}</strong>
        </p>

        <h2 style={styles.subHeader}>Estimated Fuel Cost</h2>
        <p style={styles.infoText}>
          The estimated fuel cost for the trip is:
        </p>
        <h3 style={styles.fuelCost}>
          {distance > 0 ? `${calculateFuelCost()} Denar` : "N/A"}
        </h3>
      </div>
    </div>
  );
}

const styles = {
  appContainer: {
    fontFamily: "'Poppins', sans-serif",
    textAlign: "center",
    color: "#FFFFFF",
    backgroundColor: "#1e1e2f",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
  },
  header: {
    fontSize: "2.5rem",
    marginBottom: "20px",
    textShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
  },
  mapContainer: {
    width: "90%",
    height: "400px",
    margin: "20px 0",
    border: "2px solid #4CAF50",
    borderRadius: "10px",
    boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
  },
  controlsContainer: {
    backgroundColor: "#29293d",
    width: "80%",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)",
  },
  inputGroup: {
    margin: "10px 0",
  },
  label: {
    fontSize: "1.2rem",
    display: "block",
    marginBottom: "5px",
    color: "#CCCCCC",
  },
  input: {
    width: "80%",
    padding: "10px",
    fontSize: "1rem",
    border: "2px solid #4CAF50",
    borderRadius: "5px",
    outline: "none",
    transition: "0.3s",
  },
  inputFocus: {
    borderColor: "#2196F3",
  },
  subHeader: {
    fontSize: "1.5rem",
    color: "#4CAF50",
    margin: "15px 0",
  },
  infoText: {
    fontSize: "1.2rem",
    color: "#CCCCCC",
  },
  fuelCost: {
    fontSize: "2rem",
    color: "#FF9800",
    fontWeight: "bold",
    margin: "15px 0",
  },
};

export default App;
