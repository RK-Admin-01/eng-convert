import Decimal from "decimal.js";

export type ParseResult =
  | { ok: true; value: Decimal }
  | { ok: false; error: string };

type TokenKind =
  | "number"
  | "ident"
  | "plus"
  | "minus"
  | "star"
  | "slash"
  | "caret"
  | "lparen"
  | "rparen"
  | "eof";

type Token = { kind: TokenKind; raw: string };

const CONSTANTS: Record<string, Decimal> = {
  pi: new Decimal(
    "3.14159265358979323846264338327950288419716939937510"
  ),
  e: new Decimal(
    "2.71828182845904523536028747135266249775724709369995"
  ),
};

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const s = input.trim();

  while (i < s.length) {
    const ch = s[i];

    if (/\s/.test(ch)) { i++; continue; }

    if (/[0-9]/.test(ch) || (ch === "." && /[0-9]/.test(s[i + 1] ?? ""))) {
      let num = "";
      while (i < s.length && /[0-9.]/.test(s[i])) num += s[i++];
      if (i < s.length && (s[i] === "e" || s[i] === "E")) {
        num += s[i++];
        if (i < s.length && (s[i] === "+" || s[i] === "-")) num += s[i++];
        while (i < s.length && /[0-9]/.test(s[i])) num += s[i++];
      }
      tokens.push({ kind: "number", raw: num });
      continue;
    }

    if (/[a-zA-Z_]/.test(ch)) {
      let ident = "";
      while (i < s.length && /[a-zA-Z_0-9]/.test(s[i])) ident += s[i++];
      tokens.push({ kind: "ident", raw: ident });
      continue;
    }

    switch (ch) {
      case "+": tokens.push({ kind: "plus", raw: ch }); break;
      case "-": tokens.push({ kind: "minus", raw: ch }); break;
      case "*": tokens.push({ kind: "star", raw: ch }); break;
      case "/": tokens.push({ kind: "slash", raw: ch }); break;
      case "^": tokens.push({ kind: "caret", raw: ch }); break;
      case "(": tokens.push({ kind: "lparen", raw: ch }); break;
      case ")": tokens.push({ kind: "rparen", raw: ch }); break;
      default:
        throw new Error(`Unexpected character: "${ch}"`);
    }
    i++;
  }

  tokens.push({ kind: "eof", raw: "" });
  return tokens;
}

class Parser {
  private tokens: Token[];
  private pos = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token {
    return this.tokens[this.pos];
  }

  private consume(): Token {
    return this.tokens[this.pos++];
  }

  private expect(kind: TokenKind): Token {
    const t = this.peek();
    if (t.kind !== kind) {
      throw new Error(`Expected ${kind} but got "${t.raw || t.kind}"`);
    }
    return this.consume();
  }

  parse(): Decimal {
    const result = this.parseAddSub();
    this.expect("eof");
    return result;
  }

  private parseAddSub(): Decimal {
    let left = this.parseMulDiv();
    while (this.peek().kind === "plus" || this.peek().kind === "minus") {
      const op = this.consume();
      const right = this.parseMulDiv();
      left = op.kind === "plus" ? left.plus(right) : left.minus(right);
    }
    return left;
  }

  private parseMulDiv(): Decimal {
    let left = this.parseUnary();
    while (this.peek().kind === "star" || this.peek().kind === "slash") {
      const op = this.consume();
      const right = this.parseUnary();
      if (op.kind === "slash" && right.isZero()) {
        throw new Error("Division by zero");
      }
      left = op.kind === "star" ? left.mul(right) : left.div(right);
    }
    return left;
  }

  private parseUnary(): Decimal {
    if (this.peek().kind === "minus") {
      this.consume();
      return this.parsePower().negated();
    }
    if (this.peek().kind === "plus") {
      this.consume();
    }
    return this.parsePower();
  }

  private parsePower(): Decimal {
    const base = this.parsePrimary();
    if (this.peek().kind === "caret") {
      this.consume();
      const exp = this.parseUnary();
      return base.pow(exp);
    }
    return base;
  }

  private parsePrimary(): Decimal {
    const t = this.peek();

    if (t.kind === "number") {
      this.consume();
      try {
        return new Decimal(t.raw);
      } catch {
        throw new Error(`Invalid number: "${t.raw}"`);
      }
    }

    if (t.kind === "ident") {
      this.consume();
      const key = t.raw.toLowerCase();
      if (key in CONSTANTS) return CONSTANTS[key];
      throw new Error(`Unknown identifier: "${t.raw}"`);
    }

    if (t.kind === "lparen") {
      this.consume();
      const val = this.parseAddSub();
      this.expect("rparen");
      return val;
    }

    throw new Error(
      t.kind === "eof"
        ? "Unexpected end of expression"
        : `Unexpected token: "${t.raw}"`
    );
  }
}

export function parseExpression(input: string): ParseResult {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, error: "Empty expression" };

  try {
    const tokens = tokenize(trimmed);
    const parser = new Parser(tokens);
    const value = parser.parse();
    if (!value.isFinite()) return { ok: false, error: "Result is not finite" };
    return { ok: true, value };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Invalid expression",
    };
  }
}
