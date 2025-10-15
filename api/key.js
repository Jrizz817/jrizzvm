import { kv } from "@vercel/kv";

const LIST_KEY = "animals:list";

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  if (req.method === "POST") {
    const { mode, key, hwid, temp } = req.body;

    if (!mode || !["add","edit"].includes(mode)) {
      return res.status(400).json({ message: "Modo inválido, use add ou edit" });
    }

    if (mode === "add") {
      if (!key) return res.status(400).json({ message: "Faltando key" });

      // Se hwid ou temp não fornecido, coloca null
      const entry = { key, hwid: hwid ?? null, temp: temp ?? null, ts: Date.now() };
      await kv.rpush(LIST_KEY, JSON.stringify(entry));

      const total = await kv.llen(LIST_KEY);
      return res.status(200).json({ message: "Item adicionado", total });
    }

    if (mode === "edit") {
      if (!key) return res.status(400).json({ message: "Faltando key para editar" });

      const total = await kv.llen(LIST_KEY);
      const items = await kv.lrange(LIST_KEY, 0, total - 1);
      let found = false;

      for (let i = 0; i < items.length; i++) {
        let item;
        try { item = JSON.parse(items[i]); } catch { continue; }

        if (item.key === key) {
          // Se algum campo não especificado, coloca null
          item.hwid = hwid !== undefined ? hwid : null;
          item.temp = temp !== undefined ? temp : null;
          item.ts = Date.now();

          await kv.lset(LIST_KEY, i, JSON.stringify(item));
          found = true;
          break;
        }
      }

      if (!found) return res.status(404).json({ message: "Item não encontrado" });
      return res.status(200).json({ message: "Item editado com sucesso" });
    }
  }

  if (req.method === "GET") {
    const total = await kv.llen(LIST_KEY) || 0;
    if (total === 0) return res.status(200).json({ animals: [] });

    const items = await kv.lrange(LIST_KEY, 0, total - 1);
    const animals = items.map(s => {
      try { return JSON.parse(s); } catch { return s; }
    });

    return res.status(200).json({ animals, total });
  }
}
