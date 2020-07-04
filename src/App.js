import React, { useState, useEffect } from "react";

import { API, graphqlOperation } from "aws-amplify";
import * as mutations from "./graphql/mutations";
import * as queries from "./graphql/queries";
import * as subscriptions from "./graphql/subscriptions";

import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [text, setText] = useState("");

  const fetchMessages = () => {
    API.graphql(graphqlOperation(queries.listMessages))
      .then((response) => setMessages(response.data.listMessages.items))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchMessages();

    API.graphql(graphqlOperation(subscriptions.onCreateMessage)).subscribe(() =>
      fetchMessages()
    );
  }, []);

  const handleFromChange = (e) => {
    setFrom(e.target.value);
  };

  const handleToChange = (e) => {
    setTo(e.target.value);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const submit = (e) => {
    e.preventDefault();

    if (!from || !to || !text) {
      return;
    }

    API.graphql(
      graphqlOperation(mutations.createMessage, { input: { from, to, text } })
    )
      .then(() => {
        setText("");
        setFrom("");
        setTo("");
        fetchMessages();
      })
      .catch((err) => console.error(err));
  };

  return (
    <form onSubmit={submit} className="App">
      <label>From:</label>
      <input value={from} onChange={handleFromChange} />
      <label>To:</label>
      <input value={to} onChange={handleToChange} />
      <label>Message:</label>
      <input value={text} onChange={handleTextChange} />
      <button type="submit">Send</button>
      {messages.map((message) => (
        <div key={message.id}>
          <h3>
            From: {message.from} | To: {message.to}
          </h3>
          <p>{message.text}</p>
        </div>
      ))}
    </form>
  );
}

export default App;
