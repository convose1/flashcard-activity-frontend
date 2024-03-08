import * as React from "react";
import { useSearchParams } from "react-router-dom";
const questions = require("../apis/questionQuery").questions;

import { socket } from "../socket";
import UserLists from "../components/UsersCard";
import QuestionCard from "../components/QuestionCard";
import ResultCard from "../components/ResultCard";
import Countdown from "react-countdown";
import { extractParams } from "../uritls";
import { ParamsType } from "../types";
import JoinButton from "../components/JoinButton";
import SplashCard from "../components/SplashCard";
import * as Antd from 'antd';
import './FlashCard.scss';

const FlashCard: React.FC = () => {
  
  const [searchParams, setSearchParams] = useSearchParams();
  const params = extractParams(searchParams);

  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [showResult, setShowResult] = React.useState(false);
  const [correct, setCorrect] = React.useState<{
    index: number | null;
    status: string;
  }>({ index: null, status: "" });
  const [joinedState, setJoinedState] = React.useState(false);
  const [user, setUser] = React.useState<ParamsType | null>(null);
  const [joinedUsers, setJoinedUsers] = React.useState(null);
  const [waitingUsers, setWaitingUsers] = React.useState(null);
  const [winner, setWinner] = React.useState<ParamsType | null>(null);
  const [gameStarted, setGameState] = React.useState(false);
  const [isCountdownShow, countdownShow] = React.useState(false);

  React.useEffect(() => {
    socket.on("users_state_refreshed", (users) => {
      if (users) {
        setJoinedUsers(users.filter((user) => user.joined));
        setWaitingUsers(users.filter((user) => !user.joined));
      }
    });

    socket.on("join_request_success", (user) => {
      setUser(user);
      setJoinedState(true);
    });

    socket.on("leave_request_success", () => {
      setJoinedState(false);
    });

    socket.on("receive_init_question_index", (param) => {
      setQuestionIndex(param);
    });
    socket.on("receive_current_question_index", (index) => {
      setQuestionIndex(Number(index));
    });

    socket.on("show_winner_and_next_question", (param) => {
      setWinner(param.winner);
      setCorrect({ index: null, status: "" });
      setShowResult(true);
      setTimeout(() => {
        setShowResult(false);
        setWinner(null);
      }, 2000);
    });

    socket.on("game_started", () => {
      countdownShow(true);
      setGameState(true);
    });

    socket.on("game_finished", () => {
      setGameState(false);
    });

    socket.on("receive_game_state", (gameStarted) => {
      setGameState(gameStarted);
    });
    socket.emit("user_open_activity", params);
  }, []);

  const handleMarkOption = (id: string, index: number) => {
    if (index === questions[questionIndex].answer) {
      const newIndex = questionIndex + 1;
      setQuestionIndex(newIndex);
      const payload = {
        questionId: id,
        nextQuestionIndex: newIndex,
        channel_id: params.channel_id,
        user_id: params.user_id,
      };
      setCorrect({ index, status: "correct" });
      socket.emit("show_winner_and_next_question", payload);
    } else {
      setCorrect({ index, status: "incorrect" });
      const { channel_id, user_id } = params;
      const payload = {
        plus: false,
        channel_id,
        user_id,
      };

      socket.emit("change_user_point", payload);
    }
  };

  const handleJoinGame = () => {
    socket.emit("user_join_request", params);
  };

  const handleLeaveGame = () => {
    socket.emit("user_leave_request", {
      user_id: user?.user_id,
      channel_id: user?.channel_id,
    });
    countdownShow(false);
  };

  const handleGetNextQuestionId = () => {
    const tempIndex: number = Math.floor(Math.random() * questions.length);

    if (tempIndex === questionIndex) {
      return handleGetNextQuestionId();
    } else {
      return tempIndex;
    }
  };

  const countdownRenderer = ({ seconds, completed }) => {
    return (
      <>
        {completed && (
          <div>Let&apos;s go!</div>
        )}
        {!completed && (
          <div>{seconds}</div>
        )}
      </>
    );
  };

  const handleStartGame = () => {
    socket.emit("game_started", params.channel_id);
  };

  const handleCountdownCompleted = () => {
    setTimeout(() => {
      countdownShow(false);
    }, 1500);
  };

  const question = questions[questionIndex];
  return (
    <Antd.Flex
      vertical
      className="h-full"
      >
      <Antd.Flex
        justify="space-evenly"
        align="center"
        wrap="wrap"
        className="h-full"
        >
        <Antd.Col
          span={6}
          className="min-w-sm"
          >
          <UserLists
            joinedUsers={joinedUsers}
            waitingUsers={waitingUsers}
            handleStartGame={handleStartGame}
            gameStarted={gameStarted}
            joinedState={joinedState}
          />
        </Antd.Col>
        <Antd.Col
          span={8}
          className="min-w-sm"
          >
          <SplashCard gameStarted={gameStarted} />
          {gameStarted && isCountdownShow && (
            <Countdown
              date={Date.now() + 3000}
              renderer={countdownRenderer}
              onComplete={handleCountdownCompleted}
            />
          )}
          <QuestionCard
            content={question.content}
            options={question.options}
            handleMarkOption={handleMarkOption}
            joinedState={joinedState}
            gameStarted={gameStarted}
            hidden={!gameStarted || isCountdownShow || showResult}
            correct={correct}
            questionIndex={questionIndex}
          />
          {winner && (
            <ResultCard
              isYou={winner?.user_id == user?.user_id}
              winner={winner}
              hidden={!joinedState || !showResult}
            />
          )}
        </Antd.Col>
      </Antd.Flex>
      <Antd.Divider plain className="bottom-sticky">
        <JoinButton
          joinedState={joinedState}
          handleLeaveGame={handleLeaveGame}
          handleJoinGame={handleJoinGame}
        />
      </Antd.Divider>
    </Antd.Flex>
  );
};

export default FlashCard;
