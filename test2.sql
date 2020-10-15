CREATE OR REPLACE PROCEDURE PUBLIC.proc1 (P_PARAM1 FLOAT, P_PARAM2 FLOAT)
   RETURNS STRING
   LANGUAGE JAVASCRIPT
   EXECUTE AS CALLER
   AS
   $$
    "@USING_CURSOR";
    var C1 = new CURSOR("SELECT current_date, ?, ?", ()=>[P_PARAM1, P_PARAM2]);
    P_PARAM1 = P_PARAM1 + 10;
    P_PARAM2 = P_PARAM2 + 10;
    C1.OPEN();
    [a,b,c] = C1.FETCH();
    return `${a} - ${b} - ${c}`;
   $$