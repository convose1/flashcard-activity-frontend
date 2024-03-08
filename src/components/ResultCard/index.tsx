import { CardBody, CardTitle } from "reactstrap";
import PropTypes from "prop-types";
import { ParamsType } from "../../types";
import * as Antd from 'antd';
import './style.scss'

const ResultCard = ({
  winner,
  hidden,
  isYou,
}: {
  winner: ParamsType;
  hidden: boolean;
  isYou: boolean;
}) => {
  return (
    <Antd.Card hidden={hidden}>
      <CardTitle
        tag="h2"
        className="text-center p-3 mb-0"
        style={{ fontWeight: "bold" }}
      >
        {`The Winner is ${isYou ? "You" : winner.username} `}
      </CardTitle>
      <CardBody className="text-center">
        <img
          srcSet={winner.avatar}
          className="rounded-circle"
          alt="avatar"
          width="100"
          height="100"
        />
      </CardBody>
    </Antd.Card>
  );
};

ResultCard.propTypes = {
  content: PropTypes.string,
  answer: PropTypes.object,
  winner: PropTypes.object,
  currentQuestionNum: PropTypes.number,
  hidden: PropTypes.bool,
};

export default ResultCard;
