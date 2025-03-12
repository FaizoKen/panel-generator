import { shallow } from "zustand/shallow";
import { useCurrentMessageStore } from "../state/message";
import EditorInput from "./EditorInput";

interface Props {
  embedIndex: number;
  embedId: number;
}

export default function EditorEmbedImages({ embedIndex, embedId }: Props) {
  const [imageUrl, setImageUrl] = useCurrentMessageStore(
    (state) => [state.embeds[embedIndex]?.image?.url, state.setEmbedImageUrl],
    shallow
  );

  const [thumbnailUrl, setThumbnailUrl] = useCurrentMessageStore(
    (state) => [
      state.embeds[embedIndex]?.thumbnail?.url,
      state.setEmbedThumbnailUrl,
    ],
    shallow
  );

  return (
      <div className="space-y-3">
        <EditorInput
          label="Banner URL"
          type="url"
          value={imageUrl || ""}
          onChange={(v) => setImageUrl(embedIndex, v || undefined)}
          validationPath={`embeds.${embedIndex}.image.url`}
          imageUpload={true}
        />
      </div>
  );
}
