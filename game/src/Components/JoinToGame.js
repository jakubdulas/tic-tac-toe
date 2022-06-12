import React from "react";
import { Button, Table, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";

function JoinToGame() {
  const navigate = useNavigate();
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    axiosInstance.get("/join-the-game/").then((res) => {
      setData(res.data);
    });
  }, []);

  const renderItem = (username, gameCode) => {
    return (
      <div
        className={
          "bg-light d-flex align-items-center justify-content-between px-4 py-2"
        }
      >
        <b>{username}</b>
        <Link
          style={{ textDecoration: "none" }}
          className="p-2 bg-success text-white rounded"
          to={`/board/${gameCode}`}
        >
          Dołącz
        </Link>
      </div>
    );
  };

  return (
    <Container style={{ width: "600px" }} className="mt-5">
      {data.length ? (
        data.map((item) => renderItem(item.username, item.access_code))
      ) : (
        <h1>Nie ma dostępnych żadnych gier</h1>
      )}
    </Container>
  );
}

export default JoinToGame;
