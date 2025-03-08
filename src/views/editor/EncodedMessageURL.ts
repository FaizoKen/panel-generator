import { useEffect, useState, useMemo } from "react";
import { useCurrentMessageStore } from "../../state/message";

const useEncodedMessageURL = () => {
  const msg = useCurrentMessageStore();

  const encodedURL = useMemo(() => {
    if (!msg) return "";
    try {
      const jsonString = JSON.stringify(msg);
      const base64Encoded = btoa(encodeURIComponent(jsonString)); // Proper encoding
      return `${window.location.href}/${base64Encoded}`;
    } catch (error) {
      console.error("Encoding failed:", error);
      return "";
    }
  }, [msg]);

  return encodedURL;
};

export default useEncodedMessageURL;
