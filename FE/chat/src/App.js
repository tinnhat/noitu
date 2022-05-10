import { io } from "socket.io-client";
import "./App.css";
import NoiTu from "./noitu";
const socket = io("http://localhost:4000");
function App() {
  return (
    <div>
      <NoiTu />
    </div>
  );
}

export default App;
