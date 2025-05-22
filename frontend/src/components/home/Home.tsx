import ChangeTheme from "@components/changeTheme";
import { HelmetTitle } from "@components/componentWithTitle";
import Message, { MessageProps } from "@components/message";
import { routes } from "@routes";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const chatMessages = [
  "WELCOME HOME!",
  "Wassup, bro?",
  "How's goin...",
  "Nice weather today, don't you think so?",
  "Hope you all right",
  "Go and check your triggers :D",
  "I have feeling that timers today will be happier",
  "I hope you all right!",
];

export default function Home() {
  return (
    <div className="home-wrapper">
      <HelmetTitle title="Home" />
      <div className="home-nav">
        <h1> Stream Manager </h1>
        <ChangeTheme />
      </div>
      <div className="home-content">
        <div className="home-content-tiles">
          {routes.map((route, index) => (
            <div key={index}>
              <Link to={route.path} className="common-button primary-button">
                {route.label}
              </Link>
            </div>
          ))}
        </div>
        <ChatBackground />
      </div>
      <div className="home-footer">
        <div>
          <Link to="https://github.com/Darosss" target="_blank">
            GH: Darosss 2022-2025
          </Link>
        </div>
      </div>
    </div>
  );
}

function ChatBackground() {
  const [messages, setMessages] = useState<MessageProps[]>([]);

  useEffect(() => {
    let chatTimeout: ReturnType<typeof setTimeout>;
    let chatMessageIndex = 1;

    const getRandomDelay = () => {
      const min = 500;
      const max = 1000;
      const randomDelay = Math.floor(Math.random() * (max - min + 1)) + min;
      return randomDelay;
    };

    const getRandomFromChatMessages = () => {
      return chatMessages[Math.floor(Math.random() * chatMessages.length)];
    };

    const timeoutChatMessage = () => {
      chatTimeout = setTimeout(() => {
        if (chatMessageIndex > 100) return;
        chatMessageIndex++;
        setMessages((prevState) => {
          prevState.push({
            date: new Date(),
            username: `Chat bot`,
            message: getRandomFromChatMessages(),
          });
          return [...prevState];
        });
        timeoutChatMessage();
      }, chatMessageIndex * getRandomDelay());
    };

    timeoutChatMessage();

    return () => clearTimeout(chatTimeout);
  }, []);

  return (
    <div className="home-chat-bg prevent-select">
      {messages.map((message, index) => (
        <div key={index} className="typewriter">
          <Message
            date={message.date}
            username={message.username}
            message={message.message}
            tooltip={false}
          />
        </div>
      ))}
    </div>
  );
}
