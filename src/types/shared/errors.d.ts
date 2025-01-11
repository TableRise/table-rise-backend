export interface ErrorDetails {
    attribute: string;
    path: string;
    reason: string;
}

export interface Errors {
    message: string;
    code: number;
    name?: string;
    details?: ErrorDetails[];
    redirectTo?: string;
}

export type ErrorTypes =
    | 'blank-question-or-answer'
    | 'email-already-exist'
    | 'tag-already-exist'
    | 'user-inexistent'
    | '2fa-no-active'
    | '2fa-and-secret-question-no-active'
    | '2fa-already-active'
    | '2fa-incorrect'
    | 'rpg-not-found-id'
    | 'query-string-incorrect'
    | 'query-missing'
    | 'login'
    | 'linked-data'
    | 'verification-email'
    | 'invalid-user-status'
    | 'invalid-email-verify-code'
    | 'linked-mandatory-data-when-delete'
    | 'verification-email-send-fail'
    | 'invalid-user-status'
    | 'user-database-critical-errror'
    | 'query-fail'
    | 'info-already-added'
    | 'content-inexistent'
    | 'incorrect-secret-question'
    | 'new-structure-secret-question-missing'
    | 'unauthorized'
    | 'campaign-inexistent'
    | 'music-link-already-added'
    | 'date-already-added'
    | 'player-already-in-match'
    | 'player-banned'
    | 'campaign-match-inexistent'
    | 'avatar-inexistent'
    | 'character-does-not-exist'
    | 'player-master-equal';
