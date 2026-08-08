import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const userIcon = L.divIcon({
  className: "user-location-marker",
  html: `
    <div class="user-marker">
      <div class="user-marker-pulse"></div>
      <div class="user-marker-dot"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function LocationCard({ location }) {
  const {
    loading,
    latitude,
    longitude,
    distance,
    insideArea,
    accuracy,
    error,
  } = location;

  const hasLocation =
    latitude !== null &&
    latitude !== undefined &&
    longitude !== null &&
    longitude !== undefined;

  const styles = {
    card: {
      background: "#fff",
      borderRadius: 20,
      padding: "14px 16px",
      marginBottom: 16,
      boxShadow: "0 2px 10px rgba(16,24,40,0.06)",
      border: "1px solid #F0F1F5",
      boxSizing: "border-box",
    },

    center: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      color: "#667085",
      fontSize: 13.5,
      minHeight: 34,
    },

    row: {
      display: "flex",
      alignItems: "center",
      gap: 14,
    },

    mapWrapper: {
      width: 102,
      height: 58,
      borderRadius: 14,
      overflow: "hidden",
      flexShrink: 0,
      position: "relative",
      background: "#EEF1F5",
      border: "1px solid #E4E7EC",
    },

    info: {
      flex: 1,
      minWidth: 0,
    },

    captionRow: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginBottom: 5,
    },

    statusDot: (ok) => ({
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: ok ? "#12B76A" : "#F04438",
      flexShrink: 0,
    }),

    caption: (ok) => ({
      fontSize: 13.5,
      fontWeight: 700,
      color: ok ? "#027A48" : "#D92D20",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }),

    stats: {
      fontSize: 12.5,
      color: "#98A2B3",
      lineHeight: 1.5,
    },

    statStrong: {
      color: "#667085",
      fontWeight: 600,
    },
  };

  if (loading) {
    return (
      <div style={styles.card}>
        <style>{`
          @keyframes locationSpin {
            to {
              transform: rotate(360deg);
            }
          }

          .location-spinner {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            border: 2px solid #E4E7EC;
            border-top-color: #4F6BFF;
            animation: locationSpin 0.8s linear infinite;
            flex-shrink: 0;
          }
        `}</style>

        <div style={styles.center}>
          <span className="location-spinner" />
          <span>Mengambil lokasi...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.card}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#D92D20",
            fontSize: 13.5,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: "#FEF3F2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v4"
                stroke="#D92D20"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle cx="12" cy="16.5" r="1" fill="#D92D20" />
              <path
                d="M10.3 4.5L3.2 17a2 2 0 001.7 3h14.2a2 2 0 001.7-3L13.7 4.5a2 2 0 00-3.4 0z"
                stroke="#D92D20"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!hasLocation) {
    return (
      <div style={styles.card}>
        <div style={styles.center}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: "#F2F4F7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21s-7-6.2-7-11.5A7 7 0 0112 2a7 7 0 017 7.5C19 14.8 12 21 12 21z"
                stroke="#98A2B3"
                strokeWidth="1.7"
              />
              <circle
                cx="12"
                cy="9.5"
                r="2.3"
                stroke="#98A2B3"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          <span>Lokasi belum tersedia</span>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <style>{`
        .location-map .leaflet-control-attribution {
          font-size: 7px;
          line-height: 10px;
          background: rgba(255,255,255,0.75);
        }

        .location-map .leaflet-control-zoom {
          display: none;
        }

        .location-map .leaflet-container {
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            sans-serif;
        }

        .user-location-marker {
          background: transparent;
          border: none;
        }

        .user-marker {
          position: relative;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-marker-pulse {
          position: absolute;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(79, 107, 255, 0.22);
        }

        .user-marker-dot {
          position: relative;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #4F6BFF;
          border: 2px solid #FFFFFF;
          box-shadow: 0 1px 4px rgba(16,24,40,0.3);
        }
      `}</style>

      <div style={styles.row}>
        {/* =================================================
            MINI MAP
        ================================================= */}

        <div className="location-map" style={styles.mapWrapper}>
          <MapContainer
            center={[latitude, longitude]}
            zoom={17}
            scrollWheelZoom={false}
            dragging={false}
            doubleClickZoom={false}
            touchZoom={false}
            zoomControl={false}
            attributionControl={true}
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[latitude, longitude]} icon={userIcon} />
          </MapContainer>
        </div>

        {/* =================================================
            INFO LOKASI
        ================================================= */}

        <div style={styles.info}>
          <div style={styles.captionRow}>
            <span style={styles.statusDot(insideArea)} />

            <span style={styles.caption(insideArea)}>
              {insideArea ? "Dalam area sekolah" : "Di luar area sekolah"}
            </span>
          </div>

          <div style={styles.stats}>
            Jarak{" "}
            <span style={styles.statStrong}>
              <strong>
                {typeof distance === "number"
                  ? `${distance.toFixed(1)} m`
                  : "-"}{" "}
              </strong>
              ({typeof accuracy === "number" ? `${accuracy.toFixed(1)} m` : "-"}
              )
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationCard;
