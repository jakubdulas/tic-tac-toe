import React from "react";
import { Form, Button, Container } from "react-bootstrap";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
    password2: "",
  });

  const submitForm = (e) => {
    e.preventDefault();
    axiosInstance.post("/register/", formData).then((res) => {
      console.log(res.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      axiosInstance.defaults.headers["Authorization"] =
        "Token " + localStorage.getItem("token");
      navigate("/");
    });
  };
  return (
    <Container className="w-50 p-5 mt-5">
      <h3 className="text-center">Zarejestruj się</h3>
      <Form className="w-400px" onSubmit={(e) => submitForm(e)}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Nazwa użytkownika</Form.Label>
          <Form.Control
            type="name"
            placeholder="Nazwa użytkownika"
            onChange={(e) => {
              setFormData((currState) => ({
                ...currState,
                username: e.target.value,
              }));
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Hasło</Form.Label>
          <Form.Control
            type="password"
            placeholder="Hasło"
            onChange={(e) => {
              setFormData((currState) => ({
                ...currState,
                password: e.target.value,
              }));
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Powtórz hasło</Form.Label>
          <Form.Control
            type="password"
            placeholder="Powtórz hasło"
            onChange={(e) => {
              setFormData((currState) => ({
                ...currState,
                password2: e.target.value,
              }));
            }}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Utwórz konto
        </Button>
      </Form>
    </Container>
  );
}

export default Register;
