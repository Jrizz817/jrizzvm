// api/animals.js

let currentAnimal = null;

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { Animals } = req.body;

    if (!Animals || !Array.isArray(Animals) || Animals.length === 0) {
      return res.status(400).json({ message: "JSON inválido ou sem 'Animals'" });
    }

    // Armazena apenas o primeiro da lista enviada (descarta o anterior)
    currentAnimal = Animals[0];

    return res.status(200).json({ message: "Animal atualizado", current: currentAnimal });
  }

  if (req.method === "GET") {
    if (!currentAnimal) {
      return res.status(200).json({ animal: null });
    }

    return res.status(200).json({ animal: currentAnimal });
  }

  return res.status(405).json({ message: "Método não permitido" });
}
