var sqlite3 = require('sqlite3').verbose();

/* db.serialize(function() {
  db.run("CREATE TABLE lorem (info TEXT)");

  var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
  }
  stmt.finalize();


}); */

getUsers()

function getUsers(){
    var db = new sqlite3.Database('DFC.db');
    db.each("SELECT UserID, Username AS id, username FROM User", function(err, row) {
        console.log(row.id + ": " + row.username);
    });
    db.close();
}