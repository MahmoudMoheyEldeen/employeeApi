require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Create an Express application
const app = express();

// Middleware to handle JSON data and enable CORS
app.use(express.json());
app.use(cors());

// MongoDB connection using environment variable for the URI
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

// Define the Employee Schema
const employeeSchema = new mongoose.Schema({
  id: Number,
  name: String,
  jobTitle: String,
  address: String,
  nationalId: String,
  bankAccountNo: String,
  email: String,
  phone: [String], // Array of phone numbers
  photo: String,
  birthDate: Date,
  hiringDate: Date,
  govern: String,
  religion: String,
  gender: String,
  contract: String, // For storing contract details (file path or details)
  resume: String, // For storing resume details (file path or details)
  militaryStatus: String,
  maritalStatus: String,
  salary: Number,
});

// Create the Employee model from the schema
const Employee = mongoose.model('Employee', employeeSchema, 'employees');

// API Routes

// Root route to handle health check or root URL
app.get('/', (req, res) => {
  res.send('Employee API is running');
});

// GET route to retrieve all employees
app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET route to retrieve a specific employee by ID
app.get('/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findOne({ id: req.params.id });
    if (!employee)
      return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST route to add a new employee
app.post('/employees', async (req, res) => {
  const employee = new Employee({
    id: req.body.id,
    name: req.body.name,
    jobTitle: req.body.jobTitle,
    address: req.body.address,
    nationalId: req.body.nationalId,
    bankAccountNo: req.body.bankAccountNo,
    email: req.body.email,
    phone: req.body.phone,
    photo: req.body.photo,
    birthDate: req.body.birthDate,
    hiringDate: req.body.hiringDate,
    govern: req.body.govern,
    religion: req.body.religion,
    gender: req.body.gender,
    contract: req.body.contract,
    resume: req.body.resume,
    militaryStatus: req.body.militaryStatus,
    maritalStatus: req.body.maritalStatus,
    salary: req.body.salary,
  });

  try {
    const newEmployee = await employee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT route to update an employee's information
app.put('/employees/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedEmployee)
      return res.status(404).json({ message: 'Employee not found' });
    res.json(updatedEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE route to remove an employee by ID
app.delete('/employees/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findOneAndDelete({
      id: req.params.id,
    });
    if (!deletedEmployee)
      return res.status(404).json({ message: 'Employee not found' });
    res.status(204).send(); // No content response
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Set the port dynamically using the environment variable or fallback to 3000
const port = process.env.PORT || 3000;

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
