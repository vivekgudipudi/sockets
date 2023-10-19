import "./App.css";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { nanoid } from "nanoid";

const URL = process.env.BACKENDURL || "http://localhost:7000/";
const socket = io(URL);
const userName = nanoid(4);
// const userName = prompt("Enter your name");

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const commands = [
    { name: "help", action: "Show this message" },
    { name: "random", action: "print a random number" },
    { name: "clear", action: "clear the chat" },
  ];

  const emojiSet = {
    hey: "👋",
    lol: "😂",
    like: "❤️",
    congratulations: "🎉",
  };

  useEffect(() => {
    socket.on("chat", (payload) => setChat([...chat, payload]));
  });

  const replaceMatchingWords = (string, emojiObj) => {
    const wordsToReplace = Object.keys(emojiObj);

    const replacedString = string
      .split(" ")
      .map((word) => {
        if (wordsToReplace.includes(word)) {
          return emojiObj[word];
        }
        return word;
      })
      .join(" ");

    return replacedString;
  };

  const sendMsg = (e) => {
    e.preventDefault();
    if (message === "/help") {
      setShowModal(true);
    } else if (message === "/random") {
      setChat([...chat, { userName, message: Math.random().toString() }]);
    } else if (message === "/clear") {
      setChat([]);
    } else {
      socket.emit("chat", { userName, message });
    }
    setMessage("");
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1>chat app</h1>
        {chat.map((payload, index) => (
          <p key={index}>
            {payload.userName}:{replaceMatchingWords(payload.message, emojiSet)}
          </p>
        ))}
        <form onSubmit={sendMsg}>
          <input
            type="text"
            placeholder="enter message"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <button type="submit">send</button>
        </form>
      </header>
      {showModal && (
        <div className="modal">
          <div className="modal-container">
            <div className="modal-head">
              Available commands
              <span
                className="modal-close-icon"
                onClick={() => setShowModal(false)}
              >
                X
              </span>
            </div>
            <main className="modal-body">
              {commands.map((command) => (
                <div className="command" key={command.name}>
                  /{command.name} - {command.action}
                </div>
              ))}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
