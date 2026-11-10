import { Button } from "@components/ui/button";
import { useGetAuthorizeUrl } from "@services";
import { useSocketContext } from "@socket";
import { useState, useEffect } from "react";
import { Link } from "react-router";

interface SignupButtonProps {
  onlyIcon?: boolean;
}

export default function SignupButton({ onlyIcon }: SignupButtonProps) {
  const {
    data: authData,
    error,
    refetch: refetchAuthorizeUrl,
  } = useGetAuthorizeUrl();
  const {
    emits: { getLoggedUserInfo },
    events: { sendLoggedUserInfo },
  } = useSocketContext();

  const [loggedUser, setLoggedUser] = useState<string>("");

  useEffect(() => {
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
  if (loggedUser) {
    return (
      <>
        <Button variant="primary" size="small" className="signup-button">
          <div>
            {onlyIcon ? (
              "👤"
            ) : (
              <>
                Logged as: <span>{loggedUser}</span>
              </>
            )}
          </div>
        </Button>
        <LogoutButton onlyIcon={onlyIcon} />
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
        <div>{onlyIcon ? "🔃" : "Refresh link"}</div>
      </Button>
    );
  }
  return (
    <Button variant="primary" className="signup-button">
      <Link
        to={authData ? authData.data : "_blank"}
        target="_blank"
        rel="noreferrer"
      >
        <div>{onlyIcon ? "🔐" : "Connect with twitch"}</div>
      </Link>
    </Button>
  );
}
interface LogoutButtonProps {
  onlyIcon?: boolean;
}

function LogoutButton({ onlyIcon }: LogoutButtonProps) {
  const {
    emits: { logout: emitLogout },
  } = useSocketContext();

  const handleLogout = () => {
    emitLogout();
  };

  return (
    <Button variant="danger" className="signup-button" onClick={handleLogout}>
      <div> 🚪 </div>
      {!onlyIcon && <div> Logout </div>}
    </Button>
  );
}
