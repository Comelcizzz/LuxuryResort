const EXACT: Record<string, string> = {
  "Room not found": "Номер не знайдено",
  "User not found": "Користувача не знайдено",
  "Booking not found": "Бронювання не знайдено",
  "Service not found": "Послугу не знайдено",
  "Service order not found": "Замовлення послуги не знайдено",
  "Review not found": "Відгук не знайдено",
  "Pricing rule not found": "Правило ціноутворення не знайдено",
  "checkOut must be after checkIn": "Дата виїзду має бути після дати заїзду",
  "Stay must be at least one night": "Перебування має тривати щонайменше одну ніч",
  "checkIn and checkOut are required; checkOut must be after checkIn":
    "Потрібні дати заїзду та виїзду; виїзд має бути після заїзду",
  "guests exceeds room max occupancy": "Кількість гостей перевищує місткість номера",
  "Room is not available for the selected dates": "Номер недоступний на обрані дати",
  "Booking cannot be cancelled in the current state": "Бронювання не можна скасувати в поточному статусі",
  "Only pending bookings can be paid": "Оплатити можна лише бронювання зі статусом «Очікує»",
  "Booking already has a completed payment": "Бронювання вже має успішну оплату",
  "Not allowed to access this invoice": "Немає доступу до цього чека",
  "Service is not available": "Послуга недоступна",
  "Booking does not belong to the current user": "Бронювання не належить поточному користувачу",
  "Booking status does not allow service orders": "Статус бронювання не дозволяє замовляти послуги",
  "Only staff can change service order status": "Змінювати статус замовлення може лише персонал",
  "Invalid status transition": "Недопустима зміна статусу",
  "Terminal service order status": "Замовлення вже у фінальному статусі",
  "Review for this booking already exists": "Відгук для цього бронювання вже існує",
  "Review is allowed after check-in or after checkout": "Відгук можна залишити після заїзду або після виїзду",
  "Only manager or admin can approve reviews": "Схвалювати відгуки можуть лише менеджер або адміністратор",
  "Cannot access another user's booking": "Немає доступу до чужого бронювання",
  "Cannot modify another user's booking": "Немає доступу до чужого бронювання",
  "Guests may only cancel a booking (set status to CANCELLED)": "Гість може лише скасувати власне бронювання",
  "Invalid credentials": "Невірний email або пароль",
  "Account disabled": "Обліковий запис деактивовано",
  "Invalid or expired refresh token": "Недійсний або прострочений токен оновлення",
  "Validation failed": "Помилка валідації",
  "Data constraint violation": "Порушення обмежень даних",
  "Invalid phone format": "Невірний формат телефону",
  "Access is denied": "Доступ заборонено",
  "Access Denied": "Доступ заборонено",
};

export function translateApiMessage(message: string | null | undefined): string | null {
  if (!message) return message ?? null;
  const trimmed = message.trim();
  if (EXACT[trimmed]) return EXACT[trimmed];
  if (trimmed.startsWith("Email already registered:")) {
    return "Адресу електронної пошти вже зареєстровано";
  }
  if (trimmed.startsWith("Invalid booking status transition:")) {
    return "Недопустима зміна статусу бронювання";
  }
  if (trimmed.startsWith("Request failed")) {
    return null;
  }
  return trimmed;
}
