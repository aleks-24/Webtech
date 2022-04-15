const fs = require("fs")
, spawn = require("child_process").spawn
, child = spawn("sqlite3", ["DFC.db"])

fs.createReadStream("./DFC.db.sql").pipe(child.stdin);