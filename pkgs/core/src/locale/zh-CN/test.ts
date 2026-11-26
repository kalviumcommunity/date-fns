import { describe, expect, it } from "vitest";
import { format } from "../../format/index.ts";
import { isValid } from "../../isValid/index.ts";
import { parse } from "../../parse/index.ts";
import { zhCN } from "./index.ts";

describe("zh-CN locale", () => {
  it("parses October with localized month tokens", () => {
    expect(
      parse("2022年10月27日", "yyyy年MMMdd日", new Date(), {
        locale: zhCN,
      }),
    ).toEqual(new Date(2022, 9 /* Oct */, 27));

    expect(
      parse("2022年十月27日", "yyyy年MMMMdd日", new Date(), {
        locale: zhCN,
      }),
    ).toEqual(new Date(2022, 9 /* Oct */, 27));
  });

  it("parses November and December as distinct months", () => {
    expect(
      parse("2022年11月27日", "yyyy年MMMdd日", new Date(), {
        locale: zhCN,
      }),
    ).toEqual(new Date(2022, 10 /* Nov */, 27));

    expect(
      parse("2022年12月27日", "yyyy年MMMdd日", new Date(), {
        locale: zhCN,
      }),
    ).toEqual(new Date(2022, 11 /* Dec */, 27));
  });

  describe("day period parsing", () => {
    it("round-trips morning, nighttime, and evening labels with BBBB h:mm", () => {
      const reference = new Date(2025, 0, 15);
      const pattern = "BBBB h:mm";

      for (const hour of [2, 9, 20]) {
        const original = new Date(2025, 0, 15, hour, 30);
        const text = format(original, pattern, { locale: zhCN });
        const result = parse(text, pattern, reference, { locale: zhCN });
        expect(isValid(result)).toBe(true);
        expect(result.getHours()).toBe(hour);
        expect(result.getMinutes()).toBe(30);
      }
    });

    it("round-trips narrow morning, night, and noon day period labels", () => {
      const reference = new Date(2025, 0, 15);

      for (const [pattern, hour] of [
        ["BBBBB h:mm", 2],
        ["BBBBB h:mm", 9],
        ["BBBBB h:mm", 20],
        ["h:mm bbbbb", 12],
        ["h:mm bbbb", 12],
        ["h:mm bbbb", 0],
      ] as const) {
        const original = new Date(2025, 0, 15, hour, 30);
        const text = format(original, pattern, { locale: zhCN });
        const result = parse(text, pattern, reference, { locale: zhCN });
        expect(isValid(result)).toBe(true);
        expect(result.getHours()).toBe(hour);
        expect(result.getMinutes()).toBe(30);
      }
    });

    it("returns null when matching an unrelated day period string", () => {
      expect(
        zhCN.match.dayPeriod("foo", { width: "wide", context: "formatting" }),
      ).toBeNull();
    });
  });
});
