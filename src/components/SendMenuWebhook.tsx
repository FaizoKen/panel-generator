import { useMemo, useState, useEffect, useRef } from "react";
import {
  useSendMessageToChannelMutation,
  useSendMessageToWebhookMutation,
} from "../api/mutations";
import { useCurrentMessageStore } from "../state/message";
import { useValidationErrorStore } from "../state/validationError";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { useCurrentAttachmentsStore } from "../state/attachments";
import { useSendSettingsStore } from "../state/sendSettings";
import { shallow } from "zustand/shallow";
import { messageUrlRegex, parseWebhookUrl } from "../discord/util";
import MessageRestoreButton from "./MessageRestoreButton";
import { useToasts } from "../util/toasts";
import { useGuildEmojisQuery } from "../api/queries";

export default function SendMenuWebhook() {
  const validationError = useValidationErrorStore((state) =>
    state.checkIssueByPathPrefix("")
  );

  const [webhookUrl, setWebhookUrl] = useSendSettingsStore(
    (state) => [state.webhookUrl, state.setWebhookUrl],
    shallow
  );
  const webhookInfo = useMemo(() => {
    if (!webhookUrl) return null;
    return parseWebhookUrl(webhookUrl);
  }, [webhookUrl]);

  const sendToWebhookMutation = useSendMessageToWebhookMutation();

  const createToast = useToasts((state) => state.create);

  const [messageId, setMessageId] = useSendSettingsStore(
    (state) => [state.messageId, state.setMessageId],
    shallow
  );

  const [setSelectedGuildId] = useSendSettingsStore(
    (state) => [state.setGuildId],
    shallow
  );

  const fetchTimeout = useRef<NodeJS.Timeout | null>(null);

  function send(edit: boolean) {
    if (!webhookInfo) {
      createToast({
        type: "error",
        title: "Invalid Webhook",
        message: "Please provide a valid webhook URL.",
      });
      return;
    }
    if (validationError) {
      createToast({
        type: "error",
        title: "Validation Error",
        message: "Fix the errors in your message before sending.",
      });
      return;
    }

    sendToWebhookMutation.mutate(
      {
        webhook_type: webhookInfo.type,
        webhook_id: webhookInfo.id,
        webhook_token: webhookInfo.token,
        data: useCurrentMessageStore.getState(),
        attachments: useCurrentAttachmentsStore.getState().attachments,
        thread_id: null,
        message_id: edit ? messageId : null,
      },
      {
        onSuccess: (resp) => {
          if (resp.success) {
            createToast({
              type: "success",
              title: edit ? "Message Edited" : "Message Sent",
              message: `The message has been ${edit ? "edited" : "sent"} successfully!`,
            });
          } else {
            createToast({
              type: "error",
              title: "Failed to Send Message",
              message: resp.error.message,
            });
          }
        },
        onError: (error) => {
          console.error("Error sending message:", error);
          createToast({
            type: "error",
            title: "Error",
            message: "An unexpected error occurred while sending the message.",
          });
        },
      }
    );
  }

  function handleMessageId(val: string) {
    if (!val) {
      setMessageId(null);
      return;
    }

    const match = val.match(messageUrlRegex);
    if (match) {
      setMessageId(match[2]);
    } else {
      setMessageId(val);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <div className="flex-auto sm:w-1/2">
          <div className="uppercase text-gray-300 text-sm font-medium mb-1.5">
            Bot Webhook URL
          </div>
          <input
            type="url"
            className="bg-dark-2 px-3 py-2 rounded w-full focus:outline-none text-white"
            onChange={(e) => {
              setWebhookUrl(e.target.value || null);
              if (fetchTimeout.current) {
                clearTimeout(fetchTimeout.current);
                fetchTimeout.current = null;
              }
              if (!e.target.value) {
                setSelectedGuildId(null);
                return;
              }
              fetchTimeout.current = setTimeout(async () => {
                try {
                  const response = await fetch(e.target.value);
                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }
                  const { data: datas } = await response.json();
                  if (datas.guildId) {
                    setSelectedGuildId(datas.guildId);
                  } else {
                    console.log(datas)
                    console.warn("No guildId found in the response.");
                  }
                } catch (error) {
                  console.error("Failed to fetch guildId:", error);
                } finally {
                  fetchTimeout.current = null;
                }
              }, 2000);
            }}
            value={webhookUrl || ""}
          />
        </div>
        <div className="flex-auto sm:w-1/2">
          <div className="uppercase text-gray-300 text-sm font-medium mb-1.5">
            Message ID or URL
          </div>
          <input
            type="text"
            className="bg-dark-2 px-3 py-2 rounded w-full focus:outline-none text-white"
            value={messageId ?? ""}
            onChange={(e) => handleMessageId(e.target.value)}
          />
        </div>
      </div>
      <div className="text-orange-300 font-light">
        Custom channels, roles & emojis are only available when inserting a channel key
      </div>
      <div>
        {validationError && (
          <div className="flex items-center text-red space-x-1">
            <ExclamationCircleIcon className="h-5 w-5" />
            <div>
              There are errors in your message, you have to fix them before
              sending the message.
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2 items-end md:items-center">
        <MessageRestoreButton />
        <div className="flex items-center space-x-2">
          {messageId && (
            <div
              className={`px-3 py-2 rounded text-white flex items-center space-x-3 ${
                validationError || !webhookInfo || webhookInfo.type != "discord"
                  ? "cursor-not-allowed bg-dark-2"
                  : "bg-blurple hover:bg-blurple-dark cursor-pointer"
              }`}
              role="button"
              onClick={() => send(true)}
            >
              {sendToWebhookMutation.isLoading && (
                <div className="h-2 w-2 bg-white rounded-full animate-ping"></div>
              )}
              <div>Edit Message</div>
            </div>
          )}
          <div
            className={`px-3 py-2 rounded text-white flex items-center space-x-3 ${
              validationError || !webhookInfo
                ? "cursor-not-allowed bg-dark-2"
                : "bg-blurple hover:bg-blurple-dark cursor-pointer"
            }`}
            role="button"
            onClick={() => send(false)}
          >
            {sendToWebhookMutation.isLoading && (
              <div className="h-2 w-2 bg-white rounded-full animate-ping"></div>
            )}
            <div>Send Message</div>
          </div>
        </div>
      </div>
    </div>
  );
}
