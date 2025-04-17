import React, { useEffect, useState, useRef } from "react";

function App() {
  const [word, setWord] = useState(" ");
  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [emoji, setEmoji] = useState("");
  const [score, setScore] = useState(0);
  const [mistake, setMistake] = useState(0);
  const [gameOverGif, setGameOverGif] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const audioRef = useRef(new Audio("gameOver.mp3"));
  const correct = useRef(new Audio("correct.mp3"));
  const wrong = useRef(new Audio("wrong.mp3"));

  const fetchData = async () => {
    try {
      const response = await fetch("https://flaskgamebackend.onrender.com/api/game");
      const data = await response.json();
      const [text, symbol] = data.randomWord.split(":");

      setWord(text);
      setEmoji(symbol);
      setOptions(data.shuffledWords);
      setCorrectAnswer(text);
      setMessage("");
      setDisabled(false);
      setSelectedOption("");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const HandleClick = (option) => {
    if (disabled) return;
    setDisabled(true);
    setSelectedOption(option);

    if (option === correctAnswer) {
      correct.current.play();
      setMessage("Bravo you win 😊");
      setScore((prev) => prev + 1);
      setTimeout(() => {
        fetchData();
      }, 2000);
    } else {
      wrong.current.play();
      setMistake((prev) => {
        const updated = prev + 1;
        if (updated === 3) {
          setMessage("Game Over");
          audioRef.current.play();
          setGameOverGif(true);
        } else {
          setMessage("You lost 😒");
        }
        return updated;
      });
      setTimeout(() => {
        setDisabled(false);
        if (mistake < 3) {
          fetchData();
        }
      }, 2000);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container" style={{ textAlign: "center", padding: "20px" }}>
      {mistake === 3 ? (
        <div>
          {gameOverGif && (
            <img
              src="https://i.giphy.com/dkuZHIQsslFfy.webp"
              alt="game over gif"
              style={{ width: "150px", marginTop: "10px" }}
            />
          )}
          <h2>score: {score}</h2>
          <button
            onClick={() => {
              setMistake(0);
              setScore(0);
              setGameOverGif(false);
              fetchData();
            }}
          >
            Restart 🔁
          </button>
        </div>
      ) : (
        <>
          <h2>Jeu de Mot</h2>
          <h2 style={{ fontSize: "80px" }}>{emoji}</h2>

          <ul style={{ listStyle: "none", padding: 0 }}>
            {options.map((option, index) => {
              const [text] = option.split(":");
              let backgroundColor = "white";

              if (selectedOption) {
                if (text === selectedOption) {
                  backgroundColor =
                    text === correctAnswer ? "#a8e6a3" : "#f8a5a5";
                }
              }

              return (
                <li
                  key={index}
                  onClick={() => HandleClick(text)}
                  style={{
                    margin: "10px auto",
                    padding: "10px",
                    width: "200px",
                    border: "1px solid gray",
                    borderRadius: "8px",
                    cursor: "pointer",
                    pointerEvents: disabled ? "none" : "auto",
                    opacity: disabled ? 0.6 : 1,
                    backgroundColor: backgroundColor,
                    transition: "0.3s ease",
                  }}
                >
                  {text}
                </li>
              );
            })}
          </ul>

          <h2 style={{ color: "green" }}>score: {score}</h2>
          {message && <p>{message}</p>}
        </>
      )}
    </div>
  );
}

export default App;
