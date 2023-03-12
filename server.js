const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
const prom = require("mysql2/promise");

//const PORT = process.env.PORT || 3001;
//const app = express();

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

function addEmployees() {
  db.query(
    `
    INSERT INTO employees (department_id, employee_name)
    VALUES (1, "Dave A"),
    (2, 'Dave B'),
    (4, 'Dave C'),
    (3, 'H. Lorenzo St. Magnifico')
    `,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
    }
  );
}

function addDepartments() {
  db.query(
    `
        INSERT INTO departments (dept_name)
VALUES ('Developers'),
('Cleaning'),
('Magic'),
('Accounting');
        `,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
    }
  );
}

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

function showDepartments() {
  db.query(`SELECT * FROM departments;`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
  });
}

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

// function updateEmployeeRole() {
//   db.query(`UPDATE employees SET role_id = 1
//   WHERE first_name ='H. Lorenzo';`);
// }

// function updateEmployeeRole() {
//   db.query(`UPDATE employees SET role_id = 2
//   WHERE first_name ='H. Lorenzo' AND last_name = 'St. Magnifico';`);
// }

// let roleList = [];
// db.query(`SELECT * FROM roles;`, (er, res) => {
//   if (er) {
//     console.log(er);
//   }
//   for (let r = 0; r < res.length; i++) {
//     roleList.push(res[r].id + " - " + res[r].title);
//   }
// });

/////////////////////////////////////////////////////////////////////

function updateEmployeeRole() {
  db.query(`SELECT * FROM employees;`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result[0].first_name);
    let employeeList = [];
    for (let i = 0; i < result.length; i++) {
      console.log(result[i].first_name + " " + result[i].last_name);
      employeeList.push(result[i].first_name + " - " + result[i].last_name);
    }

    console.log(employeeList);
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
        console.log(data.employeeSelect);
        const empFirstLast = data.employeeSelect.split(" - ");
        console.log(empFirstLast);
        const empFirst = empFirstLast[0];
        console.log(empFirst);
        const empLast = empFirstLast[1];
        console.log(empLast);
        db.query(`UPDATE employees SET role_id = ${data.roleID}
      WHERE first_name = "${empFirst}" AND last_name = "${empLast}";`);
      });
  });
}

// function updateEmployeeRole() {
//   db.query(
//     `
//   SELECT e.id AS Employee_ID, e.first_name, e.last_name, roles.title, e.role_id, e.manager_id, m.first_name AS manager_name, departments.dept_name
//   FROM employees e
//   LEFT JOIN employees m ON m.id = e.manager_id
//   LEFT JOIN roles ON e.role_id = roles.id
//   LEFT JOIN departments ON roles.department_id = departments.id;
//   `,
//     (err, result) => {
//       if (err) {
//         console.log(err);
//       }
//       console.log(result[0].first_name);
//       let employeeList = [];
//       //let roleList = [];
//       for (let i = 0; i < result.length; i++) {
//         console.log(result[i].first_name + " " + result[i].last_name);
//         employeeList.push(result[i].first_name + " - " + result[i].last_name);
//         //roleList.push(result[i].role_ID + " - " + result[i].title);
//       }

//       console.log(employeeList);
//       inquirer
//         .prompt([
//           {
//             type: "list",
//             name: "employeeSelect",
//             message: "select an employee to update",
//             choices: employeeList,
//           },
//           // {
//           //   type: "list",
//           //   name: "roleSelect",
//           //   message: "select a role for the employee",
//           //   choices: roleList,
//           // },
//           {}
//         ])
//         .then((data) => {
//           const empFirstLast = data.employeeSelect.split(" - ");
//           const empFirst = empFirstLast[0];
//           const empLast = empFirstLast[1];
//           const roleData = data.roleSelect.split(" - ");
//           const roleDID = roleData[0];
//           const roleTitle = roleData[1];
//           db.query(`UPDATE employees SET role_id = ${roleDID}
//       WHERE first_name = "${empFirst}" AND last_name = "${empLast}";`);
//         });
//     }
//   );
// }

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
