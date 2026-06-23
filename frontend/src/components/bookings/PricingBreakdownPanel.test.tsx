import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PricingBreakdownPanel } from "./PricingBreakdownPanel";
import type { PricingResult } from "@/types/api";

const sample: PricingResult = {
  baseTotal: "1000.00",
  finalTotal: "1150.50",
  combinedMultiplier: "1.15",
  loyaltyDiscount: "50.00",
  appliedRules: [
    { name: "Weekend", multiplier: "1.1" },
    { name: "Season", multiplier: "1.05" },
  ],
  pointsEarned: 12,
};

describe("PricingBreakdownPanel", () => {
  it("renders nothing when pricing is missing", () => {
    const { container } = render(<PricingBreakdownPanel pricing={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows rule chips, multiplier and final total", () => {
    render(<PricingBreakdownPanel pricing={sample} />);

    expect(screen.getByText("Розбір ціни")).toBeInTheDocument();
    expect(screen.getByText("Базова сума")).toBeInTheDocument();
    expect(screen.getByText(/1\.15/)).toBeInTheDocument();
    expect(screen.getByText(/Weekend/)).toBeInTheDocument();
    expect(screen.getByText(/Season/)).toBeInTheDocument();
    expect(screen.queryByText(/Нараховано балів: 12/)).not.toBeInTheDocument();
    expect(screen.getByText("До сплати")).toBeInTheDocument();
  });
});
