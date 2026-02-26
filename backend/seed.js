// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const Question = require('./model/Question');
// const Admin = require('./model/Admin');
// require('dotenv').config();

// const sampleQuestions = [
//   {
//     question: "What is the capital of France?",
//     correct_answer: "Paris",
//     incorrect_answers: ["London", "Berlin", "Madrid"],
//     category: "Geography",
//     type: "multiple",
//     difficulty: "easy"
//   },
//   {
//     question: "Which planet is known as the Red Planet?",
//     correct_answer: "Mars",
//     incorrect_answers: ["Venus", "Jupiter", "Saturn"],
//     category: "Science: Nature",
//     type: "multiple",
//     difficulty: "easy"
//   },
//   {
//     question: "What does HTML stand for?",
//     correct_answer: "HyperText Markup Language",
//     incorrect_answers: ["HighTech Modem Language", "HyperText Main Language", "Hyperlink Text Markup Language"],
//     category: "Science: Computers",
//     type: "multiple",
//     difficulty: "easy"
//   },
//   {
//     question: "Who painted the Mona Lisa?",
//     correct_answer: "Leonardo da Vinci",
//     incorrect_answers: ["Pablo Picasso", "Vincent van Gogh", "Claude Monet"],
//     category: "Art",
//     type: "multiple",
//     difficulty: "medium"
//   },
//   {
//     question: "What is the largest ocean on Earth?",
//     correct_answer: "Pacific Ocean",
//     incorrect_answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
//     category: "Geography",
//     type: "multiple",
//     difficulty: "easy"
//   },
//   {
//     question: "Which element has the chemical symbol 'O'?",
//     correct_answer: "Oxygen",
//     incorrect_answers: ["Gold", "Silver", "Iron"],
//     category: "Science: Nature",
//     type: "multiple",
//     difficulty: "easy"
//   },
//   {
//     question: "In what year did World War II end?",
//     correct_answer: "1945",
//     incorrect_answers: ["1939", "1944", "1950"],
//     category: "History",
//     type: "multiple",
//     difficulty: "medium"
//   },
//   {
//     question: "Which programming language is predominantly used for Android development?",
//     correct_answer: "Kotlin",
//     incorrect_answers: ["Swift", "C#", "Python"],
//     category: "Science: Computers",
//     type: "multiple",
//     difficulty: "medium"
//   },
//   {
//     question: "What is the name of the Greek god of the sea?",
//     correct_answer: "Poseidon",
//     incorrect_answers: ["Zeus", "Hades", "Apollo"],
//     category: "Mythology",
//     type: "multiple",
//     difficulty: "easy"
//   },
//   {
//     question: "Which country hosted the first Modern Olympic Games in 1896?",
//     correct_answer: "Greece",
//     incorrect_answers: ["France", "USA", "UK"],
//     category: "History",
//     type: "multiple",
//     difficulty: "medium"
//   }
// ];

// const seedDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URL);
//     console.log("Connected to DB for seeding...");
    
//     // Clear existing questions if any
//     await Question.deleteMany({});
//     await Question.insertMany(sampleQuestions);
//     console.log("Questions Seeded successfully!");

//     // Create default admin
//     const adminEmail = "admin@quizmaster.com";
//     const adminExists = await Admin.findOne({ email: adminEmail });
//     if (!adminExists) {
//       const hashedPassword = await bcrypt.hash("adminpassword123", 12);
//       await Admin.create({
//         name: "Admin Master",
//         email: adminEmail,
//         password: hashedPassword,
//         role: "admin"
//       });
//       console.log("Default Admin created: admin@quizmaster.com / adminpassword123");
//     } else {
//       console.log("Admin already exists.");
//     }
    
//     mongoose.connection.close();
//   } catch (error) {
//     console.error("Error seeding database:", error);
//   }
// };

// seedDB();
