import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";
import { formatValue } from "../conversion/format";

describe("Formatter", () => {
  it("formats zero", () => expect(formatValue(new Decimal(0))).toBe("0"));
  it("formats integer", () => expect(formatValue(new Decimal(42))).toBe("42"));
  it("6 sig figs by default", () => {
    expect(formatValue(new Decimal("123.456789012"))).toBe("123.457");
  });
  it("4 sig figs", () => {
    expect(formatValue(new Decimal("123.456"), { sigFigs: 4 })).toBe("123.5");
  });
  it("trims trailing zeros", () => {
    expect(formatValue(new Decimal("1.00000"))).toBe("1");
  });
  it("negative value", () => {
    expect(formatValue(new Decimal("-3.5"))).toBe("-3.5");
  });
  it("scientific notation", () => {
    const r = formatValue(new Decimal("123456789"), { notation: "scientific", sigFigs: 4 });
    expect(r).toMatch(/^1\.235e\+8$/);
  });
  it("engineering notation exponent multiple of 3", () => {
    const r = formatValue(new Decimal("1234567"), { notation: "engineering", sigFigs: 4 });
    expect(r).toMatch(/e\+6$/);
  });
  it("custom decimal separator", () => {
    const r = formatValue(new Decimal("3.14"), { decimalSeparator: "," });
    expect(r).toBe("3,14");
  });
  it("thousands grouping", () => {
    const r = formatValue(new Decimal("1234567"), { notation: "normal", sigFigs: 10, groupThousands: true });
    expect(r).toContain(",");
  });
  it("auto switches to engineering for very large values", () => {
    const r = formatValue(new Decimal("1e15"), { notation: "auto" });
    expect(r).toContain("e");
  });
  it("auto stays normal for everyday values", () => {
    const r = formatValue(new Decimal("25.4"), { notation: "auto" });
    expect(r).not.toContain("e");
  });
});
