declare const tag: unique symbol

declare type Tagged<Token> = {
	readonly [tag]: Token
}

export type Opaque<Type, Token = unknown> = Type & Tagged<Token>