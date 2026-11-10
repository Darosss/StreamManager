import { Button } from "@components/ui/button";
import { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";

interface ErrorsProps {
  error: unknown;
  onRefresh?: () => void;
}

//TODO: replenish these
enum KnownErrorCodes {
  ERROR_NETWORK = "ERR_NETWORK",
}

const MAX_TRIES = 3;
const DEFAULT_COUNTDOWN = 5;

export default function Error({ error, onRefresh }: ErrorsProps) {
  const isNetworkError =
    error instanceof AxiosError && error.code === KnownErrorCodes.ERROR_NETWORK;

  const [currentTry, setCurrentTry] = useState(0);
  const [countdown, setCountdown] = useState(DEFAULT_COUNTDOWN);
  const [isActiveCountdown, setIsActiveCountdown] = useState(
    currentTry < MAX_TRIES,
  );

  useEffect(() => {
    if (isNetworkError && isActiveCountdown) {
      const timer = setInterval(() => {
        setCountdown((countdown) => countdown - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [error, isActiveCountdown, isNetworkError]);

  const handleRefresh = useCallback(() => {
    setCurrentTry((prev) => prev + 1);
    if (onRefresh) onRefresh();
    else window.location.reload();
  }, [onRefresh]);

  useEffect(() => {
    if (countdown !== 0 || !isNetworkError) return;

    const t = setTimeout(() => {
      handleRefresh();
    }, 0);
    return () => clearTimeout(t);
  }, [countdown, handleRefresh, isNetworkError, onRefresh]);

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
              {currentTry + 1}/{MAX_TRIES} tries We will automatically try again
              in {countdown} seconds.
              <div className="hidrr">Stop refreshing</div>
            </Button>
          ) : (
            "Try again later."
          )}
        </>
      ) : (
        (error as Error).message || "Unknown error occured :("
      )}
      <Button variant="tertiary" onClick={handleRefresh}>
        Refresh manualy
      </Button>
    </div>
  );
}
