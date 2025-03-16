import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useCurrentMessageStore } from "../../state/message";
import { reverseTransformJson } from "../../util/reverseTransformJson";

export const useEncodedMessageURL = () => {
  const rawMessage = useCurrentMessageStore();
  const message = reverseTransformJson(rawMessage);
  const [shortURL, setShortURL] = useState("");
  const fetchedRef = useRef(false);

  const encodedData = useMemo(() => {
    if (!message) return "";
    try {
      return btoa(encodeURIComponent(JSON.stringify(message)));
    } catch (error) {
      console.error("Failed to encode message:", error);
      return "";
    }
  }, [message]);

  const fullEncodedURL = useMemo(
    () => (encodedData ? `${window.location.href}/${encodedData}` : ""),
    [encodedData]
  );

  const fetchShortURL = useCallback(async () => {
    if (!encodedData || fetchedRef.current) return;
    fetchedRef.current = true;

    try {
      const response = await fetch(`https://faizo.top?data=${encodedData}`);
      const url = await response.text();
      setShortURL(url || fullEncodedURL);
    } catch (error) {
      console.error("Failed to fetch shortened URL:", error);
      setShortURL(fullEncodedURL);
    }
  }, [encodedData, fullEncodedURL]);

  useEffect(() => {
    fetchShortURL();
  }, [fetchShortURL]);

  return { encodedURL: fullEncodedURL, shortURL };
};
