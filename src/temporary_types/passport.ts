/** Describes Telegram Passport data shared with the bot by the user. */
export interface PassportData {
    /** Array with information about documents and other Telegram Passport elements that was shared with the bot */
    data: EncryptedPassportElement[];
    /** Encrypted credentials required to decrypt the data */
    credentials: EncryptedCredentials;
}

/** This object represents a file uploaded to Telegram Passport. Currently all Telegram Passport files are in JPEG format when decrypted and don't exceed 10MB. */
export interface PassportFile {
    /** Identifier for this file, which can be used to download or reuse the file */
    file_id: string;
    /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
    file_unique_id: string;
    /** File size in bytes */
    file_size: number;
    /** Unix time when the file was uploaded */
    file_date: number;
}

/** Describes documents or other Telegram Passport elements shared with the bot by the user. */
export interface EncryptedPassportElement {
    /** Element type. One of “personal_details”, “passport”, “driver_license”, “identity_card”, “internal_passport”, “address”, “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration”, “phone_number”, “email”. */
    type:
        | "personal_details"
        | "passport"
        | "driver_license"
        | "identity_card"
        | "internal_passport"
        | "address"
        | "utility_bill"
        | "bank_statement"
        | "rental_agreement"
        | "passport_registration"
        | "temporary_registration"
        | "phone_number"
        | "email";
    /** Base64-encoded encrypted Telegram Passport element data provided by the user; available only for “personal_details”, “passport”, “driver_license”, “identity_card”, “internal_passport” and “address” types. Can be decrypted and verified using the accompanying EncryptedCredentials. */
    data?: string;
    /** User's verified phone number; available only for “phone_number” type */
    phone_number?: string;
    /** User's verified email address; available only for “email” type */
    email?: string;
    /** Array of encrypted files with documents provided by the user; available only for “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration” and “temporary_registration” types. Files can be decrypted and verified using the accompanying EncryptedCredentials. */
    files?: PassportFile[];
    /** Encrypted file with the front side of the document, provided by the user; available only for “passport”, “driver_license”, “identity_card” and “internal_passport”. The file can be decrypted and verified using the accompanying EncryptedCredentials. */
    front_side?: PassportFile;
    /** Encrypted file with the reverse side of the document, provided by the user; available only for “driver_license” and “identity_card”. The file can be decrypted and verified using the accompanying EncryptedCredentials. */
    reverse_side?: PassportFile;
    /** Encrypted file with the selfie of the user holding a document, provided by the user; available if requested for “passport”, “driver_license”, “identity_card” and “internal_passport”. The file can be decrypted and verified using the accompanying EncryptedCredentials. */
    selfie?: PassportFile;
    /** Array of encrypted files with translated versions of documents provided by the user; available if requested for “passport”, “driver_license”, “identity_card”, “internal_passport”, “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration” and “temporary_registration” types. Files can be decrypted and verified using the accompanying EncryptedCredentials. */
    translation?: PassportFile[];
    /** Base64-encoded element hash for using in PassportElementErrorUnspecified */
    hash: string;
}

/** Describes data required for decrypting and authenticating EncryptedPassportElement. See the Telegram Passport Documentation for a complete description of the data decryption and authentication processes. */
export interface EncryptedCredentials {
    /** Base64-encoded encrypted JSON-serialized data with unique user's payload, data hashes and secrets required for EncryptedPassportElement decryption and authentication */
    data: string;
    /** Base64-encoded data hash for data authentication */
    hash: string;
    /** Base64-encoded secret, encrypted with the bot's public RSA key, required for data decryption */
    secret: string;
}

/** This object represents an error in the Telegram Passport element which was submitted that should be resolved by the user. It should be one of:
- PassportElementErrorDataField
- PassportElementErrorFrontSide
- PassportElementErrorReverseSide
- PassportElementErrorSelfie
- PassportElementErrorFile
- PassportElementErrorFiles
- PassportElementErrorTranslationFile
- PassportElementErrorTranslationFiles
- PassportElementErrorUnspecified
*/
export type PassportElementError =
    | PassportElementErrorDataField
    | PassportElementErrorFrontSide
    | PassportElementErrorReverseSide
    | PassportElementErrorSelfie
    | PassportElementErrorFile
    | PassportElementErrorFiles
    | PassportElementErrorTranslationFile
    | PassportElementErrorTranslationFiles
    | PassportElementErrorUnspecified;

/** Represents an issue in one of the data fields that was provided by the user. The error is considered resolved when the field's value changes. */
export interface PassportElementErrorDataField {
    /** Error source, must be data */
    source: "data";
    /** The section of the user's Telegram Passport which has the error, one of “personal_details”, “passport”, “driver_license”, “identity_card”, “internal_passport”, “address” */
    type:
        | "personal_details"
        | "passport"
        | "driver_license"
        | "identity_card"
        | "internal_passport"
        | "address";
    /** Name of the data field which has the error */
    field_name: string;
    /** Base64-encoded data hash */
    data_hash: string;
    /** Error message */
    message: string;
}

/** Represents an issue with the front side of a document. The error is considered resolved when the file with the front side of the document changes. */
export interface PassportElementErrorFrontSide {
    /** Error source, must be front_side */
    source: "front_side";
    /** The section of the user's Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport” */
    type: "passport" | "driver_license" | "identity_card" | "internal_passport";
    /** Base64-encoded hash of the file with the front side of the document */
    file_hash: string;
    /** Error message */
    message: string;
}

/** Represents an issue with the reverse side of a document. The error is considered resolved when the file with reverse side of the document changes. */
export interface PassportElementErrorReverseSide {
    /** Error source, must be reverse_side */
    source: "reverse_side";
    /** The section of the user's Telegram Passport which has the issue, one of “driver_license”, “identity_card” */
    type: "driver_license" | "identity_card";
    /** Base64-encoded hash of the file with the reverse side of the document */
    file_hash: string;
    /** Error message */
    message: string;
}

/** Represents an issue with the selfie with a document. The error is considered resolved when the file with the selfie changes. */
export interface PassportElementErrorSelfie {
    /** Error source, must be selfie */
    source: "selfie";
    /** The section of the user's Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport” */
    type: "passport" | "driver_license" | "identity_card" | "internal_passport";
    /** Base64-encoded hash of the file with the selfie */
    file_hash: string;
    /** Error message */
    message: string;
}

/** Represents an issue with a document scan. The error is considered resolved when the file with the document scan changes. */
export interface PassportElementErrorFile {
    /** Error source, must be file */
    source: "file";
    /** The section of the user's Telegram Passport which has the issue, one of “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration” */
    type:
        | "utility_bill"
        | "bank_statement"
        | "rental_agreement"
        | "passport_registration"
        | "temporary_registration";
    /** Base64-encoded file hash */
    file_hash: string;
    /** Error message */
    message: string;
}

/** Represents an issue with a list of scans. The error is considered resolved when the list of files containing the scans changes. */
export interface PassportElementErrorFiles {
    /** Error source, must be files */
    source: "files";
    /** The section of the user's Telegram Passport which has the issue, one of “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration” */
    type:
        | "utility_bill"
        | "bank_statement"
        | "rental_agreement"
        | "passport_registration"
        | "temporary_registration";
    /** List of base64-encoded file hashes */
    file_hashes: string[];
    /** Error message */
    message: string;
}

/** Represents an issue with one of the files that constitute the translation of a document. The error is considered resolved when the file changes. */
export interface PassportElementErrorTranslationFile {
    /** Error source, must be translation_file */
    source: "translation_file";
    /** Type of element of the user's Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport”, “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration” */
    type:
        | "passport"
        | "driver_license"
        | "identity_card"
        | "internal_passport"
        | "utility_bill"
        | "bank_statement"
        | "rental_agreement"
        | "passport_registration"
        | "temporary_registration";
    /** Base64-encoded file hash */
    file_hash: string;
    /** Error message */
    message: string;
}

/** Represents an issue with the translated version of a document. The error is considered resolved when a file with the document translation change. */
export interface PassportElementErrorTranslationFiles {
    /** Error source, must be translation_files */
    source: "translation_files";
    /** Type of element of the user's Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport”, “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration” */
    type:
        | "passport"
        | "driver_license"
        | "identity_card"
        | "internal_passport"
        | "utility_bill"
        | "bank_statement"
        | "rental_agreement"
        | "passport_registration"
        | "temporary_registration";
    /** List of base64-encoded file hashes */
    file_hashes: string[];
    /** Error message */
    message: string;
}

/** Represents an issue in an unspecified place. The error is considered resolved when new data is added. */
export interface PassportElementErrorUnspecified {
    /** Error source, must be unspecified */
    source: "unspecified";
    /** Type of element of the user's Telegram Passport which has the issue */
    type: string;
    /** Base64-encoded element hash */
    element_hash: string;
    /** Error message */
    message: string;
}
