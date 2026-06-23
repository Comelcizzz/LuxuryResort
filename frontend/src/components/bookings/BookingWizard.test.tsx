import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BookingWizard } from "./BookingWizard";
import { fetchAvailability } from "@/api/endpoints/rooms.api";
import { createBooking, payBooking } from "@/api/endpoints/bookings.api";
import type { BookingResponse, PayBookingResponse } from "@/types/api";
import { BookingStatus } from "@/types/domain";

vi.mock("@/api/endpoints/rooms.api", () => ({
  fetchAvailability: vi.fn(),
}));

vi.mock("@/api/endpoints/bookings.api", () => ({
  createBooking: vi.fn(),
  payBooking: vi.fn(),
}));

const mockedAvail = vi.mocked(fetchAvailability);
const mockedCreate = vi.mocked(createBooking);
const mockedPay = vi.mocked(payBooking);

function renderWizard() {
  return render(
    <MemoryRouter>
      <BookingWizard roomId="room-1" />
    </MemoryRouter>
  );
}

/** React 18 Strict Mode у тестах може подвоїти дерево — беремо перший екземпляр кнопки. */
function firstByTestId(id: string) {
  const all = screen.getAllByTestId(id);
  return all[0]!;
}

describe("BookingWizard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("blocks empty dates with validation message", async () => {
    const user = userEvent.setup();
    renderWizard();
    await user.click(firstByTestId("wizard-dates-next"));
    const err = await screen.findByText(
      /Невірні дати|String must contain|Too small|Invalid input/i
    );
    expect(err).toBeInTheDocument();
    expect(mockedAvail).not.toHaveBeenCalled();
  });

  it("advances to details when availability OK", async () => {
    const user = userEvent.setup();
    mockedAvail.mockResolvedValue({ available: true });

    renderWizard();
    await user.type(screen.getAllByLabelText(/^Заїзд$/)[0]!, "2026-06-10");
    await user.type(screen.getAllByLabelText(/^Виїзд$/)[0]!, "2026-06-15");
    await user.click(firstByTestId("wizard-dates-next"));

    await waitFor(() => {
      expect(mockedAvail).toHaveBeenCalledWith("room-1", "2026-06-10", "2026-06-15");
    });
    expect((await screen.findAllByText(/^Гості$/))[0]).toBeInTheDocument();
  });

  it("shows pricing breakdown and completes payment flow", async () => {
    const user = userEvent.setup();
    mockedAvail.mockResolvedValue({ available: true });

    const booking: BookingResponse = {
      id: "bk-1",
      roomId: "room-1",
      roomNumber: "101",
      roomName: "Deluxe",
      userId: "u1",
      userEmail: "g@g.com",
      checkInDate: "2026-06-10",
      checkOutDate: "2026-06-15",
      guestsCount: 2,
      baseTotal: "1000",
      dynamicPriceTotal: "1100",
      finalMultiplier: "1.1",
      status: BookingStatus.PENDING,
      cancellationReason: null,
      specialRequests: null,
      loyaltyPointsEarned: 5,
      loyaltyPointsUsed: 0,
      createdAt: "",
      updatedAt: "",
      pricing: {
        baseTotal: "1000",
        finalTotal: "1100",
        combinedMultiplier: "1.1",
        loyaltyDiscount: "0",
        appliedRules: [{ name: "Rule A", multiplier: "1.1" }],
        pointsEarned: 5,
      },
    };

    mockedCreate.mockResolvedValue(booking);
    const payRes: PayBookingResponse = {
      bookingStatus: BookingStatus.CONFIRMED,
      payment: {
        id: "p1",
        bookingId: "bk-1",
        amount: "1100",
        currency: "UAH",
        status: "COMPLETED",
        paymentMethod: "CARD",
        transactionRef: null,
        failureReason: null,
        processedAt: null,
        createdAt: "2026-01-01T00:00:00Z",
      },
    };
    mockedPay.mockResolvedValue(payRes);

    renderWizard();
    await user.type(screen.getAllByLabelText(/^Заїзд$/)[0]!, "2026-07-01");
    await user.type(screen.getAllByLabelText(/^Виїзд$/)[0]!, "2026-07-05");
    await user.click(firstByTestId("wizard-dates-next"));
    await screen.findAllByText(/^Гості$/);

    await user.click(firstByTestId("wizard-create-booking"));
    await waitFor(() => expect(mockedCreate).toHaveBeenCalled());

    expect(await screen.findByText("Розбір ціни")).toBeInTheDocument();
    expect(screen.getByText(/Rule A/)).toBeInTheDocument();

    await user.click(firstByTestId("wizard-pay"));
    await user.click(await screen.findByRole("button", { name: /Сплатити/i }));

    await waitFor(() => {
      expect(mockedPay).toHaveBeenCalledWith("bk-1", "CARD");
    });
    expect(await screen.findByText(/Бронювання підтверджено/)).toBeInTheDocument();
  });
});
