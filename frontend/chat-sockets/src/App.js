import "./App.css";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { nanoid } from "nanoid";

const URL = process.env.BACKENDURL || "http://localhost:7000/";
const socket = io(URL);
const userName = nanoid(4);

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

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
    socket.emit("chat", { userName, message });
    setMessage("");
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1>chat app</h1>
        {chat.map((payload, index) => (
          <p key={index}>
            {payload.userName}:{" "}
            {replaceMatchingWords(payload.message, emojiSet)}
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
    </div>
  );
}

export default App;
