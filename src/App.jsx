import React, { useEffect, useState, useRef } from "react";

function App() {
  const [usedWords, setUsedWords] = useState([]);
  const [win, setWin] = useState(false);
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
      const response = await fetch("http://127.0.0.1:5000/api/game");
      const data = await response.json();
      const [text, symbol] = data.randomWord.split(":");

      if (usedWords.includes(text)) {
        fetchData(); 
        return;
      }

      setWord(text);
      setEmoji(symbol);
      setOptions(data.shuffledWords);
      setCorrectAnswer(text);
      setMessage("");
      setDisabled(false);
      setSelectedOption("");
      setUsedWords((prev) => [...prev, text]); 
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

      setScore((prev) => {
        const newScore = prev + 1;
        if (newScore >= 20) {
          setWin(true);
          setDisabled(true);
        } else {
          setTimeout(() => {
            fetchData();
          }, 1000);
        }
        return newScore;
      });

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

        setTimeout(() => {
          if (updated < 3) {
            setDisabled(false);
            fetchData();
          }
        }, 2000);

        return updated;
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container" style={{ textAlign: "center", padding: "20px" }}>
      {mistake === 3 || win ? (
        <div>
          {gameOverGif && (
            <img
              src="https://i.giphy.com/dkuZHIQsslFfy.webp"
              alt="game over gif"
              style={{ width: "150px", marginTop: "10px" }}
            />
          )}
          <h2 style={{ color: win ? "green" : "red" }}>
            {win ? "Tebrikler, kazandın!" : "Game Over"}
          </h2>
          <h2>Score: {score}</h2>
          <button
            onClick={() => {
              setMistake(0);
              setScore(0);
              setGameOverGif(false);
              setUsedWords([]);
              setWin(false);
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
