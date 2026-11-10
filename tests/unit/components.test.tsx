import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import {
  Bi,
  Button,
  Field,
  Figure,
  StatusLabel,
  VerificationLabel,
  Notice,
  OtpInput,
} from "@/components/ui";

describe("Core Editorial UI Components", () => {
  describe("Bi (Bilingual Heading)", () => {
    it("renders Hindi line first with lang='hi' and English line beneath inside one heading", () => {
      render(
        <Bi
          hindi="अतिथि देवो भवः"
          english="Atithi Devo Bhava"
          as="h1"
        />
      );

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();

      const hindiSpan = heading.querySelector('[lang="hi"]');
      expect(hindiSpan).not.toBeNull();
      expect(hindiSpan?.textContent).toBe("अतिथि देवो भवः");

      const englishSpan = heading.querySelector("span:not([lang='hi'])");
      expect(englishSpan?.textContent).toBe("Atithi Devo Bhava");
    });
  });

  describe("Button", () => {
    it("renders primary variant with minimum 44px tap target", () => {
      render(<Button variant="primary">Confirm Action</Button>);
      const btn = screen.getByRole("button", { name: "Confirm Action" });
      expect(btn).toBeInTheDocument();
      expect(btn.className).toContain("min-h-[44px]");
      expect(btn.className).toContain("min-w-[44px]");
      expect(btn.className).toContain("bg-primary");
    });

    it("renders disabled state with disabled attribute", () => {
      render(<Button disabled>Unavailable</Button>);
      const btn = screen.getByRole("button", { name: "Unavailable" });
      expect(btn).toBeDisabled();
      expect(btn.className).toContain("cursor-not-allowed");
    });
  });

  describe("Field", () => {
    it("renders label and helper text", () => {
      render(
        <Field label="Display name" htmlFor="display-name" helperText="Shown to members">
          <input id="display-name" type="text" />
        </Field>
      );
      expect(screen.getByText("Display name")).toBeInTheDocument();
      expect(screen.getByText("Shown to members")).toBeInTheDocument();
    });

    it("displays error with 'Error: ' prefix in English", () => {
      render(
        <Field label="Email" htmlFor="email" error="Invalid format" lang="en">
          <input id="email" type="email" />
        </Field>
      );
      expect(screen.getByText("Error: Invalid format")).toBeInTheDocument();
    });

    it("displays error with 'त्रुटि: ' prefix in Hindi", () => {
      render(
        <Field label="ईमेल" htmlFor="email-hi" error="अमान्य पता" lang="hi">
          <input id="email-hi" type="email" />
        </Field>
      );
      expect(screen.getByText("त्रुटि: अमान्य पता")).toBeInTheDocument();
    });
  });

  describe("Figure (Refuses to render without alt, credit, licence)", () => {
    it("renders figure when alt, credit, and licence are all provided", () => {
      render(
        <Figure
          src="/test.jpg"
          alt="Artisan painting"
          credit="Suman Devi"
          licence="CC BY 4.0"
          caption="Painting session in Madhubani"
        />
      );
      expect(screen.getByRole("figure")).toBeInTheDocument();
      expect(screen.getByText("Photo: Suman Devi (CC BY 4.0)")).toBeInTheDocument();
    });

    it("refuses to render and returns null when alt text is missing", () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { container } = render(
        <Figure
          src="/test.jpg"
          alt=""
          credit="Suman Devi"
          licence="CC BY 4.0"
        />
      );
      expect(container.firstChild).toBeNull();
      spy.mockRestore();
    });

    it("refuses to render and returns null when credit is missing", () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { container } = render(
        <Figure
          src="/test.jpg"
          alt="Artisan painting"
          credit=""
          licence="CC BY 4.0"
        />
      );
      expect(container.firstChild).toBeNull();
      spy.mockRestore();
    });

    it("refuses to render and returns null when licence is missing", () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { container } = render(
        <Figure
          src="/test.jpg"
          alt="Artisan painting"
          credit="Suman Devi"
          licence=""
        />
      );
      expect(container.firstChild).toBeNull();
      spy.mockRestore();
    });
  });

  describe("StatusLabel", () => {
    it("renders bordered text without pill shapes", () => {
      render(<StatusLabel status="Pending" variant="default" />);
      const label = screen.getByText("Pending");
      expect(label).toBeInTheDocument();
      expect(label.className).toContain("border");
      expect(label.className).toContain("rounded-sm");
      expect(label.className).not.toContain("rounded-full");
    });
  });

  describe("VerificationLabel", () => {
    it("renders label, check glyph, and date", () => {
      render(<VerificationLabel label="Mobile verified" date="01 Nov 2026" />);
      expect(screen.getByText("Mobile verified")).toBeInTheDocument();
      expect(screen.getByText("01 Nov 2026")).toBeInTheDocument();
    });

    it("displays the disclaimer when showDisclaimer is true", () => {
      render(
        <VerificationLabel
          label="Identity checked by our team"
          showDisclaimer
        />
      );
      expect(
        screen.getByText("A badge shows what we checked, not a guarantee.")
      ).toBeInTheDocument();
    });
  });

  describe("Notice", () => {
    it("renders with a left border and no background fill", () => {
      render(<Notice variant="warning">Important safety reminder.</Notice>);
      const notice = screen.getByText("Important safety reminder.");
      expect(notice).toBeInTheDocument();
      expect(notice.className).toContain("border-l-2");
      expect(notice.className).toContain("border-l-terracotta");
    });
  });

  describe("OtpInput", () => {
    it("renders 6 input boxes by default", () => {
      render(<OtpInput onComplete={vi.fn()} />);
      const inputs = screen.getAllByRole("textbox");
      expect(inputs).toHaveLength(6);
    });

    it("filters out non-numeric characters and accepts numbers", () => {
      const onComplete = vi.fn();
      render(<OtpInput onComplete={onComplete} />);
      const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];

      // Enter non-numeric
      fireEvent.change(inputs[0]!, { target: { value: "a" } });
      expect(inputs[0]!.value).toBe("");

      // Enter numeric
      fireEvent.change(inputs[0]!, { target: { value: "5" } });
      expect(inputs[0]!.value).toBe("5");
    });
  });
});
