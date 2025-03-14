import { useState, useEffect } from "react";
import { useCurrentMessageStore } from "../state/message";
import { usePanelVarStore } from "../state/panelvar";
import EditorInput from "./EditorInput";
import JsonPathFinder from "./jsonpathfinder";

export default function EditorapiInt() {
  const { apiInt, setapiInt } = useCurrentMessageStore();
  const { int, setInt } = usePanelVarStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    // Clear pending requests and timeouts on unmount
    return () => {
      timeoutId && clearTimeout(timeoutId);
      abortController?.abort();
    };
  }, [timeoutId, abortController]);

  useEffect(() => {
    // Cancel any pending requests
    abortController?.abort();
    setError(null);

    if (!apiInt.trim()) {
      const id = setTimeout(() => setInt({}), 3000);
      setTimeoutId(id);
      return;
    }

    if (!validateUrl(apiInt)) {
      setError("Please enter a valid URL");
      return;
    }

    const controller = new AbortController();
    setAbortController(controller);

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(apiInt, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        setInt(data);
        setError(null);
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error("API Error:", error);
          setError(error.message || "Failed to fetch data");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const id = setTimeout(fetchData, 3000);
    setTimeoutId(id);

    return () => {
      clearTimeout(id);
      controller.abort();
    };
  }, [apiInt, setInt]);

  return (
    <div className="space-y-2">
      <EditorInput
        label="API Integration | cURL GET"
        value={apiInt}
        onChange={setapiInt}
        validationPath="apiInt"
      />
      
      
      {isLoading && (
        <div style={{ color: 'gray', fontSize: '0.875rem' }}>Loading...</div>
      )}
      
      {error && (
        <div style={{ color: 'red', fontSize: '0.875rem' }}>{error}</div>
      )}
      
      {!isLoading && !error && int && Object.keys(int).length > 0 && (
        <div style={{ color: 'green', fontSize: '0.875rem' }}>
          Successfully loaded API data
        </div>
      )}
      {int && Object.keys(int).length > 0 && <JsonPathFinder />}
    </div>
  );
}