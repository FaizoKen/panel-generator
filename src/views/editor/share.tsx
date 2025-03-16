import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import { useRef, useState } from "react";
import { useToasts } from "../../util/toasts";
import { useEncodedMessageURL, useShortLink } from "./EncodedMessageURL";

export default function ShareView() {
  const navigate = useNavigate();
  const createToast = useToasts((state) => state.create);

  const encodedURL = useEncodedMessageURL();
  const shortURL = useShortLink();
  const [useShort, setUseShort] = useState(false);

  const urlTransform = useShort ? shortURL : encodedURL;

  const inputRef = useRef<HTMLInputElement>(null);

  function copy() {
    if (inputRef.current) {
      inputRef.current.select();
      inputRef.current.setSelectionRange(0, 99999);
      document.execCommand("copy");
      createToast({
        title: "Copied URL",
        message: "The URL has been copied to your clipboard",
        type: "success",
      });
    }
  }

  return (
    <Modal width="xs" onClose={() => navigate("/editor")}> 
      <div className="p-4">
        <div className="text-lg mb-5 text-white">
          Copy the URL below to share your message
        </div>
        <div className="flex items-center mb-3">
          <label className="text-white mr-2">Use a Short Link (expires in 7 days)</label>
          <input
            type="checkbox"
            checked={useShort}
            onChange={() => setUseShort(!useShort)}
          />
        </div>
        <input
          type="text"
          value={urlTransform}
          className="px-3 py-2 bg-dark-2 rounded w-full focus:outline-none text-white mb-5"
          readOnly
          ref={inputRef}
        />
        <div className="space-x-2 flex justify-end">
          <button
            className="px-3 py-2 rounded text-white bg-blurple hover:bg-blurple-dark"
            onClick={copy}
          >
            Copy URL
          </button>
          <button
            className="px-3 py-2 rounded text-white bg-dark-6 hover:bg-dark-7"
            onClick={() => navigate("/editor")}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}