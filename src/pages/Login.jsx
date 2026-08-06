import { useState } from "react";

import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

import { auth } from "../firebase/config";

import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const styles = {
    container: {
      maxWidth: 400,
      margin: "50px auto",
      padding: 20,
    },

    input: {
      width: "100%",
      padding: 12,
      marginBottom: 15,
      boxSizing: "border-box",
    },

    button: {
      width: "100%",
      padding: 14,
      background: "#2563eb",
      color: "#fff",
      border: "none",
      borderRadius: 8,
    },
  };

  async function handleLogin() {
    try {
      await setPersistence(auth, browserLocalPersistence);

      await signInWithEmailAndPassword(
        auth,

        email,

        password,
      );

      navigate("/home");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div style={styles.container}>
      <h2>Login Guru</h2>

      <input
        style={styles.input}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        style={styles.input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button style={styles.button} onClick={handleLogin}>
        LOGIN
      </button>
    </div>
  );
}

export default Login;
