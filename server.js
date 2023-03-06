const inquirer = require("inquirer");
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;
const app = express();

const mainprompt = [
  {
    type: "list",
    name: "main",
    message: "what would you like to do?",
    choices: [
      "view all departments",
      "view all roles",
      "view all employees",
      "add a department",
      "add a role",
      "add an employee",
      "update an employee role",
    ],
  },
];

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "shitbot",
  database: "biz_db",
});
