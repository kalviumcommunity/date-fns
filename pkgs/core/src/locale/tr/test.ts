import { describe, expect, it } from "vitest";
import { format } from "../../format/index.ts";
import { isValid } from "../../isValid/index.ts";
import { parse } from "../../parse/index.ts";
import { tr } from "./index.ts";

describe("tr locale", () => {
  describe("day period parsing", () => {
    it("round-trips noon, midnight, and afternoon formatted with b tokens", () => {
      const noon = new Date(2024, 8, 7, 12, 0);
      const midnight = new Date(2024, 8, 7, 0, 0);
      const afternoon = new Date(2024, 8, 7, 13, 0);
      const opts = { locale: tr };

      for (const pattern of ["h:mm b", "h:mm bbb", "h:mm bbbb", "h:mm bbbbb"]) {
        for (const date of [midnight, noon, afternoon]) {
          const text = format(date, pattern, opts);
          const parsed = parse(text, pattern, date, opts);
          expect(isValid(parsed)).toBe(true);
          expect(parsed).toEqual(date);
        }
      }
    });

    it("parses noon variants (öğlen, öğle, öğleyin)", () => {
      const ref = new Date(2024, 8, 7, 0, 0);
      const expected = new Date(2024, 8, 7, 12, 0);
      const opts = { locale: tr };

      for (const text of ["12:00 öğlen", "12:00 öğle", "12:00 öğleyin"]) {
        const parsed = parse(text, "h:mm bbbb", ref, opts);
        expect(isValid(parsed)).toBe(true);
        expect(parsed).toEqual(expected);
      }
    });

    it("parses öğleden sonra as afternoon", () => {
      const result = tr.match.dayPeriod("öğleden sonra", {
        width: "wide",
        context: "formatting",
      });
      expect(result).toEqual({ value: "afternoon", rest: "" });
    });
  });
});
