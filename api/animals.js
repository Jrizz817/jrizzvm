// api/animals.js
let animalsStore = []; // Armazena todos os pets
let index = 0; // Controle de batches

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { Animals } = req.body;

    if (!Animals || !Array.isArray(Animals)) {
      return res.status(400).json({ message: "JSON inválido ou sem 'Animals'" });
    }

    // Adiciona novos animais ao store
    animalsStore.push(...Animals);

    return res.status(200).json({ message: "Animais recebidos", total: animalsStore.length });
  }

  if (req.method === "GET") {
    if (!animalsStore.length) return res.status(200).json({ batch: [] });

    // Pega 10 animais do store
    const batch = animalsStore.slice(0, 10);

    // Remove esses 10 do store
    animalsStore = animalsStore.slice(10);

    return res.status(200).json({ batch });
  }

  return res.status(405).json({ message: "Método não permitido" });
}
