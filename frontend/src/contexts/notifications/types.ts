import React from "react";
import {
  NOTIFICATION_CONTAINER,
  NOTIFICATION_INSERT,
  NOTIFICATION_TYPE,
} from "./enums";

export interface NotificationOpts {
  title: string;
  message?: string | React.ReactNode;
  type?: NOTIFICATION_TYPE;
  insert?: NOTIFICATION_INSERT;
  container?: NOTIFICATION_CONTAINER;
  duration?: number;
}

export interface NotificationsContexType {
  addNotify: (opts: NotificationOpts) => void;
}
