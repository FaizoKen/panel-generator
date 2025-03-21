import { useCurrentMessageStore } from "../state/message";
import EditorEmbedAuthor from "./EditorEmbedAuthor";
import Collapsable from "./Collapsable";
import EditorEmbedBody from "./EditorEmbedBody";
import EditorEmbedGuide from "./EditorEmbedGuide";
import { shallow } from "zustand/shallow";
import EditorEmbedImages from "./EditorEmbedImages";
import { useMemo } from "react";
import { colorIntToHex } from "../util/discord";
import { FaceSmileIcon } from "@heroicons/react/20/solid";

interface Props {
  embedIndex: number;
  embedId: number;
}

export default function EditorEmbed({ embedIndex, embedId }: Props) {
  const embedName = useCurrentMessageStore((state) => {
    const embed = state.embeds[embedIndex];
    return embed.author?.name || embed.title;
  });

  const [moveUp, moveDown, duplicate, remove] = useCurrentMessageStore(
    (state) => [
      state.moveEmbedUp,
      state.moveEmbedDown,
      state.duplicateEmbed,
      state.deleteEmbed,
    ],
    shallow
  );

  const color = useCurrentMessageStore(
    (state) => state.embeds[embedIndex]?.color
  );

  const hexColor = useMemo(
    () => (color !== undefined ? colorIntToHex(color) : "#1f2225"),
    [color]
  );

  return (
    <div
      className="bg-dark-3 p-3 rounded-md border-l-4"
      style={{ borderColor: hexColor }}
    >
      <Collapsable
        title={embedId === 1 ? "Header" : embedId === 2 ? "Body" : embedId === 3 ? "Footer" : `Embed`}
        id={`embeds.${embedId}`}
        valiationPathPrefix={`embeds.${embedIndex}`}
        collapsable = {embedId === 3 ? false : true}

        size="large"
        extra={
          embedName && (
            <div className="text-gray-500 truncate flex space-x-2 pl-2">
              <div>-</div>
              <div className="truncate">{embedName}</div>
            </div>
          )
        }
        buttons={
          <div className="flex-none text-gray-300 flex items-center space-x-2">
                                {embedId === 3 && (
            <EditorEmbedGuide embedIndex={embedIndex} embedId={embedId} />
          )}                                {embedId === 1 && (
            <EditorEmbedAuthor embedIndex={embedIndex} embedId={embedId} />
          )}
          </div>
        }
      >
        <div className="space-y-4">
          {embedId === 1 && (
            <>

              <EditorEmbedImages embedIndex={embedIndex} embedId={embedId} />
            </>
          )}
          {embedId === 2 && (
            <EditorEmbedBody embedIndex={embedIndex} embedId={embedId} />
          )}

        </div>
      </Collapsable>
    </div>
  );
}
