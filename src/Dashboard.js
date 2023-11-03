import React, { useEffect, useState } from "react";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import {
  getDatabase,
  ref,
  onValue,
  update as dbUpdate,
} from "firebase/database";
import { set } from "firebase/database";

function Dashboard() {
  const auth = getAuth();
  const navigate = useNavigate();

  const db = getDatabase();
  const [seats, setSeats] = useState({});
  const [user, setUser] = useState(auth.currentUser);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [showCards, setShowCards] = useState(false);
  const [average, setAverage] = useState(null);

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [editedUsername, setEditedUsername] = useState(
    user?.displayName || user?.email
  );

  useEffect(() => {
    const fetchData = async () => {
      const seatRef = ref(db, "seats");
      onValue(seatRef, (snapshot) => {
        const data = snapshot.val();
        setSeats(data || {});
      });
    };

    fetchData();

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setEditedUsername(currentUser.displayName || currentUser.email);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [db, auth]);

  const updateSelectedCard = async (cardNumber) => {
    if (user) {
      const userSeatKey = Object.keys(seats).find(
        (key) =>
          seats[key].username === user.displayName ||
          seats[key].username === user.email
      );

      if (userSeatKey) {
        const seatRef = ref(db, `seats/${userSeatKey}`);

        const updatedData = {
          username: user.displayName || user.email,
          selectedCard: cardNumber,
        };
        await set(seatRef, updatedData);
      }
    }
  };

  const resetSelectedNumbers = async () => {
    try {
      setShowCards(false);
      const updates = {};
      Object.keys(seats).forEach((key) => {
        updates[`seats/${key}/selectedCard`] = null;
      });
      await dbUpdate(ref(db), updates);
    } catch (error) {
      console.error("Seçimleri sıfırlarken hata oluştu:", error.message);
    }
  };

  const handleUsernameClick = () => {
    setIsEditingUsername(true);
  };

  const handleUsernameChange = (e) => {
    setEditedUsername(e.target.value);
  };

  const calculateAverage = () => {
    const selectedNumbers = Object.values(seats).map(
      (seat) => seat.selectedCard
    );
    const validNumbers = selectedNumbers.filter((num) => num != null);
    const sum = validNumbers.reduce((acc, curr) => acc + curr, 0);
    const avg = validNumbers.length > 0 ? sum / validNumbers.length : 0;
    setAverage(avg);
  };

  const openCards = () => {
    setShowCards(true);
    calculateAverage();
  };

  const handleUsernameSubmit = async () => {

    try {
      if (
        user &&
        editedUsername !== user.displayName &&
        editedUsername !== ""
      ) {
        const isUsernameTaken = Object.values(seats).includes(editedUsername);

        if (isUsernameTaken) {
          alert(
            "This username is already taken. Please choose a different one."
          );
          return;
        }

        const userSeatKey = Object.keys(seats).find(
          (key) => seats[key] === user.displayName || seats[key] === user.email
        );
        console.log(userSeatKey);

        if (userSeatKey) {
          await set(ref(db, "seats/" + userSeatKey), editedUsername);
        }
        await updateProfile(user, { displayName: editedUsername });

        //setUser({ ...user, displayName: editedUsername });
        setIsEditingUsername(false);
      }
    } catch (error) {
      console.error("Error updating display name:", error.message);
      alert("Error updating display name: " + error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu:", error.message);
    }
  };

  const handleResetAndExit = async () => {
    try {
      await set(ref(db, "seats"), {});
      await handleSignOut();
    } catch (error) {
      console.error("Reset and Exit failed:", error.message);
      alert(
        "An error occurred while trying to reset and exit. Please try again."
      );
    }
  };

  return (
    <div className="dashboard">
      <div className="title-bar">
        {user && (
          <>
            {isEditingUsername ? (
              <div className="username-edit">
                <input
                  className="username-input"
                  value={editedUsername}
                  onChange={handleUsernameChange}
                  autoFocus
                />
                <button
                  className="save-username-button"
                  onClick={handleUsernameSubmit}
                >
                  Save
                </button>
              </div>
            ) : (
              <span className="center-text" onClick={handleUsernameClick}>
                {user.displayName || user.email}
              </span>
            )}
            <button onClick={handleSignOut}>Çıkış Yap</button>
            <button onClick={handleResetAndExit}>Reset</button>
          </>
        )}
      </div>
      <div className="seating-area">
        <div className="left-side">
          {Object.keys(seats)
            .slice(0, 5)
            .map((seat, index) => (
              <div className="person" key={index}>
                <div className="seat">{seats[seat].username || index + 1}</div>
                <div className="spacer"></div>
                <div className="cards">
                  {showCards ? (
                    seats[seat].selectedCard
                  ) : !seats[seat].selectedCard ? (
                    <img
                      src="/secret.png"
                      width="100%"
                      height="100%"
                      alt="Card back"
                    />
                  ) : (
                    <img
                      src="/pokemon.png"
                      width="170%"
                      height="100%"
                      alt="Card back"
                    />
                  )}
                </div>
              </div>
            ))}
          {[...Array(5 - Object.keys(seats).slice(0, 5).length)].map(
            (_, index) => (
              <div className="person empty" key={index}>
                <div className="seat"></div>
                <div className="spacer"></div>
                <div className="cards"></div>
              </div>
            )
          )}
        </div>
        <div className="right-side">
          {Object.keys(seats)
            .slice(5, 10)
            .map((seat, index) => (
              <div className="person" key={index}>
                <div className="cards">
                  {showCards ? (
                    seats[seat].selectedCard
                  ) : !seats[seat].selectedCard ? (
                    <img
                      src="/secret.png"
                      width="100%"
                      height="100%"
                      alt="Card back"
                    />
                  ) : (
                    <img
                      src="/pokemon.png"
                      width="170%"
                      height="100%"
                      alt="Card back"
                    />
                  )}
                </div>
                <div className="spacer"></div>
                <div className="seat">{seats[seat].username || index + 5}</div>
              </div>
            ))}
          {[...Array(5 - Object.keys(seats).slice(5, 10).length)].map(
            (_, index) => (
              <div className="person empty" key={index}>
                <div className="cards"></div>
                <div className="spacer"></div>
                <div className="seat"></div>
              </div>
            )
          )}
        </div>
      </div>
      <div className="center-button align-column">
        <button className="button-shape" onClick={openCards}>
          Kartları Aç
        </button>
        <button className="button-shape" onClick={resetSelectedNumbers}>
          Seçimleri Sıfırla
        </button>
        {average !== null && (
          <div className="average-display">Average: {average.toFixed(2)}</div>
        )}
      </div>

      <div className="floating-box">
        {[1, 2, 3, 5, 8].map((number) => (
          <div
            key={number}
            className="number"
            onClick={() => updateSelectedCard(number)}
          >
            {number}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
