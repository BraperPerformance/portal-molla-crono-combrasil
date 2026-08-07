# Cronograma Molla — Portal Whitelabel

Ferramenta de cronograma (Gantt) da **Agência Molla**, com portal de acesso por senha, edição completa e Resumo Geral automático. Este repositório contém a versão configurada para o projeto **Combrasil**, mas o modelo é whitelabel: pode ser duplicado para qualquer cliente.

## Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | O portal completo (login + cronograma). |
| `api/cronograma.js` | Função serverless (Vercel) que conecta o portal ao banco Supabase com validação de senha no servidor. |
| `guia-de-acesso.html` | Guia de acesso para enviar ao cliente (imprimível — abra e use Ctrl+P para gerar PDF). |
| `README.md` | Este arquivo. |

## Acessos

| Perfil | Senha | Pode |
|---|---|---|
| **Admin (equipe Molla)** | `m0ll@#2026#` | Ver tudo, editar atividades e eixos, alterar status, criar abas, exportar/importar, configurar cliente |
| **Cliente** | `Mollacrono2026` | Ver o cronograma (somente leitura) |

O login pede apenas o **nome** (identificação livre) e a **senha do grupo**. A sessão vale enquanto a aba do navegador estiver aberta.

> **Nota de segurança:** a proteção é feita no navegador, adequada para organizar o acesso e evitar visitantes casuais — as senhas não aparecem em texto puro no código (apenas o hash SHA-256), mas não é uma barreira de nível bancário. Não publique dados sensíveis no cronograma.

## Publicar (GitHub + Vercel + Supabase)

### Parte 1 — Site no ar

1. **GitHub:** crie um repositório (pode ser privado) e envie os arquivos deste pacote, mantendo a estrutura (a pasta `api/` precisa ficar na raiz, ao lado do `index.html`). Pelo site: *Add file → Upload files*.
2. **Vercel:** em [vercel.com](https://vercel.com), *Add New → Project*, conecte sua conta GitHub e selecione o repositório. Clique em **Deploy** — sem configuração extra.
3. A Vercel gera um link `https://seu-projeto.vercel.app`. É esse link que vai no guia de acesso do cliente (edite o `guia-de-acesso.html` e substitua o campo `[ inserir link do portal aqui ]`).

Nesse ponto o portal já funciona em **modo local** (cada navegador guarda a própria cópia). Para ativar a sincronização automática entre todos, siga a Parte 2.

### Parte 2 — Banco de dados (sincronização automática)

1. Crie uma conta gratuita em [supabase.com](https://supabase.com) e um novo projeto (*New project* — escolha qualquer nome e uma senha de banco, região *South America (São Paulo)*).
2. No projeto, abra o **SQL Editor**, cole o comando abaixo e clique em **Run**:

   ```sql
   create table if not exists cronogramas (
     id text primary key,
     dados jsonb not null,
     atualizado_em timestamptz not null default now()
   );
   ```

3. Ainda no Supabase, vá em **Project Settings → API** e copie dois valores: a **Project URL** e a chave **service_role** (fica na seção *Project API keys* — clique em *Reveal*).
4. Na **Vercel**, abra o projeto → **Settings → Environment Variables** e crie:
   - `SUPABASE_URL` → a Project URL copiada
   - `SUPABASE_SERVICE_KEY` → a chave service_role copiada
5. Vá em **Deployments** e clique em **Redeploy** no último deploy (para as variáveis valerem).
6. Pronto. Entre no portal como admin: na primeira entrada, o cronograma é publicado na nuvem automaticamente e o selo **"Nuvem: sincronizado"** aparece no topo.

> A chave service_role dá acesso total ao banco — por isso ela fica **só na Vercel** (variável de ambiente), nunca no código do site. O navegador conversa apenas com a função `api/cronograma`, que valida a senha antes de qualquer gravação.

## Como funciona no dia a dia (com o banco ativo)

- **Edição:** entre como admin, ligue o **Modo edição** e altere o que precisar. As alterações ficam como **rascunho local** (selo "Alterações não salvas"); clique em **Salvar alterações** para publicar na nuvem para todos, ou em **Restaurar última versão salva** para descartar o rascunho. O **Log de atividade** (aba, só admin) registra quem alterou o quê e quando.
- **Todo mundo vê a mesma coisa:** quem abrir o link recebe sempre a versão mais recente. O cliente logado tem a tela atualizada sozinha a cada minuto.
- **Sem internet ou sem banco configurado:** o portal avisa "Modo local" e continua funcionando com os dados do navegador — nada trava.
- **Exportar/Importar JSON viraram backup:** use Exportar de tempos em tempos para guardar uma cópia de segurança, ou Importar para restaurar uma. **Baixar cópia (HTML)** gera uma versão portátil para arquivar ou enviar por e-mail.
- **Atenção com dois admins editando ao mesmo tempo:** vale a regra "último que salva, vence". Para o volume de um cronograma, combina-se facilmente — mas evitem editar a mesma aba simultaneamente.

## Novo cliente (whitelabel)

1. Duplique o repositório (ou o `index.html`).
2. Entre como admin → **Configurações do cliente**: troque nome, título do projeto e faça upload da logo.
3. Ajuste os eixos e atividades (ou apague os existentes e monte do zero).
4. **Baixar cópia (HTML)** → publique como `index.html` do novo repositório.

## Trocar as senhas

As senhas ficam como hash SHA-256 em dois lugares: no `index.html` e na função `api/cronograma.js` (constantes `HASH_ADMIN` e `HASH_CLIENTE`). Para trocar:

1. Abra o console do navegador (F12) no portal e rode:
   ```js
   sha256('NovaSenhaAqui')
   ```
2. Copie o resultado e substitua o valor da constante correspondente **nos dois arquivos** (ou, em vez de editar a `api/`, defina as variáveis de ambiente `HASH_ADMIN`/`HASH_CLIENTE` na Vercel, que têm prioridade).
3. Publique os arquivos atualizados (a Vercel redistribui sozinha).

---

Agência Molla · Trade Marketing, Incentivo e Comunicação
