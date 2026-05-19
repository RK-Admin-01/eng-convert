import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";
import { parseExpression } from "../conversion/expressionParser";

function parse(input: string): Decimal {
  const r = parseExpression(input);
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

describe("Expression parser", () => {
  it("parses integer", () => expect(parse("42").toFixed()).toBe("42"));
  it("parses decimal", () => expect(parse("3.14").toFixed()).toBe("3.14"));
  it("addition", () => expect(parse("1+2").toFixed()).toBe("3"));
  it("subtraction", () => expect(parse("5-3").toFixed()).toBe("2"));
  it("multiplication", () => expect(parse("4*3").toFixed()).toBe("12"));
  it("division", () => expect(parse("10/4").toFixed()).toBe("2.5"));
  it("fraction 1+3/8", () => expect(parse("1+3/8").toFixed()).toBe("1.375"));
  it("nested parens", () => expect(parse("(2+3)*4").toFixed()).toBe("20"));
  it("exponent", () => expect(parse("2^10").toFixed()).toBe("1024"));
  it("unary minus", () => expect(parse("-5").toFixed()).toBe("-5"));
  it("unary plus", () => expect(parse("+3").toFixed()).toBe("3"));
  it("scientific notation 5e-3", () => expect(parse("5e-3").toFixed()).toBe("0.005"));
  it("scientific notation 1.5E2", () => expect(parse("1.5E2").toFixed()).toBe("150"));
  it("pi constant", () => {
    const r = parse("pi");
    expect(r.toDecimalPlaces(5).toFixed()).toBe("3.14159");
  });
  it("e constant", () => {
    const r = parse("e");
    expect(r.toDecimalPlaces(5).toFixed()).toBe("2.71828");
  });
  it("2*pi", () => {
    const r = parse("2*pi");
    expect(r.toDecimalPlaces(4).toFixed()).toBe("6.2832");
  });
  it("complex expression (1+3/8)*25.4", () => {
    const r = parse("(1+3/8)*25.4");
    expect(r.toFixed()).toBe("34.925");
  });
  it("handles whitespace", () => expect(parse(" 1 + 2 ").toFixed()).toBe("3"));

  it("empty input returns error", () => {
    const r = parseExpression("");
    expect(r.ok).toBe(false);
  });

  it("division by zero returns error", () => {
    const r = parseExpression("1/0");
    expect(r.ok).toBe(false);
    expect(r.ok === false && r.error).toContain("zero");
  });

  it("unknown identifier returns error", () => {
    const r = parseExpression("sqrt(4)");
    expect(r.ok).toBe(false);
  });

  it("unclosed paren returns error", () => {
    const r = parseExpression("(1+2");
    expect(r.ok).toBe(false);
  });

  it("bare operator returns error", () => {
    const r = parseExpression("*3");
    expect(r.ok).toBe(false);
  });
});
