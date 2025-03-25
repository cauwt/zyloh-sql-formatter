import {format} from './sqlFormatter';
import { lineager } from './sqlLineager';
// create 

const sql=`
CREATE TABLE target_table AS
CREATE TABLE target_table AS (
id number(20)
,name nvarchar2(100)
,amount decimal(20,8)
,description clob
,create_date date
,create_time timestamp
) TABLESPACE "FDS_D_TBS";
`;

console.log(format(sql, {  language: 'plsql',
    tabWidth: 2,
    keywordCase: 'upper',
    expressionWidth: 50,
    identifierCase: 'lower',
    linesBetweenQueries: 2, }));

// console.log(lineager(sql, { language: 'plsql' }));
