import React from "react";
import './style.scss'

const SplashCard = ({ gameStarted }) => {
  return (
    <div
      className="text-center splash-card"
      hidden={gameStarted}
      >
      <span>
        Flashcard
        <br />
        Challenge
      </span>
    </div>
  );
};

export default SplashCard;
