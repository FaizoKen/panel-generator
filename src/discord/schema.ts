import { z } from "zod";
import { getUniqueId } from "../util";

const VARIABLE_RE = new RegExp("\\{\\{[^}]+\\}\\}");

const HOSTNAME_RE = new RegExp("\\.[a-zA-Z]{2,}$");
const urlRefinement: [(v: string) => boolean, string] = [
  (v) => {
    if (v.match(VARIABLE_RE)) return true;

    try {
      const url = new URL(v);
      return !!url.hostname.match(HOSTNAME_RE);
    } catch {
      return false;
    }
  },
  "Invalid URL",
];

const IMAGE_PATH_RE = new RegExp("\\.(png|jpg|jpeg|webp|gif)$");
const imageUrlRefinement: [(v: string) => boolean, string] = [
  (v) => {
    if (v.match(VARIABLE_RE)) return true;

    try {
      const url = new URL(v);
      return !!url.hostname.match(HOSTNAME_RE); // && !!url.pathname.match(IMAGE_PATH_RE) TODO: make better image url regex
    } catch {
      return false;
    }
  },
  "Invalid image URL",
];

export const uniqueIdSchema = z.number();

export type UniqueId = z.infer<typeof uniqueIdSchema>;

export const embedFooterTextSchema = z.optional(z.string().max(2048));

export type EmbedFooterText = z.infer<typeof embedFooterTextSchema>;

export const embedFooterIconUrlSchema = z.optional(
  z.string().refine(...imageUrlRefinement)
);

export type EmbedFooterIconUrl = z.infer<typeof embedFooterIconUrlSchema>;

export const embedFooterSchema = z.optional(
  z.object({
    text: embedFooterTextSchema,
    icon_url: embedFooterIconUrlSchema,
  })
);

export type EmbedFooter = z.infer<typeof embedFooterSchema>;

export const embedImageUrlSchema = z.optional(
  z.string().refine(...urlRefinement)
);

export type EmbedImageUrl = z.infer<typeof embedImageUrlSchema>;

export const embedImageSchema = z.optional(
  z.object({
    url: embedImageUrlSchema,
  })
);

export type EmbedImage = z.infer<typeof embedImageSchema>;

export const embedThumbnailUrlSchema = z.optional(
  z.string().refine(...urlRefinement)
);

export type EmbedThumbnailUrl = z.infer<typeof embedThumbnailUrlSchema>;

export const embedThumbnailSchema = z.optional(
  z.object({
    url: embedThumbnailUrlSchema,
  })
);

export type EmbedThumbnail = z.infer<typeof embedThumbnailSchema>;

export const embedAuthorNameSchema = z.string().min(1).max(256);

export type EmbedAuthorName = z.infer<typeof embedAuthorNameSchema>;

export const embedAuthorUrlSchema = z.optional(
  z.string().refine(...urlRefinement)
);

export type EmbedAuthorUrl = z.infer<typeof embedAuthorUrlSchema>;

export const embedAuthorIconUrlSchema = z.optional(
  z.string().refine(...imageUrlRefinement)
);

export type EmbedAuthorIconUrl = z.infer<typeof embedAuthorIconUrlSchema>;

export const embedAuthorSchema = z.optional(
  z.object({
    name: embedAuthorNameSchema,
    url: embedAuthorUrlSchema,
    icon_url: embedAuthorIconUrlSchema,
  })
);

export type EmbedAuthor = z.infer<typeof embedAuthorSchema>;

export const embedProviderNameSchema = z.string().min(1).max(256);

export type EmbedProviderName = z.infer<typeof embedProviderNameSchema>;

export const embedProviderUrlSchema = z.optional(
  z.string().refine(...urlRefinement)
);

export type EmbedProviderUrl = z.infer<typeof embedProviderUrlSchema>;

export const embedProviderSchema = z.optional(
  z.object({
    name: embedProviderNameSchema,
    url: embedProviderUrlSchema,
  })
);

export type EmbedProvider = z.infer<typeof embedProviderSchema>;

export const embedFieldNameSchema = z.string().min(1).max(256);

export type EmbedFieldName = z.infer<typeof embedFieldNameSchema>;

export const embedFieldValueSchema = z.string().min(1).max(1024);

export type EmbedFieldValue = z.infer<typeof embedFieldValueSchema>;

export const embedFieldInlineSchma = z.optional(z.boolean());

export type EmbedFieldInline = z.infer<typeof embedFieldInlineSchma>;

export const embedFieldSchema = z.object({
  id: uniqueIdSchema.default(() => getUniqueId()),
  name: embedFieldNameSchema,
  value: embedFieldValueSchema,
  inline: embedFieldInlineSchma,
});

export type EmbedField = z.infer<typeof embedFieldSchema>;

export const embedTitleSchema = z.optional(z.string().max(256));

export type EmbedTitle = z.infer<typeof embedTitleSchema>;

export const embedDescriptionSchema = z.optional(z.string().max(4096));

export type EmbedDescription = z.infer<typeof embedDescriptionSchema>;

export const embedUrlSchema = z.optional(z.string().refine(...urlRefinement));

export type EmbedUrl = z.infer<typeof embedUrlSchema>;

export const embedTimestampSchema = z.optional(z.string());

export type EmbedTimestamp = z.infer<typeof embedTimestampSchema>;

export const embedColor = z.optional(z.number().max(16777215));

export type EmbedColor = z.infer<typeof embedColor>;

export const embedSchema = z
  .object({
    id: uniqueIdSchema.default(() => getUniqueId()),
    title: embedTitleSchema,
    description: embedDescriptionSchema,
    url: embedUrlSchema,
    timestamp: embedTimestampSchema,
    color: embedColor,
    footer: embedFooterSchema,
    author: embedAuthorSchema,
    provider: embedProviderSchema,
    image: embedImageSchema,
    thumbnail: embedThumbnailSchema,
    fields: z.array(embedFieldSchema).max(25).default([]),
    hidden: z.boolean().optional(),
  });


export type MessageEmbed = z.infer<typeof embedSchema>;

export const emojiSchema = z
  .object({
    id: z.optional(z.string()),
    name: z.string(),
    animated: z.boolean(),
  })
  .refine(
    (val) => val.id || val.name,
    "Emoji must have either an id or a name"
  );

export type Emoji = z.infer<typeof emojiSchema>;

export const buttonStyleSchema = z
  .literal(1)
  .or(z.literal(2))
  .or(z.literal(3))
  .or(z.literal(4))
  .or(z.literal(5));

export type MessageComponentButtonStyle = z.infer<typeof buttonStyleSchema>;

export const buttonModalSchema = z.object({
  id: uniqueIdSchema.default(() => getUniqueId()),
  name: z.string().max(100).default(""),
  placeholder: z.string().max(100).default(""),
  value: z.string().max(100).default(""),
  style: z.literal(1).or(z.literal(2)).default(1),
  required: z.optional(z.boolean()),
  minLength: z.optional(z.number().min(1).max(1000)),
  maxLength: z.optional(z.number().min(1).max(1000)),
});

export type buttonModal = z.infer<typeof buttonModalSchema>;

export const buttonSchema = z
  .object({
    id: uniqueIdSchema.default(() => getUniqueId()),
    type: z.literal(2),
    style: z.literal(1).or(z.literal(2)).or(z.literal(3)).or(z.literal(4)),
    label: z.string(),
    emoji: z.optional(z.nullable(emojiSchema)),
    hidden: z.optional(z.boolean()),
    modals: z.array(buttonModalSchema).max(5).default([]),
  })
  .or(
    z.object({
      id: uniqueIdSchema.default(() => getUniqueId()),
      type: z.literal(2),
      style: z.literal(5),
      label: z.string(),
      emoji: z.optional(z.nullable(emojiSchema)),
      url: z.string().refine(...urlRefinement),
      hidden: z.optional(z.boolean()),
    })
  )
  .superRefine((data, ctx) => {
    if (!data.emoji && !data.label) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["label"],
        message: "Label is required when no emoji is set",
      });
    }
  });

export type MessageComponentButton = z.infer<typeof buttonSchema>;

export const selectMenuOptionResponseSchema = z
  .object({
    description: z.optional(z.string().max(4096)),
    url: z.optional(z.string().refine(...urlRefinement)),
    color: z.optional(z.number().max(16777215)),
    image_url: z.optional(z.string().refine(...urlRefinement)),
  });

export const selectMenuOptionSchema = z.object({
  id: uniqueIdSchema.default(() => getUniqueId()),
  label: z.string().min(1).max(100),
  description: z.optional(z.string().min(1).max(100)),
  message_response: z.optional(selectMenuOptionResponseSchema).default({}),
  emoji: z.optional(z.nullable(emojiSchema)),
});

export type MessageComponentSelectMenuOption = z.infer<
  typeof selectMenuOptionSchema
>;

export const selectMenuSchema = z.object({
  id: uniqueIdSchema.default(() => getUniqueId()),
  type: z.literal(3),
  placeholder: z.optional(z.string().max(150)),
  hidden: z.optional(z.boolean()),
  options: z.array(selectMenuOptionSchema).min(1).max(25),
});

export type MessageComponentSelectMenu = z.infer<typeof selectMenuSchema>;

export const actionRowSchema = z.object({
  id: uniqueIdSchema.default(() => getUniqueId()),
  type: z.literal(1),
  components: z.array(buttonSchema.or(selectMenuSchema)).min(1).max(5),
});

export type MessageComponentActionRow = z.infer<typeof actionRowSchema>;

export const messageActionSchema = z
  .object({
    type: z.literal(1).or(z.literal(6)).or(z.literal(8)), // text response
    id: uniqueIdSchema.default(() => getUniqueId()),
    text: z.string().min(1).max(2000),
    public: z.boolean().default(false),
  })
  .or(
    z.object({
      type: z.literal(5).or(z.literal(7)).or(z.literal(9)), // saved messages responses
      id: uniqueIdSchema.default(() => getUniqueId()),
      target_id: z.string().min(1),
      public: z.boolean().default(false),
    })
  )
  .or(
    z.object({
      type: z.literal(2).or(z.literal(3)).or(z.literal(4)), // toggle, add, remove role
      id: uniqueIdSchema.default(() => getUniqueId()),
      target_id: z.string().min(1),
      public: z.boolean().default(false),
      disable_default_response: z.boolean().default(false),
    })
  )
  .or(
    z.object({
      type: z.literal(10), // permission check with default response
      id: uniqueIdSchema.default(() => getUniqueId()),
      permissions: z.string().default("0"),
      role_ids: z.array(z.string()),
      disable_default_response: z.literal(false),
    })
  )
  .or(
    z.object({
      type: z.literal(10), // permission check with custom response
      id: uniqueIdSchema.default(() => getUniqueId()),
      permissions: z.string().default("0"),
      role_ids: z.array(z.string()),
      disable_default_response: z.literal(true),
      text: z.string().min(1).max(2000),
    })
  );

export type MessageAction = z.infer<typeof messageActionSchema>;


export const messageContentSchema = z.string().max(2000);

export const intCurlSchema = z.string();

export type MessageContent = z.infer<typeof messageContentSchema>;

export const webhookUsernameSchema = z.optional(
  z
    .string()
    .max(80)
    .refine(
      (val) =>
        !val.toLowerCase().includes("clyde") &&
        !val.toLowerCase().includes("discord"),
      "Username can't contain 'clyde' or 'discord'"
    )
    .refine(
      (val) => val.toLowerCase() !== "everyone" && val.toLowerCase() !== "here",
      "Username can't be 'everyone'  or 'here'"
    )
);

export type WebhookUsername = z.infer<typeof webhookUsernameSchema>;

export const webhookAvatarUrlSchema = z.optional(
  z.string().refine(...imageUrlRefinement)
);

export type WebhookAvatarUrl = z.infer<typeof webhookAvatarUrlSchema>;

export const messageAllowedMentionsSchema = z.optional(
  z.object({
    parse: z.array(
      z.literal("users").or(z.literal("roles")).or(z.literal("everyone"))
    ),
    roles: z.array(z.string()),
    users: z.array(z.string()),
    replied_user: z.boolean(),
  })
);

export const messageThreadName = z.optional(z.string().max(100));

export const messageSchema = z
  .object({
    intCurl: intCurlSchema.default(""),
    content: messageContentSchema.default(""),
    username: webhookUsernameSchema,
    avatar_url: webhookAvatarUrlSchema,
    embeds: z.array(embedSchema).max(10).default([]),
    allowed_mentions: messageAllowedMentionsSchema,
    components: z.array(actionRowSchema).max(5).default([]),
    thread_name: messageThreadName,
  })
  .superRefine((data, ctx) => {
    // this currently doesn't take attachments into account
    if (!data.content && !data.embeds.length && !data.components.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["content"],
        message: "Content is required when no other fields are set",
      });
    }
  });

export type Message = z.infer<typeof messageSchema>;
