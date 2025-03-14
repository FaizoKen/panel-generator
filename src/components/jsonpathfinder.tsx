import React, { useState } from "react";
import { usePanelVarStore } from "../state/panelvar";
import { useToasts } from "../util/toasts";

const getPaths = (obj: any, prefix: string = ""): { path: string; value: any }[] => {
  let paths: { path: string; value: any }[] = [];
  for (const key in obj) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      paths = paths.concat(getPaths(obj[key], path));
    } else {
      paths.push({ path, value: obj[key] });
    }
  }
  return paths;
};

const JsonPathFinder: React.FC = () => {
  const panelVar = usePanelVarStore((state) => state.int); // Adjust as needed
  const [selectedPath, setSelectedPath] = useState("");
  const createToast = useToasts((state) => state.create);

  const handleCopy = (path: string) => {
    navigator.clipboard.writeText(`{{${path}}}`).then(() => {
      createToast({
        title: "Copied Path",
        message: ` {{${path}}}`,
        type: "success",
      });
    });
  };

  const paths = getPaths(panelVar);

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">JSON Path Selector</h2>
      <ul className="mt-4 p-2 bg-white dark:bg-gray-700 rounded-md shadow-md max-h-64 overflow-y-auto">
        {paths.map(({ path, value }) => (
          <li
            key={path}
            className="flex justify-between p-2 border-b border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
            onClick={() => {
              setSelectedPath(path);
              handleCopy(path);
            }}
          >
            <span className="text-gray-900 dark:text-gray-100">{path}: </span>
            <span className="font-mono text-blue-600 dark:text-blue-400">{JSON.stringify(value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JsonPathFinder;