# Sistema de Gerenciamento de Estoque

![Logistics Cartoon](https://cdn.dribbble.com/users/1138853/screenshots/4834993/06_08_gif.gif)


## Visão Geral
Sistema de Gerenciamento de Estoque desenvolvido para uma empresa gerenciar seu estoque de forma eficiente. O sistema permite aos usuários realizar várias operações relacionadas ao estoque, incluindo rastreamento, atualização e gerenciamento dos itens.

## Funcionalidades
- **Rastreamento de Estoque**: Monitora as quantidades dos itens em estoque.
- **Gerenciamento de Estoque**: Atualiza e gerencia os detalhes do inventário.
- **Interface de Usuário**: Front-end interativo e amigável para fácil operação.
- **Sincronização de Dados**: Garante a consistência e integridade dos dados através de operações transacionais.
- **Filtragem e Ordenação**: Filtra e ordena itens do inventário com base em vários critérios.

## Tecnologias Utilizadas
- **Cliente**: JavaScript, HTML, CSS
- **Servidor**: Node.js, Express.js
- **Banco de Dados**: SQL Server
- **ORM**: Prisma
- **Containerização**: Docker

## Começando

### Pré-requisitos
- Node.js
- Docker
- SQL Server

### Instalação

1. Clone o repositório:
    ```sh
    git clone https://github.com/Gigio42/PiSegundoSem.git
    cd PiSegundoSem
    ```

2. Configure o cliente:
    ```sh
    cd Client
    npm install
    ```

3. Configure o servidor:
    ```sh
    cd ../Server
    npm install
    ```

4. Configure o banco de dados:
    ```sh
    cd ../prisma
    npx prisma migrate dev --name init
    ```

5. Execute os containers Docker:
    ```sh
    docker-compose up
    ```

### Executando a Aplicação

1. Inicie o servidor:
    ```sh
    cd Server
    npm start
    ```

2. Inicie o cliente com Live Server.

3. Acesse a aplicação em `http://localhost:3000`.

## Uso

### Filtragem e Ordenação
- Utilize as opções de filtro para restringir os itens do inventário.
- Clique no botão de ordenação para ordenar os itens de forma ascendente ou descendente com base no critério selecionado.

### Gerenciamento de Estoque
- Adicione novos itens ao inventário.
- Atualize os detalhes dos itens existentes.
- Remova itens do inventário.

## Desenvolvimento

### Contribuindo

1. Faça um fork do repositório.
2. Crie uma nova branch (`git checkout -b feature/SuaFuncionalidade`).
3. Faça suas alterações.
4. Comite suas alterações (`git commit -m 'Adicione uma funcionalidade'`).
5. Faça o push para a branch (`git push origin feature/SuaFuncionalidade`).
6. Abra um pull request.

## Licença
Este projeto está licenciado sob a Licença MIT.
