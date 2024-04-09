import React, { useEffect, useState } from "react";
import StartScreen from "./components/start";
import Game from "./components/game";

// https://opentdb.com/api_config.php - api link
// to handle error code 429 - too many requests from user for quesitons
const API_URL = "https://opentdb.com/api.php";
const MAX_RETRIES = 3;
const BASE_DELAY = 1500; // 1.5 seconds

function App() {
  type Question = {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: Array<string>;
  };

  const [inGame, setInGame] = useState(false);
  const [quizData, setQuizData] = useState<Array<Question>>([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [numQuestions, setNumQuestions] = useState(6);
  const [busyFetching, setBusyFetching] = useState(false);

  function fetchData(tries = 0) {
    fetch(`${API_URL}?amount=${numQuestions}&type=multiple`).then(
      async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (data.results) {
            setQuizData(data.results);
            setBusyFetching(false);
          }
        } else if (res.status === 429 && tries < MAX_RETRIES) {
          const sleep = (ms: number) =>
            new Promise((resolve) => setTimeout(resolve, ms));
          await sleep(BASE_DELAY);
          fetchData(tries + 1);
        } else {
          throw new Error(`Request failed with status: ${res.status}`);
        }
      }
    );
  }

  useEffect(() => {
    setCorrectAnswers(0);
  }, [quizData]);

  useEffect(() => {});

  function revealAnswers(show: boolean) {
    setShowAnswers(show);
  }

  async function playGame() {
    try {
      setBusyFetching(true);
      await fetchData();
    } catch (err) {
      setInGame(false);
    }
    revealAnswers(false);
    setInGame(true);
  }
  function showScore() {
    setCorrectAnswers((prevAns) => prevAns + 1);
  }
  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setNumQuestions(Number(event.target.value));
  }

  const home = () => setInGame(false);

  const quizElements = quizData.map((data, index) => {
    return (
      <Game
        key={index}
        question={data.question}
        answers={data.incorrect_answers}
        correct_answer={data.correct_answer}
        revealAnswers={showAnswers}
        showScore={showScore}
      />
    );
  });

  function renderSelect() {
    return (
      <div>
        <header>SELECT NUMBER OF QUESTIONS</header>
        <select
          className="number-select"
          id="numOfQuestions"
          value={numQuestions}
          name="numQuestions"
          onChange={handleChange}
        >
          <option value={6}>6</option>
          <option value={7}>7</option>
          <option value={8}>8</option>
          <option value={9}>9</option>
          <option value={10}>10</option>
        </select>
      </div>
    );
  }

  return busyFetching ? (
    <h1 id="loading_data">Loading questions...</h1>
  ) : (
    <main>
      <div className="start-div">
        {!inGame && <StartScreen play={playGame} />}
        {!inGame && renderSelect()}
      </div>
      <div className="game-container">{inGame && quizElements}</div>
      {inGame && (
        <div className="check-answers-container">
          <button
            className="check-answers-btn"
            onClick={() => revealAnswers(true)}
          >
            CHECK ANSWERS
          </button>
          <button className="check-answers-btn" onClick={playGame}>
            NEW GAME
          </button>
          <button className="check-answers-btn" onClick={home}>
            HOME
          </button>
          {showAnswers && (
            <h3>
              YOU GOT {correctAnswers}/{numQuestions} RIGHT!
            </h3>
          )}
        </div>
      )}
    </main>
  );
}

export default App;
