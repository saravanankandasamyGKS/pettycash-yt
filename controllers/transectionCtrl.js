const transectionModel = require("../models/transectionModel");
const moment = require("moment");
const getAllTransection = async (req, res) => {
  try {
    const { frequency, selectedDate, type } = req.body;
    const transections = await transectionModel.find({
      ...(frequency !== "custom"
        ? {
            date: {
              $gt: moment().subtract(Number(frequency), "d").toDate(),
            },
          }
        : {
            date: {
              $gte: selectedDate[0],
              $lte: selectedDate[1],
            },
          }),
      userid: req.body.userid,
      ...(type !== "all" && { type }),
    });
    res.status(200).json(transections);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const deleteTransection = async (req, res) => {
  try {
    const deletedTransection = await transectionModel.findByIdAndDelete(req.body.transectionId);
    if (!deletedTransection) {
      return res.status(404).send("Transaction not found");
    }
    res.status(200).send("Transaction Deleted");
  } catch (error) {
    console.error("Error deleting transaction:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const editTransection = async (req, res) => {
  try {
    await transectionModel.findOneAndUpdate(
      { _id: req.body.transectionId },
      req.body.payload
    );
    res.status(200).json({ message: "Edit Successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while editing the transaction" });
  }
};

const addTransection = async (req, res) => {
  try {
    const newTransections = new transectionModel(req.body);
    await newTransections.save();
    res.status(201).send("transection Created");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  getAllTransection,
  addTransection,
  editTransection,
  deleteTransection,
};
