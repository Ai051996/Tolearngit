import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'contacts.json');

app.use(cors());
app.use(express.json());
// Serve the frontend from ../frontend/public
app.use(express.static(path.join(__dirname, '../frontend/public')));

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(DATA_FILE);
  } catch (err) {
    await fs.writeFile(DATA_FILE, JSON.stringify({ contacts: [] }, null, 2));
  }
}

async function readContacts() {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(raw || '{"contacts":[]}');
  return Array.isArray(parsed.contacts) ? parsed.contacts : [];
}

async function writeContacts(contacts) {
  await fs.writeFile(DATA_FILE, JSON.stringify({ contacts }, null, 2));
}

app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await readContacts();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read contacts' });
  }
});

app.post('/api/contacts', async (req, res) => {
  const { name, email, phone } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }
  try {
    const contacts = await readContacts();
    const newContact = {
      id: Date.now().toString(),
      name,
      email,
      phone: phone || ''
    };
    contacts.push(newContact);
    await writeContacts(contacts);
    res.status(201).json(newContact);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save contact' });
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const contacts = await readContacts();
    const next = contacts.filter(c => c.id !== id);
    if (next.length === contacts.length) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    await writeContacts(next);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


