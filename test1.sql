CREATE OR REPLACE PROCEDURE PUBLIC.proc1 (P_PARAM1 FLOAT, P_PARAM2 FLOAT)
   RETURNS STRING
   LANGUAGE JAVASCRIPT
   EXECUTE AS CALLER
   AS
   $$
    "@USING_EXEC";
    [currdate] = EXEC("SELECT CURRENT_DATE").INTO();
    return `params were ${P_PARAM1} , ${P_PARAM2} and current date ${currdate}`;
   $$