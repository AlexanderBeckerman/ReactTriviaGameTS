import React from "react";

type Props = {
  play: () => void;
};
export default function StartScreen(props: Props) {
  return (
    <div>
      <h1 className="start-header">Quizzical</h1>
      <p className="start-p">Test your knowledge</p>
      <button className="start-btn" onClick={props.play}>
        Start Quiz
      </button>
    </div>
  );
}
