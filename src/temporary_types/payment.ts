import type { Chat, User } from "./manage.ts";
import type { PaidMedia, Sticker } from "./message.ts";

/** This object represents a portion of the price for goods or services. */
export interface LabeledPrice {
    /** Portion label */
    label: string;
    /** Price of the product in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45 pass amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). */
    amount: number;
}

/** This object contains basic information about an invoice. */
export interface Invoice {
    /** Product name */
    title: string;
    /** Product description */
    description: string;
    /** Unique bot deep-linking parameter that can be used to generate this invoice */
    start_parameter: string;
    /** Three-letter ISO 4217 currency code, or “XTR” for payments in Telegram Stars */
    currency: string;
    /** Total price in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45 pass amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). */
    total_amount: number;
}

/** This object represents a shipping address. */
export interface ShippingAddress {
    /** Two-letter ISO 3166-1 alpha-2 country code */
    country_code: string;
    /** State, if applicable */
    state: string;
    /** City */
    city: string;
    /** First line for the address */
    street_line1: string;
    /** Second line for the address */
    street_line2: string;
    /** Address post code */
    post_code: string;
}

/** This object represents information about an order. */
export interface OrderInfo {
    /** User name */
    name?: string;
    /** User's phone number */
    phone_number?: string;
    /** User email */
    email?: string;
    /** User shipping address */
    shipping_address?: ShippingAddress;
}

/** This object represents one shipping option. */
export interface ShippingOption {
    /** Shipping option identifier */
    id: string;
    /** Option title */
    title: string;
    /** List of price portions */
    prices: LabeledPrice[];
}

/** This object contains basic information about a successful payment. */
export interface SuccessfulPayment {
    /** Three-letter ISO 4217 currency code, or “XTR” for payments in Telegram Stars */
    currency: string;
    /** Total price in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45 pass amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). */
    total_amount: number;
    /** Bot specified invoice payload */
    invoice_payload: string;
    /** Expiration date of the subscription, in Unix time; for recurring payments only */
    subscription_expiration_date?: number;
    /** True, if the payment is a recurring payment for a subscription */
    is_recurring?: true;
    /** True, if the payment is the first payment for a subscription */
    is_first_recurring?: true;
    /** Identifier of the shipping option chosen by the user */
    shipping_option_id?: string;
    /** Order information provided by the user */
    order_info?: OrderInfo;
    /** Telegram payment identifier */
    telegram_payment_charge_id: string;
    /** Provider payment identifier */
    provider_payment_charge_id: string;
}

/** This object contains basic information about a refunded payment. */
export interface RefundedPayment {
    /** Three-letter ISO 4217 currency code, or “XTR” for payments in Telegram Stars. Currently, always “XTR” */
    currency: string;
    /** Total refunded price in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45, total_amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). */
    total_amount: number;
    /** Bot-specified invoice payload */
    invoice_payload: string;
    /** Telegram payment identifier */
    telegram_payment_charge_id: string;
    /** Provider payment identifier */
    provider_payment_charge_id?: string;
}

/** This object contains information about an incoming shipping query. */
export interface ShippingQuery {
    /** Unique query identifier */
    id: string;
    /** User who sent the query */
    from: User;
    /** Bot specified invoice payload */
    invoice_payload: string;
    /** User specified shipping address */
    shipping_address: ShippingAddress;
}

/** This object contains information about an incoming pre-checkout query. */
export interface PreCheckoutQuery {
    /** Unique query identifier */
    id: string;
    /** User who sent the query */
    from: User;
    /** Three-letter ISO 4217 currency code, or “XTR” for payments in Telegram Stars */
    currency: string;
    /** Total price in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45 pass amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). */
    total_amount: number;
    /** Bot specified invoice payload */
    invoice_payload: string;
    /** Identifier of the shipping option chosen by the user */
    shipping_option_id?: string;
    /** Order information provided by the user */
    order_info?: OrderInfo;
}

/** This object describes the state of a revenue withdrawal operation. Currently, it can be one of

- RevenueWithdrawalStatePending
- RevenueWithdrawalStateSucceeded
- RevenueWithdrawalStateFailed */
export type RevenueWithdrawalState =
    | RevenueWithdrawalStatePending
    | RevenueWithdrawalStateSucceeded
    | RevenueWithdrawalStateFailed;

/** The withdrawal is in progress. */
export interface RevenueWithdrawalStatePending {
    /** Type of the state, always “pending” */
    type: "pending";
}

/** The withdrawal succeeded. */
export interface RevenueWithdrawalStateSucceeded {
    /** Type of the state, always “succeeded” */
    type: "succeeded";
    /** Date the withdrawal was completed in Unix time */
    date: number;
    /** An HTTPS URL that can be used to see transaction details */
    url: string;
}

/** The withdrawal failed and the transaction was refunded. */
export interface RevenueWithdrawalStateFailed {
    /** Type of the state, always “failed” */
    type: "failed";
}

/** Contains information about the affiliate that received a commission via this transaction. */
export interface AffiliateInfo {
    /** The bot or the user that received an affiliate commission if it was received by a bot or a user */
    affiliate_user?: User;
    /** The chat that received an affiliate commission if it was received by a chat */
    affiliate_chat?: Chat;
    /** The number of Telegram Stars received by the affiliate for each 1000 Telegram Stars received by the bot from referred users */
    commission_per_mille: number;
    /** Integer amount of Telegram Stars received by the affiliate from the transaction, rounded to 0; can be negative for refunds */
    amount: number;
    /** The number of 1/1000000000 shares of Telegram Stars received by the affiliate; from -999999999 to 999999999; can be negative for refunds */
    nanostar_amount?: number;
}

/** This object describes the source of a transaction, or its recipient for outgoing transactions. Currently, it can be one of

- TransactionPartnerUser
- TransactionPartnerAffiliateProgram
- TransactionPartnerFragment
- TransactionPartnerTelegramAds
- TransactionPartnerTelegramApi
- TransactionPartnerOther */
export type TransactionPartner =
    | TransactionPartnerUser
    | TransactionPartnerAffiliateProgram
    | TransactionPartnerFragment
    | TransactionPartnerTelegramAds
    | TransactionPartnerTelegramApi
    | TransactionPartnerOther;

/** Describes a transaction with a user. */
export interface TransactionPartnerUser {
    /** Type of the transaction partner, always “user” */
    type: "user";
    /** Information about the user */
    user: User;
    /** Information about the affiliate that received a commission via this transaction */
    affiliate?: AffiliateInfo;
    /** Bot-specified invoice payload */
    invoice_payload?: string;
    /** The duration of the paid subscription */
    subscription_period?: number;
    /** Information about the paid media bought by the user */
    paid_media?: PaidMedia[];
    /** Bot-specified paid media payload */
    paid_media_payload?: string;
    /** The gift sent to the user by the bot */
    gift?: string;
}

/** Describes the affiliate program that issued the affiliate commission received via this transaction. */
export interface TransactionPartnerAffiliateProgram {
    /** Type of the transaction partner, always “affiliate_program” */
    type: "affiliate_program";
    /** Information about the bot that sponsored the affiliate program */
    sponsor_user?: User;
    /** The number of Telegram Stars received by the bot for each 1000 Telegram Stars received by the affiliate program sponsor from referred users */
    commission_per_mille: number;
}

/** Describes a withdrawal transaction with Fragment. */
export interface TransactionPartnerFragment {
    /** Type of the transaction partner, always “fragment” */
    type: "fragment";
    /** State of the transaction if the transaction is outgoing */
    withdrawal_state?: RevenueWithdrawalState;
}

/** Describes a withdrawal transaction to the Telegram Ads platform. */
export interface TransactionPartnerTelegramAds {
    /** Type of the transaction partner, always “telegram_ads” */
    type: "telegram_ads";
}

/** Describes a transaction with payment for paid broadcasting. */
export interface TransactionPartnerTelegramApi {
    /** Type of the transaction partner, always “telegram_api” */
    type: "telegram_api";
    /** The number of successful requests that exceeded regular limits and were therefore billed */
    request_count: number;
}

/** Describes a transaction with an unknown source or recipient. */
export interface TransactionPartnerOther {
    /** Type of the transaction partner, always “other” */
    type: "other";
}

/** Describes a Telegram Star transaction. */
export interface StarTransaction {
    /** Unique identifier of the transaction. Coincides with the identifier of the original transaction for refund transactions. Coincides with SuccessfulPayment.telegram_payment_charge_id for successful incoming payments from users. */
    id: string;
    /** Integer amount of Telegram Stars transferred by the transaction */
    amount: number;
    /** The number of 1/1000000000 shares of Telegram Stars transferred by the transaction; from 0 to 999999999 */
    nanostar_amount?: number;
    /** Date the transaction was created in Unix time */
    date: number;
    /** Source of an incoming transaction (e.g., a user purchasing goods or services, Fragment refunding a failed withdrawal). Only for incoming transactions */
    source?: TransactionPartner;
    /** Receiver of an outgoing transaction (e.g., a user for a purchase refund, Fragment for a withdrawal). Only for outgoing transactions */
    receiver?: TransactionPartner;
}

/** Contains a list of Telegram Star transactions. */
export interface StarTransactions {
    /** The list of transactions */
    transactions: StarTransaction[];
}

/** This object contains information about a paid media purchase. */
export interface PaidMediaPurchased {
    /** User who purchased the media */
    from: User;
    /** Bot-specified paid media payload */
    paid_media_payload: string;
}

/** This object represents a gift that can be sent by the bot. */
export interface Gift {
    /** Unique identifier of the gift */
    id: string;
    /** The sticker that represents the gift */
    sticker: Sticker;
    /** The number of Telegram Stars that must be paid to send the sticker */
    star_count: number;
    /** The total number of the gifts of this type that can be sent; for limited gifts only */
    total_count?: number;
    /** The number of remaining gifts of this type that can be sent; for limited gifts only */
    remaining_count?: number;
}

/** This object represent a list of gifts. */
export interface Gifts {
    /** The list of gifts */
    gifts: Gift[];
}
