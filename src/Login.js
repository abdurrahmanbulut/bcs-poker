import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, set, get } from "firebase/database";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();
  const db = getDatabase();
  const navigate = useNavigate();

  googleProvider.setCustomParameters({
    prompt: "select_account"
  });
  
  const signInWithEmail = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

      const seatsRef = ref(db, "seats");
      const seatsSnapshot = await get(seatsRef);
      const occupiedSeats = seatsSnapshot.val() || {};

      const availableSeats = [];
      for (let i = 1; i <= 10; i++) {
        const seatKey = `seat${i}`;
        if (!occupiedSeats[seatKey]) {
          availableSeats.push(seatKey);
        }
      }

      if (availableSeats.length === 0) {
        alert("Masa dolu!");
        return;
      }

      const randomIndex = Math.floor(Math.random() * availableSeats.length);
      const userSeat = availableSeats[randomIndex];
      await set(ref(db, "seats/" + userSeat), {
        username: user.displayName || user.email,
        selectedCard: null,
      });

      navigate("/dashboard");
    } catch (error) {
      alert("Giriş başarısız: " + error.message);
    }
  };

  const signUpWithEmail = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

      const seatsRef = ref(db, "seats");
      const seatsSnapshot = await get(seatsRef);
      const occupiedSeats = seatsSnapshot.val() || {};

      const availableSeats = [];
      for (let i = 1; i <= 10; i++) {
        const seatKey = `seat${i}`;
        if (!occupiedSeats[seatKey] || !occupiedSeats[seatKey].username) {
          availableSeats.push(seatKey);
        }
      }

      if (availableSeats.length === 0) {
        alert("Masa dolu!");
        return;
      }

      const randomIndex = Math.floor(Math.random() * availableSeats.length);
      const userSeat = availableSeats[randomIndex];
      await set(ref(db, "seats/" + userSeat), {
        username: user.displayName || user.email,
        selectedCard: null,
      });

      navigate("/dashboard");
    } catch (error) {
      alert("Kayıt başarısız: " + error.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      const user = auth.currentUser;

      const seatsRef = ref(db, "seats");
      const seatsSnapshot = await get(seatsRef);
      const occupiedSeats = seatsSnapshot.val() || {};

      const availableSeats = [];
      for (let i = 1; i <= 10; i++) {
        const seatKey = `seat${i}`;
        if (!occupiedSeats[seatKey] || !occupiedSeats[seatKey].username) {
          availableSeats.push(seatKey);
        }
      }

      if (availableSeats.length === 0) {
        alert("Masa dolu!");
        return;
      }

      const randomIndex = Math.floor(Math.random() * availableSeats.length);
      const userSeat = availableSeats[randomIndex];
      await set(ref(db, "seats/" + userSeat), {
        username: user.displayName || user.email,
        selectedCard: null,
      });
      navigate("/dashboard");
    } catch (error) {
      alert("Google ile giriş başarısız: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h4 className="login-header">BCS-Poker</h4>
        <div className="input-group">
          <label className="login-header">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>
        <div className="input-group">
          <label className="login-header">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <button onClick={signInWithEmail}>Giriş Yap</button>
        <button onClick={signUpWithEmail}>Kayıt Ol</button>
        <button onClick={signInWithGoogle}>Google ile Giriş Yap</button>
      </div>
    </div>
  );
}

export default Login;
