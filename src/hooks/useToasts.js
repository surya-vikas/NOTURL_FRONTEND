import { useCallback, useEffect, useRef, useState } from "react";

let nextToastId = 1;

function useToasts() {
  const [toasts, setToasts] = useState([]);
  const timeoutRefs = useRef(new Map());

  const removeToast = useCallback((id) => {
    const timeout = timeoutRefs.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutRefs.current.delete(id);
    }

    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    ({ message, type = "success", duration = 3200 }) => {
      if (!message) {
        return;
      }

      const toastId = nextToastId;
      nextToastId += 1;

      setToasts((currentToasts) => [...currentToasts, { id: toastId, message, type }]);

      const timeout = setTimeout(() => {
        removeToast(toastId);
      }, duration);

      timeoutRefs.current.set(toastId, timeout);
    },
    [removeToast]
  );

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
      timeoutRefs.current.clear();
    };
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
  };
}

export default useToasts;
