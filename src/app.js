const express = require("express");
const dbConnection = require("./db/db");
const dotenv = require("dotenv");
const Notes = require("./models/note.model");

const app = express();
dotenv.config();
dbConnection();

app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const payload = req.body;

    const save = await Notes.create(payload);

    res.status(200).json({
      message: "data saved in notes",
      data: save,
    });
  } catch (error) {
    console.log(error);
    res.status(300).json({
      Message: error,
    });
  }
});

app.get("/", async (req, res) => {
  try {
    let notes = await Notes.find();
    console.log(notes);
    res.status(200).json({
      data: notes,
    });
  } catch (error) {
    console.log(error);
    res.status(300).json({
      message: error,
    });
  }
});

app.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body;

    const note = await Notes.findOne({ _id: id });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    if (payload.title !== undefined) {
      note.title = payload.title;
    }

    if (payload.content !== undefined) {
      note.content = payload.content;
    }

    await note.save();

    res.status(200).json({
      message: "Data updated successfully",
      data: note,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating data",
      error: error.message,
    });
  }
});

app.delete("/:id", async(req, res) => {
    try {
        let { id } = req.params;
        let note = await Notes.deleteOne({_id : id})
        res.status(204).json({
          message: "Note deleted successfully",
          note
        });
    } catch (error) {
        console.log(error);
    }
});

module.exports = app;
