import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import your route components too
import App from "./App";
import Login from "./Components/Login";
import Home from "./Components/Home";
import JoinToGame from "./Components/JoinToGame";
import CreateGame from "./Components/CreateGame";
import Board from "./Components/Board";
import Lobby from "./Components/Lobby";
import Register from "./Components/Register";
import PrivateRoute from "./routes/PrivateRoute";
import AnnounceWinner from "./Components/AnnounceWinner";
import "bootstrap/dist/css/bootstrap.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route element={<PrivateRoute />}>
          <Route index element={<Home />} />
          <Route path="joinToGame" element={<JoinToGame />} />
          <Route path="create-game" element={<CreateGame />} />
          <Route path="lobby/:gameCode" element={<Lobby />} />
          <Route path="announce-winner" element={<AnnounceWinner />} />
        </Route>
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="board/:gameCode" element={<Board />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
