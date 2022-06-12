import React from "react";
import { Link } from "react-router-dom";
import { Button, Table, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";

function Lobby() {
  const initialState = {
    isReady: true,
    username: "asd",
    symbol: "X",
  };

  const { gameCode } = useParams();

  const [player1, setPlayer1] = React.useState(initialState);
  const [player2, setPlayer2] = React.useState(initialState);

  const renderItem = (player) => {
    return (
      <div
        className={
          "d-flex align-items-center justify-content-between px-4 py-2 border border-end-0 border-top-0 border-start-0"
        }
      >
        <b>{player.username}</b>
        <div
          className="d-flex align-items-center justify-content-between"
          style={{ width: "30%" }}
        >
          {player.isReady ? (
            <span className="bg-success p-1 text-light rounded">Gotowy</span>
          ) : (
            <span className="bg-danger p-1 text-light rounded">Niegotowy</span>
          )}
          <h1>{player.symbol}</h1>
        </div>
      </div>
    );
  };

  const ready = () => {};

  return (
    <Container style={{ width: "600px" }} className="mt-5">
      {renderItem(player1)}
      {renderItem(player2)}
      <div className="d-flex justify-content-between align-items-center">
        <Button className="w-100 m-4 btn-success">Gotowy</Button>
        <Link
          to={`/board/${gameCode}`}
          className={
            player1.isReady & player2.isReady
              ? "btn w-100 m-4 btn-primary "
              : "btn w-100 m-4 btn-primary disabled"
          }
        >
          Rozpocznij
        </Link>
        <Link className=" btn w-100 m-4 btn-danger" to="/">
          Opuść
        </Link>
      </div>
      <span>Kod do gry: {gameCode}</span>
    </Container>
  );
}

export default Lobby;
