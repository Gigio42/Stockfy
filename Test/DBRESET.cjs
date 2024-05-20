// Use esse script se vc quiser resetar o banco de dados inteiro. 

// Como eu faço bastante testes as vezes o banco fica poluido de informações erradas 
// e preciso limpar, mas como é cansativo ficar colocando o nome de cada tabela   
// para deletar toda vez, fiz esse script pra facilitar.

const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('../Server/estoque.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

db.serialize(() => {
  db.run('DELETE FROM conjugacoes');
  db.run('DELETE FROM maquina');
  db.run('DELETE FROM item_maquinas');
  db.run('DELETE FROM item');
  db.run('DELETE FROM chapa_item');
  db.run('DELETE FROM chapas');
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});