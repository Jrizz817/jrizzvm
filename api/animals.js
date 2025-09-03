// api/animals.js

let animalsStore = [];
let currentIndex = 0;

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
    const batch = animalsStore.slice(currentIndex, currentIndex + 10);

    // Atualiza índice
    currentIndex += 10;
    if (currentIndex >= animalsStore.length) {
      currentIndex = 0; // reinicia ciclo infinito
    }

    return res.status(200).json({ batch });
  }

  return res.status(405).json({ message: "Método não permitido" });
}
