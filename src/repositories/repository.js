// Acesso a dados: todas as consultas ao banco ficam aqui
const db = require('./db');

const TABELA = 'veiculos';

const listar = () => db(TABELA).select('*').orderBy('id');

const buscarPorId = (id) => db(TABELA).where({ id }).first();

const criar = async (dados) => {
  const [veiculo] = await db(TABELA).insert(dados).returning('*');
  return veiculo;
};

const atualizar = async (id, dados) => {
  const [veiculo] = await db(TABELA).where({ id }).update(dados).returning('*');
  return veiculo;
};

const remover = (id) => db(TABELA).where({ id }).del();

module.exports = { listar, buscarPorId, criar, atualizar, remover };
