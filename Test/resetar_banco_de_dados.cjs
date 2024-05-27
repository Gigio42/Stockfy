// Use esse script se vc quiser resetar o banco de dados inteiro. 

// Como eu faço bastante testes as vezes o banco fica poluido de informações erradas 
// e preciso limpar, mas como é cansativo ficar colocando o nome de cada tabela   
// para deletar toda vez, fiz esse script pra facilitar.

const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('../Server/estoque.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

db.serialize(() => {
  db.run('DELETE FROM Conjugacoes');
  db.run('DELETE FROM Maquina');
  db.run('DELETE FROM Item');
  db.run('DELETE FROM Chapa_item');
  db.run('DELETE FROM Chapas');
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});