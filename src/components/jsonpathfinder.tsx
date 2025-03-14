import React, { useState } from "react";
import { usePanelVarStore } from "../state/panelvar";
import { useToasts } from "../util/toasts";

const getPaths = (obj: any, prefix: string = ""): { path: string; value: any }[] => {
  let paths: { path: string; value: any }[] = [];
  for (const key in obj) {
    const isParentArray = Array.isArray(obj);
    let newSegment;
    if (isParentArray) {
      newSegment = `[${key}]`;
    } else {
      newSegment = prefix ? `.${key}` : key;
    }
    const path = prefix + newSegment;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      paths = paths.concat(getPaths(obj[key], path));
    } else {
      paths.push({ path, value: obj[key] });
    }
  }
  return paths;
};

const JsonPathFinder: React.FC = () => {
  const panelVar = usePanelVarStore((state) => state.int);
  const [selectedPath, setSelectedPath] = useState("");
  const createToast = useToasts((state) => state.create);

  const handleCopy = (path: string) => {
    navigator.clipboard.writeText(`{{${path}}}`).then(() => {
      createToast({
        title: "Copied Path",
        message: `{{${path}}}`,
        type: "success",
      });
    });
  };

  const paths = getPaths(panelVar);

  return (
<div className="p-4 bg-gray-800 rounded-md shadow-md mt-3">
  <h2 className="font-bold mb-2 text-gray-100">Data Variable Picker</h2>
  <p className="text-gray-400 text-sm mb-2">Click to copy the variable and paste it into a text editor to reveal the data</p>
  <ul className="mt-4 p-2 bg-gray-700 rounded-md shadow-md max-h-64 overflow-y-auto">
    {paths.map(({ path, value }) => (
      <li
        key={path}
        className="flex justify-between p-2 border-b border-gray-600 cursor-pointer hover:bg-gray-600"
        onClick={() => {
          setSelectedPath(path);
          handleCopy(path);
        }}
      >
        <span className="text-gray-100">{path}</span>
        <span className="font-mono text-gray-400">{typeof value === "string" ? value : JSON.stringify(value)}</span>
      </li>
    ))}
  </ul>
</div>

  );
};

export default JsonPathFinder;