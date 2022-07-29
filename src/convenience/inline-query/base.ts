export type NewObj<Prev, QueryResult, Key extends keyof QueryResult> = Prev & {
    [k in Key]-?: Exclude<QueryResult[Key], undefined>;
};

export type MiniObj = { type: string };

export abstract class BaseInlineQueryResultBuilder<TObj = MiniObj> {
    constructor(protected value: Record<string, any>) {}

    protected add<Key extends string, Value>(
        key: Key,
        value: Value
    ): BaseInlineQueryResultBuilder<TObj & { [K in Key]: Value }> {
        this.value[key] = value;
        return this;
    }

    protected id(id: string) {
        return this.add("id", id);
    }

    public build() {
        return this.value as TObj;
    }
}
