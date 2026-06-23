-- Remove duplicate kids club and translate remaining English seed content to Ukrainian.

-- Reassign orders from duplicate "Kids Creative Club" to existing "Дитячий клуб"
UPDATE service_orders
SET service_id = 'cccccccc-cccc-cccc-cccc-cccccccc0015'
WHERE service_id = 'cccccccc-cccc-cccc-cccc-cccccccc0211';

DELETE FROM services WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccc0211';

-- Base catalog services (V3)
UPDATE services SET name = 'Фірмовий SPA-ритуал', description = '90-хвилинна SPA-програма: скраб, масаж гарячим камінням і арома-ритуал.' WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccc0001';
UPDATE services SET name = 'Йога на світанку', description = 'Ранкова йога на терасі з інструктором та welcome-drink.' WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccc0002';
UPDATE services SET name = 'Дегустаційна вечеря від шефа', description = 'Авторське сет-меню від шефа з сезонними продуктами.' WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccc0003';
UPDATE services SET name = 'Преміум-трансфер до аеропорту', description = 'Індивідуальний трансфер бізнес-класом до/з аеропорту.' WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccc0004';

-- Showcase services (V7)
UPDATE services SET name = 'Фірмовий SPA-курс «Renewal»', description = 'Повний двогодинний ритуал: пілінг, масаж гарячим камінням, ароматерапія, трав''яний чай і відпочинок у тихій зоні.' WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccc0201';
UPDATE services SET name = 'Парний масаж при свічках', description = 'Масаж для двох із теплими оліями, атмосферою свічок і келихом ігристого після сеансу.' WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccc0202';
UPDATE services SET name = 'Дегустаційне меню від шефа', description = 'Шестистравове сезонне меню з винним pairing, замінами за алергіями та подачею біля столу.' WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccc0203';
UPDATE services SET name = 'Сніданок у номер', description = 'Преміальний сніданковий поднос із випічкою, фруктами, яйцями, кавою, соком і опцією шампанського.' WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccc0204';
UPDATE services SET name = 'Персональне тренування', description = 'Індивідуальне тренування з оцінкою форми, силовим блоком, розтяжкою та смузі після заняття.' WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccc0205';
UPDATE services SET name = 'Йога на світанку на даху', description = 'Групова практика на терасі даху з килимками, рушниками, трав''яною водою та спокійним плейлистом.' WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccc0206';
UPDATE services SET name = 'Приватна прогулянка старим містом', description = 'Індивідуальна екскурсія історичним центром із фотозупинками, кавою та місцевими історіями.' WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccc0207';
UPDATE services SET name = 'Гірський одноденний тур', description = 'Одноденна гірська екскурсія з приватним трансфером, гідом, пікнік-кошиком і маршрутом до оглядових точок.' WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccc0208';
UPDATE services SET name = 'Преміум-трансфер до аеропорту', description = 'Трансфер meet-and-greet у бізнес-класі з допомогою з багажем і відстеженням рейсу.' WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccc0209';
UPDATE services SET name = 'Нічний міський шатл', description = 'Вечірній і нічний трансфер у межах міста на вечерю, події або безпечне повернення в готель.' WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccc0210';
UPDATE services SET name = 'Романтичне оформлення номера', description = 'Романтична підготовка номера з квітами, свічками, десертом, листівкою та вечірнім turndown.' WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccc0212';

-- Base catalog rooms (V3)
UPDATE rooms SET name = 'Делюкс з видом на місто', description = 'Світлий номер із панорамними вікнами, робочою зоною та king-size ліжком.' WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0001';
UPDATE rooms SET name = 'Сімейний люкс', description = 'Просторий сімейний люкс із двома окремими зонами та видом на внутрішній сад.' WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0002';
UPDATE rooms SET name = 'Стандарт Comfort', description = 'Класичний стандартний номер для коротких ділових і туристичних поїздок.' WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0003';
UPDATE rooms SET name = 'Президентський Panorama', description = 'Преміальний президентський номер із терасою та окремою вітальнею.' WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0004';
UPDATE rooms SET name = 'Бізнес Twin', description = 'Зручний номер із двома окремими ліжками та повноцінним робочим столом.' WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0005';
UPDATE rooms SET name = 'Люкс для молодят', description = 'Романтичний люкс із ванною біля вікна та вечірнім декоративним освітленням.' WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0006';

-- Showcase rooms (V7)
UPDATE rooms SET name = 'Стандарт Azure', description = 'Світлий стандартний номер з queen-size ліжком, вікнами на місто, blackout-шторами, дощовим душем, робочим столом і швидким Wi-Fi для коротких ділових або weekend-поїздок.' WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0201';
UPDATE rooms SET name = 'Стандарт Garden Patio', description = 'Тихий номер з прямим виходом на патіо, садовими місцями для відпочинку, теплим освітленням, ергономічним робочим місцем і компактним сховищем для двох гостей.' WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0202';
UPDATE rooms SET name = 'Делюкс Executive Twin', description = 'Делюкс twin для колег або друзів: два преміальні ліжка, крісло для відпочинку, кавомашина та простір для багажу.' WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0203';
UPDATE rooms SET name = 'Делюкс Skyline King', description = 'King-номер з панорамним видом на skyline, преміальною білизною, зоною для читання, мармуровою ванною та пріоритетним room service пізно ввечері.' WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0204';
UPDATE rooms SET name = 'Делюкс Wellness', description = 'Спокійний делюкс біля SPA-поверху з килимком для йоги, ароматерапевтичним набором, ванною та preset-освітленням для сну.' WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0205';
UPDATE rooms SET name = 'Сімейний люкс Garden', description = 'Великий люкс із окремою спальнею та вітальнею, розкладним диваном, welcome-набором для дітей, видом на сад і столом для сімейних сніданків.' WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0206';
UPDATE rooms SET name = 'Люкс Executive Corner', description = 'Кутовий люкс з двостороннім видом на місто, окремою вітальнею, столом для нарад на четверих, espresso-bar і глибокою ванною.' WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0207';
UPDATE rooms SET name = 'Люкс Honeymoon Terrace', description = 'Романтичний люкс з приватною терасою, ванною біля вікна, вечірнім turndown, квітами та ігристим при заїзді.' WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0208';
UPDATE rooms SET name = 'Президентська резиденція', description = 'Флагманська резиденція з приватною їдальнею, джакузі на терасі, персональним дворецьким, окремим кабінетом, каміном і панорамним видом.' WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0209';
UPDATE rooms SET name = 'Пентхаус Royal Panorama', description = 'Пентхаус на верхньому поверсі з wraparound-терасою, повноцінною вітальнею, опцією приватного шефа, гардеробною та VIP-координацією трансферу.' WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0210';
UPDATE rooms SET name = 'Компактний бізнес-номер', description = 'Ефективний номер для solo business-гостей зі standing desk, доступом до принтера за запитом, швидким Wi-Fi і тихою орієнтацією на внутрішній двір.' WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0211';
UPDATE rooms SET name = 'Делюкс Accessible', description = 'Доступний делюкс з безбар''єрним входом, широкою ванною, поручнями, зниженими вимикачами та зручним king-size ліжком.' WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0212';

-- Showcase reviews (V7) — translate English comments
UPDATE reviews SET comment = 'Номер був бездоганно чистим, Wi-Fi швидкий, а check-in зайняв менше двох хвилин. Ідеально для короткого міського перебування.' WHERE id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeee0201';
UPDATE reviews SET comment = 'Садове патіо було спокійним і приватним. Сніданок у номер подали вчасно, персонал дружній.' WHERE id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeee0202';
UPDATE reviews SET comment = 'Зручний twin для ділової поїздки. Стіл корисний, у номері було тихо вночі.' WHERE id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeee0203';
UPDATE reviews SET comment = 'Вид на skyline чудовий. Номер відчувався преміальним, room service швидкий навіть пізно ввечері.' WHERE id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeee0204';
UPDATE reviews SET comment = 'Wellness-номер спокійний і дуже комфортний. Ароматерапія та ванна — приємний бонус.' WHERE id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeee0205';
UPDATE reviews SET comment = 'Чудовий сімейний люкс. Окрема вітальня полегшила вечори, а дитячий клуб дуже допоміг.' WHERE id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeee0206';
UPDATE reviews SET comment = 'Відмінний люкс для роботи та відпочинку. Стіл для нарад і espresso-bar справді корисні.' WHERE id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeee0207';
UPDATE reviews SET comment = 'Ідеальне перебування на річницю. Тераса, квіти та turndown-service організовані бездоганно.' WHERE id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeee0208';
UPDATE reviews SET comment = 'Резиденція дорога, але вражає. Сервіс дворецького, вечеря та вид з тераси — на найвищому рівні.' WHERE id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeee0209';
UPDATE reviews SET comment = 'Пентхаус відчувався як приватна квартира. Координація аеропорту та lounge-зона — відмінні.' WHERE id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeee0210';

-- Zero out loyalty points on demo users (feature removed from UI)
UPDATE users SET loyalty_points = 0 WHERE loyalty_points > 0;
