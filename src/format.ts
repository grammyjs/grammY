import type { MessageEntity, User } from "./types.ts";

export class EntityString {
    constructor(private text = "", private entities: MessageEntity[] = []) {}

    append(text: string, ...entities: MessageEntity[]): this {
        this.text += text;
        this.entities.push(...entities);
        return this;
    }

    plain(text: string): this {
        return this.append(text);
    }
    mention(text: string): this {
        return this.append(text, {
            type: "mention",
            offset: this.text.length,
            length: text.length,
        });
    }
    hashtag(text: string): this {
        return this.append(text, {
            type: "hashtag",
            offset: this.text.length,
            length: text.length,
        });
    }
    cashtag(text: string): this {
        return this.append(text, {
            type: "cashtag",
            offset: this.text.length,
            length: text.length,
        });
    }
    botCommand(text: string): this {
        return this.append(text, {
            type: "bot_command",
            offset: this.text.length,
            length: text.length,
        });
    }
    url(text: string): this {
        return this.append(text, {
            type: "url",
            offset: this.text.length,
            length: text.length,
        });
    }
    email(text: string): this {
        return this.append(text, {
            type: "email",
            offset: this.text.length,
            length: text.length,
        });
    }
    phoneNumber(text: string): this {
        return this.append(text, {
            type: "phone_number",
            offset: this.text.length,
            length: text.length,
        });
    }
    bold(text: string): this {
        return this.append(text, {
            type: "bold",
            offset: this.text.length,
            length: text.length,
        });
    }
    italic(text: string): this {
        return this.append(text, {
            type: "italic",
            offset: this.text.length,
            length: text.length,
        });
    }
    underline(text: string): this {
        return this.append(text, {
            type: "underline",
            offset: this.text.length,
            length: text.length,
        });
    }
    strikethrough(text: string): this {
        return this.append(text, {
            type: "strikethrough",
            offset: this.text.length,
            length: text.length,
        });
    }
    spoiler(text: string): this {
        return this.append(text, {
            type: "spoiler",
            offset: this.text.length,
            length: text.length,
        });
    }
    blockquote(text: string): this {
        return this.append(text, {
            type: "blockquote",
            offset: this.text.length,
            length: text.length,
        });
    }
    expandableBlockquote(text: string): this {
        return this.append(text, {
            type: "expandable_blockquote",
            offset: this.text.length,
            length: text.length,
        });
    }
    code(text: string): this {
        return this.append(text, {
            type: "code",
            offset: this.text.length,
            length: text.length,
        });
    }
    pre(text: string, language?: string): this {
        return this.append(text, {
            type: "pre",
            offset: this.text.length,
            length: text.length,
            language,
        });
    }
    textLink(text: string, url: string): this {
        return this.append(text, {
            type: "text_link",
            offset: this.text.length,
            length: text.length,
            url,
        });
    }
    textMention(text: string, user: User): this {
        return this.append(text, {
            type: "text_mention",
            offset: this.text.length,
            length: text.length,
            user,
        });
    }
    customEmoji(text: string, custom_emoji_id: string): this {
        return this.append(text, {
            type: "custom_emoji",
            offset: this.text.length,
            length: text.length,
            custom_emoji_id,
        });
    }
    dateTime(
        text: string,
        unix_time: number,
        date_time_format: MessageEntity.DateTime["date_time_format"],
    ): this {
        return this.append(text, {
            type: "date_time",
            offset: this.text.length,
            length: text.length,
            unix_time,
            date_time_format,
        });
    }

    build(): { text: string; entities: MessageEntity[] } {
        return { text: this.text, entities: this.entities };
    }
}
