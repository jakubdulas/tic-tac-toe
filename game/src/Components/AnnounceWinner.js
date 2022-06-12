import React from "react";
import { Button, Table, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";

function AnnounceWinner() {
  const [votes, setVotes] = React.useState([]);
  const { state } = useLocation();
  const navigate = useNavigate();

  const client = React.useMemo(() => {
    return new WebSocket(`ws://127.0.0.1:8000/ws/game/${state.gameCode}/`);
  }, []);

  React.useEffect(() => {
    client.onopen = () => {
      console.log("connected");
    };

    client.onmessage = (message) => {
      let data = JSON.parse(message.data);
      let type = data.type;

      if (type == "vote") {
        let vote_data = data.vote;
        let obj = votes.find((item) => item.user == vote_data.user);

        if (obj) {
          setVotes((currState) => [
            ...currState.filter((item) => item.user != vote_data.user),
            vote_data,
          ]);
        } else {
          setVotes((currState) => [...currState, vote_data]);
        }
      }

      if (type == "start_new_game") {
        client.close();
        navigate(`/board/${data.access_code}`);
      }
    };
  }, [votes]);

  React.useEffect(() => {
    let playAgain = votes.filter((item) => item.on == "play-again");

    if (votes.length == 2) {
      if (playAgain.length === 2) {
        if (localStorage.getItem("username") == state.opponent) {
          axiosInstance
            .post("/play-again/", { playAgainCount: playAgain.length })
            .then((res) => {
              client.send(
                JSON.stringify({
                  type: "START_NEW_GAME",
                  access_code: res.data.access_code,
                })
              );
            });
        }
      } else if (playAgain.length === 0) {
        navigate("/");
      } else if (playAgain.length === 1) {
        if (playAgain[0].user === localStorage.getItem("username")) {
          axiosInstance
            .post("/play-again/", { playAgainCount: playAgain.length })
            .then((res) => {
              let data = res.data;
              let type = data.type;
              switch (type) {
                case "join-the-game":
                  client.close();
                  navigate(`/board/${data.access_code}`);
                  break;
                case "create-new-game":
                  client.close();
                  navigate("/create-game");
                  break;
              }
            });
        }
      }
    }
  }, [votes]);

  React.useEffect(() => {
    const listener = () => {
      client.close();
      client.onclose = () => {
        console.log("disconnected");
      };
      window.removeEventListener("popstate", listener);
    };

    window.addEventListener("popstate", listener);
  }, []);

  const vote = (v) => {
    switch (v) {
      case "play-again":
        client.send(
          JSON.stringify({
            type: "VOTE",
            vote: {
              user: localStorage.getItem("username"),
              on: "play-again",
            },
          })
        );
        break;
      case "leave":
        client.send(
          JSON.stringify({
            type: "VOTE",
            vote: {
              user: localStorage.getItem("username"),
              on: "leave",
            },
          })
        );
        client.close();
        navigate("/");
        break;
    }
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-center align-items-center flex-column">
        <h5>Zwycięża:</h5>
        <h1 className="mb-5">{state.message}</h1>
        <div className="d-flex justify-content-center align-items-center">
          <h3>{state.creator} </h3>
          <h1 className="mx-5">{state.score}</h1>
          <h3>{state.opponent}</h3>
        </div>
        <div className="d-flex justify-content-center align-items-center mt-4">
          <Button
            onClick={() => vote("play-again")}
            className="btn-success m-2"
          >
            Zagraj jeszcze raz{" "}
            {votes.length
              ? votes.map((item) => {
                  if (item.on === "play-again") {
                    return "👍 ";
                  }
                })
              : ""}
          </Button>
          <Button className="btn-danger m-2" onClick={() => vote("leave")}>
            Opuść grę{" "}
            {votes.length
              ? votes.map((item) => {
                  if (item.on === "leave") {
                    return "👍 ";
                  }
                })
              : ""}
          </Button>
        </div>
      </div>
    </Container>
  );
}

export default AnnounceWinner;
