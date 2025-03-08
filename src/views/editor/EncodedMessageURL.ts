import { useEffect, useState } from "react";
import { useCurrentMessageStore } from "../../state/message";

const useEncodedMessageURL = () => {
  const msg = useCurrentMessageStore();
  const [encodedURL, setEncodedURL] = useState("");

  useEffect(() => {
    try {
      const jsonString = JSON.stringify(msg);
      const base64Encoded = btoa(unescape(encodeURIComponent(jsonString))); // Encode properly
      const domain = window.location.origin; // Auto-detect domain
      setEncodedURL(`${domain}/editor/share/${base64Encoded}`);
    } catch (error) {
      console.error("Encoding failed:", error);
      setEncodedURL("");
    }
  }, [msg]);

  return encodedURL;
};

export default useEncodedMessageURL;
