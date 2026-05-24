import { nanoid } from "nanoid";
import notes from "../notes.js";
import InvariantError from "../../../exceptions/invariant-error.js";
import response from "../../../utils/response.js";
import NotFoundError from "../../../exceptions/not-found-error.js";
import NoteRepositories from "../repositories/note-repositories.js";

export const createNote = async (req, res, next) => {
  const { title, body, tags } = req.validated;
  const note = await NoteRepositories.createNote({
    title,
    body,
    tags,
  });

  if (!note) {
    return next(new InvariantError("Catatan gagal ditambahkan"));
  } else {
    return response(res, 201, "Catatan berhasil ditambahkan", {
      noteId: note.id,
    });
  }
};

export const getNotes = async (req, res) => {
  const notes = await NoteRepositories.getNotes();

  return response(res, 200, "success", { notes });
};

export const getNoteById = async (req, res, next) => {
  const { id } = req.params;
  const note = await NoteRepositories.getNoteById(id);

  if (!note) {
    return next(new NotFoundError("Catatan tidak ditemukan"));
  }

  return response(res, 200, "Catatan sukses ditampilkan", { note });
};

export const editNoteById = async (req, res, next) => {
  const { id } = req.params;
  const { title, tags, body } = req.validated;
  const note = await NoteRepositories.editNote({ id, title, tags, body });

  if (!note) {
    return next(
      new NotFoundError("Gagal memperbarui catatan. Id tidak ditemukan"),
    );
  }

  return response(res, 200, "Catatan berhasil diperbarui", note);
};

export const deleteNoteById = async (req, res, next) => {
  const { id } = req.params;
  const deletedNote = await NoteRepositories.deleteNote(id);

  if (!deletedNote) {
    return next(new NotFoundError("Catatan tidak ditemukan"));
  }

  return response(res, 200, "Catatan berhasil dihapus", deletedNote);
};
