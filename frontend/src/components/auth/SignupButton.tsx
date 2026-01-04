import { Button } from "@components/ui";
import { useGetAuthorizeUrl } from "@services";
import { useSocketContext } from "@socket";
import { useState, useEffect, useCallback } from "react";
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

  const handleSetLoggedUserInfo = useCallback(() => {
    getLoggedUserInfo((username) => {
      if (!username) return;
      setLoggedUser(username);
    });
  }, [getLoggedUserInfo]);

  useEffect(() => {
    sendLoggedUserInfo.on((username) => {
      setLoggedUser(username);
    });
    return () => {
      sendLoggedUserInfo.off();
    };
  }, [sendLoggedUserInfo]);

  useEffect(() => {
    handleSetLoggedUserInfo();
  }, [handleSetLoggedUserInfo]);

  if (loggedUser) {
    return (
      <>
        <Button variant="primary" size="small" className="signup-button">
          Logged as: <span>{loggedUser}</span>
        </Button>
        <Button
          variant="danger"
          className="signup-button"
          onClick={() => handleOnLogoutButton()}
        >
          Logout
        </Button>
      </>
    );
  } else if (error || !authData) {
    return (
      <Button
        variant="tertiary"
        className="signup-button"
        onClick={() => {
          refetchAuthorizeUrl();
        }}
      >
        Refresh Link
      </Button>
    );
  }
  return (
    <Button variant="primary" className="signup-button">
      <a
        href={authData ? authData.data : "_blank"}
        target="_blank"
        rel="noreferrer"
      >
        Connect with twitch
      </a>
    </Button>
  );
}
