import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../components/Modal";
import { useCurrentMessageStore } from "../../state/message";
import MessagePreview from "../../components/MessagePreview";
import { useSharedMessageQuery } from "../../api/queries";
import { useMemo } from "react";
import { useToasts } from "../../util/toasts";
import { parseMessageWithAction } from "../../discord/restoreSchema";

const decodeMessage = (sharedMessageId: string | undefined) => {
  if (!sharedMessageId) return null; // Handle undefined case

  try {
    const jsonString = decodeURIComponent(atob(sharedMessageId));
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Decoding failed:", error);
    return null;
  }
};

export default function ShareRestoreView() {
  const { sharedMessageId } = useParams<{ sharedMessageId: string }>(); // Ensure TypeScript knows the expected param

  const decodedMessage = decodeMessage(sharedMessageId);

  const navigate = useNavigate();

  const { data: sharedMessage } = useSharedMessageQuery(
    sharedMessageId || null
  );

  const createToast = useToasts((state) => state.create);

  const parsedData = useMemo(() => {
    if (!decodedMessage) return null;

    if (decodedMessage) {
      try {
        const parsedData = parseMessageWithAction(decodedMessage);
        return parsedData;
      } catch (e) {
        createToast({
          type: "error",
          title: "Failed to parse shared message",
          message: `${e}`,
        });
      }
    } else {
      createToast({
        title: "Failed to load shared message",
        message: `Error`,
        type: "error",
      });
    }

    return null;
  }, [sharedMessage]);

  function save() {
    if (parsedData) {
      useCurrentMessageStore.setState(parsedData);
      navigate("/editor");
    }
  }

  return (
    <Modal width="md" onClose={() => navigate("/editor")}>
      <div className="flex flex-col overflow-y-hidden">
        <div className="rounded-r-xl bg-dark-4 overflow-y-scroll flex-auto max-h-[300px] sm:max-h-[500px]">
          <div className="rounded text-white h-full px-5 py-3">
            {parsedData && <MessagePreview msg={parsedData} />}
          </div>
        </div>
        <div className="flex flex-none justify-end space-x-3 p-3">
          <button
            className="text-white px-3 py-2 rounded border-2 border-red hover:bg-red"
            onClick={() => navigate("/editor")}
          >
            Cancel
          </button>
          <button
            className="text-white px-3 py-2 rounded border-2 border-green hover:bg-green"
            onClick={save}
          >
            Restore
          </button>
        </div>
      </div>
    </Modal>
  );
}
