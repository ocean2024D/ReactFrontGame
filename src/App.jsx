import React, { useEffect, useState, useRef } from 'react';
import './App.css';

function App() {
  const [word, setWord] = useState(" ");
  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [emoji, setEmoji] = useState("");
  const [score, setScore] = useState(0);
  const [showGif, setShowGif] = useState(false);
  const [mistake, setMistake] = useState(0);
  const [gameOverGif,setGameOverGif] = useState(false)
  
  // Audio Ref
  const audioRef = useRef(new Audio('gameOver.mp3')); 
 const correct = useRef(new Audio('correct.mp3'))
 const wrong = useRef(new Audio('wrong.mp3'))
  const fetchData = async () => {
    try {
      const response = await fetch("https://flaskgamebackend.onrender.com/api/game");
      const data = await response.json();
      console.log(data);

      const [text, symbol] = data.randomWord.split(":");

      setWord(text);
      setEmoji(symbol);
      setOptions(data.shuffledWords);
      setCorrectAnswer(text);
      setMessage("");
      setShowGif(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const HandleClick = (option) => {
    if (option === correctAnswer) {
      correct.current.play()
      setMessage("Bravo you win 😊");
      setScore(prev => prev + 1);
      setShowGif(true);
    } else {
      wrong.current.play()
      setMistake(prev => {
        const updated = prev + 1;
        if (updated === 3) {
          setMessage("🔴 Game Over");
          audioRef.current.play();
        } else {
          setMessage("You lost 😒");
        }
        return updated;
      });
      setShowGif(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className='container'>
        {mistake === 3 ? (
          <div className="game-over">
            <h1 style={{ color: "red" }}>🔴 Game Over</h1>
            <button onClick={() => {
              setMistake(0);
              setScore(0);
              fetchData();
            }}>Restart 🔁</button>
          </div>
        ) : (
          <>
            <div>
              <h2>Score: {score}</h2>
              <h2>Jeu de Mot</h2>
              <h2>{emoji}</h2>
            </div>

            <ul>
              {options.map((option, index) => {
                const [text] = option.split(":");
                return (
                  <li key={index} onClick={() => HandleClick(text)}>
                    {text}
                  </li>
                );
              })}
            </ul>

            <button onClick={fetchData}>➡️</button>

            <div>
              {message && <p>{message}</p>}

              {showGif && (
                <img
                  src="https://media.tenor.com/oXbHhcC79OMAAAAi/cute-aww.gif"
                  alt="gif"
                  style={{ width: "150px", marginTop: "10px" }}
                />
              )}
            </div>
          {/* <div> gameOverGif&&
            <img  
            src=''
          </div> */}
          </>
        )}
      </div>
    </>
  );
}

export default App;
