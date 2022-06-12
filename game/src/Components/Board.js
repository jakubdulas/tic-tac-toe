import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";

function Board() {
  const navigate = useNavigate();
  const [board, setBoard] = React.useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);

  const winCases = React.useMemo(() => {
    return [
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    ];
  }, []);

  const isWinner = () => {
    const allEqual = (arr) => arr.every((v) => v === arr[0]);

    for (let i = 0; i < winCases.length; i++) {
      let winCase = winCases[i];
      let s = "";
      let row = [];
      for (let j = 0; j < winCase.length; j++) {
        let r = winCase[j][1];
        let c = winCase[j][0];
        row.push(board[r][c]);
      }
      if (allEqual(row) & (row[0] != "")) {
        return true;
      }
    }
    return false;
  };

  const [score, setScore] = React.useState("");

  const [players, setPlayers] = React.useState({
    host: "",
    guest: "",
  });

  const [whoseMove, setWhoseMove] = React.useState("O");
  const [symbol, setSymbol] = React.useState("");

  const { gameCode } = useParams();

  const client = React.useMemo(() => {
    return new WebSocket(`ws://127.0.0.1:8000/ws/game/${gameCode}/`);
  }, []);

  React.useEffect(() => {
    const listener = () => {
      axiosInstance
        .post(`/surrender/`, { access_code: gameCode })
        .then((res) => {
          let data = res.data;
          client.send(
            JSON.stringify({
              type: "ANNOUNCE_WINNER",
              message:
                "Gracz " + localStorage.getItem("username") + " poddaje się",
              ...data,
            })
          );
        });

      window.removeEventListener("popstate", listener);
    };

    window.addEventListener("popstate", listener);

    client.onopen = () => {
      axiosInstance.post("/game/", { access_code: gameCode }).then((res) => {
        let data = res.data;
        setSymbol(data.symbol);

        client.send(
          JSON.stringify({
            type: "JOIN_GAME",
            ...data,
          })
        );
      });
    };

    client.onmessage = (message) => {
      const data = JSON.parse(message.data);
      const type = data.type;

      switch (type) {
        case "make_move":
          setWhoseMove(data.nextMove);
          setBoard(data.board);
          break;
        case "join_game":
          setPlayers({
            host: data.host,
            guest: data.guest,
          });
          setScore(data.score);
          break;
        case "announce_winner":
          client.close();
          navigate(`/announce-winner`, {
            state: {
              message: data.message,
              score: data.score,
              creator: data.creator,
              opponent: data.opponent,
              gameCode: gameCode,
            },
          });
          break;
      }
    };

    client.onclose = () => {
      console.log("disconnected");
    };
  }, []);

  const makemove = (ri, ci) => {
    if (
      (symbol == whoseMove) &
      (players.host.length > 0) &
      (players.guest.length > 0) &
      (board[ri][ci] == "")
    ) {
      let new_board = [...board];
      new_board[ri][ci] = symbol;
      setBoard(new_board);

      client.send(
        JSON.stringify({
          type: "MAKE_MOVE",
          board: board,
          whoMadeMove: symbol,
        })
      );

      if (isWinner()) {
        axiosInstance
          .post(`/announce-winner/`, {
            access_code: gameCode,
            winner: localStorage.getItem("username"),
          })
          .then((res) => {
            let data = res.data;
            client.send(
              JSON.stringify({
                type: "ANNOUNCE_WINNER",
                message: "Zwycięża " + data.winner + "🎉",
                ...data,
              })
            );
          });
      }
    }
  };

  return (
    <div>
      <Container style={{ height: "80vh" }} className="w-100">
        <Row>
          <Col className="d-flex align-items-center justify-content-end">
            <span
              style={{
                fontWeight: "500",
                fontSize: "30px",
                padding: "20px",
              }}
            >
              O
            </span>
            <span>{players.host ? players.host : ""}</span>
          </Col>
          <Col className="d-flex align-items-center justify-content-center">
            <h1>{score ? score : ""}</h1>
          </Col>
          <Col className="d-flex align-items-center justify-content-start">
            <span>{players.guest ? players.guest : ""}</span>
            <span
              style={{
                fontWeight: "500",
                fontSize: "30px",
                padding: "20px",
              }}
            >
              X
            </span>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center">
            <h1>
              {players?.host?.length & players?.guest?.length
                ? `Ruch gracza: ${
                    whoseMove == "X" ? players.guest : players.host
                  }`
                : ""}
            </h1>
          </Col>
        </Row>
        <Row>
          <Col></Col>
          <Col className="d-flex justify-content-center">
            <div className="mt-3">
              {board.map((columns, ri) => {
                return (
                  <div className="d-flex" key={ri}>
                    {columns.map((col, ci) => (
                      <div
                        style={{
                          width: "100px",
                          height: "100px",
                          margin: "2px",
                          display: "flex",
                          backgroundColor: "#aaa",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onClick={() => makemove(ri, ci)}
                        key={`${ri}${ci}`}
                      >
                        <span
                          style={{
                            fontWeight: "500",
                            fontSize: "60px",
                            padding: "20px",
                          }}
                        >
                          {col}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </div>
  );
}

export default Board;
