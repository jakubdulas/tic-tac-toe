import React from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
  });
  const submitForm = (e) => {
    e.preventDefault();
    axiosInstance.post("/login/", formData).then((res) => {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      axiosInstance.defaults.headers["Authorization"] =
        "Token " + localStorage.getItem("token");
      navigate("/");
    });
  };
  return (
    <Container className="w-50 p-5 mt-5" onSubmit={(e) => submitForm(e)}>
      <h3 className="text-center">Logowanie</h3>
      <Form className="w-400px">
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

        <Button variant="primary" type="submit">
          Zaloguj się
        </Button>
      </Form>
    </Container>
  );
}

export default Login;
