import { shallow } from "zustand/shallow";
import { useCurrentMessageStore } from "../state/message";
import { AutoAnimate } from "../util/autoAnimate";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentDuplicateIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import EditorComponentButton from "./EditorComponentButton";
import EditorComponentSelectMenu from "./EditorComponentSelectMenu";
import Collapsable from "./Collapsable";
import { getUniqueId } from "../util";

interface Props {
  rowIndex: number;
  rowId: number;
}

export default function EditorComponentRow({ rowIndex, rowId }: Props) {
  const rowCount = useCurrentMessageStore((state) => state.components.length);
  const components = useCurrentMessageStore(
    (state) => state.components[rowIndex].components.map((c) => c.id),
    shallow
  );
  const isButtonRow = useCurrentMessageStore((state) =>
    state.components[rowIndex].components.every((c) => c.type === 2)
  );
  const [moveUp, moveDown, duplicate, remove] = useCurrentMessageStore(
    (state) => [
      state.moveComponentRowUp,
      state.moveComponentRowDown,
      state.duplicateComponentRow,
      state.deleteComponentRow,
    ],
    shallow
  );

  const [addButton, clearButtons] = useCurrentMessageStore(
    (state) => [state.addButton, state.clearButtons],
    shallow
  );

  return (
    <div className="bg-dark-3 p-3 rounded-md">
      <Collapsable
        id={`components.${rowId}`}
        valiationPathPrefix={`components.${rowIndex}.components`}
        title={isButtonRow ? "Buttons" : "Select Menu"}
        size="large"
      >
        <AutoAnimate>
          {components.map((id, i) =>
            isButtonRow ? (
              <EditorComponentButton
                key={id}
                rowIndex={rowIndex}
                rowId={rowId}
                compIndex={i}
                compId={id}
              ></EditorComponentButton>
            ) : (
              <EditorComponentSelectMenu
                key={id}
                rowIndex={rowIndex}
                rowId={rowId}
                compIndex={i}
                compId={id}
              ></EditorComponentSelectMenu>
            )
          )}
          {/* {isButtonRow && (
            <div>
              <div className="space-x-3 mt-3">
                {components.length < 5 ? (
                  <button
                    className="bg-blurple px-3 py-2 rounded transition-colors hover:bg-blurple-dark text-white"
                    onClick={() =>
                      addButton(rowIndex, {
                        id: getUniqueId(),
                        type: 2,
                        style: 2,
                        label: "",
                        action_set_id: getUniqueId().toString(),
                        modals: []
                      })
                    }
                  >
                    Add Button
                  </button>
                ) : (
                  <button
                    disabled
                    className="bg-dark-2 px-3 py-2 rounded transition-colors cursor-not-allowed text-gray-300"
                  >
                    Add Button
                  </button>
                )}
                <button
                  className="px-3 py-2 rounded border-2 border-red hover:bg-red transition-colors text-white"
                  onClick={() => clearButtons(rowIndex)}
                >
                  Clear Buttons
                </button>
              </div>
            </div>
          )} */}
        </AutoAnimate>
      </Collapsable>
    </div>
  );
}
