import "./MessagePreview.css";
import { format, parseISO } from "date-fns";
import { useState, useEffect } from "react";
import { Message } from "../discord/schema";
// @ts-ignore
import { toHTML } from "../discord/markdown";
import { colorIntToHex } from "../util/discord";
import { useSendSettingsStore } from "../state/sendSettings";
import Twemoji from "./Twemoji";
import { useGuildBrandingQuery } from "../api/queries";
import { getRelativeUrl } from "../util/url";
import { usePanelVarStore } from "../state/panelvar";


const buttonColors = {
  1: "discord-button-primary",
  2: "discord-button-secondary",
  3: "discord-button-success",
  4: "discord-button-destructive",
  5: "discord-button-secondary",
};

interface ButtonResponse {
  id: number;
  text: string;
}

function replaceVar(content: string, intData: any): string {
  return content.replace(/\{\{(.*?)\}\}/g, (match: string, key: string) => {
    const trimmedKey = key.trim();
    const parts = trimmedKey.split(/\.|\[|\]/).filter(Boolean); // Split by dot and brackets

    let value: any = intData;

    for (const k of parts) {
      if (value && typeof value === "object") {
        value = value[k];
      } else {
        return match; // Keep placeholder if value is undefined
      }
    }

    return value !== undefined ? String(value) : match;
  });
}



export default function MessagePreview({ msg }: { msg: Message }) {
  const loc = usePanelVarStore.getState().loc;
  
  
  const currentTime = format(new Date(), "hh:mm aa");
  const sendMode = useSendSettingsStore((state) => state.mode);
  const [responses, setResponses] = useState<ButtonResponse[]>([]);

  const guildId = useSendSettingsStore((s) => s.guildId);
  const { data: branding } = useGuildBrandingQuery(guildId);

  const defaultUsername =
    (branding?.success && branding.data.default_username) || loc.botName ;
  const defaultAvatarUrl =
    (branding?.success && branding.data.default_avatar_url) ||
    loc.botIconUrl ;

  const [intData, setIntData] = useState(usePanelVarStore.getState().int);

  useEffect(() => {
    const unsubscribe = usePanelVarStore.subscribe((state) => {
      const newIntData: typeof intData = state.int;
      setIntData(newIntData);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Twemoji
      options={{
        className: "discord-twemoji",
      }}
    >
      <div
        className="discord-messages"
        style={{
          border: "none",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
        }}
      >
        <div className="discord-message">
          <div className="discord-message-inner">
            <div className="discord-author-avatar">
              <img src={msg.avatar_url || defaultAvatarUrl} alt="" />
            </div>
            <div className="discord-message-content">
              <span className="discord-author-info">
                <span className="discord-author-username">
                  {msg.username || defaultUsername}
                </span>
                <span className="discord-application-tag">App</span>
              </span>
              <span className="discord-message-timestamp pl-1">
                Today at {currentTime}
              </span>
              {!!msg.content && (
  <div className="discord-message-body">
    <div
      className="discord-message-markup"
      dangerouslySetInnerHTML={{
        __html: toHTML(replaceVar(msg.content, intData) || "", {}),
      }}
    />
  </div>
)}

              <div className="discord-message-compact-indent">
                {msg.embeds &&
                  msg.embeds
                  .map((embed) => {
                    let inlineFieldIndex = 0;
                    const hexColor = embed.color
                      ? colorIntToHex(embed.color)
                      : "#1f2225";
                    let timestamp = "";
                    if (embed.timestamp) {
                      const date = parseISO(embed.timestamp);
                      if (!isNaN(date.getTime())) {
                        timestamp = format(date, "dd/MM/yyyy");
                      }
                    }
                    if (
                      embed.hidden ||
                      (!embed.description &&
                        !embed.title &&
                        !embed.author &&
                        !embed.provider &&
                        !embed.footer &&
                        (!embed.fields || embed.fields.length === 0) &&
                        !embed.image &&
                        !embed.thumbnail)
                    ) {
                      return null;
                    }

                    return (
                      <div
                        key={embed.id}
                        className="discord-embed overflow-hidden"
                      >
                        <div
                          className="discord-left-border"
                          style={{ backgroundColor: hexColor }}
                        ></div>
                        <div className="discord-embed-root">
                          <div className="discord-embed-wrapper">
                            <div className="discord-embed-grid">
                              {!!embed.provider?.name && (
                                <div className="discord-embed-provider overflow-hidden break-all">
                                  {embed.provider.url ? (
                                    <a href={embed.provider.url}>
                                      {embed.provider.name}
                                    </a>
                                  ) : (
                                    embed.provider.name
                                  )}
                                </div>
                              )}
                              {!!embed.author?.name && (
                                <div className="discord-embed-author overflow-hidden break-all">
                                  {!!embed.author.icon_url && (
                                    <img
                                      src={embed.author.icon_url}
                                      alt=""
                                      className="discord-author-image"
                                    />
                                  )}
                                  {embed.author.url ? (
                                    <a href={embed.author.url}>
                                      {embed.author.name}
                                    </a>
                                  ) : (
                                    embed.author.name
                                  )}
                                </div>
                              )}
                              {!!embed.title && (
                                <div className="discord-embed-title overflow-hidden break-all">
                                  {embed.url ? (
                                    <a
                                    href={replaceVar(embed.url, intData) || "#"} // Fallback to "#" if URL is empty
                                      dangerouslySetInnerHTML={{
                                        __html: toHTML(replaceVar(embed.title, intData) || "", {
                                          isTitle: true,
                                        }),
                                      }}
                                    ></a>
                                  ) : (
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: toHTML(replaceVar(embed.title, intData) || "", {
                                          isTitle: true,
                                        }),
                                      }}
                                    />
                                  )}
                                </div>
                              )}
                              {!!embed.description && (
                                <div
                                  className="discord-embed-description"
                                  dangerouslySetInnerHTML={{
                                    __html: toHTML(replaceVar(embed.description, intData) || "", {}),
                                  }}
                                />
                              )}
                              {!!embed.fields.length && (
                                <div className="discord-embed-fields">
                                  {embed.fields.map((field) => (
                                    <div
                                      key={field.id}
                                      className={`discord-embed-field${
                                        field.inline
                                          ? ` discord-embed-inline-field discord-embed-inline-field-${
                                              (inlineFieldIndex++ % 3) + 1
                                            }`
                                          : ""
                                      }`}
                                    >
                                      <div
                                        className="discord-field-title overflow-hidden break-all"
                                        dangerouslySetInnerHTML={{
                                          __html: toHTML(replaceVar(field.name, intData) || "", {
                                            isTitle: true,
                                          }),
                                        }}
                                      />
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: toHTML(replaceVar(field.value, intData), {}),
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                              {!!embed.image && (
                                <div className="discord-embed-media">
                                  <img
                                    src={replaceVar(embed.image.url ?? '', intData)}
                                    alt=""
                                    className="discord-embed-image"
                                  />
                                </div>
                              )}
                              {!!embed.thumbnail && (
                                <img
                                src={embed.image?.url ? replaceVar(embed.image.url, intData) : ''}
                                  alt=""
                                  className="discord-embed-thumbnail"
                                />
                              )}
                              {(embed.footer?.text || embed.timestamp) && (
                                <div className="discord-embed-footer overflow-hidden break-all">
                                  {embed.footer?.icon_url && (
                                    <img
                                      src={embed.footer?.icon_url}
                                      alt=""
                                      className="discord-footer-image"
                                    />
                                  )}
                                  {embed.footer?.text}
                                  {embed.footer?.text && embed.timestamp && (
                                    <div className="discord-footer-separator">
                                      •
                                    </div>
                                  )}
                                  <div className="flex-none">{timestamp}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                    
                  })}

                <div className="discord-attachments">
                  {sendMode &&
                    msg.components.map((row) => (
                      <div className="discord-action-row" key={row.id}>
                        {row.components.map((comp) =>
                          comp.type === 2 ? (
                            comp.style === 5 ? (
                              <a
                                className={`discord-button discord-button-hoverable discord-button-secondary ${
                                  comp.hidden ? "discord-button-disabled" : ""
                                }`}
                                key={comp.id}
                                target="_blank"
                                // href={comp.url}
                                rel="noreferrer"
                              >
                                {comp.emoji &&
                                  (comp.emoji.id ? (
                                    <img
                                      src={`https://cdn.discordapp.com/emojis/${
                                        comp.emoji.id
                                      }.${comp.emoji.animated ? "gif" : "png"}`}
                                      alt=""
                                      className="discord-button-emoji"
                                    />
                                  ) : (
                                    <Twemoji
                                      options={{
                                        className: "discord-button-emoji",
                                      }}
                                    >
                                      {comp.emoji.name}
                                    </Twemoji>
                                  ))}
                                <span>{comp.label}</span>
                                <svg
                                  className="discord-button-launch"
                                  aria-hidden="false"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M10 5V3H5.375C4.06519 3 3 4.06519 3 5.375V18.625C3 19.936 4.06519 21 5.375 21H18.625C19.936 21 21 19.936 21 18.625V14H19V19H5V5H10Z"
                                  ></path>
                                  <path
                                    fill="currentColor"
                                    d="M21 2.99902H14V4.99902H17.586L9.29297 13.292L10.707 14.706L19 6.41302V9.99902H21V2.99902Z"
                                  ></path>
                                </svg>
                              </a>
                            ) : (
                              <div
                                className={`discord-button discord-button-hoverable ${
                                  buttonColors[comp.style]
                                } ${
                                  comp.hidden ? "discord-button-disabled" : ""
                                }`}
                                key={comp.id}
                              >
                                {comp.emoji &&
                                  (comp.emoji.id ? (
                                    <img
                                      src={`https://cdn.discordapp.com/emojis/${
                                        comp.emoji.id
                                      }.${comp.emoji.animated ? "gif" : "png"}`}
                                      alt=""
                                      className="discord-button-emoji"
                                    />
                                  ) : (
                                    <Twemoji
                                      options={{
                                        className: "discord-button-emoji",
                                      }}
                                    >
                                      {comp.emoji.name}
                                    </Twemoji>
                                  ))}
                                <span>{replaceVar(comp.label, intData)}</span>
                              </div>
                            )
                          ) : comp.type === 3 ? (
                            <div
                              className={`discord-select-menu discord-select-menu-hoverable ${
                                comp.hidden
                                  ? "discord-select-menu-disabled"
                                  : ""
                              }`}
                              key={comp.id}
                            >
<span className="discord-select-menu-placeholder">
  {replaceVar(comp.placeholder ?? "Make a selection", intData)}
</span>

                              <svg
                                className="discord-select-menu-icon"
                                aria-hidden="true"
                                role="img"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="currentColor"
                                  d="M16.59 8.59003L12 13.17L7.41 8.59003L6 10L12 16L18 10L16.59 8.59003Z"
                                ></path>
                              </svg>
                            </div>
                          ) : undefined
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {responses.map((resp) => (
          <div
            className="discord-message discord-highlight-ephemeral"
            key={resp.id}
          >
            <div className="discord-replied-message">
              <img
                src={msg.avatar_url || getRelativeUrl("/logo.svg")}
                alt=""
                className="discord-replied-message-avatar"
              />
              <span className="discord-application-tag">App</span>
              <span className="discord-replied-message-username">
                {msg.username || "Default"}
              </span>
              <div className="discord-replied-message-content truncate">
                {msg.content || (
                  <span className="italic">Click to see attachment</span>
                )}
              </div>
            </div>
            <div className="discord-message-inner">
              <div className="discord-author-avatar">
                <img src={getRelativeUrl("/logo.svg")} alt="" />
              </div>
              <div className="discord-message-content">
                <span className="discord-author-info">
                  <span className="discord-author-username">
                    Default
                  </span>
                  <span className="discord-application-tag">
                    <svg
                      className="discord-application-tag-verified"
                      aria-label="Verified App"
                      aria-hidden="false"
                      width="16"
                      height="16"
                      viewBox="0 0 16 15.2"
                    >
                      <path
                        d="M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    App
                  </span>
                </span>
                <span className="discord-message-timestamp pl-1">
                  Today at {currentTime}
                </span>
                <div className="discord-message-body">
                  <span className="discord-message-markup">{resp.text}</span>
                </div>
                <div className="discord-message-compact-indent">
                  <div className="discord-message-ephemeral flex items-center">
                    <svg
                      className="discord-message-ephemeral-icon"
                      aria-hidden="false"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M12 5C5.648 5 1 12 1 12C1 12 5.648 19 12 19C18.352 19 23 12 23 12C23 12 18.352 5 12 5ZM12 16C9.791 16 8 14.21 8 12C8 9.79 9.791 8 12 8C14.209 8 16 9.79 16 12C16 14.21 14.209 16 12 16Z"
                      ></path>
                      <path
                        fill="currentColor"
                        d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                      ></path>
                    </svg>
                    Only you can see this •{" "}
                    <span
                      className="discord-message-ephemeral-link"
                      onClick={() =>
                        setResponses(responses.filter((r) => r.id !== resp.id))
                      }
                    >
                      Dismiss message
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Twemoji>
  );
}
