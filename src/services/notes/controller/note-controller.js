import { nanoid } from "nanoid";
import notes from "../notes.js";
import InvariantError from "../../../exceptions/invariant-error.js";
import response from "../../../utils/response.js";
import NotFoundError from "../../../exceptions/not-found-error.js";

export const createNote = (req, res, next) => {
  const { title = "untitled", tags, body } = req.body;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const newNote = { title, tags, body, id, createdAt, updatedAt };
  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (!isSuccess) {
    return next(new InvariantError("Catatan gagal ditambahkan"));
  } else {
    return response(res, 201, "Catatan berhasil ditambahkan", { noteId: id });
  }
};

export const getNotes = (req, res) => {
  const { title = '' } = req.query;

  if (title !== '') {
    const note = notes.filter((note) => note.title === title);
    return response(res, 200, "success", { notes: note });
  }

  return response(res, 200, "success", { notes });
};

export const getNoteById = (req, res, next) => {
  const { id } = req.params;
  const note = notes.find((n) => n.id === id);

  if (!note) {
    return next(new NotFoundError("Catatan tidak ditemukan"));
  }

  return response(res, 200, "Catatan sukses ditampilkan", { note });
};

export const editNoteById = (req, res, next) => {
  const { id } = req.params;
  const { title, tags, body } = req.body;
  const updatedAt = new Date().toISOString();
  const index = notes.findIndex((note) => note.id === id);

  if (index === -1) {
    return next(
      new NotFoundError("Gagal memperbarui catatan. Id tidak ditemukan"),
    );
  }

  notes[index] = {
    ...notes[index],
    title,
    tags,
    body,
    updatedAt,
  };

  return response(res, 200, "Catatan berhasil diperbarui", {
    note: notes[index],
  });
};

export const deleteNoteById = (req, res, next) => {
  const { id } = req.params;
  const index = notes.findIndex((note) => note.id === id);

  if (index === -1) {
    return next(new NotFoundError("Catatan gagal dihapus. Id tidak ditemukan"));
  }

  notes.splice(index, 1);
  return response(res, 200, "Catatan berhasil dihapus");
};
