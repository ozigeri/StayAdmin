# StayAdmin API

Minimalista Node.js + Express API a StayAdmin feladatleírás végpontjaival. Adatbázis és TypeScript nélkül, egyetlen Express függőséggel. Node.js 22 vagy újabb szükséges.

## Indítás

```sh
npm install
npm run seed
npm start
```

Alapcím: `http://localhost:3000`. Más port: `PORT=3001 npm start`.
Fejlesztéskor az `npm run dev` automatikusan újraindítja a szervert a kód változásakor.
A CORS engedélyezett, így például a `http://localhost:4200` címen futó Angular alkalmazás közvetlenül használhatja.

## Adatok és visszaállítás

- `seed/data.json`: az eredeti adatok; 1 felhasználó, 12 szálláshely, 60 foglalás. A képek picsum URL-ek.
- `data/data.json`: az API futásidejű adattára, amelyet az `npm run seed` másol be. A felhasználók, szálláshelyek és foglalások külön tömbök ugyanebben a JSON-fájlban.
- A módosítások azonnal fájlba kerülnek, és újraindítás után is megmaradnak. A seed forrása változatlan marad. A fájl cseréje atomikus; egy szálláshely és foglalásainak törlése egyetlen mentés.
- Visszaállítás: állítsd le a szervert, futtasd az `npm run seed` parancsot, majd indítsd újra. Ez felülírja a futásidejű adatokat.
- A seed dátumai 2026. november 13. köré rendezettek: múltbeli, aznapi és közelgő foglalásokkal. A másolás nem tolja el a dátumokat; később a napi statisztikák természetesen változnak.
- Egyetlen szerverfolyamat használja az adattárat. Futás közben ne szerkeszd kézzel a JSON-t: az API memóriában is tartja az adatokat.

## Bejelentkezés

```sh
curl -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"Admin","password":"1234"}'
```

Válasz: `{"token":"<16 karakter>"}`. A felhasználónév kis- és nagybetűtől független, a jelszó stringként küldendő. A token kriptográfiailag véletlen, 16 hexadecimális karakter, és csak a szerver memóriájában él. Szerverújraindításkor érvénytelenné válik, böngészőfrissítéskor nem. A frontend tárolja és kijelentkezéskor törölje.

A többi végpont fejléce: `Authorization: bearer <token>`. A `Bearer` írásmód is elfogadott. Hiányzó vagy hibás token esetén `401` a válasz. A böngészős CORS-előkérés (`OPTIONS`) nem kér tokent.

## Végpontok

| Metódus | Útvonal | Eredmény |
| --- | --- | --- |
| POST | `/auth/login` | `200`: token; hibás adatok: `401` |
| GET | `/properties` | `200`: lista; opcionális `name` részleges, kis- és nagybetűtől független keresés és `category` pontos szűrés |
| GET | `/properties/:id` | `200`: teljes szálláshely; hiányzó: `404` |
| POST | `/properties` | `200`: létrehozott szálláshely; hibás törzs: `400` |
| PUT | `/properties/:id` | `200`: módosított szálláshely; hibás törzs: `400`, hiányzó: `404` |
| DELETE | `/properties/:id` | `204`: szálláshely és összes kapcsolódó foglalás törölve; hiányzó: `404` |
| GET | `/bookings` | `200`: foglalások a szálláshely nevével; opcionális `status` szűrés, ismeretlen státusz: `400` |
| POST | `/bookings/:id/confirm` | `204`: visszaigazolva; hiányzó: `404`; lemondott foglalás: `400` |
| POST | `/bookings/:id/cancel` | `204`: lemondva; hiányzó: `404` |
| GET | `/properties/:id/overview` | `200`: áttekintés; hiányzó szálláshely: `404` |

A létrehozás és módosítás teljes törzse (PUT esetén is minden kötelező mező szükséges):

```json
{
  "name": "Lebegő Lángos Grand Hotel",
  "location": "Eger",
  "address": "Felhő utca 42.",
  "category": "Hotel",
  "description": "A reggeli az ablakhoz repül.",
  "imageUrl": "https://picsum.photos/seed/langos/800/600",
  "roomPrices": { "Standard": 12000, "Superior": 18000, "Family": 24000 }
}
```

Kötelező: nem üres `name`, `location`, `address`, érvényes `category`, illetve mindhárom véges, nemnegatív numerikus szobaár. A `description` és `imageUrl` elhagyható, alapértékük üres string. Az azonosítót a szerver generálja.

Kategóriák: `Hotel`, `Pension`, `Apartment`, `Guesthouse`.
Státuszok: `Pending`, `Confirmed`, `Cancelled`. Az „Összes” szűréshez hagyd el a `status` paramétert. Az ismételt visszaigazolás vagy lemondás sikeres; lemondott foglalás nem igazolható vissza.

A szálláshelylista elemei: `id`, `imageUrl`, `name`, `location`, `category`. A részletezés ezen felül `description`, `address`, `roomPrices` mezőket ad vissza.
A foglaláslista elemei: `id`, `guestName`, `propertyName`, `start`, `end`, `status`.
A foglalási összesítő a szűretlen `/bookings` listából számolható. Külön foglaláslétrehozó végpontot a PDF nem határoz meg; a foglalások a seedből érkeznek.

### Áttekintés

A `/properties/:id/overview` a PDF szerinti `today`, `recentBookings`, `upcomingCheckIns` mezőket adja vissza:

- `today.booked`: a ma létrehozott foglalások száma, státusztól függetlenül.
- `today.checkIns` és `today.checkOuts`: a mai érkezések és távozások, lemondott foglalások nélkül.
- `recentBookings`: legfeljebb 4 foglalás, `createdAt` szerint csökkenő sorrendben; mezők: `id`, `guestName`, `propertyName`, `start`, `end`.
- `upcomingCheckIns`: a mai naptól a két nappal későbbi nap végéig érkező, nem lemondott foglalások, érkezés szerint növekvően; mezők: `imageUrl`, `guestName`, `propertyName`, `date`.

A naphatárok `Europe/Budapest` időzóna szerint értendők. A dátumok JSON-stringek; a seed érkezési/távozási dátumai `YYYY-MM-DD`, a létrehozási időpontok ISO 8601 formátumúak.

A hibaválaszok formátuma: `{"message":"Hiba leírása"}`. Hibás JSON: `400`, túl nagy törzs: `413`, ismeretlen útvonal: `404`, belső vagy írási hiba: `500`. A `204` válaszoknak nincs törzsük.

Tesztek és tesztfüggőségek nincsenek a projektben.
