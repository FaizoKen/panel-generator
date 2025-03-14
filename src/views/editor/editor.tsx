import { Outlet } from "react-router-dom";
import EditorMessageContentFields from "../../components/EditorMessageContentFields";
import EditorEmbeds from "../../components/EditorEmbeds";
import EditorMenuBar from "../../components/EditorMenuBar";
import EditorMessagePreview from "../../components/EditorMessagePreview";
import EditorComponents from "../../components/EditorComponents";
import { useCurrentMessageStore } from "../../state/message";
import { debounce } from "debounce";
import { Message, messageSchema } from "../../discord/schema";
import { useValidationErrorStore } from "../../state/validationError";
import EditorAttachments from "../../components/EditorAttachments";
import SendMenu from "../../components/SendMenu";
import { Drawer } from "vaul";
import { useState } from "react";
import { DocumentMagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function EditorView() {
  const setValidationError = useValidationErrorStore((state) => state.setError);

  const debouncedSetValidationError = debounce((msg: Message) => {
    const res = messageSchema.safeParse(msg);
    setValidationError(res.success ? null : res.error);
  }, 250);

  useCurrentMessageStore((state) => {
    debouncedSetValidationError(state);
    return null;
  });

  // TODO: also validate actions stores

  const [previewDrawerOpen, setPreviewDrawerOpen] = useState(false);

  return (
    <div className="flex h-full w-full">
      <div className="flex flex-col lg:flex-row h-full flex-auto w-full">
        <div className="lg:w-2/3 lg:h-full bg-dark-4 lg:overflow-y-auto no-scrollbar">
          <div className="px-5 pt-5 pb-20 space-y-5 xl:px-20">
            <SendMenu />
            <div className="border border-dark-6"></div>
            <EditorMenuBar />
            <EditorMessageContentFields />
            <EditorAttachments />
            <EditorEmbeds />
            <EditorComponents />
          </div>
        </div>
        <div className="hidden lg:block w-1/2 h-full bg-dark-4 lg:border-l-2 border-dark-3 px-5 py-2 overflow-y-auto no-scrollbar">
          <EditorMessagePreview />
        </div>

        <Drawer.Root
          open={previewDrawerOpen}
          onOpenChange={setPreviewDrawerOpen}
        >
          <Drawer.Trigger asChild className="fixed bottom-3 right-3 lg:hidden">
            <button className="bg-blurple rounded-full w-12 h-12 flex items-center justify-center">
              <DocumentMagnifyingGlassIcon className="text-gray-200 h-8 w-8" />
            </button>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40" />
            <Drawer.Content className="z-10 bg-dark-4 flex flex-col fixed bottom-0 left-0 right-0 max-h-[80%] rounded-t-[10px] overflow-y-hidden h-full focus:outline-none">
              <div className="overflow-y-hidden h-full px-3 flex flex-col">
                <div className="p-4 flex-none">
                  <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-600" />
                </div>
                <div className="overflow-y-auto pb-10">
                  <EditorMessagePreview />
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
      <Outlet />
    </div>
  );
}
