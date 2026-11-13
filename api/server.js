import express from 'express';
import { randomBytes, randomUUID } from 'node:crypto';
import { readFileSync, writeFileSync, renameSync } from 'node:fs';

const file = new URL('./data/data.json', import.meta.url);
const temporaryFile = new URL('./data/data.json.tmp', import.meta.url);
let data;
try {
  data = JSON.parse(readFileSync(file, 'utf8'));
  for (const key of ['users', 'properties', 'bookings']) {
    if (!Array.isArray(data[key])) throw new Error(`Hiányzó lista: ${key}`);
  }
} catch (error) {
  console.error('Nem olvashatók az adatok. Futtasd az npm run seed parancsot!', error.message);
  process.exit(1);
}

// Egyetlen fájl és szinkron, atomikus csere: a kapcsolódó törlések együtt mentődnek.
function save(next) {
  writeFileSync(temporaryFile, JSON.stringify(next, null, 2) + '\n');
  renameSync(temporaryFile, file);
  data = next;
}

const app = express();
const tokens = new Set();
const categories = ['Hotel', 'Pension', 'Apartment', 'Guesthouse'];
const statuses = ['Pending', 'Confirmed', 'Cancelled'];
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.set('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
app.use(express.json({ limit: '100kb' }));

app.post('/auth/login', (req, res) => {
  const { username, password } = req.body ?? {};
  const user = data.users.find(user => typeof username === 'string'
    && user.username.toLowerCase() === username.toLowerCase() && user.password === password);
  if (!user) return res.status(401).json({ message: 'Helytelen felhasználónév vagy jelszó.' });
  let token;
  do { token = randomBytes(8).toString('hex'); } while (tokens.has(token));
  tokens.add(token);
  res.json({ token });
});

app.use((req, res, next) => {
  const match = /^bearer ([a-f0-9]{16})$/i.exec(req.get('Authorization') ?? '');
  if (!match || !tokens.has(match[1])) {
    return res.status(401).json({ message: 'Hiányzó vagy érvénytelen token.' });
  }
  next();
});

function propertyBody(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  for (const key of ['name', 'location', 'address']) {
    if (typeof body[key] !== 'string' || !body[key].trim()) return null;
  }
  if (!categories.includes(body.category)) return null;
  for (const key of ['description', 'imageUrl']) {
    if (body[key] !== undefined && typeof body[key] !== 'string') return null;
  }
  const roomPrices = {};
  for (const type of ['Standard', 'Superior', 'Family']) {
    const price = body.roomPrices?.[type];
    if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) return null;
    roomPrices[type] = price;
  }
  return {
    name: body.name.trim(), location: body.location.trim(), address: body.address.trim(),
    category: body.category, description: body.description ?? '', imageUrl: body.imageUrl ?? '',
    roomPrices,
  };
}

app.get('/properties', (req, res) => {
  const name = typeof req.query.name === 'string' ? req.query.name.toLocaleLowerCase('hu') : '';
  res.json(data.properties
    .filter(p => p.name.toLocaleLowerCase('hu').includes(name)
      && (!req.query.category || p.category === req.query.category))
    .map(({ id, imageUrl, name, location, category }) => ({ id, imageUrl, name, location, category })));
});

app.post('/properties', (req, res) => {
  const body = propertyBody(req.body);
  if (!body) return res.status(400).json({ message: 'Hibás vagy hiányzó szálláshelyadatok. Minden szobaára kötelező, és nemnegatív szám legyen.' });
  const property = { id: randomUUID(), ...body };
  save({ ...data, properties: [...data.properties, property] });
  res.status(200).json(property);
});

app.param('propertyId', (req, res, next, id) => {
  req.property = data.properties.find(p => p.id === id);
  if (!req.property) return res.status(404).json({ message: 'A szálláshely nem található.' });
  next();
});

app.get('/properties/:propertyId', (req, res) => res.json(req.property));
app.put('/properties/:propertyId', (req, res) => {
  const body = propertyBody(req.body);
  if (!body) return res.status(400).json({ message: 'Hibás vagy hiányzó szálláshelyadatok. Minden szobaára kötelező, és nemnegatív szám legyen.' });
  const property = { id: req.property.id, ...body };
  save({ ...data, properties: data.properties.map(p => p.id === property.id ? property : p) });
  res.json(property);
});
app.delete('/properties/:propertyId', (req, res) => {
  const id = req.property.id;
  save({ ...data, properties: data.properties.filter(p => p.id !== id),
    bookings: data.bookings.filter(b => b.propertyId !== id) });
  res.status(204).end();
});

function bookingView(booking) {
  const { id, guestName, start, end } = booking;
  return { id, guestName, propertyName: data.properties.find(p => p.id === booking.propertyId).name, start, end };
}

app.get('/bookings', (req, res) => {
  if (req.query.status && !statuses.includes(req.query.status)) {
    return res.status(400).json({ message: 'Ismeretlen foglalási státusz.' });
  }
  res.json(data.bookings.filter(b => !req.query.status || b.status === req.query.status)
    .map(b => ({ ...bookingView(b), status: b.status })));
});

for (const [action, status] of [['confirm', 'Confirmed'], ['cancel', 'Cancelled']]) {
  app.post(`/bookings/:id/${action}`, (req, res) => {
    const booking = data.bookings.find(b => b.id === req.params.id);
    if (!booking) return res.status(404).json({ message: 'A foglalás nem található.' });
    // Az ismételt kérés sikeres; lemondott foglalást nem lehet újra megerősíteni.
    if (action === 'confirm' && booking.status === 'Cancelled') {
      return res.status(400).json({ message: 'Lemondott foglalás nem igazolható vissza.' });
    }
    save({ ...data, bookings: data.bookings.map(b => b.id === booking.id ? { ...b, status } : b) });
    res.status(204).end();
  });
}

const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Budapest', year: 'numeric', month: '2-digit', day: '2-digit',
});
function dateKey(value) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parts = Object.fromEntries(dateFormatter.formatToParts(new Date(value)).map(p => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

app.get('/properties/:propertyId/overview', (req, res) => {
  const property = req.property;
  const bookings = data.bookings.filter(b => b.propertyId === property.id);
  const active = bookings.filter(b => b.status !== 'Cancelled');
  const today = dateKey(new Date());
  const until = new Date(`${today}T12:00:00Z`);
  until.setUTCDate(until.getUTCDate() + 2);
  const lastDay = until.toISOString().slice(0, 10);
  res.json({
    today: {
      booked: bookings.filter(b => dateKey(b.createdAt) === today).length,
      checkIns: active.filter(b => dateKey(b.start) === today).length,
      checkOuts: active.filter(b => dateKey(b.end) === today).length,
    },
    recentBookings: [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4).map(bookingView),
    upcomingCheckIns: active.filter(b => dateKey(b.start) >= today && dateKey(b.start) <= lastDay)
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .map(b => ({ imageUrl: property.imageUrl, guestName: b.guestName, propertyName: property.name, date: b.start })),
  });
});

app.use((req, res) => res.status(404).json({ message: 'Ismeretlen végpont.' }));
app.use((error, req, res, next) => {
  if (error.type === 'entity.parse.failed') return res.status(400).json({ message: 'Érvénytelen JSON.' });
  if (error.type === 'entity.too.large') return res.status(413).json({ message: 'Túl nagy kérés.' });
  console.error(error);
  res.status(500).json({ message: 'Belső szerverhiba; a művelet nem sikerült.' });
});

const port = process.env.PORT || 3000;
const server = app.listen(port);
server.on('listening', () => console.log(`StayAdmin API: http://localhost:${port}`));
server.on('error', error => {
  console.error('A szerver nem indítható:', error.message);
  process.exit(1);
});
