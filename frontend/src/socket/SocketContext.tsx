import React, { JSX, useContext, useEffect, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  SocketContexType,
} from "./types";
import { viteBackendUrl } from "@configs/envVariables";
import { getSocketEmitsFunctions } from "./emits";
import { getSocketEventsFunctions } from "./events";

export const socketConn = io(viteBackendUrl) as Socket<
  ServerToClientEvents,
  ClientToServerEvents
>;

export const SocketContext = React.createContext<SocketContexType | null>(null);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const emits = useMemo<SocketContexType["emits"]>(() => {
    if (!socketConn) return;

    return getSocketEmitsFunctions(socketConn);
  }, []);

  const events = useMemo<SocketContexType["events"]>(() => {
    if (!socketConn) return;

    return getSocketEventsFunctions(socketConn);
  }, []);

  useEffect(() => {
    if (!socketConn || !events) return;

    events.forceReconnect.on(() => {
      socketConn.disconnect();

      socketConn.connect();
    });

    return () => {
      events.forceReconnect.off();
    };
  }, [events]);

  return (
    <SocketContext.Provider value={{ emits, events }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = (): Required<SocketContexType> => {
  const socketContext = useContext(SocketContext);

  if (!socketContext) {
    throw new Error(
      "useSocketContext must be used within a SocketContextProvider"
    );
  }

  if (!socketContext.emits || !socketContext.events)
    throw new Error("Socket connection isn't initialized");

  //Know that values are not null
  return socketContext as Required<SocketContexType>;
};
