API de Gerenciamento de Veículos

API REST para cadastrar, consultar, atualizar e remover veículos (CRUD), desenvolvida com Node.js, Express e Knex, usando um banco PostgreSQL hospedado no Neon.

Disciplina: Programação cliente/servidor

Tecnologias
Tecnologia	Finalidade
Node.js	Ambiente de execução do servidor
Express	Rotas e servidor HTTP
Knex	Query builder para acesso ao banco
PostgreSQL (Neon)	Banco de dados relacional
pg	Driver do PostgreSQL
dotenv	Variáveis de ambiente
cors	Liberação de acesso de outras origens
Estrutura do projeto
api-veiculos/
├── src/
│   ├── server.js       # Inicia o Express, cors, express.json e a porta
│   ├── routes.js       # Define as rotas de /veiculos
│   ├── controller.js   # Recebe a requisição, valida e responde
│   ├── repository.js   # Acesso a dados (todas as consultas do Knex)
│   └── db.js           # Conexão do Knex com o PostgreSQL
├── .env                # Variáveis de ambiente (NÃO vai para o GitHub)
├── .env.example        # Modelo do .env, sem dados sensíveis
├── .gitignore
├── package.json
├── README.md
└── TESTES.md           # Documentação dos testes
Pré-requisitos
Node.js 18.11 ou mais recente (o script dev usa node --watch)
Um banco PostgreSQL com a tabela veiculos criada (veja abaixo)
Como executar
Instale as dependências:
bash
   npm install
Crie o arquivo .env na raiz do projeto, copiando o modelo:
bash
   cp .env.example .env

No Windows (PowerShell): copy .env.example .env 3. Edite o .env e coloque a string de conexão real em DATABASE_URL. A URL deve ficar em uma única linha:

   DATABASE_URL='postgresql://USUARIO:SENHA@HOST/banco?sslmode=require'
   PORT=3000
Inicie o servidor:
bash
   npm run dev     # desenvolvimento (reinicia ao salvar arquivos)
   npm start       # execução normal
O terminal deve mostrar Servidor rodando na porta 3000.
Scripts
Script	Comando	Descrição
npm start	node src/server.js	Inicia o servidor
npm run dev	node --watch src/server.js	Inicia com reinício automático
Variáveis de ambiente
Variável	Descrição	Padrão
DATABASE_URL	String de conexão com o PostgreSQL	(obrigatória)
PORT	Porta do servidor	3000

O arquivo .env contém credenciais e está no .gitignore. Nunca envie esse arquivo ao GitHub.

Banco de dados

Tabela veiculos:

Coluna	Tipo	Restrições
id	SERIAL	PRIMARY KEY
modelo	VARCHAR(100)	NOT NULL
tipo_propulsao	tipo_propulsao_enum	NOT NULL
ano_modelo	SMALLINT	NOT NULL
autonomia_km	INT	Opcional
capacidade_bateria_kwh	DECIMAL(6,2)	Opcional
preco_base	DECIMAL(10,2)	NOT NULL
status_producao	status_producao_enum	NOT NULL, DEFAULT 'em_producao'

Script de criação (caso a tabela ainda não exista):

sql
CREATE TYPE tipo_propulsao_enum AS ENUM ('eletrico', 'hibrido', 'combustao');
CREATE TYPE status_producao_enum AS ENUM ('em_producao', 'planejado', 'descontinuado');

CREATE TABLE veiculos (
  id SERIAL PRIMARY KEY,
  modelo VARCHAR(100) NOT NULL,
  tipo_propulsao tipo_propulsao_enum NOT NULL,
  ano_modelo SMALLINT NOT NULL,
  autonomia_km INT,
  capacidade_bateria_kwh DECIMAL(6,2),
  preco_base DECIMAL(10,2) NOT NULL,
  status_producao status_producao_enum NOT NULL DEFAULT 'em_producao'
);

Os valores dos enums acima são exemplos. Para ver os valores aceitos no seu banco:

sql
SELECT unnest(enum_range(NULL::tipo_propulsao_enum));
SELECT unnest(enum_range(NULL::status_producao_enum));
Endpoints

URL base: http://localhost:3000

Método	Rota	Descrição	Sucesso	Erros
GET	/veiculos	Lista todos os veículos	200	500
GET	/veiculos/:id	Busca um veículo pelo id	200	400, 404
POST	/veiculos	Cadastra um veículo	201	400
PUT	/veiculos/:id	Atualiza um veículo	200	400, 404
DELETE	/veiculos/:id	Remove um veículo	204	400, 404
Corpo da requisição (POST e PUT)
json
{
  "modelo": "Modelo Exemplo",
  "tipo_propulsao": "eletrico",
  "ano_modelo": 2026,
  "autonomia_km": 450,
  "capacidade_bateria_kwh": 75.50,
  "preco_base": 189900.00,
  "status_producao": "em_producao"
}
No POST, os campos modelo, tipo_propulsao, ano_modelo e preco_base são obrigatórios.
Se status_producao não for enviado, o banco usa em_producao.
No PUT, envie apenas os campos que deseja alterar (pelo menos um).
Campos fora da lista acima são ignorados.
Exemplo de resposta (POST, status 201)
json
{
  "id": 11,
  "modelo": "Modelo Exemplo",
  "tipo_propulsao": "eletrico",
  "ano_modelo": 2026,
  "autonomia_km": 450,
  "capacidade_bateria_kwh": "75.50",
  "preco_base": "189900.00",
  "status_producao": "em_producao"
}

Os campos DECIMAL (preco_base e capacidade_bateria_kwh) são devolvidos como texto, que é o comportamento padrão do driver pg para não perder precisão.

Respostas de erro

Os erros retornam um JSON com a mensagem:

json
{ "erro": "Veículo não encontrado" }
Status	Quando acontece
400	Id inválido, campo obrigatório ausente, valor de enum inválido ou PUT sem campos
404	Nenhum veículo com o id informado
500	Erro interno ou falha de conexão com o banco
Testes

Os testes manuais, feitos com a extensão Thunder Client do VS Code, estão documentados em TESTES.md.

Problemas comuns
Mensagem	Causa provável	Solução
getaddrinfo ENOTFOUND ...	DATABASE_URL mal formada ou sem internet	Confira se a URL está em uma linha só e correta
relation "veiculos" does not exist	A tabela não existe no banco conectado	Crie a tabela ou use a DATABASE_URL do banco certo
invalid input value for 


Testes


Documentação dos Testes

Testes manuais da API de Veículos, realizados com a extensão Thunder Client do VS Code.

Ambiente
Item	Valor
URL base	http://localhost:3000
Servidor	npm run dev
Banco	PostgreSQL no Neon (banco banco, tabela veiculos)
Ferramenta	Thunder Client (VS Code)
Como executar cada teste
Deixe o servidor rodando (npm run dev).
No Thunder Client, clique em New Request.
Escolha o método e cole a URL.
Nas requisições com corpo, abra a aba Body, selecione JSON e cole o conteúdo.
Clique em Send e compare o status e a resposta com o esperado.
Parte 1: Testes de sucesso
T01: Listar todos os veículos
Item	Detalhe
Método e URL	GET http://localhost:3000/veiculos
Body	Nenhum
Status esperado	200
Resposta esperada	Array JSON com os veículos (array vazio [] se não houver nenhum)
T02: Cadastrar veículo (sem informar status_producao)
Item	Detalhe
Método e URL	POST http://localhost:3000/veiculos
Status esperado	201

Body:

json
{
  "modelo": "Veiculo Teste",
  "tipo_propulsao": "eletrico",
  "ano_modelo": 2026,
  "autonomia_km": 450,
  "capacidade_bateria_kwh": 75.50,
  "preco_base": 189900.00
}

Resposta esperada: o veículo criado, com id gerado e status_producao igual a "em_producao" (valor padrão). Anote o id retornado, pois ele é usado nos testes seguintes (ID_NOVO).

T03: Cadastrar veículo informando status_producao
Item	Detalhe
Método e URL	POST http://localhost:3000/veiculos
Status esperado	201

Body:

json
{
  "modelo": "Veiculo Teste 2",
  "tipo_propulsao": "hibrido",
  "ano_modelo": 2025,
  "preco_base": 120000.00,
  "status_producao": "em_producao"
}

Resposta esperada: veículo criado com autonomia_km e capacidade_bateria_kwh iguais a null (campos opcionais) e o status_producao informado.

T04: Buscar veículo por id
Item	Detalhe
Método e URL	GET http://localhost:3000/veiculos/ID_NOVO
Body	Nenhum
Status esperado	200
Resposta esperada	Objeto do veículo com o id informado
T05: Atualizar veículo
Item	Detalhe
Método e URL	PUT http://localhost:3000/veiculos/ID_NOVO
Status esperado	200

Body:

json
{
  "preco_base": 179900.00,
  "autonomia_km": 480
}

Resposta esperada: o registro completo já com preco_base e autonomia_km atualizados. Os demais campos permanecem iguais.

T06: Remover veículo
Item	Detalhe
Método e URL	DELETE http://localhost:3000/veiculos/ID_NOVO
Body	Nenhum
Status esperado	204
Resposta esperada	Corpo vazio
T07: Confirmar a remoção
Item	Detalhe
Método e URL	GET http://localhost:3000/veiculos/ID_NOVO
Status esperado	404
Resposta esperada	{ "erro": "Veículo não encontrado" }
Parte 2: Testes de erro
T08: Buscar id inexistente
Item	Detalhe
Método e URL	GET http://localhost:3000/veiculos/99999
Status esperado	404
Resposta esperada	{ "erro": "Veículo não encontrado" }
T09: Atualizar id inexistente
Item	Detalhe
Método e URL	PUT http://localhost:3000/veiculos/99999
Body	{ "preco_base": 100000 }
Status esperado	404
Resposta esperada	{ "erro": "Veículo não encontrado" }
T10: Remover id inexistente
Item	Detalhe
Método e URL	DELETE http://localhost:3000/veiculos/99999
Status esperado	404
Resposta esperada	{ "erro": "Veículo não encontrado" }
T11: Id inválido
Item	Detalhe
Método e URL	GET http://localhost:3000/veiculos/abc
Status esperado	400
Resposta esperada	{ "erro": "Id inválido" }
T12: Cadastro sem campos obrigatórios
Item	Detalhe
Método e URL	POST http://localhost:3000/veiculos
Body	{ "modelo": "X" }
Status esperado	400
Resposta esperada	{ "erro": "Campos obrigatórios: tipo_propulsao, ano_modelo, preco_base" }
T13: Cadastro com valor de enum inválido
Item	Detalhe
Método e URL	POST http://localhost:3000/veiculos
Status esperado	400

Body:

json
{
  "modelo": "Teste Enum",
  "tipo_propulsao": "foguete",
  "ano_modelo": 2026,
  "preco_base": 100000
}

Resposta esperada: { "erro": "... invalid input value for enum ..." }.

T14: Atualização sem nenhum campo
Item	Detalhe
Método e URL	PUT http://localhost:3000/veiculos/ID_NOVO
Body	{}
Status esperado	400
Resposta esperada	{ "erro": "Nenhum campo para atualizar" }
Quadro de resultados

Preencha a coluna "Resultado" após executar cada teste.

Teste	Descrição	Status esperado	Status obtido	Resultado
T01	GET lista	200		
T02	POST sem status_producao	201		
T03	POST com status_producao	201		
T04	GET por id	200		
T05	PUT atualiza	200		
T06	DELETE remove	204		
T07	GET após remoção	404		
T08	GET id inexistente	404		
T09	PUT id inexistente	404		
T10	DELETE id inexistente	404		
T11	GET id inválido	400		
T12	POST sem obrigatórios	400		
T13	POST enum inválido	400		
T14	PUT sem campos	400		
Observações
Os testes de T01 a T07 devem ser feitos em sequência, pois dependem do ID_NOVO criado em T02.
O banco é compartilhado: altere e apague apenas os registros criados nos seus testes.
Os campos DECIMAL (preco_base e capacidade_bateria_kwh) são retornados como texto (por exemplo "189900.00"). Isso é esperado.
Para remover registros de teste que sobrarem (por exemplo o criado em T03), use DELETE /veiculos/ID.
Teenum	Valor de enum inexistente	Use um valor retornado pelas consultas de enum
EADDRINUSE	Porta já em uso	Altere o PORT no .env
Aviso SECURITY WARNING ... sslmode	Aviso do driver pg sobre SSL	Pode ser ignorado
