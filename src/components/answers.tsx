import React from "react";

type Props = {
  revealAns: boolean;
  isCorrect: boolean;
  isChosen: boolean;
  isRight: number;
  answer: string;
  chooseAnswer: () => void;
};
export default function Answers(props: Props) {
  function determineColor() {
    if (props.isCorrect && props.revealAns) {
      return { backgroundColor: "green" };
    } else if (props.isChosen && props.isRight === -1 && props.revealAns) {
      return { backgroundColor: "red" };
    } else if (props.isChosen && !props.revealAns) {
      return { backgroundColor: "#ccccb1" };
    } else return { backgroundColor: "white" };
  }

  function canAnswer() {
    return props.revealAns ? "" : props.chooseAnswer();
  }

  const styles = determineColor();
  return (
    <div>
      <button
        onClick={canAnswer}
        className="answer-btn"
        style={styles}
        dangerouslySetInnerHTML={{ __html: props.answer }}
      ></button>
    </div>
  );
}
