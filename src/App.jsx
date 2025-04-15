import React, { useEffect, useState } from 'react';

function App() {
  const [word, setWord] = useState(" ");
  const [options, setOptions] = useState([]);
  const [message,setMessage]= useState("")
  const [correctAnswer,setCorrectAnswer] = useState("")
  
  // useEffect dışında tanımlandı, böylece buton da kullanabilir
  const fetchData = async () => {
    try {
      const response = await fetch("https://flaskgamebackend.onrender.com/api/game");
      const data = await response.json();
      console.log(data);
      setWord(data.randomWord);
      setOptions(data.shuffledWords);
      setCorrectAnswer(data.randomWord)
      setMessage("")
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
const HandleClick = (option) =>{

  if(option === correctAnswer){

    setMessage("Bravo you win😊");

  }else{
    setMessage("you lost😒")
  }
} 
  useEffect(() => {
    fetchData(); 
  }, []);

  return (
    <>
      <div>
        <h2>Try to find the word </h2>
        <h2>{word}</h2>
      </div>
      <ul>
        {options.map((option, index) => (
          <li key={index} onClick={() => HandleClick(option)}>{option}</li>
        ))}
      </ul>

      <button onClick={fetchData}>Yeni Kelime</button>

      <div>
        {message && <p>{message}</p>}
      </div>
    </>
  );
}

export default App;
