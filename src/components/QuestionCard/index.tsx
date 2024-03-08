/* eslint-disable react/react-in-jsx-scope */
import { CardTitle } from "reactstrap";
import PropTypes from "prop-types";
import * as Antd from 'antd';
import './style.scss'

const QuestionCard = ({
  content,
  options,
  handleMarkOption,
  joinedState,
  questionIndex,
  gameStarted,
  hidden,
  correct,
}) => {
  const { status, index } = correct;
  return (
    <Antd.Card
      hidden={hidden}
      bordered={false}
      className="question-card"
      >
      <CardTitle tag="h4">
        {questionIndex + 1} / 56
      </CardTitle>
      <CardTitle tag="h4" className="text-center">
        {content}
      </CardTitle>
      <Antd.Flex
        vertical
        gap="small"
        >
        {options.map((option: string, indx: number) => (
          <Antd.Button
            key={indx}
            block
            danger={indx == index && status == "incorrect"}
            type="primary"
            shape="round"
            size="large"
            disabled={joinedState && gameStarted ? false : true}
            onClick={() => handleMarkOption(option, indx)}
            >
            {option}
          </Antd.Button>
        ))}
      </Antd.Flex>
    </Antd.Card>
  );
};
QuestionCard.propTypes = {
  content: PropTypes.string,
  options: PropTypes.array,
  handleMarkOption: PropTypes.func,
  joinedState: PropTypes.bool,
  currentQuestionNum: PropTypes.number,
  gameStarted: PropTypes.bool,
  hidden: PropTypes.bool,
};

export default QuestionCard;
