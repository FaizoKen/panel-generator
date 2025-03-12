import { useCurrentMessageStore } from "../state/message";
import { shallow } from "zustand/shallow";
import { useCollapsedStatesStore } from "../state/collapsed";
import clsx from "clsx";
import { getUniqueId } from "../util";
import { AutoAnimate } from "../util/autoAnimate";
import EditorComponentRow from "./EditorComponentRow";
import Collapsable from "./Collapsable";
import { useSendSettingsStore } from "../state/sendSettings";

export default function EditorComponents() {
  const components = useCurrentMessageStore(
    (state) => state.components.map((e) => e.id),
    shallow
  );
  
  const addRow = useCurrentMessageStore((state) => state.addComponentRow);
  const clearComponents = useCurrentMessageStore(
    (state) => state.clearComponentRows
  );

  function addButtonRow() {
    if (components.length >= 5) return;
    addRow({
      id: getUniqueId(),
      type: 1,
      components: [
        {
          id: getUniqueId(),
          type: 2,
          style: 2,
          label: "",
          action_set_id: "",
          modals: [],
        },
      ],
    })
  }

  function addSelectMenuRow() {
    if (components.length >= 5) return;
    addRow({
      id: getUniqueId(),
      type: 1,
      components: [
        {
          id: getUniqueId(),
          type: 3,
          options: [],
        },
      ],
    });
  }

  const sendMode = useSendSettingsStore((state) => state.mode);

  return (
    <Collapsable
      id="components"
      title="Components"
      size="large"
      valiationPathPrefix="components"
    >
      <AutoAnimate className="space-y-3 mb-3">
        {components.map((id, i) => (
          <div key={id}>
            <EditorComponentRow rowIndex={i} rowId={id} />
          </div>
        ))}
      </AutoAnimate>

    </Collapsable>
  );
}
