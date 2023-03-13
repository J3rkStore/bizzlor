const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
//keeping the prom const her simply for my own future reference so I can learn more about using this
const prom = require("mysql2/promise");

//const PORT = process.env.PORT || 3001;
//const app = express();

//questions for the main prompt:
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

//allows server.js to interact with sql database biz_db
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "shitbot",
    database: "biz_db",
  },
  console.log("connected to biz_db database")
);

//db.query(`source db/schema.sql`);

//SELF JOIN on display with the below function.  This was a struggle.  My eternal gratitude to Senpai Kayvon for helping me figure this one out
//info at https://www.devart.com/dbforge/sql/sqlcomplete/self-join-in-sql-server.html
function showEmployees() {
  db.query(
    `
    SELECT e.id AS Employee_ID, e.first_name, e.last_name, roles.title, roles.salary, e.manager_id, m.first_name AS manager_name, departments.dept_name
    FROM employees e
    LEFT JOIN employees m ON m.id = e.manager_id
    LEFT JOIN roles ON e.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id;
        `,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.table(result);
    }
  );
}

//joins roles and departments tables
function showRoles() {
  db.query(
    `
    SELECT roles.title, roles.id, roles.salary, roles.department_id, departments.dept_name AS department
FROM roles
LEFT JOIN departments
ON roles.department_id = departments.id;
    `,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.table(result);
    }
  );
}

//shows departments
function showDepartments() {
  db.query(`SELECT * FROM departments;`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
  });
}

//adds department to departments table
function addDepartment() {
  const deptPrompt = [
    { type: "input", name: "name", message: "enter department name" },
  ];
  inquirer.prompt(deptPrompt).then((data) => {
    db.query(
      `INSERT INTO departments (dept_name)
    VALUES (?)
    ;`,
      data.name,
      (err, result) => {
        if (err) {
          console.log(err);
        }
        console.table(result);
      }
    );
  });
}

//adds role to roles table
function addRole() {
  const rolePrompt = [
    {
      type: "number",
      name: "deptID",
      message: "enter the dept ID number for the new role",
    },
    {
      type: "input",
      name: "name",
      message: "enter the job title for the new role",
    },
    {
      type: "number",
      name: "salary",
      message: "how much monies?",
    },
  ];
  inquirer.prompt(rolePrompt).then((data) => {
    db.query(
      `
      INSERT INTO roles (department_id, title, salary)
VALUES (${data.deptID}, '${data.name}', ${data.salary});
      `,

      (err, result) => {
        if (err) {
          console.log(err);
        }
        console.table(result);
      }
    );
  });
}

//adds employee to employees table
function addEmployee() {
  const employeePrompt = [
    {
      type: "number",
      name: "roleID",
      message: "enter the role ID number for the new employee",
    },
    {
      type: "input",
      name: "firstName",
      message: "enter their first name",
    },
    {
      type: "input",
      name: "lastName",
      message: "enter their last name",
    },
    {
      type: "number",
      name: "managerID",
      message: "enter the employee ID number for their manager",
    },
  ];
  inquirer.prompt(employeePrompt).then((data) => {
    db.query(
      `
    INSERT INTO employees (role_id, first_name, last_name, manager_id)
VALUES (${data.roleID}, '${data.firstName}', '${data.lastName}', ${data.managerID});
`,

      (err, result) => {
        if (err) {
          console.log(err);
        }
        console.table(result);
      }
    );
  });
}

//changes an employee role
//note to self: find the time to RREEEAAALLY understand async-await and promises
function updateEmployeeRole() {
  db.query(`SELECT * FROM employees;`, (err, result) => {
    if (err) {
      console.log(err);
    }

    //empty array to add employees into with the below for loop
    let employeeList = [];
    for (let i = 0; i < result.length; i++) {
      employeeList.push(result[i].first_name + " - " + result[i].last_name);
    }

    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeSelect",
          message: "select an employee to update",
          choices: employeeList,
        },
        {
          type: "number",
          name: "roleID",
          message:
            "enter the role ID number you would like to assign to the employee",
        },
      ])
      .then((data) => {
        const empFirstLast = data.employeeSelect.split(" - ");

        const empFirst = empFirstLast[0];

        const empLast = empFirstLast[1];

        db.query(`UPDATE employees SET role_id = ${data.roleID}
      WHERE first_name = "${empFirst}" AND last_name = "${empLast}";`);
      });
  });
}

//very handy to finally understand switch cases.  data.main refers to the inquirer prompt in const mainPrompt with name: main
// info at https://www.w3schools.com/js/js_switch.asp
inquirer.prompt(mainprompt).then(function (data) {
  switch (data.main) {
    case "view all departments":
      showDepartments();
      break;
    case "view all roles":
      showRoles();
      break;
    case "view all employees":
      showEmployees();
      break;
    case "add a department":
      addDepartment();
      break;
    case "add a role":
      addRole();
      break;
    case "add an employee":
      addEmployee();
      break;
    case "update an employee role":
      updateEmployeeRole();
      break;
  }
});
