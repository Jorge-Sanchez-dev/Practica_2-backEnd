import { Router } from "express";
import { getDb } from "./mongo";
import { ObjectId } from "mongodb";
import { Book } from "./types";

const router = Router();
const coleccion = () => getDb().collection("Books");

//  GET /api/books
router.get("/", async (req, res) => {
  try {
    const books = await coleccion().find().toArray();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: "Internal server erro", error: err });
  }
});

// POST /api/books
router.post("/", async (req, res) => {
  try {
    const { title, author, pages } = req.body ?? {};

    if (
      typeof title !== "string" ||
      typeof author !== "string" ||
      typeof pages !== "number"
    ) {
      return res.status(400).json({ message: "Invalid JSON body" });
    }

    if (pages <= 0) {
      return res
        .status(400)
        .json({ message: "El numero de páginas tiene que ser positivoc" });
    }

    const now = new Date();
    const newBook: Book = {
      title,
      author,
      pages,
      createdAt: now,
      updatedAt: now,
    };

    const result = await coleccion().insertOne(newBook);
    const created = await coleccion().findOne({ _id: result.insertedId });

    return res.status(201).json(created);
  } catch (err) {
    return res.status(400).json({ message: "Error crear libro", error: err });
  }
});

//PUT /api/books/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const libroActualizado: {
      title?: string;
      author?: string;
      pages?: number;
    } = {};
    const { title, author, pages } = req.body ?? {};

    if (title !== undefined) {
      if (typeof title !== "string") {
        return res
          .status(400)
          .json({ message: "El titulo debe de ser un string" });
      }
      libroActualizado.title = title;
    }

    if (author !== undefined) {
      if (typeof author !== "string") {
        return res.status(400).json({ message: "El autor debe ser un string" });
      }
      libroActualizado.author = author;
    }

    if (pages !== undefined) {
      if (typeof pages !== "number" || !Number.isFinite(pages)) {
        return res
          .status(400)
          .json({ message: "Las paginas deben de ser un numero" });
      }
      if (pages < 0) {
        return res
          .status(400)
          .json({ message: "El numero de páginas tiene que ser positivo" });
      }
      libroActualizado.pages = pages;
    }

    const now = new Date();

    const result = await coleccion().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...libroActualizado, updatedAt: now } }
    );

    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ message: "Error updating book", error: err });
  }
});

// DELETE /api/books/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await coleccion().deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Libro con ese id no existe" });
    }

    return res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Error al eliminar el libro", error: err });
  }
});

export default router;
