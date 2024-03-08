import React from "react";
import * as Antd from 'antd';
import './style.scss'

const JoinButton = ({ joinedState, handleLeaveGame, handleJoinGame }) => {
  return (
    <Antd.Button
      type="primary"
      shape="round"
      danger={joinedState}
      className="game-btn"
      color={joinedState ? "danger" : "info"}
      size="large"
      onClick={joinedState ? handleLeaveGame : handleJoinGame}
    >
      {joinedState ? "Leave Game" : "Join Game"}
    </Antd.Button>
  );
};

export default JoinButton;
