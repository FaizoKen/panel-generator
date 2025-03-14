import { useState, useEffect } from "react";
import { useCurrentMessageStore } from "../state/message";
import { usePanelVarStore } from "../state/panelvar"; // Import usePanelVarStore
import EditorInput from "./EditorInput";

export default function EditorapiInt() {
  const apiInt = useCurrentMessageStore((state) => state.apiInt);
  const setapiInt = useCurrentMessageStore((state) => state.setapiInt);

  const int = usePanelVarStore((state) => state.int); // Get int state
  const setInt = usePanelVarStore((state) => state.setInt); // Get setInt function

  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (!apiInt.trim()) {
      setTimeout(() => {
        setInt({});
      }, 3000);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(apiInt);
        const data = await response.json();
        setInt(data); // Store API response in Zustand store
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    const id = window.setTimeout(fetchData, 3000);
    setTimeoutId(id);

    return () => clearTimeout(id);
  }, [apiInt, setInt]);

  return (
    <div>
      <EditorInput
        label="API Integration | cURL GET"
        value={apiInt}
        onChange={(v) => setapiInt(v)}
        validationPath={`apiInt`}
      />
    </div>
  );
}
