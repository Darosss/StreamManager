import React, { JSX, useCallback, useContext, useState } from "react";
import { NotificationOpts, NotificationsContexType } from "./types";
import {
  NOTIFICATION_CONTAINER,
  NOTIFICATION_INSERT,
  NOTIFICATION_TYPE,
} from "./enums";
import { useTimer } from "@hooks/useTimer";

type Notification = NotificationOpts & { id: number; timeout?: number };

export const NotificationsContext =
  React.createContext<NotificationsContexType | null>(null);

export const NotificationsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = (id: Notification["id"]) => {
    setNotifications((prevState) => {
      const foundNotifyIdx = prevState.findIndex((n) => n.id === id);
      if (foundNotifyIdx === -1) return prevState;

      const notify = prevState.at(foundNotifyIdx);
      if (notify?.timeout) clearTimeout(notify.timeout);
      return prevState.filter((n) => n.id !== id);
    });
  };
  const addNotification = useCallback(
    ({
      type = NOTIFICATION_TYPE.DEFAULT,
      insert = NOTIFICATION_INSERT.BOTTOM,
      container = NOTIFICATION_CONTAINER.TOP_CENTER,
      duration = 10000,
      message,
      title,
    }: NotificationOpts) => {
      const id = Math.random();
      const timeout =
        duration &&
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      setNotifications((prevState) => {
        const notifyData: Notification = {
          id,
          timeout,
          type,
          message,
          insert,
          container,
          duration,
          title,
        };

        if (insert === NOTIFICATION_INSERT.BOTTOM) {
          return [...prevState, notifyData];
        } else {
          return [notifyData, ...prevState];
        }
      });
    },
    []
  );
  return (
    <NotificationsContext.Provider
      value={{
        addNotify: addNotification,
      }}
    >
      {children}
      <div className="notifications-context-wrapper">
        {notifications.map((n) => (
          <OneNotification key={n.id} notification={n} />
        ))}
      </div>
    </NotificationsContext.Provider>
  );
};

interface OneNotificationProps {
  notification: Notification;
}
const OneNotification = ({ notification }: OneNotificationProps) => {
  const timer = useTimer({
    currentTime: 0,
    duration: (notification.duration || 0) / 1000 || 0,
    enabled: true,
    updateMs: 500,
  });
  const progress =
    notification.duration &&
    Math.min(100, (timer / (notification.duration / 1000)) * 100);

  return (
    <div className={`notification-wrapper ${notification.type}`}>
      <div className="notification-title">{notification.title}</div>
      {notification.message && (
        <div className="notification-content"> {notification.message} </div>
      )}
      {notification.duration && (
        <div
          className="notification-progress"
          style={{
            width: `${progress}%`,
          }}
        />
      )}
      <div className="notification-bg" />
    </div>
  );
};

export const useNotifications = (): Required<NotificationsContexType> => {
  const notificationsContext = useContext(NotificationsContext);

  if (!notificationsContext) {
    throw new Error(
      "useNotifications must be used within a NotificationsContextProvider"
    );
  }

  return notificationsContext as Required<NotificationsContexType>;
};
