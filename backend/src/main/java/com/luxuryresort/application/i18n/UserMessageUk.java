package com.luxuryresort.application.i18n;

import java.util.Map;

public final class UserMessageUk {

    private static final Map<String, String> EXACT = Map.ofEntries(
            Map.entry("Room not found", "Номер не знайдено"),
            Map.entry("User not found", "Користувача не знайдено"),
            Map.entry("Booking not found", "Бронювання не знайдено"),
            Map.entry("Service not found", "Послугу не знайдено"),
            Map.entry("Service order not found", "Замовлення послуги не знайдено"),
            Map.entry("Review not found", "Відгук не знайдено"),
            Map.entry("Pricing rule not found", "Правило ціноутворення не знайдено"),
            Map.entry("checkOut must be after checkIn", "Дата виїзду має бути після дати заїзду"),
            Map.entry("Stay must be at least one night", "Перебування має тривати щонайменше одну ніч"),
            Map.entry("checkIn and checkOut are required; checkOut must be after checkIn",
                    "Потрібні дати заїзду та виїзду; виїзд має бути після заїзду"),
            Map.entry("guests exceeds room max occupancy", "Кількість гостей перевищує місткість номера"),
            Map.entry("Room is not available for the selected dates", "Номер недоступний на обрані дати"),
            Map.entry("Booking cannot be cancelled in the current state", "Бронювання не можна скасувати в поточному статусі"),
            Map.entry("Only pending bookings can be paid", "Оплатити можна лише бронювання зі статусом «Очікує»"),
            Map.entry("Booking already has a completed payment", "Бронювання вже має успішну оплату"),
            Map.entry("Not allowed to access this invoice", "Немає доступу до цього чека"),
            Map.entry("Service is not available", "Послуга недоступна"),
            Map.entry("Booking does not belong to the current user", "Бронювання не належить поточному користувачу"),
            Map.entry("Booking status does not allow service orders", "Статус бронювання не дозволяє замовляти послуги"),
            Map.entry("Only staff can change service order status", "Змінювати статус замовлення може лише персонал"),
            Map.entry("Invalid status transition", "Недопустима зміна статусу"),
            Map.entry("Terminal service order status", "Замовлення вже у фінальному статусі"),
            Map.entry("Review for this booking already exists", "Відгук для цього бронювання вже існує"),
            Map.entry("Review is allowed after check-in or after checkout",
                    "Відгук можна залишити після заїзду або після виїзду"),
            Map.entry("Only manager or admin can approve reviews", "Схвалювати відгуки можуть лише менеджер або адміністратор"),
            Map.entry("Cannot access another user's booking", "Немає доступу до чужого бронювання"),
            Map.entry("Cannot modify another user's booking", "Немає доступу до чужого бронювання"),
            Map.entry("Guests may only cancel a booking (set status to CANCELLED)",
                    "Гість може лише скасувати власне бронювання"),
            Map.entry("Invalid credentials", "Невірний email або пароль"),
            Map.entry("Account disabled", "Обліковий запис деактивовано"),
            Map.entry("Invalid or expired refresh token", "Недійсний або прострочений токен оновлення"),
            Map.entry("Validation failed", "Помилка валідації"),
            Map.entry("Data constraint violation", "Порушення обмежень даних"),
            Map.entry("Invalid phone format", "Невірний формат телефону"),
            Map.entry("Access is denied", "Доступ заборонено"),
            Map.entry("Access Denied", "Доступ заборонено"),
            Map.entry("Функцію лояльності вимкнено", "Функцію лояльності вимкнено")
    );

    private UserMessageUk() {
    }

    public static String translate(String message) {
        if (message == null || message.isBlank()) {
            return message;
        }
        String mapped = EXACT.get(message);
        if (mapped != null) {
            return mapped;
        }
        if (message.startsWith("Email already registered:")) {
            return "Адресу електронної пошти вже зареєстровано";
        }
        if (message.startsWith("Invalid booking status transition:")) {
            return "Недопустима зміна статусу бронювання";
        }
        return message;
    }
}
