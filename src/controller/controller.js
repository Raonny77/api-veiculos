// Controladores: recebem a requisição, chamam o repositório e respondem
const repo = require('./repository');

// Campos aceitos no corpo da requisição
const CAMPOS = [
  'modelo',
  'tipo_propulsao',
  'ano_modelo',
  'autonomia_km',
  'capacidade_bateria_kwh',
  'preco_base',
  'status_producao',
];

const filtrarCampos = (corpo) => {
  const dados = {};
  for (const campo of CAMPOS) {
    if (corpo[campo] !== undefined) dados[campo] = corpo[campo];
  }
  return dados;
};

const idValido = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

const listar = async (req, res) => {
  try {
    res.status(200).json(await repo.listar());
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

const buscarPorId = async (req, res) => {
  try {
    if (!idValido(req.params.id)) return res.status(400).json({ erro: 'Id inválido' });
    const veiculo = await repo.buscarPorId(req.params.id);
    if (!veiculo) return res.status(404).json({ erro: 'Veículo não encontrado' });
    res.status(200).json(veiculo);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

const criar = async (req, res) => {
  try {
    const dados = filtrarCampos(req.body);
    const faltando = ['modelo', 'tipo_propulsao', 'ano_modelo', 'preco_base'].filter(
      (campo) => dados[campo] === undefined || dados[campo] === null || dados[campo] === ''
    );
    if (faltando.length) {
      return res.status(400).json({ erro: `Campos obrigatórios: ${faltando.join(', ')}` });
    }
    const veiculo = await repo.criar(dados);
    res.status(201).json(veiculo);
  } catch (erro) {
    // 22P02 = valor inválido (ex.: enum inexistente); 23502 = campo nulo obrigatório
    const status = ['22P02', '23502', '22003'].includes(erro.code) ? 400 : 500;
    res.status(status).json({ erro: erro.message });
  }
};

const atualizar = async (req, res) => {
  try {
    if (!idValido(req.params.id)) return res.status(400).json({ erro: 'Id inválido' });
    const dados = filtrarCampos(req.body);
    if (Object.keys(dados).length === 0) {
      return res.status(400).json({ erro: 'Nenhum campo para atualizar' });
    }
    const veiculo = await repo.atualizar(req.params.id, dados);
    if (!veiculo) return res.status(404).json({ erro: 'Veículo não encontrado' });
    res.status(200).json(veiculo);
  } catch (erro) {
    const status = ['22P02', '23502', '22003'].includes(erro.code) ? 400 : 500;
    res.status(status).json({ erro: erro.message });
  }
};

const remover = async (req, res) => {
  try {
    if (!idValido(req.params.id)) return res.status(400).json({ erro: 'Id inválido' });
    const apagados = await repo.remover(req.params.id);
    if (!apagados) return res.status(404).json({ erro: 'Veículo não encontrado' });
    res.status(204).send();
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

module.exports = { listar, buscarPorId, criar, atualizar, remover };
