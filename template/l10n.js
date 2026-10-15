// UI strings and default scene copy per language.
// Markup in heads: [text] = emerald highlight, {text} = teal highlight.
// Feed index meaning (keep in every language): 0,1,3,4 = orders (table rows 0..3); 2,5 = questions (filtered out).
window.L10N = {
  ru: {
    live: { on: 'В ЭФИРЕ', off: 'ЭФИР ЗАВЕРШЁН' },
    feed: [['Оля','Беру синее платье, M'],['Марина','Мне 2 красных топа, S'],['Катя','Сколько стоит бежевая?'],['Света','Отложите куртку, L!'],['Наташа','+ чёрные брюки, 42'],['Ирина','А синее ещё есть?'],['Оксана','Беру сумку!'],['Лена','Мне шарф серый ×2'],['Юля','Какая длина у платья?'],['Таня','Беру! M'],['Вика','Красный топ, M'],['Аня','Отложите мне белую'],['Даша','Сколько доставка?'],['Галина','Беру 2 шт']],
    table: { title: 'Заказы · эфир', cols: ['Покупатель','Товар','Размер','Кол-во'],
      rows: [['Оля','Синее платье','M','1',0],['Марина','Красный топ','S','2',1],['Света','Куртка','L','1',3],['Наташа','Чёрные брюки','42','1',4]] },
    ordersWord: n => (n % 10 === 1 && n % 100 !== 11) ? 'заказ' : ([2,3,4].includes(n % 10) && ![12,13,14].includes(n % 100)) ? 'заказа' : 'заказов',
    ai: { name: 'Оля', html: 'беру <span class="hl l h1">синее платье</span>, <span class="hl v h2">M</span>', chips: ['Синее платье','Размер M','1 шт.'], code: '#A-1042', nocode: 'артикул не нужен' },
    connect: { aTitle: 'Страница Facebook', aSub: 'быстрый режим', or: 'или', bTitle: 'Ссылка на эфир', bSub: 'без входа через Facebook', url: 'facebook.com/live/videos/2918…', btn: 'Обработать' },
    chat: { shop: 'Ваш магазин', ava: 'М', net: 'Messenger', sent: 'Отправлено',
      msgs: ['Оля, ваш заказ:<br><b>синее платье, M&nbsp;—&nbsp;1&nbsp;шт.</b>','Марина, ваш заказ:<br><b>красный топ, S&nbsp;—&nbsp;2&nbsp;шт.</b>','Света, ваш заказ:<br><b>куртка, L&nbsp;—&nbsp;1&nbsp;шт.</b>'] },
    defaults: {
      hook: { setup: ['Эфир закончился,','а в комментариях —'], p1: 'сотни', p2: 'заказов?' },
      pain: { head: ['Листать,','выписывать,','сверять…'], big: 'часами' },
      solution: { head: ['Noxio собирает','заказы из','комментариев','[автоматически]'] },
      ai: { head: ['ИИ понимает','заказы даже','[без кодов товаров]'] },
      connect: { head: ['Подключите','страницу Facebook','{или} просто вставьте','ссылку на эфир'] },
      messenger: { head: ['Готовый список','заказов'], sub: '+ сообщения покупателям в Messenger' },
      offer: { big: '14', l2: 'дней', l3: 'бесплатно', pills: ['до 3 эфиров','без карты'] },
      cta: { brand: 'Noxio', tag: 'Заказы из эфиров — автоматически', button: 'Попробуйте: noxio.pl', small: '14 дней бесплатно' }
    }
  },
  lv: {
    live: { on: 'TIEŠRAIDĒ', off: 'TIEŠRAIDE BEIGUSIES' },
    feed: [['Anna','Ņemu zilo kleitu, M'],['Ilze','Man 2 sarkanos topus, S'],['Laura','Cik maksā bēšā?'],['Sanita','Atlieciet jaku, L!'],['Inese','+ melnās bikses, 42'],['Liene','Vai zilā vēl ir?'],['Kristīne','Ņemu somu!'],['Elīna','Man pelēko šalli ×2'],['Dace','Cik gara ir kleita?'],['Agnese','Ņemu! M'],['Zane','Sarkano topu, M'],['Evija','Atlieciet man balto'],['Marta','Cik maksā piegāde?'],['Linda','Ņemu 2 gab.']],
    table: { title: 'Pasūtījumi · tiešraide', cols: ['Pircējs','Prece','Izmērs','Daudz.'],
      rows: [['Anna','Zilā kleita','M','1',0],['Ilze','Sarkanais tops','S','2',1],['Sanita','Jaka','L','1',3],['Inese','Melnās bikses','42','1',4]] },
    ordersWord: n => (n % 10 === 1 && n % 100 !== 11) ? 'pasūtījums' : (n === 0 ? 'pasūtījumu' : 'pasūtījumi'),
    ai: { name: 'Anna', html: 'ņemu <span class="hl l h1">zilo kleitu</span>, <span class="hl v h2">M</span>', chips: ['Zilā kleita','Izmērs M','1 gab.'], code: '#A-1042', nocode: 'preces kods nav vajadzīgs' },
    connect: { aTitle: 'Facebook lapa', aSub: 'ātrais režīms', or: 'vai', bTitle: 'Saite uz tiešraidi', bSub: 'bez Facebook pieteikšanās', url: 'facebook.com/live/videos/2918…', btn: 'Apstrādāt' },
    chat: { shop: 'Jūsu veikals', ava: 'V', net: 'Messenger', sent: 'Nosūtīts',
      msgs: ['Anna, jūsu pasūtījums:<br><b>zilā kleita, M&nbsp;—&nbsp;1&nbsp;gab.</b>','Ilze, jūsu pasūtījums:<br><b>sarkanais tops, S&nbsp;—&nbsp;2&nbsp;gab.</b>','Sanita, jūsu pasūtījums:<br><b>jaka, L&nbsp;—&nbsp;1&nbsp;gab.</b>'] },
    defaults: {
      hook: { setup: ['Tiešraide beigusies,','bet komentāros —'], p1: 'simtiem', p2: 'pasūtījumu?' },
      pain: { head: ['Ritināt,','pierakstīt,','salīdzināt…'], big: 'stundām' },
      solution: { head: ['Noxio pats savāc','pasūtījumus','no komentāriem','[automātiski]'] },
      ai: { head: ['MI saprot','pasūtījumus pat','[bez preču kodiem]'] },
      connect: { head: ['Pievienojiet','Facebook lapu','{vai} vienkārši','ielīmējiet saiti'] },
      messenger: { head: ['Gatavs','pasūtījumu saraksts'], sub: '+ ziņas pircējiem Messenger' },
      offer: { big: '14', l2: 'dienas', l3: 'bez maksas', pills: ['līdz 3 tiešraidēm','bez kartes'] },
      cta: { brand: 'Noxio', tag: 'Pasūtījumi no tiešraidēm — automātiski', button: 'Izmēģiniet: noxio.pl', small: '14 dienas bez maksas' }
    }
  },
  pl: {
    live: { on: 'NA ŻYWO', off: 'LIVE ZAKOŃCZONY' },
    feed: [['Ola','Biorę niebieską sukienkę, M'],['Kasia','Poproszę 2 czerwone topy, S'],['Magda','Ile kosztuje beżowa?'],['Ewa','Odłóżcie mi kurtkę, L!'],['Asia','+ czarne spodnie, 42'],['Ania','Czy niebieska jest jeszcze?'],['Monika','Biorę torebkę!'],['Basia','Szary szal ×2'],['Gosia','Jaka długość sukienki?'],['Iza','Biorę! M'],['Ula','Czerwony top, M'],['Natalia','Odłóżcie mi białą'],['Karolina','Ile kosztuje wysyłka?'],['Justyna','Biorę 2 szt.']],
    table: { title: 'Zamówienia · live', cols: ['Kupujący','Produkt','Rozmiar','Ilość'],
      rows: [['Ola','Niebieska sukienka','M','1',0],['Kasia','Czerwony top','S','2',1],['Ewa','Kurtka','L','1',3],['Asia','Czarne spodnie','42','1',4]] },
    ordersWord: n => n === 1 ? 'zamówienie' : ([2,3,4].includes(n % 10) && ![12,13,14].includes(n % 100)) ? 'zamówienia' : 'zamówień',
    ai: { name: 'Ola', html: 'biorę <span class="hl l h1">niebieską sukienkę</span>, <span class="hl v h2">M</span>', chips: ['Niebieska sukienka','Rozmiar M','1 szt.'], code: '#A-1042', nocode: 'kod produktu niepotrzebny' },
    connect: { aTitle: 'Strona na Facebooku', aSub: 'tryb szybki', or: 'lub', bTitle: 'Link do transmisji', bSub: 'bez logowania przez Facebook', url: 'facebook.com/live/videos/2918…', btn: 'Przetwórz' },
    chat: { shop: 'Twój sklep', ava: 'S', net: 'Messenger', sent: 'Wysłano',
      msgs: ['Ola, Twoje zamówienie:<br><b>niebieska sukienka, M&nbsp;—&nbsp;1&nbsp;szt.</b>','Kasia, Twoje zamówienie:<br><b>czerwony top, S&nbsp;—&nbsp;2&nbsp;szt.</b>','Ewa, Twoje zamówienie:<br><b>kurtka, L&nbsp;—&nbsp;1&nbsp;szt.</b>'] },
    defaults: {
      hook: { setup: ['Live się skończył,','a w komentarzach —'], p1: 'setki', p2: 'zamówień?' },
      pain: { head: ['Przewijać,','przepisywać,','sprawdzać…'], big: 'godzinami' },
      solution: { head: ['Noxio zbiera','zamówienia','z komentarzy','[automatycznie]'] },
      ai: { head: ['AI rozumie','zamówienia nawet','[bez kodów produktów]'] },
      connect: { head: ['Podłącz stronę','na Facebooku','{lub} po prostu wklej','link do live’a'] },
      messenger: { head: ['Gotowa lista','zamówień'], sub: '+ wiadomości do kupujących w Messengerze' },
      offer: { big: '14', l2: 'dni', l3: 'za darmo', pills: ['do 3 transmisji','bez karty'] },
      cta: { brand: 'Noxio', tag: 'Zamówienia z live’ów — automatycznie', button: 'Wypróbuj: noxio.pl', small: '14 dni za darmo' }
    }
  },
  en: {
    live: { on: 'LIVE', off: 'LIVE ENDED' },
    feed: [['Emma','I’ll take the blue dress, M'],['Sophie','2 red tops for me, S'],['Mia','How much is the beige one?'],['Grace','Hold the jacket for me, L!'],['Chloe','+ black trousers, 42'],['Lily','Is the blue one still there?'],['Ava','I’ll take the bag!'],['Ella','Grey scarf ×2'],['Amy','How long is the dress?'],['Zoe','Mine! M'],['Ruby','Red top, M'],['Kate','Hold the white one for me'],['Lucy','How much is shipping?'],['Jess','I’ll take 2']],
    table: { title: 'Orders · live', cols: ['Buyer','Item','Size','Qty'],
      rows: [['Emma','Blue dress','M','1',0],['Sophie','Red top','S','2',1],['Grace','Jacket','L','1',3],['Chloe','Black trousers','42','1',4]] },
    ordersWord: n => n === 1 ? 'order' : 'orders',
    ai: { name: 'Emma', html: 'I’ll take the <span class="hl l h1">blue dress</span>, <span class="hl v h2">M</span>', chips: ['Blue dress','Size M','1 pc'], code: '#A-1042', nocode: 'no product code needed' },
    connect: { aTitle: 'Facebook Page', aSub: 'fast mode', or: 'or', bTitle: 'Link to your live', bSub: 'no Facebook login', url: 'facebook.com/live/videos/2918…', btn: 'Process' },
    chat: { shop: 'Your shop', ava: 'S', net: 'Messenger', sent: 'Sent',
      msgs: ['Emma, your order:<br><b>blue dress, M&nbsp;—&nbsp;1&nbsp;pc</b>','Sophie, your order:<br><b>red top, S&nbsp;—&nbsp;2&nbsp;pcs</b>','Grace, your order:<br><b>jacket, L&nbsp;—&nbsp;1&nbsp;pc</b>'] },
    defaults: {
      hook: { setup: ['The live is over,','and the comments hold'], p1: 'hundreds', p2: 'of orders?' },
      pain: { head: ['Scrolling,','copying,','checking…'], big: 'for hours' },
      solution: { head: ['Noxio collects','orders from','comments','[automatically]'] },
      ai: { head: ['AI understands','orders even','[without product codes]'] },
      connect: { head: ['Connect your','Facebook Page','{or} just paste','a link to the live'] },
      messenger: { head: ['A ready','order list'], sub: '+ messages to buyers in Messenger' },
      offer: { big: '14', l2: 'days', l3: 'free', pills: ['up to 3 lives','no card'] },
      cta: { brand: 'Noxio', tag: 'Orders from lives — automatically', button: 'Try it: noxio.pl', small: '14 days free' }
    }
  }
};
