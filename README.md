# Pés de Seda

Primeira versão navegável da landing page do e-book **Pés de Seda**, de Ana Maria Lourenço. A demonstração apresenta a composição editorial, a autora, a oferta e as perguntas frequentes. As vendas reais permanecem fechadas.

## Estado atual

- Interface responsiva com HTML inicial renderizado pelo Next.js.
- Direção visual de caderno de família contemporâneo, sem fotografia sintética: história entre gerações, índice em linhas, experiência de leitura, autora como dedicatória e oferta como colofão.
- Movimento com `motion/react`, respeitando `prefers-reduced-motion`.
- Checkout Asaas implementado no servidor e validado no Sandbox; continua desativado por padrão no arquivo de exemplo.
- Preço canônico lido somente de `PRODUCT_PRICE_CENTS` no servidor.
- Pedidos, tentativas, eventos e direitos persistidos em SQLite na simulação local.
- PDF lido apenas de caminho privado configurado em `PDF_STORAGE_KEY`; nenhum PDF existe em `public/` ou nos testes.
- Download exige pedido pago, direito ativo e token privado válido em toda requisição.
- O preço canônico aprovado é R$ 49,90 (4.990 centavos), definido e validado no servidor.
- Produção, webhook público, retrato, capa oficial e PDF final continuam pendentes.

## Stack e decisões

| Parte | Escolha | Motivo |
|---|---|---|
| Interface e servidor | Next.js 16.4.5, React 19.3.1, TypeScript 6.0.3 | HTML inicial, rotas de servidor e uma única aplicação para a prévia |
| Movimento | Motion 14.9.0 | `MotionConfig` com preferência do usuário e animações isoladas |
| Banco local | `node:sqlite` do Node 24 | Persistência local sem serviço externo ou credencial |
| Banco de produção | PostgreSQL gerenciado, adaptando `CommerceRepository` | Concorrência e operação multi-instância; provedor ainda não escolhido |
| PDF local | Arquivo fora de `public/`, apontado por variável de ambiente | O servidor revalida o direito antes de servir o arquivo |
| PDF de produção | Armazenamento privado compatível com URL assinada curta | O provedor e o adaptador ainda dependem da operação comercial |
| Hospedagem | Runtime Node.js com HTTPS e armazenamento/banco externos | Evita depender do filesystem efêmero; fornecedor ainda depende do titular |

As fontes Source Serif 4 e Source Sans 3 são hospedadas no próprio bundle por meio dos pacotes Fontsource. As versões estão fixadas no `package.json` e o `package-lock.json` deve ser preservado.

## Instalar e abrir

Requisitos usados nesta entrega: Node.js 24.18.1 e npm 11.16.0.

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Abra `http://localhost:3000`. Para avaliar em um celular na mesma rede:

```powershell
npm run dev -- --hostname 0.0.0.0
```

Abra no celular `http://IP-DO-COMPUTADOR:3000`. Talvez seja necessário permitir o Node.js no firewall local.

## Testar e gerar o build

```powershell
npm run lint
npm test
npm run build
npm run test:e2e
npm start
```

`npm run test:e2e` usa o build existente, inicia a prévia em `127.0.0.1:3100` e executa o Chromium. Rode `npm run build` antes. As capturas são gravadas em `evidencias/`.

A matriz responsiva automatizada cobre 320, 360, 390, 768, 1024 e 1440 px, além de teclado e preferência por movimento reduzido.

O comando completo verificado nesta entrega é:

```powershell
npm run lint
npm test
npm run build
npx playwright test --reporter=line
```

## Configuração comercial

Copie `.env.example` para `.env.local`, mas não versione segredos. A demonstração segura usa:

```dotenv
SALES_ENABLED=false
CHECKOUT_MODE=disabled
```

O Sandbox foi validado com credencial local, preço de R$ 49,90, Pix e cartão. O Asaas exige callbacks HTTPS públicos: durante a avaliação local eles apontam para o próprio domínio Sandbox e não retornam à aplicação. Para homologar o ciclo completo ainda são necessários uma URL pública HTTPS para callbacks e webhook, PDF revisado em armazenamento privado e configuração de e-mail. Somente no Sandbox, `CHECKOUT_MODE=asaas` e `SALES_ENABLED=true` habilitam a criação.

Se o token Asaas começar com `$`, escape o primeiro caractere no arquivo `.env.local` (`\$...`) para impedir que o carregador de variáveis do Next.js tente expandi-lo. Nunca versione esse arquivo.

Produção usa banco, credenciais, webhook e origem separados do sandbox. Não copie IDs ou dados de compradores entre ambientes. O callback apenas volta à página do pedido; somente `CHECKOUT_PAID` ativa o direito.

## Rotas

- `POST /api/checkout`: mesma origem, produto e chave de tentativa; ignora qualquer preço do navegador.
- `POST /api/webhooks/asaas`: valida `asaas-access-token`, persiste o ID do evento e aplica mudanças idempotentes.
- `GET /api/pedido`: consulta privada do estado persistido para atualizar a página; não consulta nem substitui o webhook do Asaas.
- `GET /api/pagamentos/asaas?pedido=...&acesso=...&cobranca=pay_...`: consulta pontual e privada `GET /v3/payments/{id}` no servidor, valida pedido e preço de R$ 49,90 e não altera o estado local.
- `GET /pedido`: exige ID e token privado; o retorno antecipado mostra “Aguardando confirmação”.
- `GET /api/download`: revalida pedido e direito antes de ler o PDF privado.
- `POST /api/recuperar`: resposta neutra; o envio de link ainda depende do provedor de e-mail e da captura confirmada do endereço.

## Limites desta versão

O UI/UX Pro Max foi instalado localmente e seu checklist foi aplicado, mas a busca automatizada não rodou porque não há Python executável neste computador. Impeccable 4.8.0 e Taste Skill também estão disponíveis no projeto. No redesign de 04/11/2026, o catálogo 21st.dev foi pesquisado. Foram efetivamente consultados [Editorial Hero, de @felipemenezes098](https://21st.dev/@felipemenezes098/components/hero-05), [Editorial service list, de @ibrandify](https://21st.dev/@ibrandify/components/editorial-service-list) e [Accessible Accordion, de @a11ypros](https://21st.dev/@a11ypros/components/a11y-accordion). Eles orientaram assimetria, linhas editoriais e semântica; nenhum componente foi instalado ou copiado nesta rodada. Newsletter, relatos, contato público, termos e política permanecem ocultos ou marcados como preparação.

Referências técnicas confirmadas em 3 de novembro de 2026: [criação de checkout](https://docs.asaas.com/reference/criar-novo-checkout), [consulta de uma cobrança](https://docs.asaas.com/reference/recuperar-uma-unica-cobranca), [link e redirecionamento](https://docs.asaas.com/docs/link-do-checkout-e-redirecionamento-do-cliente), [eventos do checkout](https://docs.asaas.com/docs/checkout-events), [eventos de cobranças](https://docs.asaas.com/docs/webhook-para-cobrancas) e [recebimento de webhooks](https://docs.asaas.com/docs/receive-asaas-events-at-your-webhook-endpoint).
