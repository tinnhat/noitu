import checkWord from "check-if-word";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.scss";
const socket = io("https://noi-tu.herokuapp.com");
function NoiTu() {
  const inputRef = useRef(null);
  const word = checkWord("en");
  const [messages, setMessages] = useState([]);
  const [score, setScore] = useState(0);
  const [show, setShow] = useState(true);
  useEffect(() => {
    socket.on("message from server", (message) => {
      // setMessages(messages);
      setMessages([...messages, message]);
    });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = inputRef.current.value;
    //bắt đầu trò chơi
    if (messages.length === 0) {
      socket.emit("message", {
        message,
        time: Date.now(),
      });
      inputRef.current.value = "";
      return;
    }
    //check tieng anh
    if (!word.check(message)) {
      toast.error("Vui lòng nhập đúng định dạng theo chuẩn English !");
      return;
    }
    const firstKeyInput = inputRef.current.value.slice(0, 1);
    const lastKeyArr = messages[messages.length - 1]?.message.slice(
      messages[messages.length - 1].message.length - 1
    );
    //check tu trung
    if (messages.length !== 0) {
      for (let i = 0; i < messages.length; i++) {
        if (message === messages[i].message) {
          toast.error("Từ này đã tồn tại,vui lòng nhập lại từ khác !");
          return;
        }
      }
    }
    //check noi tu
    if (firstKeyInput === lastKeyArr) {
      setScore(score + 1);

      socket.emit("message", {
        message,
        time: Date.now(),
      });
    } else {
      toast.error("Nối từ bắt đầu bằng từ đã được in đậm trước đó");
    }
    inputRef.current.value = "";
  };
  return (
    <div className="App">
      <h1 className="typing">Nối từ 1.0</h1>
      <div className="score-box">
        <p>Score: {score}</p>
      </div>
      <main>
        <div className="messages">
          {messages.map((val, idx) => {
            if (idx % 2 === 0) {
              return (
                <div className="message " key={idx}>
                  <span className="text">
                    {val.message.slice(0, val.message.length - 1)}
                  </span>
                  <span className="hightlight">
                    {val.message.slice(val.message.length - 1)}
                  </span>
                  <span className="time">
                    {new Date(val.time).toLocaleTimeString("en-US")}
                  </span>
                </div>
              );
            }
            return (
              <div className="message right-text" key={idx}>
                <span className="text">
                  {val.message.slice(0, val.message.length - 1)}
                </span>
                <span className="hightlight">
                  {val.message.slice(val.message.length - 1)}
                </span>
                <span className="time">
                  {new Date(val.time).toLocaleTimeString("en-US")}
                </span>
              </div>
            );
          })}
        </div>

        <div className="input-group">
          <form onSubmit={handleSubmit}>
            <input ref={inputRef} type="text" />
          </form>
        </div>
        {show && (
          <div className="boxmodal">
            <button
              className="play"
              onClick={() => {
                setShow(false);
              }}
            >
              Chơi ngay
            </button>
          </div>
        )}
      </main>
      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default NoiTu;
