const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
  class: {
    type: String,
  },
  students: [
    {
      email: { type: String },
      name: { type: String },
      score: { type: Number },
      history: [
        {
          pointsAdded: { type: Number },
          pointTitle: { type: String },
          date: { type: String },
          time: { type: String },
        },
      ],
    },
  ],
  classCode: {
    type: String,
  },
  scoreSys: [
    {
      scoreIcon: { type: String },
      scoreName: { type: String },
      score: { type: Number },
    },
  ],
  ownerId: {
    type: String,
  },
  teacherName: {
    type: String,
  },
});

module.exports = mongoose.model("class", ClassSchema);
