SELECT departments.dept_name AS dept, employees.employee_name 
FROM employees
LEFT JOIN departments
ON employees.department_id = departments.id
ORDER BY employees.employee_name;