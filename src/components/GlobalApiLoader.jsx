import { useEffect, useState } from "react";
import { isApiLoading, subscribeToApiLoading } from "../services/api";

function GlobalApiLoader() {
  const [isLoading, setIsLoading] = useState(isApiLoading());

  useEffect(() => {
    const unsubscribe = subscribeToApiLoading(setIsLoading);
    return unsubscribe;
  }, []);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="global-api-loader" role="status" aria-live="polite">
      <span className="loader-spinner light" aria-hidden="true" />
      <span>Loading...</span>
    </div>
  );
}

export default GlobalApiLoader;
