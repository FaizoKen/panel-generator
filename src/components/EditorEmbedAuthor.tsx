import { shallow } from "zustand/shallow";
import { useCurrentMessageStore } from "../state/message";
import Collapsable from "./Collapsable";
import CheckBox from "./CheckBox";

interface Props {
  embedIndex: number;
  embedId: number;
}

export default function EditorEmbedAuthor({ embedIndex, embedId }: Props) {

  const [author, setAuthor] = useCurrentMessageStore(
    (state) => [
      state.embeds[embedIndex]?.author?.name || null, // Get author name or null
      state.setEmbedAuthor,
    ],
    shallow
  );
  const checkAuthor = Boolean(author);

  return (
<div className="flex justify-end items-center text-gray-300 space-x-2">
  <div className="uppercase text-gray-300 text-sm font-medium mb-1.5">
    Community Name
  </div>
  <CheckBox
    checked={checkAuthor ?? false}
    onChange={(v) => setAuthor(embedIndex, v)}
  />
</div>
  );
}
