function LocationCard({ location }) {
  const {
    loading,

    distance,

    insideArea,

    accuracy,

    error,
  } = location;

  const styles = {
    card: {
      background: "#fff",

      borderRadius: 20,

      padding: 20,

      marginBottom: 20,

      boxShadow: "0 3px 10px rgba(0,0,0,.1)",
    },
  };

  if (loading) {
    return <div style={styles.card}>Mengambil lokasi...</div>;
  }

  if (error) {
    return <div style={styles.card}>{error}</div>;
  }

  return (
    <div style={styles.card}>
      <h3>Lokasi</h3>

      <p>{insideArea ? "🟢 Dalam Area" : "🔴 Di Luar Area"}</p>

      <p>
        Jarak :{distance?.toFixed(1)}
        meter
      </p>

      <p>
        Akurasi :{accuracy?.toFixed(1)}
        meter
      </p>
    </div>
  );
}

export default LocationCard;
