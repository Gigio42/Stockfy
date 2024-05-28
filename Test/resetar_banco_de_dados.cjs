const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("../Server/estoque.sqlite", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Destruição do banco de dados em 5 segundos...");

  // Momento dramático até vc cancelar
  let counter = 5;
  let countdown = setInterval(() => {
    counter--;
    if (counter > 1) {
      console.log(`${counter} segundos restantes...`);
    } else if (counter === 1) {
      console.log("1 segundo restante...");
    } else {
      console.log("# Limpando todos os dados...");
      clearInterval(countdown);

      db.serialize(() => {
        db.run("DELETE FROM Conjugacoes");
        db.run("DELETE FROM Chapas");
        db.run("DELETE FROM Chapa_Item");
        db.run("DELETE FROM Item");
        db.run("DELETE FROM Item_Maquina");
        db.run("DELETE FROM Maquina");
        db.run("DELETE FROM Usuarios");

        /* const maquinas = [
          "Corte e vinco",
          "Riscador",
          "Grampeador",
          "Impressora",
          "Rotativa",
          "Coladeira",
          "Serra",
          "Prensa",
          "Corte e vinco plana",
          "Corte e vinco 3",
          "Corte e vinco 4",
          "Corte e vinco 5",
          "Corte e vinco 7",
        ]; */
      });

      db.close((err) => {
        if (err) {
          console.error(err.message);
        }
        console.log(`finalizado, parabéns vc destruiu tudo!`);
      });
    }
  }, 1000);
});
