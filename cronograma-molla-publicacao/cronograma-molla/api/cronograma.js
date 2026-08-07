// api/cronograma.js — Função serverless (Vercel) que conecta o portal ao Supabase.
// O navegador nunca acessa o banco diretamente: toda leitura/gravação passa por aqui,
// com validação de senha no servidor. A chave do Supabase fica em variáveis de ambiente.
//
// Variáveis de ambiente necessárias (Vercel → Settings → Environment Variables):
//   SUPABASE_URL          → URL do projeto Supabase (ex.: https://xxxx.supabase.co)
//   SUPABASE_SERVICE_KEY  → chave "service_role" do Supabase (Settings → API)
// Opcionais:
//   HASH_ADMIN, HASH_CLIENTE → para trocar senhas sem editar código (SHA-256 da senha)
//   CRONOGRAMA_ID            → identificador do cronograma (padrão: "principal")

const HASH_ADMIN =
  process.env.HASH_ADMIN ||
  'f4024262919b1229e0f9714737c1534a48277f35cdf94852de294651fab6a419'; // m0ll@#2026#
const HASH_CLIENTE =
  process.env.HASH_CLIENTE ||
  '2126d63cfcd68f11acbf47bfcb2b558987e89088591241a894c699334d62da0a'; // Mollacrono2026
const ID = process.env.CRONOGRAMA_ID || 'principal';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    return res.status(503).json({ erro: 'Banco não configurado (defina SUPABASE_URL e SUPABASE_SERVICE_KEY na Vercel)' });
  }

  const chave = req.headers['x-chave'] || '';
  const isAdmin = chave === HASH_ADMIN;
  const isCliente = chave === HASH_CLIENTE;
  const sb = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  };

  try {
    if (req.method === 'GET') {
      if (!isAdmin && !isCliente) return res.status(401).json({ erro: 'Não autorizado' });
      const r = await fetch(
        `${url}/rest/v1/cronogramas?id=eq.${encodeURIComponent(ID)}&select=dados,atualizado_em`,
        { headers: sb }
      );
      if (!r.ok) return res.status(502).json({ erro: 'Falha ao consultar o banco' });
      const rows = await r.json();
      if (!rows.length) return res.status(404).json({ erro: 'Nenhum cronograma salvo ainda' });
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'POST') {
      if (!isAdmin) return res.status(403).json({ erro: 'Somente administradores podem salvar' });
      let dados = req.body;
      if (typeof dados === 'string') { try { dados = JSON.parse(dados); } catch { dados = null; } }
      if (!dados || !dados.cliente || !Array.isArray(dados.eixos)) {
        return res.status(400).json({ erro: 'Dados inválidos' });
      }
      const r = await fetch(`${url}/rest/v1/cronogramas?on_conflict=id`, {
        method: 'POST',
        headers: { ...sb, Prefer: 'resolution=merge-duplicates' },
        body: JSON.stringify([{ id: ID, dados, atualizado_em: new Date().toISOString() }]),
      });
      if (!r.ok) return res.status(502).json({ erro: 'Falha ao gravar no banco' });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ erro: 'Método não permitido' });
  } catch (e) {
    return res.status(500).json({ erro: 'Erro interno' });
  }
}
