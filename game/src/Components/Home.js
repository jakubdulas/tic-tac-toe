import React from "react";
import { Card } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

function Home() {
  return (
    <div className="d-flex w-50 m-auto mt-5 pt-5">
      <Card className="m-2" style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>Stwórz grę</Card.Title>
          <Card.Text>
            Stwórz poczekalnię aby inni gracze mogli do niej dołączyć.
          </Card.Text>
          <LinkContainer to="create-game">
            <Card.Link>Rozpocznij grę</Card.Link>
          </LinkContainer>
        </Card.Body>
      </Card>

      <Card className="m-2" style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>Dołącz do gry</Card.Title>
          <Card.Text>
            Dołącz do istaniejącej poczekalni i zmierz się z innym graczem.
          </Card.Text>
          <LinkContainer to="joinToGame">
            <Card.Link>Dołącz</Card.Link>
          </LinkContainer>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Home;
