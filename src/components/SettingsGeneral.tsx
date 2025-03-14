import { shallow } from "zustand/shallow";
import { useSettingsStore } from "../state/settings";
import CheckBox from "./CheckBox";

export default function SettingsGeneral() {
  const [editHistoryEnabled, setEditHistoryEnabled] = useSettingsStore(
    (s) => [s.editHistoryEnabled, s.setEditHistoryEnabled],
    shallow
  );

  function clearAll() {
    const ok = confirm(
      "Are you sure you want to clear all local data? The message editor and all your app settings will be cleared. Your saved messages, scheduled messages, and custom commands will not be affected."
    );
    if (ok) {
      localStorage.clear();
      window.location.reload();
    }
  }

  return (
    <div className="bg-dark-3 rounded-lg p-5">
      <div className="text-white text-2xl font-medium mb-10">
        <div>App Settings</div>
      </div>
      <div className="space-y-6 mb-10">
        <div className="flex items-center">
          <CheckBox
            checked={editHistoryEnabled}
            onChange={setEditHistoryEnabled}
          />
          <div>
            <div className="text-white font-medium text-lg ml-3">
              Edit History
            </div>
            <div className="text-gray-400 font-light text-sm ml-3">
              Edit history allows you undo and redo the last 10 changes to a
              message. Disabling this may reduce the memory usage of the app.
            </div>
          </div>
        </div>
        {/* Removed Keep Sidebar Collapsed and Confirm On Exit */}
      </div>
      <div className="flex justify-end">
        <button
          className="px-3 py-2 rounded text-white border-red border-2 hover:bg-red"
          onClick={clearAll}
        >
          Clear Local Data
        </button>
      </div>
    </div>
  );
}
