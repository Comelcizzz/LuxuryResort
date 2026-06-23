package com.luxuryresort.application.service.impl;

import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.VerticalAlignment;
import com.luxuryresort.application.exception.ResourceNotFoundException;
import com.luxuryresort.application.security.UserPermissions;
import com.luxuryresort.application.service.InvoiceService;
import com.luxuryresort.domain.entity.Booking;
import com.luxuryresort.domain.entity.Payment;
import com.luxuryresort.domain.entity.User;
import com.luxuryresort.domain.enums.BookingStatus;
import com.luxuryresort.domain.enums.PaymentStatus;
import com.luxuryresort.domain.repository.BookingRepository;
import com.luxuryresort.domain.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    private static final DeviceRgb INK = new DeviceRgb(15, 23, 42);
    private static final DeviceRgb MUTED = new DeviceRgb(71, 85, 105);
    private static final DeviceRgb ACCENT = new DeviceRgb(161, 125, 58);
    private static final DeviceRgb PAPER = new DeviceRgb(255, 252, 245);
    private static final ZoneId RECEIPT_TZ = ZoneId.of("Europe/Kyiv");
    private static final DateTimeFormatter RECEIPT_TIME =
            DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm").withZone(RECEIPT_TZ);

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    public InvoiceServiceImpl(BookingRepository bookingRepository, PaymentRepository paymentRepository) {
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] buildBookingInvoicePdf(UUID bookingId, User actor) {
        Booking booking = bookingRepository.findWithRoomAndUserById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (!UserPermissions.isStaff(actor) && !booking.getUser().getId().equals(actor.getId())) {
            throw new IllegalArgumentException("Not allowed to access this invoice");
        }
        Optional<Payment> paymentOpt =
                paymentRepository.findTopByBooking_IdAndStatusOrderByProcessedAtDesc(bookingId, PaymentStatus.COMPLETED);
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            try (PdfDocument pdf = new PdfDocument(writer);
                 Document doc = new Document(pdf, PageSize.A4)) {
                doc.setMargins(40, 48, 48, 48);
                PdfFont regular = loadFont("/fonts/NotoSans-Regular.ttf", StandardFonts.HELVETICA);
                PdfFont bold = loadFont("/fonts/NotoSans-Bold.ttf", StandardFonts.HELVETICA_BOLD);
                doc.setFont(regular);

                Table slip = new Table(UnitValue.createPercentArray(new float[] {100f}))
                        .useAllAvailableWidth()
                        .setBorder(new SolidBorder(ACCENT, 1.2f))
                        .setBackgroundColor(PAPER);

                Cell body = new Cell()
                        .setBorder(Border.NO_BORDER)
                        .setPadding(22);

                body.add(headerBlock(bold, regular, booking, paymentOpt));
                body.add(lineTable(bold, regular, booking, paymentOpt));

                slip.addCell(body);
                doc.add(slip);

                doc.add(new Paragraph(
                        "Документ сформовано в демо-режимі. ПДВ не нараховується (навчальний проєкт).")
                        .setFont(regular).setFontSize(8).setFontColor(MUTED)
                        .setTextAlignment(TextAlignment.CENTER).setMarginTop(18));
            }
            return baos.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("Failed to generate PDF", e);
        }
    }

    private static Table headerBlock(
            PdfFont bold,
            PdfFont regular,
            Booking booking,
            Optional<Payment> paymentOpt
    ) {
        String receiptNo = booking.getId().toString().replace("-", "").substring(0, 12).toUpperCase();
        Instant issued = paymentOpt.map(Payment::getProcessedAt).orElse(booking.getUpdatedAt());
        String when = RECEIPT_TIME.format(issued);

        Table t = new Table(UnitValue.createPercentArray(new float[] {100f})).useAllAvailableWidth();
        t.addCell(cellNoBorder(new Paragraph("LUXURY RESORT")
                .setFont(bold).setFontSize(20).setFontColor(INK).setTextAlignment(TextAlignment.CENTER)));
        t.addCell(cellNoBorder(new Paragraph("КВИТАНЦІЯ ПРО ОПЛАТУ ПРОЖИВАННЯ")
                .setFont(bold).setFontSize(11).setFontColor(ACCENT).setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(2)));
        t.addCell(cellNoBorder(new Paragraph("№ " + receiptNo + "  ·  " + when)
                .setFont(regular).setFontSize(9).setFontColor(MUTED).setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(6)));
        t.setMarginBottom(14);
        return t;
    }

    private static Cell cellNoBorder(Paragraph p) {
        return new Cell().add(p).setBorder(Border.NO_BORDER).setPadding(0);
    }

    private Table lineTable(PdfFont bold, PdfFont regular, Booking booking, Optional<Payment> paymentOpt) {
        Table grid = new Table(UnitValue.createPercentArray(new float[] {62f, 38f}))
                .useAllAvailableWidth();

        grid.addHeaderCell(headerCell("Позиція", bold));
        grid.addHeaderCell(headerCell("Сума", bold));

        int nights = (int) Math.max(1, ChronoUnit.DAYS.between(booking.getCheckInDate(), booking.getCheckOutDate()));
        grid.addCell(rowLabel(regular, "Номер"));
        grid.addCell(rowValue(regular, booking.getRoom().getName() + " · № " + booking.getRoom().getRoomNumber()));
        grid.addCell(rowLabel(regular, "Гість"));
        grid.addCell(rowValue(regular, guestLine(booking.getUser())));
        grid.addCell(rowLabel(regular, "Заїзд / виїзд"));
        grid.addCell(rowValue(regular, booking.getCheckInDate() + " → " + booking.getCheckOutDate()));
        grid.addCell(rowLabel(regular, "Ночей"));
        grid.addCell(rowValue(regular, nights + ""));

        BigDecimal base = booking.getBaseTotal();
        BigDecimal perNight = base.divide(BigDecimal.valueOf(nights), 2, RoundingMode.HALF_UP);
        grid.addCell(rowLabel(regular, "Базова вартість (" + nights + " н.)"));
        grid.addCell(rowValue(regular, money(perNight) + " × " + nights));
        grid.addCell(rowLabel(regular, "Підсумок бази"));
        grid.addCell(rowValue(bold, money(base)));
        grid.addCell(rowLabel(regular, "Динамічне ціноутворення (× "
                + booking.getFinalMultiplier().stripTrailingZeros().toPlainString() + ")"));
        grid.addCell(rowValue(regular, money(booking.getDynamicPriceTotal())));

        if (booking.getLoyaltyPointsUsed() > 0) {
            grid.addCell(rowLabel(regular, "Балів лояльності використано"));
            grid.addCell(rowValue(regular, String.valueOf(booking.getLoyaltyPointsUsed())));
        }

        grid.addCell(rowLabel(regular, "Статус бронювання"));
        grid.addCell(rowValue(regular, bookingStatusUa(booking.getStatus())));

        if (paymentOpt.isPresent()) {
            Payment p = paymentOpt.get();
            grid.addCell(rowLabel(regular, "Спосіб оплати"));
            grid.addCell(rowValue(regular, paymentMethodUa(p.getPaymentMethod())));
            if (p.getTransactionRef() != null) {
                grid.addCell(rowLabel(regular, "RRN / транзакція"));
                grid.addCell(rowValue(regular, p.getTransactionRef()));
            }
        }

        Cell totalLeft = new Cell()
                .add(new Paragraph("ДО СПЛАТИ").setFont(bold).setFontSize(11).setFontColor(INK))
                .setBorderTop(new SolidBorder(ACCENT, 0.8f))
                .setPaddingTop(10)
                .setVerticalAlignment(VerticalAlignment.MIDDLE);
        Cell totalRight = new Cell()
                .add(new Paragraph(money(booking.getDynamicPriceTotal()))
                        .setFont(bold).setFontSize(14).setFontColor(INK).setTextAlignment(TextAlignment.RIGHT))
                .setBorderTop(new SolidBorder(ACCENT, 0.8f))
                .setPaddingTop(10)
                .setVerticalAlignment(VerticalAlignment.MIDDLE);
        grid.addCell(totalLeft);
        grid.addCell(totalRight);

        grid.addCell(new Cell(1, 2)
                .add(new Paragraph("Дякуємо за вибір Luxury Resort — приємного відпочинку!")
                        .setFont(regular).setFontSize(9).setFontColor(MUTED).setTextAlignment(TextAlignment.CENTER)
                        .setMarginTop(12))
                .setBorder(Border.NO_BORDER));

        return grid;
    }

    private static Cell headerCell(String text, PdfFont bold) {
        return new Cell()
                .add(new Paragraph(text).setFont(bold).setFontSize(9).setFontColor(INK))
                .setBackgroundColor(new DeviceRgb(246, 240, 230))
                .setBorderBottom(new SolidBorder(ACCENT, 0.5f))
                .setPadding(8);
    }

    private static Cell rowLabel(PdfFont font, String text) {
        return new Cell()
                .add(new Paragraph(text).setFont(font).setFontSize(9).setFontColor(MUTED))
                .setBorder(Border.NO_BORDER)
                .setPaddingTop(6).setPaddingBottom(6)
                .setBorderBottom(new SolidBorder(new DeviceRgb(226, 232, 240), 0.4f));
    }

    private static Cell rowValue(PdfFont font, String text) {
        return new Cell()
                .add(new Paragraph(text).setFont(font).setFontSize(9).setFontColor(INK).setTextAlignment(TextAlignment.RIGHT))
                .setBorder(Border.NO_BORDER)
                .setPaddingTop(6).setPaddingBottom(6)
                .setBorderBottom(new SolidBorder(new DeviceRgb(226, 232, 240), 0.4f));
    }

    private static String guestLine(User user) {
        String name = user.getFirstName() + " " + user.getLastName();
        return name.trim() + " · " + user.getEmail();
    }

    private static String money(BigDecimal amount) {
        NumberFormat nf = NumberFormat.getCurrencyInstance(Locale.forLanguageTag("uk-UA"));
        return nf.format(amount);
    }

    private static String bookingStatusUa(BookingStatus status) {
        return switch (status) {
            case PENDING -> "Очікує";
            case CONFIRMED -> "Підтверджено";
            case CHECKED_IN -> "Заїзд";
            case CHECKED_OUT -> "Виїзд";
            case CANCELLED -> "Скасовано";
            case NO_SHOW -> "Не з'явився";
        };
    }

    private static String paymentMethodUa(String code) {
        if (code == null) {
            return "—";
        }
        return switch (code) {
            case "CARD" -> "Банківська картка";
            case "APPLE_PAY" -> "Apple Pay";
            case "GOOGLE_PAY" -> "Google Pay";
            case "BANK_TRANSFER" -> "Банківський переказ";
            default -> code;
        };
    }

    private static PdfFont loadFont(String classpath, String standardFont) {
        try (InputStream in = InvoiceServiceImpl.class.getResourceAsStream(classpath)) {
            if (in == null) {
                return PdfFontFactory.createFont(standardFont);
            }
            byte[] bytes = in.readAllBytes();
            return PdfFontFactory.createFont(
                    bytes,
                    PdfEncodings.IDENTITY_H,
                    PdfFontFactory.EmbeddingStrategy.FORCE_EMBEDDED
            );
        } catch (Exception e) {
            try {
                return PdfFontFactory.createFont(standardFont);
            } catch (Exception ex) {
                throw new IllegalStateException("Font load failed", ex);
            }
        }
    }
}
