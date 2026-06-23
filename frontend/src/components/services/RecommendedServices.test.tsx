import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { RecommendedServices } from "./RecommendedServices";

describe("RecommendedServices", () => {
  it("renders nothing when not authenticated", () => {
    const { container } = render(
      <BrowserRouter>
        <RecommendedServices authenticated={false} items={[]} isLoading={false} />
      </BrowserRouter>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows loading state", () => {
    render(
      <BrowserRouter>
        <RecommendedServices authenticated items={undefined} isLoading />
      </BrowserRouter>
    );
    expect(screen.getByTestId("rec-loading")).toBeInTheDocument();
  });

  it("shows empty state", () => {
    render(
      <BrowserRouter>
        <RecommendedServices authenticated items={[]} isLoading={false} />
      </BrowserRouter>
    );
    expect(screen.getByTestId("rec-empty")).toBeInTheDocument();
    expect(screen.getByText(/Поки немає персональних рекомендацій/)).toBeInTheDocument();
  });

  it("renders recommendation links", () => {
    render(
      <BrowserRouter>
        <RecommendedServices
          authenticated
          isLoading={false}
          items={[
            { id: "a1", name: "SPA", category: "SPA", price: "500", relevanceScore: "0.9" },
            { id: "b2", name: "Pool", category: "FITNESS", price: "200", relevanceScore: "0.8" },
          ]}
        />
      </BrowserRouter>
    );
    expect(screen.getByTestId("rec-list")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "SPA" })).toHaveAttribute("href", "/services/a1");
    expect(screen.getByRole("link", { name: "Pool" })).toHaveAttribute("href", "/services/b2");
  });
});
