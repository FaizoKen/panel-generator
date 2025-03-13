import { shallow } from "zustand/shallow";
import { useCurrentMessageStore } from "../state/message";
import CheckBox from "./CheckBox";

interface Props {
  embedIndex: number;
  embedId: number;
}

export default function EditorEmbedAuthor({ embedIndex, embedId }: Props) {

  const [guide, setGuide] = useCurrentMessageStore(
    (state) => [
      state.embeds[embedIndex]?.title || null, // Get author name or null
      state.setEmbedGuide,
    ],
    shallow
  );
  const checkGuide = Boolean(guide);

  return (
    <div className="flex justify-end items-center text-gray-300 space-x-2">
              <div className="uppercase text-gray-300 text-sm font-medium mb-1.5">
              Support Guide
              </div>
              <CheckBox
                checked={checkGuide ?? false}
                onChange={(v) => setGuide(embedIndex, v)}
              />
            </div>
  );
}
