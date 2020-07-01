import React, { useState, useEffect } from "react";
import "./App.css";

import { withAuthenticator } from "@aws-amplify/ui-react";
import { API, graphqlOperation } from "aws-amplify";
import * as mutations from "./graphql/mutations";
import * as queries from "./graphql/queries";

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const fetchMessages = () => {
    API.graphql(graphqlOperation(queries.listMessages))
      .then((response) => setMessages(response.data.listMessages.items))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const submit = (e) => {
    e.preventDefault();

    API.graphql(graphqlOperation(mutations.createMessage, { input: { text } }))
      .then(() => {
        setText("");
        fetchMessages();
      })
      .catch((err) => console.error(err));
  };

  return (
    <form onSubmit={submit} className="App">
      <input value={text} onChange={handleTextChange} />
      <button type="submit">Save</button>
      {messages.map((message) => (
        <p key={message.id}>{message.text}</p>
      ))}
    </form>
  );
}

export default withAuthenticator(App);
