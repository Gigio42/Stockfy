# Sistema de Gerenciamento de Estoque




Para começar, se quiserem fazer alterações nesse documento, existem 2 formas:

Todas elas começam tendo que clonar o repositório para ter na sua maquina:

```
git clone https://github.com/jucalast/PiSegundoSem.git
```
(Lembre-se que quando vcs usarem o shell para clonar, ele vai clonar para onde vc está)


E também sempre que alguém modificar o repositório original (main branch), vamos precisar sincronizar com ele manualmente na nossa máquina por meio de pull:
```
git pull origin main
```

Modificar por branch /pull request (mais seguro e recomendável se vc fez muita coisa)
---
Crie uma branch (Galho) que vai ser uma ramificação sua do projeto original com suas alterações separadas
```
git checkout -b [nome da sua branch]
```
Faça commit pelo vscode mesmo ou pelo terminal que seria:
```
git add .
git commit -m "as alterações q vc fez"
```
Faça um push para o galho que vc criou:
```
git push origin [branch q vc criou]
```
Depois é possível pedir um pull request entre a main e a branch que vc criou no site do github para agnt conseguir analisar e fazer merge.



Modificar direto por push:
---
Faça como usualmente vc faria, depois de ter clonado, se vc estiver pelo vscode, vc clica em commit e depois dá sync ou:
```
git add .
git commit -m "as alterações q vc fez"
git push origin main
```

Comandos para ter em mente
---
Lista as branches do repo
```
git branch
```
Muda vc de uma branch para outra, se colocar -b vc cria e já muda para ela
```
git checkout [branch de sua escolha]
```
Mostra as modificações q tdmundo está fazendo no arquivo original do projeto, (se quiser sair é a tecla 'q')
```
git log origin/main
```
Se quiser saber se houve mudanças na main, pode usar o fetch
```
git fetch origin main
```
Se quiser mesclar sua branch com a main sem passar por um pull request (ñ recomendado), primeiro vc precisa estar na branch q vc criou, depois fazer o merge:
```
git merge origin/main
```