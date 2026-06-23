# Діаграма прецедентів (Use Case) — Luxury Resort

```mermaid
flowchart TB
    subgraph Guest["Гість (Guest)"]
        UC1[Перегляд номерів / доступність]
        UC2[Бронювання + динамічне ціноутворення]
        UC3[Оплата (mock gateway)]
        UC4[Скасування власного бронювання]
        UC5[Замовлення послуг]
        UC6[Відгук після перебування]
        UC7[Перегляд балансу лояльності]
        UC8[Завантаження рахунку PDF]
    end

    subgraph Receptionist["Ресепшн (Receptionist)"]
        UC10[Оновлення статусу замовлення послуги]
        UC11[Перегляд бронювань / замовлень]
    end

    subgraph Manager["Менеджер (Manager)"]
        UC20[CRUD номерів і каталогу послуг]
        UC21[Модерація відгуків]
        UC22[Правила ціноутворення]
        UC23[Аналітика / зайнятість / sentiment]
        UC24[Перегляд користувачів]
    end

    subgraph Admin["Адміністратор (Admin)"]
        UC30[Управління ролями користувачів]
        UC31[Аудит-логи]
        UC32[Видалення відгуків / бронювань / номерів]
    end

    System[(Система Luxury Resort)]
    Guest --> System
    Receptionist --> System
    Manager --> System
    Admin --> System
```

**Примітка для записки:** актори відповідають ролям `GUEST`, `RECEPTIONIST`, `MANAGER`, `ADMIN` у JWT / Spring Security.
