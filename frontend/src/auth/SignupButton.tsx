import { useGetAuthorizeUrl } from "@services";
import { useSocketContext } from "@socket";
import { useState, useEffect } from "react";

export default function SignupButton() {
  const {
    data: authData,
    error,
    refetch: refetchAuthorizeUrl,
  } = useGetAuthorizeUrl();
  const {
    emits: { logout: emitLogout, getLoggedUserInfo },
    events: { sendLoggedUserInfo },
  } = useSocketContext();

  const [loggedUser, setLoggedUser] = useState<string>("");

  const handleOnLogoutButton = () => {
    emitLogout();
  };

  useEffect(() => {
    sendLoggedUserInfo.on((username) => {
      setLoggedUser(username);
    });
    return () => {
      sendLoggedUserInfo.off();
    };
  }, [sendLoggedUserInfo]);

  useEffect(() => {
    getLoggedUserInfo((username) => {
      if (!username) return;
      setLoggedUser(username);
    });
  }, [getLoggedUserInfo]);

  if (loggedUser) {
    return (
      <>
        <button className="common-button primary-button signup-button">
          Logged as: <span>{loggedUser}</span>
        </button>
        <button
          className="common-button danger-button signup-button"
          onClick={() => handleOnLogoutButton()}
        >
          Logout
        </button>
      </>
    );
  } else if (error || !authData) {
    return (
      <button
        className="common-button tertiary-button signup-button"
        onClick={() => {
          refetchAuthorizeUrl();
        }}
      >
        Refresh Link
      </button>
    );
  }
  return (
    <a
      className="common-button tertiary-button signup-button"
      href={authData ? authData.data : "_blank"}
      target="_blank"
      rel="noreferrer"
    >
      Connect with twitch
    </a>
  );
}
