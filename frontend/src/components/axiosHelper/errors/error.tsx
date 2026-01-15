import { Button } from "@components/ui/button";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

interface ErrorsProps {
  error: unknown;
}

//TODO: replenish these
enum KnownErrorCodes {
  ERROR_NETWORK = "ERR_NETWORK",
}

export default function Error({ error }: ErrorsProps) {
  const [countdown, setCountdown] = useState(15);
  const [isActiveCountdown, setIsActiveCountdown] = useState(true);

  useEffect(() => {
    if (
      error instanceof AxiosError &&
      error.code === KnownErrorCodes.ERROR_NETWORK &&
      isActiveCountdown
    ) {
      const timer = setInterval(() => {
        setCountdown((countdown) => countdown - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [error, isActiveCountdown]);

  useEffect(() => {
    if (countdown === 0) {
      window.location.reload();
    }
  }, [countdown]);

  const stopRefresh = () => {
    setIsActiveCountdown(false);
  };
  return (
    <div className="axios-error-wrapper">
      {(error as AxiosError).code === KnownErrorCodes.ERROR_NETWORK ? (
        <>
          We have problem with connecting to our servers.
          <br />
          {isActiveCountdown ? (
            <Button onClick={stopRefresh}>
              We will automatically try again in {countdown} seconds.
              <div className="hidrr">Stop refreshing</div>
            </Button>
          ) : (
            "Try again later."
          )}
        </>
      ) : (
        (error as Error).message || "Unknown error occured :("
      )}
    </div>
  );
}
