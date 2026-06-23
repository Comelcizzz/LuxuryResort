# Діаграма класів (спрощена, шар application + web)

Фокус: доменні сутності, ключові сервіси та REST-контролери.

```mermaid
classDiagram
    direction TB

    class BookingService {
        +create()
        +updateStatus()
        +list()
    }

    class PaymentService {
        +payBooking()
    }

    class DynamicPricingService {
        +calculateDynamicPrice()
    }

    class ResortCatalogService {
        +list()
        +recommendations()
    }

    class ServiceOrderService {
        +create()
        +list()
        +updateStatus()
    }

    class ReviewService {
        +create()
        +list()
        +approve()
    }

    class AdminAnalyticsService {
        +dashboard()
        +occupancyForecast()
        +roomSentiment()
    }

    class InvoiceService {
        +buildBookingInvoicePdf()
    }

    class BookingController
    class ServiceCatalogController
    class ServiceOrderController
    class ReviewController
    class AdminAnalyticsController

    BookingController --> BookingService
    BookingController --> PaymentService
    BookingController --> InvoiceService

    ServiceCatalogController --> ResortCatalogService
    ServiceOrderController --> ServiceOrderService
    ReviewController --> ReviewService
    AdminAnalyticsController --> AdminAnalyticsService

    BookingService --> DynamicPricingService
    PaymentService --> BookingService
```

Для повної UML у дипломі можна додати окремі пакети `domain.entity`, `domain.repository`, `infrastructure.security`.
