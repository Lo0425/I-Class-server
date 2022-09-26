const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Class = require("../models/Class");
require("dotenv").config();
const randomstring = require("randomstring");

router.post("/register", async (req, res) => {
  try {
    const classes = new Class(req.body);
    classes.classCode = randomstring.generate({
      length: 6,
      charset: "alphanumeric",
      capitalization: "uppercase",
    });

    // classes.teacherName

    classes.scoreSys.push({
      scoreName: "On Time",
      score: 1,
    });
    classes.scoreSys.push({
      scoreName: "On Task",
      score: 1,
    });
    classes.scoreSys.push({
      scoreName: "Attend Class",
      score: 1,
    });
    classes.scoreSys.push({
      scoreName: "Late",
      score: -1,
    });
    classes.save();
    return res.json({ classes, msg: "Class added successfully" });
  } catch (e) {
    return res.json({ e, msg: "Failed to register" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let classroom = await Class.find({ ownerId: req.params.id });
    if (!classroom)
      return res.json({
        msg: "No classroom found",
      });
    return res.json({
      classroom,
    });
  } catch (e) {
    return res.json({
      e,
      msg: "Cannot get classroom",
    });
  }
});

router.post("/join/:otp", async (req, res) => {
  // return;
  try {
    const { email, name } = req.body;

    let classRoom = await Class.findOne({ classCode: req.params.otp });
    let studentInfo = classRoom.students.find(
      (student) => student.email === email
    );

    if (studentInfo) {
      return res.json({ msg: "You were in the class already", status: 400 });
    } else if (!classRoom) {
      return res.json({
        msg: "No class code found",
      });
    } else {
      classRoom.students.push({
        email: email,
        name: name,
        score: 0,
      });

      await classRoom.save();
      return res.json({ msg: "Class joined successfully", classRoom });
    }
  } catch (e) {
    return res.json({
      e,
      msg: "Failed to join class",
      status: 400,
    });
  }
});

router.get("/find/:email", async (req, res) => {
  try {
    let classroom = await Class.find({ "students.email": req.params.email });
    if (!classroom)
      return res.json({
        msg: "No classroom found",
      });
    return res.json({
      classroom,
    });
  } catch (e) {
    return res.json({
      e,
      msg: "Cannot get classroom",
    });
  }
});

router.post("/add-skill/:classcode", async (req, res) => {
  try {
    const { title, point } = req.body;
    let classRoom = await Class.findOne({
      classCode: req.params.classcode,
    });
    classRoom.scoreSys.push({
      scoreName: title,
      score: point,
    });
    await classRoom.save();
    return res.json({ msg: "Saved successfully", classRoom });
  } catch (e) {
    return res.json({
      e,
      msg: "Failed to add skill",
      status: 400,
    });
  }
});

router.get("/getscoresys/:classcodee", async (req, res) => {
  try {
    let classroom = await Class.findOne({
      classCode: req.params.classcodee,
    });
    if (!classroom)
      return res.json({
        msg: "No classroom found",
      });
    return res.json({
      classroom,
    });
  } catch (e) {
    return res.json({
      e,
      msg: "Cannot get classroom",
    });
  }
});

router.post("/addScore/:score", async (req, res) => {
  try {
    const { email, title, classCode, date, time } = req.body;

    let classRoom = await Class.findOne({
      classCode: classCode,
    });

    for (let i = 0; i < classRoom.students.length; i++) {
      if (classRoom.students[i].email == email) {
        classRoom.students[i].score =
          parseInt(classRoom.students[i].score) + parseInt(req.params.score);

        classRoom.students[i].history.push({
          pointsAdded: req.params.score,
          pointTitle: title,
          date: date,
          time: time,
        });

        let minusPoint = req.params.score * -1;

        await classRoom.save();
        if (req.params.score > 1 || req.params.score < -1) {
          if (req.params.score > 0) {
            return res.json({
              msg:
                req.params.score +
                " points added to " +
                classRoom.students[i].name,
              classRoom,
            });
          } else {
            return res.json({
              msg:
                minusPoint +
                " points deducted from " +
                classRoom.students[i].name,
              classRoom,
            });
          }
        } else {
          if (req.params.score > 0) {
            return res.json({
              msg:
                req.params.score +
                " point added to " +
                classRoom.students[i].name,
              classRoom,
            });
          } else {
            return res.json({
              msg:
                minusPoint +
                " point deducted from " +
                classRoom.students[i].name,
              classRoom,
            });
          }
        }
      }
    }
  } catch (e) {
    return res.json({
      e,
      msg: "Try again",
      status: 400,
    });
  }
});

router.post("/delete-skill/:id", async (req, res) => {
  try {
    const { classCode } = req.body;
    let classRoom = await Class.findOne({
      classCode: classCode,
    });
    for (let i = 0; i < classRoom.scoreSys.length; i++) {
      classRoom.scoreSys.pull({
        _id: req.params.id,
      });
      await classRoom.save();
      return res.json({ msg: "Skill Removed", classRoom });
    }
  } catch (e) {
    return res.json({
      e,
      message: "Unable to delete post",
    });
  }
});

router.post("/getScoreHistory/:classCode", async (req, res) => {
  try {
    const { email } = req.body;
    let classRoom = await Class.findOne({
      classCode: req.params.classCode,
    });

    let history = classRoom.students.find((student) => student.email === email);

    return res.json({ history });
  } catch (e) {
    return res.json({
      e,
      message: "Unable to get student history",
    });
  }
});

module.exports = router;
