import {
  CardTitle,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import PropTypes from "prop-types";
import * as Antd from 'antd';
import './style.scss'

const UserLists = ({
  joinedUsers,
  handleStartGame,
  gameStarted,
  joinedState,
}) => {
  
  const renderStartGameButton = () => {
    return (
      <center>
        <Antd.Button
          size="large"
          type="primary"
          shape="round"
          className="start-game-btn"
          hidden={!joinedState || gameStarted}
          onClick={handleStartGame}
        >
          Start new game
        </Antd.Button>
      </center>
    );
  };

  return (
    <Antd.Card
      bordered={false}
      className="users-card"
      >
        <CardTitle tag="h4" className="text-center">
          Contestants:
        </CardTitle>
        <ListGroup>
          {joinedUsers &&
            joinedUsers.map((user) => (
              <ListGroupItem
                key={user.user_id}
                className="d-flex align-items-center p-1"
              >
                <div className="d-flex align-items-center p-2">
                  <img
                    src={user.avatar}
                    className="rounded-circle"
                    alt="avatar"
                    width="35"
                    height="35"
                  />
                  <div className="ms-3">
                    <h4 className="mb-0">{user.username}</h4>
                  </div>
                </div>
                <h5 className="ms-auto">{user.point} points</h5>
              </ListGroupItem>
            ))}
        </ListGroup>
      <center>{renderStartGameButton()}</center>
  </Antd.Card>
  );
};

UserLists.propTypes = {
  joinedUsers: PropTypes.array,
  waitingUsers: PropTypes.array,
  handleStartGame: PropTypes.func,
  gameStarted: PropTypes.bool,
  joinedState: PropTypes.bool,
};

export default UserLists;
