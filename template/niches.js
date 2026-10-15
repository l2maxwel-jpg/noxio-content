// Product niches: an episode with "niche": "<name>" shows these products in the comment feed, the order table,
// the AI bubble and the Messenger messages instead of the default clothing set from l10n.js.
// Same index rules as l10n.js: feed 0,1,3,4 are orders (table rows 0..3), 2 and 5 are questions.
// Keep buyer names in the table ≤ 8 letters, items ≤ 16, variants ≤ 6 (the table columns are narrow).
window.NICHES = {
  cosmetics: {
    ru: {
      feed: [['Алина','Беру крем 50 мл'],['Вера','Мне 2 помады, тон 03'],['Даша','А для сухой кожи есть?'],['Полина','Отложите тушь, чёрную!'],['Ксения','+ сыворотка 30 мл'],['Лиза','Сколько стоит палетка?'],['Нина','Беру маску ×2'],['Карина','Мне тон 02'],['Соня','Какой срок годности?'],['Жанна','Беру! 50 мл'],['Рита','Помаду 05, пожалуйста'],['Алла','Отложите мне крем'],['Майя','Есть пробники?'],['Ева','Беру 3 шт']],
      table: { cols: ['Покупатель','Товар','Вариант','Кол-во'], rows: [['Алина','Крем для лица','50 мл','1',0],['Вера','Помада','тон 03','2',1],['Полина','Тушь','чёрная','1',3],['Ксения','Сыворотка','30 мл','1',4]] },
      ai: { name: 'Вера', html: 'мне 2 <span class="hl l h1">помады</span>, <span class="hl v h2">тон 03</span>', chips: ['Помада','Тон 03','2 шт.'] },
      chat: { msgs: ['Алина, ваш заказ:<br><b>крем для лица, 50&nbsp;мл&nbsp;—&nbsp;1&nbsp;шт.</b>','Вера, ваш заказ:<br><b>помада, тон&nbsp;03&nbsp;—&nbsp;2&nbsp;шт.</b>','Полина, ваш заказ:<br><b>тушь, чёрная&nbsp;—&nbsp;1&nbsp;шт.</b>'] }
    },
    pl: {
      feed: [['Zosia','Biorę krem 50 ml'],['Agata','2 pomadki, odcień 03'],['Marta','Jest coś do suchej skóry?'],['Weronika','Odłóżcie tusz, czarny!'],['Paulina','+ serum 30 ml'],['Ania','Ile kosztuje paletka?'],['Klaudia','Biorę maskę ×2'],['Ewelina','Poproszę odcień 02'],['Dorota','Jaka data ważności?'],['Iwona','Biorę! 50 ml'],['Sylwia','Pomadka 05 proszę'],['Beata','Odłóżcie mi krem'],['Edyta','Są próbki?'],['Renata','Biorę 3 szt.']],
      table: { cols: ['Kupujący','Produkt','Wariant','Ilość'], rows: [['Zosia','Krem do twarzy','50 ml','1',0],['Agata','Pomadka','nr 03','2',1],['Weronika','Tusz','czarny','1',3],['Paulina','Serum','30 ml','1',4]] },
      ai: { name: 'Agata', html: '2 <span class="hl l h1">pomadki</span>, <span class="hl v h2">odcień 03</span>', chips: ['Pomadka','Odcień 03','2 szt.'] },
      chat: { msgs: ['Zosia, Twoje zamówienie:<br><b>krem do twarzy, 50&nbsp;ml&nbsp;—&nbsp;1&nbsp;szt.</b>','Agata, Twoje zamówienie:<br><b>pomadka, odcień&nbsp;03&nbsp;—&nbsp;2&nbsp;szt.</b>','Weronika, Twoje zamówienie:<br><b>tusz, czarny&nbsp;—&nbsp;1&nbsp;szt.</b>'] }
    },
    lv: {
      feed: [['Elza','Ņemu krēmu 50 ml'],['Rita','2 lūpu krāsas, tonis 03'],['Ieva','Vai ir sausai ādai?'],['Madara','Atlieciet melno tušu!'],['Santa','+ serums 30 ml'],['Laila','Cik maksā palete?'],['Baiba','Ņemu masku ×2'],['Diāna','Man toni 02'],['Gita','Kāds derīguma termiņš?'],['Una','Ņemu! 50 ml'],['Sintija','Lūpu krāsu 05, lūdzu'],['Vita','Atlieciet man krēmu'],['Signe','Vai ir paraugi?'],['Ance','Ņemu 3 gab.']],
      table: { cols: ['Pircējs','Prece','Variants','Daudz.'], rows: [['Elza','Sejas krēms','50 ml','1',0],['Rita','Lūpu krāsa','nr. 03','2',1],['Madara','Skropstu tuša','melna','1',3],['Santa','Serums','30 ml','1',4]] },
      ai: { name: 'Rita', html: '2 <span class="hl l h1">lūpu krāsas</span>, <span class="hl v h2">tonis 03</span>', chips: ['Lūpu krāsa','Tonis 03','2 gab.'] },
      chat: { msgs: ['Elza, jūsu pasūtījums:<br><b>sejas krēms, 50&nbsp;ml&nbsp;—&nbsp;1&nbsp;gab.</b>','Rita, jūsu pasūtījums:<br><b>lūpu krāsa, tonis&nbsp;03&nbsp;—&nbsp;2&nbsp;gab.</b>','Madara, jūsu pasūtījums:<br><b>skropstu tuša, melna&nbsp;—&nbsp;1&nbsp;gab.</b>'] }
    },
    en: {
      feed: [['Holly','I’ll take the cream, 50 ml'],['Megan','2 lipsticks, shade 03'],['Erin','Anything for dry skin?'],['Rose','Hold the black mascara!'],['Lauren','+ serum, 30 ml'],['Anna','How much is the palette?'],['Beth','Mask ×2 please'],['Jade','Shade 02 for me'],['Abby','What’s the expiry date?'],['Nina','Mine! 50 ml'],['Leah','Lipstick 05 please'],['Tara','Hold a cream for me'],['Fern','Any samples?'],['Kim','I’ll take 3']],
      table: { cols: ['Buyer','Item','Variant','Qty'], rows: [['Holly','Face cream','50 ml','1',0],['Megan','Lipstick','no. 03','2',1],['Rose','Mascara','black','1',3],['Lauren','Serum','30 ml','1',4]] },
      ai: { name: 'Megan', html: '2 <span class="hl l h1">lipsticks</span>, <span class="hl v h2">shade 03</span>', chips: ['Lipstick','Shade 03','2 pcs'] },
      chat: { msgs: ['Holly, your order:<br><b>face cream, 50&nbsp;ml&nbsp;—&nbsp;1&nbsp;pc</b>','Megan, your order:<br><b>lipstick, shade&nbsp;03&nbsp;—&nbsp;2&nbsp;pcs</b>','Rose, your order:<br><b>mascara, black&nbsp;—&nbsp;1&nbsp;pc</b>'] }
    }
  },

  shoes: {
    ru: {
      feed: [['Марина','Беру кроссовки, 38'],['Инна','Мне 2 пары балеток, 37'],['Таня','Есть 37 размер?'],['Люба','Отложите сапоги, 39!'],['Яна','+ туфли бежевые, 36'],['Катя','Они маломерят?'],['Влада','Беру лоферы!'],['Оля','Мне 41'],['Женя','Какая подошва?'],['Лера','Беру! 38'],['Маша','Кеды белые, 37'],['Ира','Отложите мне 40'],['Света','Есть другие цвета?'],['Дина','Беру 2 пары']],
      table: { rows: [['Марина','Кроссовки','38','1',0],['Инна','Балетки','37','2',1],['Люба','Сапоги','39','1',3],['Яна','Туфли бежевые','36','1',4]] },
      ai: { name: 'Люба', html: 'отложите <span class="hl l h1">сапоги</span>, <span class="hl v h2">39</span>!', chips: ['Сапоги','Размер 39','1 пара'] },
      chat: { msgs: ['Марина, ваш заказ:<br><b>кроссовки, 38&nbsp;—&nbsp;1&nbsp;пара</b>','Инна, ваш заказ:<br><b>балетки, 37&nbsp;—&nbsp;2&nbsp;пары</b>','Люба, ваш заказ:<br><b>сапоги, 39&nbsp;—&nbsp;1&nbsp;пара</b>'] }
    },
    pl: {
      feed: [['Kinga','Biorę sneakersy, 38'],['Ola','2 pary baletek, 37'],['Ilona','Jest rozmiar 37?'],['Marzena','Odłóżcie kozaki, 39!'],['Ewa','+ beżowe szpilki, 36'],['Daria','Jak z rozmiarówką?'],['Hania','Biorę mokasyny!'],['Lena','Poproszę 41'],['Maja','Jaka podeszwa?'],['Nikola','Biorę! 38'],['Wiktoria','Białe trampki, 37'],['Ula','Odłóżcie mi 40'],['Jola','Są inne kolory?'],['Bożena','Biorę 2 pary']],
      table: { rows: [['Kinga','Sneakersy','38','1',0],['Ola','Baletki','37','2',1],['Marzena','Kozaki','39','1',3],['Ewa','Szpilki beżowe','36','1',4]] },
      ai: { name: 'Marzena', html: 'odłóżcie <span class="hl l h1">kozaki</span>, <span class="hl v h2">39</span>!', chips: ['Kozaki','Rozmiar 39','1 para'] },
      chat: { msgs: ['Kinga, Twoje zamówienie:<br><b>sneakersy, 38&nbsp;—&nbsp;1&nbsp;para</b>','Ola, Twoje zamówienie:<br><b>baletki, 37&nbsp;—&nbsp;2&nbsp;pary</b>','Marzena, Twoje zamówienie:<br><b>kozaki, 39&nbsp;—&nbsp;1&nbsp;para</b>'] }
    },
    lv: {
      feed: [['Līga','Ņemu sporta apavus, 38'],['Inga','2 pārus balerīnu, 37'],['Kate','Vai ir 37. izmērs?'],['Dzintra','Atlieciet zābakus, 39!'],['Aija','+ bēšas kurpes, 36'],['Ilze','Vai izmērs atbilst?'],['Maija','Ņemu mokasīnus!'],['Lāsma','Man 41'],['Daina','Kāda zole?'],['Ruta','Ņemu! 38'],['Alise','Baltās kedas, 37'],['Ilona','Atlieciet man 40'],['Zane','Vai ir citas krāsas?'],['Sarmīte','Ņemu 2 pārus']],
      table: { rows: [['Līga','Sporta apavi','38','1',0],['Inga','Balerīnas','37','2',1],['Dzintra','Zābaki','39','1',3],['Aija','Bēšas kurpes','36','1',4]] },
      ai: { name: 'Dzintra', html: 'atlieciet <span class="hl l h1">zābakus</span>, <span class="hl v h2">39</span>!', chips: ['Zābaki','Izmērs 39','1 pāris'] },
      chat: { msgs: ['Līga, jūsu pasūtījums:<br><b>sporta apavi, 38&nbsp;—&nbsp;1&nbsp;pāris</b>','Inga, jūsu pasūtījums:<br><b>balerīnas, 37&nbsp;—&nbsp;2&nbsp;pāri</b>','Dzintra, jūsu pasūtījums:<br><b>zābaki, 39&nbsp;—&nbsp;1&nbsp;pāris</b>'] }
    },
    en: {
      feed: [['Olivia','I’ll take the sneakers, 38'],['Hannah','2 pairs of flats, 37'],['Isla','Do you have a 37?'],['Freya','Hold the boots, 39!'],['Poppy','+ beige heels, 36'],['Alice','Do they run small?'],['Daisy','I’ll take the loafers!'],['Molly','41 for me'],['Evie','What’s the sole like?'],['Maya','Mine! 38'],['Ivy','White canvas shoes, 37'],['Phoebe','Hold a 40 for me'],['Sara','Other colours?'],['Esme','I’ll take 2 pairs']],
      table: { rows: [['Olivia','Sneakers','38','1',0],['Hannah','Flats','37','2',1],['Freya','Boots','39','1',3],['Poppy','Beige heels','36','1',4]] },
      ai: { name: 'Freya', html: 'hold the <span class="hl l h1">boots</span>, <span class="hl v h2">39</span>!', chips: ['Boots','Size 39','1 pair'] },
      chat: { msgs: ['Olivia, your order:<br><b>sneakers, 38&nbsp;—&nbsp;1&nbsp;pair</b>','Hannah, your order:<br><b>flats, 37&nbsp;—&nbsp;2&nbsp;pairs</b>','Freya, your order:<br><b>boots, 39&nbsp;—&nbsp;1&nbsp;pair</b>'] }
    }
  },

  kids: {
    ru: {
      feed: [['Аня','Беру комбинезон, 92'],['Лена','Мне 2 боди, 74'],['Юля','А на 2 года что есть?'],['Оксана','Отложите куртку, 110!'],['Галя','+ шапка, 52'],['Ника','Это хлопок?'],['Тома','Беру пижаму!'],['Вика','Мне 98'],['Роза','Какой состав?'],['Нелли','Беру! 104'],['Таня','Платье, 116'],['Света','Отложите мне 86'],['Люда','Есть для мальчиков?'],['Зоя','Беру 2 шт']],
      table: { rows: [['Аня','Комбинезон','92','1',0],['Лена','Боди','74','2',1],['Оксана','Куртка','110','1',3],['Галя','Шапка','52','1',4]] },
      ai: { name: 'Оксана', html: 'отложите <span class="hl l h1">куртку</span>, <span class="hl v h2">110</span>!', chips: ['Куртка','Рост 110','1 шт.'] },
      chat: { msgs: ['Аня, ваш заказ:<br><b>комбинезон, 92&nbsp;—&nbsp;1&nbsp;шт.</b>','Лена, ваш заказ:<br><b>боди, 74&nbsp;—&nbsp;2&nbsp;шт.</b>','Оксана, ваш заказ:<br><b>куртка, 110&nbsp;—&nbsp;1&nbsp;шт.</b>'] }
    },
    pl: {
      feed: [['Ania','Biorę kombinezon, 92'],['Magda','2 body, 74'],['Kasia','Co macie na 2 latka?'],['Ela','Odłóżcie kurtkę, 110!'],['Gosia','+ czapka, 52'],['Iza','To bawełna?'],['Asia','Biorę piżamkę!'],['Ola','Poproszę 98'],['Ewa','Jaki skład?'],['Monika','Biorę! 104'],['Basia','Sukienka, 116'],['Natalia','Odłóżcie mi 86'],['Karolina','Macie dla chłopców?'],['Justyna','Biorę 2 szt.']],
      table: { rows: [['Ania','Kombinezon','92','1',0],['Magda','Body','74','2',1],['Ela','Kurtka','110','1',3],['Gosia','Czapka','52','1',4]] },
      ai: { name: 'Ela', html: 'odłóżcie <span class="hl l h1">kurtkę</span>, <span class="hl v h2">110</span>!', chips: ['Kurtka','Rozmiar 110','1 szt.'] },
      chat: { msgs: ['Ania, Twoje zamówienie:<br><b>kombinezon, 92&nbsp;—&nbsp;1&nbsp;szt.</b>','Magda, Twoje zamówienie:<br><b>body, 74&nbsp;—&nbsp;2&nbsp;szt.</b>','Ela, Twoje zamówienie:<br><b>kurtka, 110&nbsp;—&nbsp;1&nbsp;szt.</b>'] }
    },
    lv: {
      feed: [['Anna','Ņemu kombinezonu, 92'],['Lelde','2 bodijus, 74'],['Agnese','Kas ir 2 gadu vecumam?'],['Evita','Atlieciet jaku, 110!'],['Inese','+ cepure, 52'],['Kristīne','Vai tā ir kokvilna?'],['Dace','Ņemu pidžamu!'],['Elīna','Man 98'],['Marta','Kāds sastāvs?'],['Zane','Ņemu! 104'],['Laura','Kleita, 116'],['Linda','Atlieciet man 86'],['Liene','Vai ir zēniem?'],['Sanita','Ņemu 2 gab.']],
      table: { rows: [['Anna','Kombinezons','92','1',0],['Lelde','Bodijs','74','2',1],['Evita','Jaka','110','1',3],['Inese','Cepure','52','1',4]] },
      ai: { name: 'Evita', html: 'atlieciet <span class="hl l h1">jaku</span>, <span class="hl v h2">110</span>!', chips: ['Jaka','Izmērs 110','1 gab.'] },
      chat: { msgs: ['Anna, jūsu pasūtījums:<br><b>kombinezons, 92&nbsp;—&nbsp;1&nbsp;gab.</b>','Lelde, jūsu pasūtījums:<br><b>bodijs, 74&nbsp;—&nbsp;2&nbsp;gab.</b>','Evita, jūsu pasūtījums:<br><b>jaka, 110&nbsp;—&nbsp;1&nbsp;gab.</b>'] }
    },
    en: {
      feed: [['Amelia','I’ll take the snowsuit, 92'],['Emily','2 bodysuits, 74'],['Lucy','Anything for a 2-year-old?'],['Jessica','Hold the jacket, 110!'],['Sophia','+ hat, 52'],['Chloe','Is it cotton?'],['Ella','I’ll take the pyjamas!'],['Mia','98 for me'],['Grace','What’s the fabric?'],['Lily','Mine! 104'],['Ruby','Dress, 116'],['Ava','Hold an 86 for me'],['Zara','Anything for boys?'],['Kate','I’ll take 2']],
      table: { rows: [['Amelia','Snowsuit','92','1',0],['Emily','Bodysuit','74','2',1],['Jessica','Jacket','110','1',3],['Sophia','Hat','52','1',4]] },
      ai: { name: 'Jessica', html: 'hold the <span class="hl l h1">jacket</span>, <span class="hl v h2">110</span>!', chips: ['Jacket','Size 110','1 pc'] },
      chat: { msgs: ['Amelia, your order:<br><b>snowsuit, 92&nbsp;—&nbsp;1&nbsp;pc</b>','Emily, your order:<br><b>bodysuit, 74&nbsp;—&nbsp;2&nbsp;pcs</b>','Jessica, your order:<br><b>jacket, 110&nbsp;—&nbsp;1&nbsp;pc</b>'] }
    }
  },

  accessories: {
    ru: {
      feed: [['Диана','Беру серьги, золото'],['Алёна','Мне 2 браслета, 18 см'],['Кира','Кольцо регулируется?'],['Мила','Отложите сумку, чёрную!'],['Лиля','+ цепочка 45 см'],['Надя','А гипоаллергенные есть?'],['Фая','Беру кулон!'],['Лора','Мне золото'],['Роза','Какая застёжка?'],['Ася','Беру! серебро'],['Тая','Ремень, коричневый'],['Ира','Отложите мне кольцо'],['Мира','Есть подарочная упаковка?'],['Ада','Беру 2 шт']],
      table: { cols: ['Покупатель','Товар','Вариант','Кол-во'], rows: [['Диана','Серьги','золото','1',0],['Алёна','Браслет','18 см','2',1],['Мила','Сумка','чёрная','1',3],['Лиля','Цепочка','45 см','1',4]] },
      ai: { name: 'Мила', html: 'отложите <span class="hl l h1">сумку</span>, <span class="hl v h2">чёрную</span>!', chips: ['Сумка','Чёрная','1 шт.'] },
      chat: { msgs: ['Диана, ваш заказ:<br><b>серьги, золото&nbsp;—&nbsp;1&nbsp;шт.</b>','Алёна, ваш заказ:<br><b>браслет, 18&nbsp;см&nbsp;—&nbsp;2&nbsp;шт.</b>','Мила, ваш заказ:<br><b>сумка, чёрная&nbsp;—&nbsp;1&nbsp;шт.</b>'] }
    },
    pl: {
      feed: [['Julia','Biorę kolczyki, złote'],['Ola','2 bransoletki, 18 cm'],['Kamila','Pierścionek ma regulację?'],['Emilia','Odłóżcie torebkę, czarną!'],['Lidia','+ łańcuszek 45 cm'],['Nina','Są hipoalergiczne?'],['Ada','Biorę wisiorek!'],['Laura','Poproszę złoty'],['Róża','Jakie zapięcie?'],['Hela','Biorę! srebrny'],['Tola','Pasek, brązowy'],['Iga','Odłóżcie mi pierścionek'],['Mira','Jest opakowanie na prezent?'],['Alicja','Biorę 2 szt.']],
      table: { cols: ['Kupujący','Produkt','Wariant','Ilość'], rows: [['Julia','Kolczyki','złote','1',0],['Ola','Bransoletka','18 cm','2',1],['Emilia','Torebka','czarna','1',3],['Lidia','Łańcuszek','45 cm','1',4]] },
      ai: { name: 'Emilia', html: 'odłóżcie <span class="hl l h1">torebkę</span>, <span class="hl v h2">czarną</span>!', chips: ['Torebka','Czarna','1 szt.'] },
      chat: { msgs: ['Julia, Twoje zamówienie:<br><b>kolczyki, złote&nbsp;—&nbsp;1&nbsp;szt.</b>','Ola, Twoje zamówienie:<br><b>bransoletka, 18&nbsp;cm&nbsp;—&nbsp;2&nbsp;szt.</b>','Emilia, Twoje zamówienie:<br><b>torebka, czarna&nbsp;—&nbsp;1&nbsp;szt.</b>'] }
    },
    lv: {
      feed: [['Estere','Ņemu auskarus, zelta'],['Ginta','2 aproces, 18 cm'],['Ilga','Vai gredzens regulējams?'],['Krista','Atlieciet melno somu!'],['Lija','+ ķēdīte 45 cm'],['Rasa','Vai ir hipoalerģiski?'],['Anete','Ņemu kulonu!'],['Lote','Man zelta'],['Ramona','Kāda ir aizdare?'],['Elza','Ņemu! sudraba'],['Patrīcija','Josta, brūna'],['Velta','Atlieciet man gredzenu'],['Sabīne','Vai ir dāvanu iepakojums?'],['Viola','Ņemu 2 gab.']],
      table: { cols: ['Pircējs','Prece','Variants','Daudz.'], rows: [['Estere','Auskari','zelta','1',0],['Ginta','Aproce','18 cm','2',1],['Krista','Soma','melna','1',3],['Lija','Ķēdīte','45 cm','1',4]] },
      ai: { name: 'Krista', html: 'atlieciet <span class="hl v h2">melno</span> <span class="hl l h1">somu</span>!', chips: ['Soma','Melna','1 gab.'] },
      chat: { msgs: ['Estere, jūsu pasūtījums:<br><b>auskari, zelta&nbsp;—&nbsp;1&nbsp;gab.</b>','Ginta, jūsu pasūtījums:<br><b>aproce, 18&nbsp;cm&nbsp;—&nbsp;2&nbsp;gab.</b>','Krista, jūsu pasūtījums:<br><b>soma, melna&nbsp;—&nbsp;1&nbsp;gab.</b>'] }
    },
    en: {
      feed: [['Isabel','I’ll take the earrings, gold'],['Naomi','2 bracelets, 18 cm'],['Clara','Is the ring adjustable?'],['Stella','Hold the black bag!'],['Lydia','+ chain, 45 cm'],['Ellie','Hypoallergenic?'],['Hazel','I’ll take the pendant!'],['Iris','Gold for me'],['Ruth','What clasp is it?'],['Nora','Mine! silver'],['Tess','Belt, brown'],['Vera','Hold a ring for me'],['Amber','Gift wrapping?'],['Joy','I’ll take 2']],
      table: { cols: ['Buyer','Item','Variant','Qty'], rows: [['Isabel','Earrings','gold','1',0],['Naomi','Bracelet','18 cm','2',1],['Stella','Bag','black','1',3],['Lydia','Chain','45 cm','1',4]] },
      ai: { name: 'Stella', html: 'hold the <span class="hl v h2">black</span> <span class="hl l h1">bag</span>!', chips: ['Bag','Black','1 pc'] },
      chat: { msgs: ['Isabel, your order:<br><b>earrings, gold&nbsp;—&nbsp;1&nbsp;pc</b>','Naomi, your order:<br><b>bracelet, 18&nbsp;cm&nbsp;—&nbsp;2&nbsp;pcs</b>','Stella, your order:<br><b>bag, black&nbsp;—&nbsp;1&nbsp;pc</b>'] }
    }
  },

  home: {
    ru: {
      feed: [['Галина','Беру плед, серый'],['Елена','Мне 2 подушки, 50×50'],['Ольга','Постельное есть двуспальное?'],['Нина','Отложите полотенце, белое!'],['Вера','+ свеча, ваниль'],['Люся','Это лён?'],['Тамара','Беру скатерть!'],['Зина','Мне бежевый'],['Римма','Какой размер пледа?'],['Инна','Беру! 50×50'],['Лида','Наволочки ×4'],['Майя','Отложите мне плед'],['Алла','Можно стирать в машинке?'],['Фаина','Беру 2 шт']],
      table: { cols: ['Покупатель','Товар','Вариант','Кол-во'], rows: [['Галина','Плед','серый','1',0],['Елена','Подушка','50×50','2',1],['Нина','Полотенце','белое','1',3],['Вера','Свеча','ваниль','1',4]] },
      ai: { name: 'Елена', html: 'мне 2 <span class="hl l h1">подушки</span>, <span class="hl v h2">50×50</span>', chips: ['Подушка','50×50','2 шт.'] },
      chat: { msgs: ['Галина, ваш заказ:<br><b>плед, серый&nbsp;—&nbsp;1&nbsp;шт.</b>','Елена, ваш заказ:<br><b>подушка, 50×50&nbsp;—&nbsp;2&nbsp;шт.</b>','Нина, ваш заказ:<br><b>полотенце, белое&nbsp;—&nbsp;1&nbsp;шт.</b>'] }
    },
    pl: {
      feed: [['Halina','Biorę koc, szary'],['Grażyna','2 poduszki, 50×50'],['Teresa','Jest pościel 160×200?'],['Danuta','Odłóżcie ręcznik, biały!'],['Irena','+ świeca, wanilia'],['Jadwiga','To len?'],['Krystyna','Biorę obrus!'],['Zofia','Poproszę beżowy'],['Barbara','Jaki wymiar koca?'],['Elżbieta','Biorę! 50×50'],['Wanda','Poszewki ×4'],['Maria','Odłóżcie mi koc'],['Anna','Można prać w pralce?'],['Lucyna','Biorę 2 szt.']],
      table: { cols: ['Kupujący','Produkt','Wariant','Ilość'], rows: [['Halina','Koc','szary','1',0],['Grażyna','Poduszka','50×50','2',1],['Danuta','Ręcznik','biały','1',3],['Irena','Świeca','wanilia','1',4]] },
      ai: { name: 'Grażyna', html: '2 <span class="hl l h1">poduszki</span>, <span class="hl v h2">50×50</span>', chips: ['Poduszka','50×50','2 szt.'] },
      chat: { msgs: ['Halina, Twoje zamówienie:<br><b>koc, szary&nbsp;—&nbsp;1&nbsp;szt.</b>','Grażyna, Twoje zamówienie:<br><b>poduszka, 50×50&nbsp;—&nbsp;2&nbsp;szt.</b>','Danuta, Twoje zamówienie:<br><b>ręcznik, biały&nbsp;—&nbsp;1&nbsp;szt.</b>'] }
    },
    lv: {
      feed: [['Gunta','Ņemu pledu, pelēku'],['Silvija','2 spilvenus, 50×50'],['Ingrīda','Vai ir gultasveļa 160×200?'],['Dace','Atlieciet baltu dvieli!'],['Ilze','+ svece, vaniļa'],['Velta','Vai tas ir lins?'],['Rasma','Ņemu galdautu!'],['Aina','Man bēšu'],['Biruta','Kāds pleda izmērs?'],['Maija','Ņemu! 50×50'],['Vija','Spilvendrānas ×4'],['Skaidrīte','Atlieciet man pledu'],['Dzidra','Var mazgāt veļasmašīnā?'],['Lidija','Ņemu 2 gab.']],
      table: { cols: ['Pircējs','Prece','Variants','Daudz.'], rows: [['Gunta','Pleds','pelēks','1',0],['Silvija','Spilvens','50×50','2',1],['Dace','Dvielis','balts','1',3],['Ilze','Svece','vaniļa','1',4]] },
      ai: { name: 'Silvija', html: '2 <span class="hl l h1">spilvenus</span>, <span class="hl v h2">50×50</span>', chips: ['Spilvens','50×50','2 gab.'] },
      chat: { msgs: ['Gunta, jūsu pasūtījums:<br><b>pleds, pelēks&nbsp;—&nbsp;1&nbsp;gab.</b>','Silvija, jūsu pasūtījums:<br><b>spilvens, 50×50&nbsp;—&nbsp;2&nbsp;gab.</b>','Dace, jūsu pasūtījums:<br><b>dvielis, balts&nbsp;—&nbsp;1&nbsp;gab.</b>'] }
    },
    en: {
      feed: [['Helen','I’ll take the throw, grey'],['Diane','2 cushions, 50×50'],['Susan','Any double bedding?'],['Linda','Hold a white towel!'],['Carol','+ candle, vanilla'],['Janet','Is it linen?'],['Mary','I’ll take the tablecloth!'],['Joan','Beige for me'],['Ann','How big is the throw?'],['Pam','Mine! 50×50'],['Sue','Pillowcases ×4'],['Gill','Hold a throw for me'],['Lynn','Machine washable?'],['Val','I’ll take 2']],
      table: { cols: ['Buyer','Item','Variant','Qty'], rows: [['Helen','Throw','grey','1',0],['Diane','Cushion','50×50','2',1],['Linda','Towel','white','1',3],['Carol','Candle','vanilla','1',4]] },
      ai: { name: 'Diane', html: '2 <span class="hl l h1">cushions</span>, <span class="hl v h2">50×50</span>', chips: ['Cushion','50×50','2 pcs'] },
      chat: { msgs: ['Helen, your order:<br><b>throw, grey&nbsp;—&nbsp;1&nbsp;pc</b>','Diane, your order:<br><b>cushion, 50×50&nbsp;—&nbsp;2&nbsp;pcs</b>','Linda, your order:<br><b>towel, white&nbsp;—&nbsp;1&nbsp;pc</b>'] }
    }
  }
};
