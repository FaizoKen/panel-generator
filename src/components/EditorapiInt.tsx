import { useState, useEffect, useRef } from "react";
import { useCurrentMessageStore } from "../state/message";
import { usePanelVarStore } from "../state/panelvar";
import EditorInput from "./EditorInput";
import JsonPathFinder from "./jsonpathfinder";
import Collapsable from "./Collapsable";

const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export default function EditorapiInt() {
  const { apiInt, setapiInt } = useCurrentMessageStore();
  const { int, setInt } = usePanelVarStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
      abortControllerRef.current?.abort();
    };
  }, []);

  const fetchData = async (url: string, useProxy: boolean = false) => {
    setIsWaiting(false);
    setIsLoading(true);
    try {
      const fetchUrl = useProxy ? `https://curl.faizo.top/?url=${encodeURIComponent(url)}` : url;
      const response = await fetch(fetchUrl, { signal: abortControllerRef.current?.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      
      const data = await response.json();
      setInt(data);
      setError(null);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error("API Error:", error);
        if (!useProxy) {
          // Retry with proxy
          fetchData(url, true);
        } else {
          setError(error.message || "Failed to fetch data");
          setInt({}); // Send empty object on error
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setError(null);
    setIsWaiting(false);
    setIsLoading(false);
    timeoutRef.current && clearTimeout(timeoutRef.current);
    abortControllerRef.current?.abort();

    if (!apiInt.trim()) {
      timeoutRef.current = setTimeout(() => {
        setInt({});
        setIsWaiting(false);
      }, 3000);
      setIsWaiting(true);
      return;
    }

    if (!validateUrl(apiInt)) {
      setError("Please enter a valid URL");
      setInt({}); // Send empty object on error
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    timeoutRef.current = setTimeout(() => fetchData(apiInt), 2000);
    setIsWaiting(true);

    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
      controller.abort();
      setIsWaiting(false);
    };
  }, [apiInt, setInt]);

  const getStatusMessage = () => {
    if (error) return <div style={{ color: 'pink', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</div>;
    // if (isLoading) return <div style={{ color: 'gray', fontSize: '0.875rem', marginTop: '0.5rem' }}>Loading...</div>;
    if (isWaiting || isLoading) return <div style={{ color: 'gray', fontSize: '0.875rem', marginTop: '0.5rem' }}>Loading...</div>;
    // if (int && Object.keys(int).length > 0) return (
    //   <div style={{ color: 'green', fontSize: '0.875rem', marginTop: '0.5rem' }}>Successfully loaded data</div>
    // );
    return null;
  };

  return (
    <Collapsable
      id="apiInt"
      title="Data Automation"
      size="large"
      valiationPathPrefix="apiInt"
    >
    <div className="bg-dark-3 p-3 rounded-md">
      <EditorInput
        label="Public API / JSON URL"
        value={apiInt}
        onChange={setapiInt}
        validationPath="apiInt"
      />
      
      {getStatusMessage()}

      {int && Object.keys(int).length > 0 && <JsonPathFinder />}

    </div>
    </Collapsable>
  );
}