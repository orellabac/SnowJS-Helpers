snowsql-helpers: Extending Snowflake stored procedures with helpers
===========================================================

Motivation:
----------

Snowflake is a great platform. And using JS for stored procedures is nice I have no complains with that.
However sometimes the current API forces you to do a lot of repetitive work. For example when you are executing a
SQL statement or trying to retrieve results.

The Snowflake stored procedures do not allow you to do any kind of import. So this very simple script implements something like that.

In your stored procedure body you can do:
```javascript
CREATE ....
$$
"@USING_<snippetname>";
$$
```

The tool will map the snipped name to <snippetname>.snippet and replace it.



So you can write your store procedures, then do 
```
snowsql-helpers file.sql outdir
```

and the deploy the modified file.

I hope that helps :)

Installation
==================
`npm install -g snowsql-helpers`

Available snippets
==================

Currently there are only two snippets available:

`EXEC` Snippet
--------------

it allows you to execute queries like:

```javascript
EXEC(`SELECT CURRENT_DATE`);
```

if you want to pass arguments you can use:

```javascript
EXEC(`SELECT Employee where EmpID = ?`,[PARAM1]);
```

To do something like  a select into then you can do:

```javascript
EXEC(`SELECT EmployeeName, Salary where EmpID = ?`,[PARAM1]);
[vEmpName, vSalary] = INTO();
```

or as a one liner:
```javascript
[vEmpName, vSalary] = EXEC(`SELECT Employee where EmpID = ?`,[PARAM1]);
```

This helper has some other nice things like:
it sets a global variable for:
* ROW_COUNT
* ACTIVITY_COUNT
* MESSAGE_TEXT
* SQLCODE
* SQLSTATE

So you can easily do things like:

```javascript 
EXEC(`Delete from Employee where EmpID = ?`,[PARAM1]);
if (ACTIVITY_COUNT) {
    return "employee was deleted";
}
else {
    return "no employees were deleted";
}
```

or 

```javascript 
EXEC(`Select EmployeeName from Employee where EmpID = ?`,[PARAM1]);
if (ROW_COUNT) {
    [vEmpName] = INTO();
    return `employee ${vEmpName} was found`;
}
else {
    return "no employees were deleted";
}
```

`Cursor` SNIPPET
-----------------

A lot of database provide some kind of cursor functionality.

You can for example do something like this:

```sql
DECLARE CURSOR C1 AS SELECT * FROM EMPLOYEE;
```

You can also set parameter for the cursor:

```sql
DECLARE CURSOR C1 AS SELECT * FROM EMPLOYEE where EmpId = :var1;
```

So this snippet allows that too:

```javascript
var C1=new Cursor("SELECT * FROM EMPLOYEE");
var C2=new Cursor("SELECT EmpName From Employee where EmpId = ?",()=>[EmpID]);
//...
EmpID = 100;
//...
C2.OPEN();
[EmpName] = C2.FETCH();

```
