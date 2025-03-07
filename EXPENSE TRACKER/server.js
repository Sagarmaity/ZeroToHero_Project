const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/expense", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const ExpenseSchema = new mongoose.Schema({
    name: String,
    amount: Number,
    category: String,
    date: String
});

const Expense = mongoose.model("Expense", ExpenseSchema);

// Routes

// Get all expenses
app.get("/expenses", async (req, res) => {
    const expenses = await Expense.find();
    res.json(expenses);
});

// Add a new expense
app.post("/expenses", async (req, res) => {
    const { name, amount, category, date } = req.body;
    const newExpense = new Expense({ name, amount, category, date });
    await newExpense.save();
    res.json(newExpense);
});

// Delete an expense
app.delete("/expenses/:id", async (req, res) => {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
});

// Update an expense
app.put("/expenses/:id", async (req, res) => {
    const { name, amount, category, date } = req.body;
    const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, { name, amount, category, date }, { new: true });
    res.json(updatedExpense);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
