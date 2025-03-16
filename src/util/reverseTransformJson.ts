import { Panel } from "./transformJson";
import {
  MessageComponentButtonStyle,
  EmbedField,
  Message,
  MessageComponentActionRow,
  buttonModal,
  MessageComponentButton,
  MessageEmbed,
  MessageComponentSelectMenuOption,
  MessageComponentSelectMenu,
  MessageAction,
  Emoji,
} from "../discord/schema";

export function reverseTransformJson(output: Message): Panel {
  const parseColor = (color?: number) =>
    color ? `#${color.toString(16).padStart(6, '0')}` : null;

  const parseEmoji = (emoji?: { id?: string; name: string; animated?: boolean }) => {
    if (!emoji) return '';
    return emoji.id ? `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>` : emoji.name;
  };

  const getImageId = (url?: string) => url ?? '';

  const embed1 = output.embeds?.find(e => e.id === 1);
  const embed2 = output.embeds?.find(e => e.id === 2);
  const embed3 = output.embeds?.find(e => e.id === 3);

  const components = output.components?.flatMap(c => c.components) || [];

  const selectMenu = components.find(c => c.type === 3) as MessageComponentSelectMenu | undefined;
  const buttons = components.filter(c => c.type === 2);

  const mainButton = buttons.find(b => b.id === 10) as MessageComponentButton | undefined;
  const rulesButton = buttons.find(b => b.id === 11);
  const settingsButton = buttons.find(b => b.id === 12);

  const buttonStyles: Record<number, string> = {
    1: "PRIMARY",
    2: "SECONDARY",
    3: "SUCCESS",
    4: "DANGER",
  };

  return {
    api_get: output.apiInt || null,
    raw_data: {
      message: output.content || null,
      panels: {
        is_name: !!embed1?.author,
        is_guide: !!embed3?.title,
        is_rule: rulesButton ? !rulesButton.hidden : false,
        is_setting: settingsButton ? !settingsButton.hidden : false,
        is_menu: selectMenu ? !selectMenu.hidden : false,
        is_button: mainButton ? !mainButton.hidden : false,
        lang: "en",
        msg_color: parseColor(embed1?.color ?? embed2?.color ?? embed3?.color),
        menu_name: selectMenu?.placeholder || null,
        button_color: buttonStyles[mainButton?.style ?? 1] || "PRIMARY",
        button_emoji: mainButton?.emoji ? parseEmoji(mainButton.emoji) : null,
        button_name: mainButton ? (mainButton as MessageComponentButton).label || "No Label" : "No Label",
        image: getImageId(embed1?.image?.url) || null,
        title: embed2?.title || null,
        description: embed2?.description || null,
        desc_image: embed2?.image?.url ? getImageId(embed2.image.url) : null,
        url: embed2?.url || null,
      },
      modals:
        mainButton && "modals" in mainButton
          ? mainButton.modals.map(modal => ({
              name: modal.name || null,
              placeholder: modal.placeholder || null,
              value: modal.value || null,
              style: modal.style === 1 ? "SHORT" : "PARAGRAPH",
              required: modal.required ?? false,
              minLength: modal.minLength?.toString() || null,
              maxLength: modal.maxLength?.toString() || null,
            }))
          : [],
      options: selectMenu && 'options' in selectMenu
        ? selectMenu.options.map((opt: MessageComponentSelectMenuOption) => ({
            emoji: opt.emoji ? parseEmoji(opt.emoji) : null,
            label: opt.label || null,
            description: opt.description || null,
            msg_image: getImageId(opt.message_response?.image_url) || null,
            msg_description: opt.message_response?.description || null,
            msg_color: parseColor(opt.message_response?.color) || null,
            url: opt.message_response?.url || null,
          }))
        : [],
    },
  };
}
