import ChangeTheme from "@components/changeTheme";
import { HelmetTitle } from "@components/componentWithTitle";
import Message, { MessageProps } from "@components/message";
import { Button } from "@components/ui/button";
import { routes } from "@routes";
import { useGetMessages } from "@services";
import { useEffect, useReducer, useRef, useState } from "react";
import { Link } from "react-router";
import SignupButton from "@components/auth";

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
  const homeWrapper = useRef<HTMLDivElement>(null);
  const scrollToTop = () =>
    homeWrapper.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  return (
    <div ref={homeWrapper} className="home-wrapper">
      <HelmetTitle title="Home" />

      <ChatBackground />

      <div className="home-container">
        <header className="home-header">
          <div className="home-header-content">
            <Button className="home-logo" onClick={scrollToTop}>
              Stream manager
            </Button>
            <SignupButton />
            <ChangeTheme />
          </div>
        </header>

        <main className="home-main">
          <section className="home-hero">
            <h2 className="home-hero-title">Welcome Back</h2>
            <p className="home-hero-subtitle">
              Manage your stream with powerful tools and automation
            </p>
          </section>

          <section className="home-navigation">
            {routes.map((category, categoryIndex) => (
              <div key={categoryIndex} className="nav-category">
                <div className="nav-category-header">
                  <h3 className="nav-category-title">{category.title}</h3>
                  <p className="nav-category-description">
                    {category.description}
                  </p>
                  <div className="nav-category-bg"></div>
                </div>
                <div className="nav-category-grid">
                  {category.routes.map((route, routeIndex) => (
                    <Link
                      key={routeIndex}
                      to={route.path}
                      className={`nav-card ${
                        route.path === "/" ? "nav-card-disabled" : ""
                      }`}
                    >
                      <span className="nav-card-icon">{route.icon}</span>
                      <span className="nav-card-label">{route.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </main>

        <footer className="home-footer">
          <div className="home-footer-content">
            <div className="home-footer-links">
              <a
                href="https://github.com/Darosss"
                target="_blank"
                rel="noopener noreferrer"
                className="home-footer-link"
              >
                Created by Darosss
              </a>
              <span className="home-footer-separator">•</span>
              <a
                href="https://github.com/Darosss/"
                target="_blank"
                rel="noopener noreferrer"
                className="home-footer-link"
              >
                View my github
              </a>
              <span className="home-footer-separator">•</span>
              <Button
                className="home-footer-link home-footer-button"
                onClick={scrollToTop}
              >
                Back to top
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function ChatBackground() {
  const { data } = useGetMessages();
  const [messagesToShow, setMessagesToShow] = useState<
    { username: string; message: string }[]
  >(chatMessages.map((message) => ({ username: "chat bot", message })));

  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    if (!data) return;
    if (data.data.length > chatMessages.length) setMessagesToShow([]);

    data.data.forEach((msg) =>
      messagesToShow.push({
        message: msg.message,
        username: msg.ownerUsername,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
      return messagesToShow[Math.floor(Math.random() * messagesToShow.length)];
    };

    const timeoutChatMessage = () => {
      chatTimeout = setTimeout(() => {
        if (chatMessageIndex > 100) return;
        chatMessageIndex++;
        setMessages((prevState) => {
          const { username, message } = getRandomFromChatMessages();
          prevState.push({
            date: new Date(),
            username,
            message,
          });
          return prevState;
        });
        forceUpdate();
        timeoutChatMessage();
      }, chatMessageIndex * getRandomDelay());
    };

    timeoutChatMessage();

    return () => clearTimeout(chatTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="home-chat-bg prevent-select">
      {messages.map((message, index) => {
        return (
          <div key={index} className="typewriter">
            <Message
              date={message.date}
              username={message.username}
              message={message.message}
              tooltip={false}
            />
          </div>
        );
      })}
    </div>
  );
}
