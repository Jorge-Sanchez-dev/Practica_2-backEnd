import { Router } from "express";
import { getDb } from "./mongo";
import { ObjectId } from "mongodb";
import { Book } from "./types";


const router = Router();
const coleccion = () => getDb().collection('Books');

//  GET /api/books
router.get('/', async (req, res) => {
  try {
    const books = await coleccion().find().toArray();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: "Error fetching books", error: err });
  }
});

/*
router.post(`/`, async (req, res) => {
  try {
    const newName = req.body?.name;
    const newLastName = req.body?.lastName;
    if (
      newName &&
      newLastName &&
      typeof newName === "string" &&
      typeof newLastName === "string"
    ) {
      const result = await coleccion().insertOne(req.body);
      const idMongo = result.insertedId;
      const personaCreada = await coleccion().findOne({ _id: idMongo });
      res.status(201).json(personaCreada);
    } else {
      res.status(400).json({ message: "Invalid input body" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});
router.post("/", async (req, res) => {
  try {
    const { title, author, pages } = req.body ?? {};

    // Validamos que todos los campos sean del tipo correcto
    if (
      typeof title !== "string" ||
      typeof author !== "string" ||
      typeof pages !== "number"
    ) {
      return res.status(400).json({ message: "Invalid input body" });
    }

    // Creamos timestamps
    const now = new Date();

    // Construimos el nuevo libro con el tipo Book
    const newBook: Book = {
      title,
      author,
      pages,
      createdAt: now,
      updatedAt: now,
    };

    // Lo insertamos en Mongo
    const result = await coleccion().insertOne(newBook);

    // Recuperamos el documento recién creado (para devolverlo completo)
    const created = await coleccion().findOne({ _id: result.insertedId });

    // Devolvemos 201 (Created)
    return res.status(201).json(created);
  } catch (err) {
    return res.status(400).json({ message: "Error creating book", error: err });
  }
});



router.put("/:id", async (req, res) => {
  try {
    const result = await coleccion().updateOne(
      { _id: new ObjectId(req.params?.id) },
      { $set: req.body }
    );
    res.json(result);
  } catch (err) {
    res.status(404).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await coleccion().deleteOne({
      _id: new ObjectId(req.params?.id),
    });
    res.json({ result });
  } catch (err) {
    res.status(404).json(err);
  }
});
*/

export default router;