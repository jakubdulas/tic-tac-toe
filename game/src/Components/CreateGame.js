import React from "react";
import { Container, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios";

function CreateGame() {
  const [isPrivate, setIsPrivate] = React.useState(false);
  let navigate = useNavigate();

  const submitForm = (e) => {
    e.preventDefault();
    axiosInstance
      .post("/create-game/", { is_private: isPrivate })
      .then((res) => {
        const access_code = res.data.access_code;
        navigate(`/board/${access_code}`);
      });
  };

  return (
    <Container className="w-50 p-5 mt-5">
      <h3 className="text-center mb-4">Stwórz grę</h3>

      <Form onSubmit={(e) => submitForm(e)}>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check
            onChange={() => setIsPrivate(!isPrivate)}
            type="checkbox"
            label="Czy prywatna"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Zatwierdź
        </Button>
      </Form>
    </Container>
  );
}

export default CreateGame;
