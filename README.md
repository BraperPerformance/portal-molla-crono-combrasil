# Cronograma Molla — Portal Whitelabel

Ferramenta de cronograma (Gantt) da **Agência Molla**, com portal de acesso por senha, edição completa e Resumo Geral automático. Este repositório contém a versão configurada para o projeto **Combrasil**, mas o modelo é whitelabel: pode ser duplicado para qualquer cliente.

## Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | O portal completo (login + cronograma). Um único arquivo, sem dependências. |
| `guia-de-acesso.html` | Guia de acesso para enviar ao cliente (imprimível — abra e use Ctrl+P para gerar PDF). |
| `README.md` | Este arquivo. |

## Acessos

| Perfil | Senha | Pode |
|---|---|---|
| **Admin (equipe Molla)** | `m0ll@#2026#` | Ver tudo, editar atividades e eixos, alterar status, criar abas, exportar/importar, configurar cliente |
| **Cliente** | `Mollacrono2026` | Ver o cronograma (somente leitura) |

O login pede apenas o **nome** (identificação livre) e a **senha do grupo**. A sessão vale enquanto a aba do navegador estiver aberta.

> **Nota de segurança:** a proteção é feita no navegador, adequada para organizar o acesso e evitar visitantes casuais — as senhas não aparecem em texto puro no código (apenas o hash SHA-256), mas não é uma barreira de nível bancário. Não publique dados sensíveis no cronograma.

## Publicar no GitHub + Vercel

1. **GitHub:** crie um repositório (pode ser privado) e envie os arquivos deste pacote. Pelo site: *Add file → Upload files*.
2. **Vercel:** em [vercel.com](https://vercel.com), *Add New → Project*, conecte sua conta GitHub e selecione o repositório. Não precisa configurar nada — como é um site estático com `index.html` na raiz, o deploy sai direto. Clique em **Deploy**.
3. Pronto: a Vercel gera um link `https://seu-projeto.vercel.app`. É esse link que vai no guia de acesso do cliente (edite o `guia-de-acesso.html` e substitua o campo `[ inserir link do portal aqui ]`).
4. Cada `git push` (ou upload de arquivo novo no GitHub) atualiza o site automaticamente.

Alternativa sem Vercel: o mesmo repositório funciona no GitHub Pages (*Settings → Pages → Deploy from branch*).

## Fluxo de trabalho da equipe

- **Editar:** entre como admin, ligue o **Modo edição** e faça as alterações. Tudo é salvo automaticamente **no seu navegador**.
- **Publicar as alterações para todos:** as edições ficam locais até você atualizar o arquivo publicado. Use **Baixar cópia (HTML)** — ele gera um `index.html` novo com os dados atuais embutidos — e suba esse arquivo no GitHub no lugar do anterior (renomeie para `index.html`). O deploy da Vercel atualiza sozinho.
- **Backup e trabalho em equipe:** use **Exportar JSON** para salvar/versionar o estado e **Importar JSON** para carregar o cronograma de outra pessoa.

## Novo cliente (whitelabel)

1. Duplique o repositório (ou o `index.html`).
2. Entre como admin → **Configurações do cliente**: troque nome, título do projeto e faça upload da logo.
3. Ajuste os eixos e atividades (ou apague os existentes e monte do zero).
4. **Baixar cópia (HTML)** → publique como `index.html` do novo repositório.

## Trocar as senhas

As senhas ficam como hash SHA-256 no `index.html`, nas constantes `HASH_ADMIN` e `HASH_CLIENTE`. Para trocar:

1. Abra o console do navegador (F12) em qualquer página do portal e rode:
   ```js
   sha256('NovaSenhaAqui')
   ```
2. Copie o resultado e substitua o valor da constante correspondente no `index.html`.
3. Publique o arquivo atualizado.

---

Agência Molla · Trade Marketing, Incentivo e Comunicação
