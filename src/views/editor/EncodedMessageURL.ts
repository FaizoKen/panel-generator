import { useEffect, useState, useMemo } from "react";
import { useCurrentMessageStore } from "../../state/message";
import { reverseTransformJson } from "../../util/reverseTransformJson";

export const useShortLink = () => {
  const rawMsg = useCurrentMessageStore();
  const msg = reverseTransformJson(rawMsg);
  const [shortURL, setShortURL] = useState("");

  const encodedURL = useMemo(() => {
    if (!msg) return "";
    try {
      const jsonString = JSON.stringify(msg);
      const base64Encoded = btoa(encodeURIComponent(jsonString));
      return `${window.location.href}/${base64Encoded}`;
    } catch (error) {
      console.error("Encoding failed:", error);
      return "";
    }
  }, [msg]);

  useEffect(() => {
    if (encodedURL) {
      fetch(`https://faizo.top?data=${encodedURL.split('/').pop()}`)
        .then((res) => res.text())
        .then((shortened) => setShortURL(shortened))
        .catch((error) => console.error("Shortening failed:", error));
    }
  }, [encodedURL]);

  return shortURL || encodedURL;
};

export const useEncodedMessageURL = () => {
  const rawMsg = useCurrentMessageStore();
  const msg = reverseTransformJson(rawMsg);

  const encodedURL = useMemo(() => {
    if (!msg) return "";
    try {
      const jsonString = JSON.stringify(msg);
      const base64Encoded = btoa(encodeURIComponent(jsonString));
      return `${window.location.href}/${base64Encoded}`;
    } catch (error) {
      console.error("Encoding failed:", error);
      return "";
    }
  }, [msg]);

  return encodedURL;
};