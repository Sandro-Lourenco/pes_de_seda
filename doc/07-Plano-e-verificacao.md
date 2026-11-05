# Plano de execução
Todas as etapas começam pendentes. Atualize a linha correspondente quando houver evidência.
| Etapa | Estado em 03/11/2026 | Entregável | Evidência para concluir |
|---|---|---|---|
| 1 • Base | Concluída para desenvolvimento local | Inventário do repo, stack, banco, hospedagem e armazenamento escolhidos | Decisões, versões, limites de produção e comandos reais no README |
| 2 • Interface | Concluída como primeira versão | Conteúdo, componentes responsivos, movimento reduzido | `evidencias/` contém abertura, autoria e oferta em 390 e 1440 px; Playwright verifica 320 px, teclado e movimento reduzido |
| 3 • Compra local | Parcial | Contratos de 04 implementados com provedor simulado | 6 testes reproduzíveis passaram; envio de recuperação por e-mail e adaptador de URL assinada aguardam provedores |
| 4 • Homologação | Parcial | Pix e cartão em conta sandbox | Sessão Sandbox abriu com R$ 49,90, Pix e cartão; callback e webhook públicos ainda pendentes |
| 5 • Abertura | Pendente e fechada | Preço, edição do PDF, termos, suporte e credenciais aprovados | Preço aprovado; demais itens e aceite do titular pendentes; `SALES_ENABLED=false` e `CHECKOUT_MODE=disabled` por padrão |

## Casos mínimos executáveis pelo implementador
- Dado um pedido pendente, quando alguém abre a URL de sucesso e solicita o PDF, então o pedido continua pendente e o download é negado.
- Dadas duas solicitações simultâneas com a mesma chave de tentativa, então existe no máximo um checkout ativo. Repetir o teste simulando perda da resposta do provedor.
- Dado um evento autêntico de pagamento entregue duas vezes, então existe um único direito de acesso e um único trabalho de envio. Uma falha de e-mail deve poder ser repetida independentemente do pagamento.
- Dado um estorno confirmado seguido por uma notificação de pagamento atrasada, então o acesso permanece revogado. Antes de codificar, verificar na referência Asaas os eventos aplicáveis à modalidade e registrar fixtures anonimizadas.
- Dado um link de recuperação vencido, reutilizado ou vinculado a outro pedido, então ele não permite obter o PDF. Documentar validade, uso único e vínculo entre pedido e e-mail.

## Dependências e retomada
Autora aprova preço, imagens, relatos e edição final. Titular da conta fornece configuração de sandbox por canal seguro. Implementador escolhe e registra banco, hospedagem e provedor de e-mail. Newsletter é opcional: se inativa, registrar “fora do escopo desta entrega” no aceite. Para cada teste registrar identificador, ambiente, comando ou passos, resultado esperado, observado e evidência. Pendência de sandbox permite concluir a prévia local, mas mantém homologação pendente.

## Registro da execução de 03/11/2026

### Inventário e decisões

- O repositório continha somente `AGENTS.md` e a documentação em `doc/`; não havia aplicação nem ZIP por extrair na pasta.
- Stack criada: Next.js 16.4.5, React 19.3.1, Motion 14.9.0, TypeScript 6.0.3 e Node 24.18.1.
- O lockfile foi gerado com versões exatas. SQLite é usado apenas na execução local. A produção foi desenhada para PostgreSQL gerenciado e armazenamento privado, com fornecedor pendente do titular.
- Checkout de produção permanece fechado. O preço aprovado foi registrado como 4.990 centavos no servidor. Nenhuma credencial, comprador ou PDF comercial foi usado como fixture.

### Ferramentas de interface

- UI/UX Pro Max instalado localmente com `uipro init --ai codex`. O checklist de acessibilidade foi aplicado: hierarquia de títulos, link de salto, foco de 3 px, alvos de 48 px, contraste textual, semântica nativa, conteúdo SSR e movimento reduzido.
- O script `search.py` não pôde ser executado: o computador possui somente o atalho bloqueado `WindowsApps/python.exe`. Conforme a regra do próprio skill, Python não foi instalado automaticamente.
- A autenticação 21st.dev foi renovada e as buscas “editorial book hero”, “author biography” e “accessible accordion” foram executadas. Foram consultados e adaptados dois componentes MIT: `Editorial Hero`, de @felipemenezes098 (hierarquia editorial, stagger e Motion), e `Accessible Accordion`, de @a11ypros (semântica nativa, teclado e abertura única). URLs: https://21st.dev/@felipemenezes098/components/hero-05 e https://21st.dev/@a11ypros/components/a11y-accordion.
- A referência `About Section`, de @uilayout.contact, apareceu na busca de biografia, mas a recuperação do código foi bloqueada pelo limite diário; nenhuma parte dela foi copiada.
- `21st review src --strict` encontrou 35 avisos informativos sobre cores no CSS e zero erro. Os tokens principais de 02 estão centralizados em `:root`; cores auxiliares representam papel, sombra e texto secundário.
- Motion para React usa `MotionConfig reducedMotion="user"`. A abertura aplica stagger de 60 ms, a capa percorre 8 px em 320 ms e o ícone do CTA percorre 2 px em 140 ms. O conteúdo permanece legível sem animação.

### Verificação local

| ID | Ambiente | Comando/cenário | Esperado | Observado | Evidência |
|---|---|---|---|---|---|
| LOC-001 | Node local | `npm run lint` | Sem erros | Passou | saída do comando |
| LOC-002 | Vitest local | `npm test` | Contratos idempotentes, payload e GET Asaas | 11/11 passaram | `tests/commerce.test.ts` e `tests/asaas-provider.test.ts` |
| LOC-003 | Build local | `npm run build` | Compilar rotas e página | Passou | saída do Next.js |
| WEB-001 | Chromium, 320 px | largura da página | Sem transbordamento | Passou | `tests/e2e/landing.spec.ts` |
| WEB-002 | Chromium, 390 px | abertura, autora e oferta | Legíveis e sem dados pessoais | Passou | `evidencias/*-390.png` |
| WEB-003 | Chromium, 1440 px | abertura, autora e oferta | Grade editorial íntegra | Passou | `evidencias/*-1440.png` |
| WEB-004 | Chromium | teclado e FAQ | Foco visível e Enter abre resposta | Passou | Playwright, 8/8 na suíte completa |
| WEB-005 | Chromium | movimento reduzido | Conteúdo imediato e ações íntegras | Passou | Playwright |
| PAY-001 | Provedor simulado | duas chamadas simultâneas | Um checkout no máximo | Passou | Vitest |
| PAY-002 | Provedor simulado | timeout após envio | Não recriar; conciliar | Passou | Vitest |
| PAY-003 | Provedor simulado | retorno antes do webhook | “Aguardando confirmação”; sem PDF | Passou no repositório e na página `/pedido` | Vitest + código SSR |
| PAY-004 | Provedor simulado | evento pago duplicado | Um direito e uma entrega | Passou | Vitest |
| PAY-005 | Provedor simulado | token forjado | Download negado | Passou | Vitest |
| PAY-006 | Provedor simulado | estorno seguido de pago atrasado | Acesso segue revogado | Passou | Vitest |
| DEP-001 | npm produção | `npm audit --omit=dev` | Sem vulnerabilidade conhecida de produção | 0 vulnerabilidades | saída do npm |

As capturas foram geradas contra `next start`, sem compradores, credenciais ou PDF. O texto “Vendas em preparação” é intencional.

### Atualização do pagamento — 03/11/2026

- Oferta canônica: `pes-de-seda`, R$ 49,90, moeda BRL, definida em `src/lib/commerce/product.ts`.
- O navegador envia somente o produto e a chave da tentativa. O servidor ignora preços externos e o adaptador recusa qualquer valor diferente de 4.990 centavos.
- O checkout Asaas cria cobrança única (`DETACHED`) com Pix e cartão, item de quantidade 1, referência externa opaca e callbacks privados.
- `GET /api/pedido` consulta apenas o banco local com ID e token privados. A confirmação financeira continua exclusiva do webhook `CHECKOUT_PAID`, conforme recomendação do Asaas.
- A página de pedido pendente consulta o servidor a cada 5 segundos e recarrega quando o webhook alterar o estado; ela não faz polling da API Asaas.
- Build incluiu as rotas `/api/checkout`, `/api/pagamentos/asaas`, `/api/pedido`, `/api/webhooks/asaas`, `/api/download` e `/pedido`. Sandbox e produção não foram acionados.

### Consulta pontual de cobrança — 03/11/2026

- A referência oficial `GET /v3/payments/{id}` foi aberta e consultada. O adaptador agora faz a requisição sem body, com `access_token` somente no servidor e timeout de 8 segundos.
- A rota privada `GET /api/pagamentos/asaas` exige o ID e o token do pedido, valida `externalReference` e o preço canônico de 4.990 centavos e devolve apenas ID, status, forma e valor.
- A consulta não promove pedido para pago: o webhook `CHECKOUT_PAID` continua sendo a confirmação financeira autoritativa, evitando polling e callback forjado.
- Os testes simulados cobrem GET sem body, cabeçalho privado e rejeição de cobrança com pedido ou preço divergente. A chamada real aguarda credencial de sandbox.

### Pendências para retomar

1. Receber capa/retrato autorizados e PDF final revisado em armazenamento privado.
2. Definir PostgreSQL, armazenamento de objetos e provedor de e-mail; implementar migração do repositório e link de recuperação de uso único.
3. Publicar uma URL HTTPS de homologação e validar callbacks, webhook e download real; a abertura do checkout Sandbox com Pix e cartão já passou.
4. Aprovar termos, privacidade, suporte, contato público e o texto em primeira pessoa.
5. Somente depois preencher a matriz comercial, separar configuração de produção e solicitar autorização explícita do titular para abrir vendas.

### Homologação Sandbox — 04/11/2026

- A credencial Sandbox permaneceu somente em `.env.local`; o prefixo `$` foi escapado para o carregador do Next.js sem expor o valor.
- A rota local `POST /api/checkout` respondeu `200`, criou sessão ativa e manteve o preço canônico no servidor.
- O adaptador foi corrigido para usar `sandbox.asaas.com/checkoutSession/show` em Sandbox e `www.asaas.com` somente em produção.
- Verificação visual no checkout hospedado: subtotal e total de R$ 49,90, item “E-book Pés de Seda”, opções Pix e Cartão de Crédito. Nenhum dado de comprador foi preenchido e nenhum pagamento foi concluído.
- O Asaas rejeitou callbacks `http://localhost`; na avaliação local, os callbacks apontam temporariamente para o próprio domínio Sandbox. O retorno à página `/pedido` e o webhook exigem uma URL pública HTTPS.

### Redesign editorial — 04/11/2026

- Direção: landing editorial assimétrica, variação 7/10, movimento 6/10 e densidade 3/10. Foram preservados os tokens de papel, tinta, folha, cerâmica e linho definidos no arquivo 02.
- Estrutura revisada: proposta e CTA na primeira dobra, metadados logo abaixo, índice em linhas, autora em composição tipográfica, oferta como página de produto, FAQ e rodapé.
- UI/UX Pro Max orientou contraste, alvos de toque, conteúdo inicial visível, linha de leitura e movimento reduzido. O script Python permaneceu indisponível; nenhuma instalação de sistema foi feita.
- 21st.dev: os metadados de `Editorial Image Hero` por @felipemenezes098 e `Featured Product Showcase` por @ziegfiroyt foram consultados. O limite gratuito bloqueou a recuperação do código, então nenhuma implementação foi copiada. A primeira referência influenciou imagem e assimetria; a segunda, proximidade entre produto, preço e CTA. Estrelas, desconto e urgência foram rejeitados por falta de evidência real.
- Referência de UX: a pesquisa pública do Baymard reforçou preço e ação principal claros na área de compra, além de informação suficiente para decidir sem depender do checkout.
- Motion para React usa entrada curta na primeira dobra, revelação por `whileInView` e feedback tátil. O HTML começa visível e `prefers-reduced-motion` remove deslocamentos.
- Foi criada a imagem editorial `public/editorial-silk-paper.webp`, sem pessoa, texto, ingrediente, produto clínico ou representação da autora. Ela é uma composição abstrata de papel e seda e não substitui a capa oficial.
- Verificação: `npm run lint`, 11 testes Vitest, build Next.js e 8 testes Playwright passaram. As capturas de abertura, autora e oferta foram atualizadas em 390 e 1440 px; 320 px permaneceu sem transbordamento.

### Refatoração visual premium — 04/11/2026

- Impeccable 4.8.0 foi instalado apenas no projeto, sem hooks. A auditoria manual anterior à edição identificou como P1 a fotografia sintética e a repetição de composições divididas; como P2, o card da autora, ritmo mecânico e oferta convencional.
- Direção aplicada: “caderno de família contemporâneo”. A abertura ganhou composição tipográfica assimétrica, fólio e fio de seda; a autora virou uma dedicatória sem card; a oferta passou a se comportar como colofão com separação editorial.
- A imagem artificial deixou de ser usada e o arquivo gerado foi removido. A página permanece tipográfica até a entrega de capa e retrato autorizados.
- Pesquisa efetivamente consultada no 21st.dev: `Editorial Hero`, de @felipemenezes098; `Editorial service list`, de @ibrandify; e `Accessible Accordion`, de @a11ypros. As referências influenciaram assimetria, linhas editoriais e a confirmação do padrão semântico; nenhum componente foi instalado ou copiado nesta rodada.
- Motion permaneceu restrito à entrada curta da capa, ao stagger da primeira dobra e ao feedback do CTA. O HTML inicia visível e movimento reduzido zera deslocamentos e transições.
- O detector final do Impeccable foi executado uma única vez sobre os arquivos alterados e retornou `[]` (zero achados mecânicos).
- Verificação observada: `npm run lint` passou; Vitest passou 11/11; `npm run build` passou após limpar somente o diretório gerado `.next-build`; Playwright passou 8/8, incluindo 320, 390 e 1440 px, teclado, FAQ e movimento reduzido.
- Fluxos Asaas, checkout, webhooks, download, banco, rotas, estados e regras de negócio não foram alterados. A produção continua fechada.

### Organização das skills e documentação — 04/11/2026

- Confirmadas sem duplicação: Impeccable 4.8.0, Taste Skill (`design-taste-frontend`) e UI UX Pro Max. A divisão de responsabilidades foi registrada no `AGENTS.md`.
- Criados `docs/design/AUDIT_BEFORE.md`, `DESIGN_SYSTEM.md`, `ART_DIRECTION.md`, `ANTI_AI_PATTERNS.md`, `COMPONENT_GUIDELINES.md`, `ANIMATION_GUIDELINES.md` e `AUDIT_AFTER.md`.
- `README.md` foi reconciliado com a interface atual: nenhuma fotografia sintética é usada e as referências 21st.dev registradas correspondem às consultas efetivamente realizadas.
- A matriz de overflow passou a verificar 320, 360, 390, 768 e 1440 px. Resultado final do Playwright: 10/10 testes passaram.
- `npm run lint`, Vitest 11/11 e `npm run build` passaram. O detector Impeccable foi repetido após completar os tokens documentados e retornou `[]`.
- A prévia final foi iniciada com `SALES_ENABLED=false` e `CHECKOUT_MODE=disabled`; nenhuma cobrança real foi criada.

### Complemento narrativo e responsivo — 04/11/2026

- A história familiar ganhou uma seção própria, baseada apenas no conteúdo aprovado: origem na avó, passagem entre gerações e organização em livro.
- A experiência de autocuidado foi traduzida como ritmo de leitura — ler, pausar e retomar — sem prescrever uso, prometer resultado ou publicar ingredientes pendentes de revisão.
- A sequência editorial passou a ter sete capítulos visuais: abertura, história, índice, experiência, autora, oferta e perguntas.
- Nenhum arquivo de checkout, Asaas, webhook, banco, download, hooks ou regras de negócio foi alterado.
- `npm run lint` passou; Vitest passou 11/11; o build Next.js passou; Playwright passou 11/11, incluindo 1024 px, teclado, FAQ e movimento reduzido.
- O build precisou ser executado fora do sandbox após o Windows negar a criação de uma pasta interna do `.next-build`; a mesma árvore compilou normalmente fora da restrição.
- Novas evidências sem dados pessoais: `historia-390.png`, `historia-1440.png`, `experiencia-390.png` e `experiencia-1440.png`.
- O detector Impeccable foi executado uma única vez sobre `page.tsx` e `globals.css` e retornou `[]`.

### Implementação do conceito Estúdio — 04/11/2026

- O titular autorizou o acesso ao site conceitual protegido e solicitou sua implementação na aplicação real.
- Foram extraídos e incorporados `ritual-hero.webp`, `capa-pes-de-seda.webp`, `memoria-familia.webp` e `capa-escalda-pes.webp` em `public/assets/`.
- A estrutura visual passou a usar abertura fotográfica, capítulos numerados, superfícies creme/verde/sálvia, capa real, memória familiar, autora editorial, oferta e FAQ no ritmo do conceito.
- O material complementar permanece identificado como pendente de confirmação comercial; nenhum depoimento ilustrativo foi publicado como prova real.
- A falha observada no Asaas foi causada pelo processo local iniciado com `SALES_ENABLED=false` e `CHECKOUT_MODE=disabled`, que sobrescrevia `.env.local`.
- A aplicação foi reiniciada usando a configuração Sandbox existente. O botão criou sessão e abriu `sandbox.asaas.com/checkoutSession/show` com sucesso, sem concluir pagamento.
- O retorno e o webhook completos ainda exigem URL pública HTTPS; callbacks em `localhost` são recusados pelo Asaas.

### Estrutura premium orientada à conversão — 04/11/2026

- Pesquisa de estrutura para e-book: a abertura passou a reunir título, autora, conteúdo, formato, preço e caminho de compra; em seguida vêm origem familiar, índice, experiência de leitura, autora, oferta detalhada e FAQ. A decisão foi apoiada por exemplos editoriais de Shopify, Kit e galerias de landing pages, sem importar promessas, urgência ou depoimentos.
- Referências 21st.dev efetivamente consultadas: `Editorial Image Hero`, de @felipemenezes098 (produto e narrativa na primeira dobra); `FAQ Accordion Section`, de @kedhareswer (linhas editoriais e acessibilidade); e `Giant Wordmark Footer`, de @kedhareswer (encerramento tipográfico). URLs: https://21st.dev/@felipemenezes098/components/hero-07, https://21st.dev/@kedhareswer/components/slit-type-faq e https://21st.dev/@kedhareswer/components/kiln-wordmark-footer.
- Implementação: novo cabeçalho responsivo com menu móvel, hero orientado ao produto, capa marcada como prévia editorial, fio de seda animado por `motion.path`, capítulos com resposta discreta ao hover, seção da autora sem sobreposição, oferta de alto contraste e rodapé tipográfico.
- Movimento permanece funcional e dispensável: entrada única da capa, desenho curto do fio, menu com opacidade/deslocamento e feedback de interação. `MotionConfig` e `useReducedMotion` preservam a experiência sem animação.
- Checkout, API Asaas, webhooks, download, banco, preço canônico e regras de negócio não foram modificados.
- Evidências novas sem dados pessoais: `evidencias/redesign-hero-390.png`, `evidencias/redesign-hero-1440.png` e `evidencias/redesign-autora-1440.png`. A verificação manual confirmou ausência de transbordamento em 320 px.
- Verificação final: `npm run lint` passou; Vitest passou 11/11; `npm run build` compilou todas as rotas; Playwright passou 11/11 em 320, 360, 390, 768, 1024 e 1440 px, incluindo teclado, FAQ e movimento reduzido.
- O detector Impeccable retornou somente avisos consultivos sobre novos tons e passos tipográficos. Os tons duráveis foram registrados em `DESIGN.md`; não houve achado funcional, de acessibilidade ou bloqueante.
- A revisão automatizada pelo CLI do 21st.dev não foi executada porque o binário não está instalado localmente e a instalação temporária poderia enviar arquivos do projeto ao serviço. A pesquisa pelo MCP oficial foi concluída sem transmitir o código-fonte.

### Passe minimalista — 04/11/2026

- O fluxo foi reduzido a seis momentos essenciais: abertura, história, conteúdo, autora, oferta e perguntas. A seção de ritmo de leitura repetia a promessa da abertura e foi removida; o material complementar também saiu da página porque ainda não possui confirmação comercial.
- Foram retirados a faixa superior, textura artificial, fólios visuais, legendas decorativas, palavra de fundo e excesso de superfícies coloridas. Permaneceram a paleta de papel/folha/cerâmica, a fotografia editorial, a capa, um fio de seda discreto e a tipografia serifada.
- A hierarquia agora mantém uma ação principal de compra, um link secundário para o conteúdo e informações essenciais em texto curto. O FAQ voltou ao papel claro e o contraste escuro ficou concentrado no índice e no rodapé.
- Checkout, API Asaas, preço, webhooks, download, banco e regras comerciais não foram alterados.
- `npm run lint` passou; Vitest passou 11/11; o build Next.js passou; Playwright passou 11/11, incluindo teclado, movimento reduzido e ausência de transbordamento em 320, 360, 390, 768, 1024 e 1440 px.
- O detector Impeccable retornou apenas avisos consultivos já conhecidos da camada CSS histórica sobre passos tipográficos; não houve achado bloqueante.
- Evidências: `evidencias/minimal-hero-390.png` e `evidencias/minimal-hero-1440.png`.

### Composição inspirada em estúdio editorial — 05/11/2026

- A referência `https://6a5a148da4960c28a5cf724b--velvety-chimera-81cfe5.netlify.app/` foi consultada visualmente. Foram aproveitados apenas os princípios de composição: capa como objeto principal, campo lavanda acinzentado, espaço negativo e coluna de decisão compacta.
- Depoimentos, promessa clínica, contatos, newsletter e checkout presentes na referência não foram importados. A capa extraída anteriormente também deixou de aparecer porque contém uma promessa não aprovada; a interface usa a representação editorial temporária e a identifica como prévia.
- O hero ganhou composição capa/texto em desktop e mantém título, proposta e ação antes da capa no celular. Índice, autora, oferta e FAQ receberam ritmos próprios, sem alterar checkout, API Asaas, webhook, download, banco, preço ou estados.
- O detector Impeccable retornou somente avisos consultivos de novos passos tipográficos e cores da variação, agora registrados em `DESIGN.md`; não houve achado funcional ou de acessibilidade.
- Evidências sem dados pessoais: `evidencias/abertura-390.png`, `evidencias/abertura-1440.png`, `evidencias/autora-390.png` e `evidencias/oferta-1440.png`.
- Verificação final: `npm run lint` passou; Vitest passou 11/11; `npm run build` compilou a página e todas as rotas; Playwright passou 11/11, incluindo 320, 360, 390, 768, 1024 e 1440 px, teclado, FAQ e movimento reduzido.

### Direção botânica cinematográfica — 05/11/2026

- A imagem fornecida pelo titular foi usada como direção de arte. Uma variação segura foi criada preservando luz, linho, pedra e folhas, mas substituindo a promessa clínica da capa por “Um cuidado de família” e completando o crédito “Ana Maria Lourenço”. A peça é identificada na interface como representação visual do e-book.
- O hero ganhou fotografia em tela cheia no desktop e fluxo texto → ação → imagem no celular. O preço de R$ 49,90 continua vindo do servidor e a compra segue pelo componente transacional existente.
- O índice virou uma narrativa de rolagem com capa provisória construída no projeto. Motion para React altera apenas transformação e sombra do objeto; com movimento reduzido, ele permanece estático. O vídeo fornecido não foi publicado porque ainda exibia uma promessa clínica não aprovada.
- A seção da autora permanece tipográfica, sem inventar retrato. Checkout, API Asaas, webhooks, banco, download, rotas e regras de negócio não foram alterados.
- Evidências sem dados pessoais: `evidencias/cinematic-desktop.png` e `evidencias/cinematic-mobile.png`.
- Verificação final: `npm run lint` passou; Vitest passou 11/11; `npm run build` compilou a página e todas as rotas; Playwright passou 11/11, incluindo 320, 360, 390, 768, 1024 e 1440 px, teclado, FAQ e movimento reduzido.
- O detector final do Impeccable encontrou zero antipadrões. As 28 observações consultivas correspondem à nova rampa botânica e aos passos tipográficos intencionais registrados nesta direção; não houve falha funcional ou de acessibilidade.

### Capa extraída do vídeo — 05/11/2026

- O titular solicitou manter a área da autora sem fotografia e substituir as capas provisórias pelo material do vídeo fornecido.
- O vídeo foi amostrado em oito quadros; o instante de 4,5 segundos foi escolhido por apresentar a frente do livro com melhor legibilidade e perspectiva. O recorte otimizado foi salvo em `public/assets/book-cover-video.webp`.
- O componente compartilhado `BookCover` passou a usar essa imagem na narrativa do conteúdo e na oferta, mantendo texto alternativo, dimensões estáveis e carregamento otimizado pelo Next.js.
- Verificação: lint passou; Vitest passou 11/11; build de produção passou; Playwright passou 11/11 em 320, 360, 390, 768, 1024 e 1440 px. O detector final do Impeccable encontrou zero antipadrões.

### Mockup dedicado na narrativa — 05/11/2026

- A pedido do titular, a imagem anterior da seção “Cuidado, palavra por palavra” foi retirada e substituída pelo arquivo fornecido `Mockup do e-book Pés de Seda.png`.
- A versão otimizada foi salva como `public/assets/story-book-mockup.webp` e usada somente nessa narrativa. A capa da oferta permanece independente.

### Refatoração editorial Unslop — 05/11/2026

- A primeira página do arquivo privado `Pés de seda.pdf` foi comparada às cinco representações existentes. `public/assets/capa-pes-de-seda.webp` corresponde fielmente à capa do PDF e passou a ser a única capa exibida; o PDF comercial permaneceu fora da pasta pública.
- O hero combina a capa oficial intacta com a natureza-morta já disponível, preservando título, crédito e texto da arte. No celular, título, proposta e ação continuam antes da imagem.
- Foram removidos parallax, movimentos decorativos, fólios repetitivos, itálico sistemático, texto provisório da autora e a cor lavanda desconectada da marca. A página agora alterna papel, linho e verde profundo em composições assimétricas.
- A seção da autora permanece tipográfica, sem retrato fictício. A oferta foi tratada como colofão comercial e continua usando o preço canônico de R$ 49,90 e o mesmo `CheckoutButton`.
- Nenhum arquivo de API, Asaas, webhook, banco, pedido, download, preço, segurança ou contrato comercial foi alterado.
- UI/UX Pro Max: as regras locais de acessibilidade, alvos de toque, 4/8 px, contraste, responsividade e movimento reduzido foram aplicadas. A busca automatizada não executou porque o ambiente não possui Python funcional; nenhuma instalação de sistema foi feita.
- Impeccable: o detector foi executado uma vez nos alvos alterados e retornou apenas 16 avisos consultivos de novos passos tipográficos e tons da rampa editorial; não houve antipadrão bloqueante.
- Validação no navegador: 320, 390, 768, 1440 e 1920 px sem transbordamento; foco inicial no link de salto; FAQ operável; hero e oferta legíveis; `prefers-reduced-motion` reduziu transições para atualização imediata.
- Testes: `npm run lint` passou; Vitest passou 11/11; `npm run build` compilou todas as rotas; Playwright passou 12/12, incluindo 1920 px, teclado, FAQ e movimento reduzido.
- Evidências completas sem dados pessoais: `evidencias/unslop-before-1440.png`, `evidencias/unslop-before-390.png`, `evidencias/unslop-after-1440.png` e `evidencias/unslop-after-390.png`.
- A metodologia Unslop é de Damir Sokolovsky (@heydamir), licenciada sob CC BY 4.0.

### Preparação Asaas para produção — 05/11/2026

- A documentação oficial foi revisada novamente. O payload já oferecia `PIX` e `CREDIT_CARD` no mesmo checkout, com compra única (`DETACHED`) e preço canônico de 4.990 centavos no servidor.
- O domínio do checkout de produção foi alinhado ao endereço oficial `https://asaas.com/checkoutSession/show?id=...`; o Sandbox permanece separado em `https://sandbox.asaas.com`.
- Os callbacks agora são montados com a API `URL`, preservando query strings existentes e codificando ID e token privados do pedido.
- Foram criados `.env.production.example`, `scripts/check-production-readiness.mjs` e `docs/operacao/ASAAS-PRODUCAO.md`. A checagem reprova URL local, preço divergente, token de webhook inválido, PDF público e abertura sem configuração completa, sem imprimir segredos.
- A interface informa explicitamente Pix e cartão. O checkout continua fechado em produção até domínio, banco persistente, PDF privado, webhook real, compra controlada e aprovação expressa do titular.
- Verificação observada: `npm run lint` passou; Vitest passou 12/12; `npm run build` compilou todas as rotas; Playwright passou 12/12; o modelo incompleto foi reprovado pela trava e uma configuração inteiramente fictícia completa foi aprovada, sem chamada externa.

### Domínio e pacote de hospedagem — 05/11/2026

- `https://pesdeseda.com.br` foi definido como domínio oficial em callbacks, webhook, metadados canônicos e modelo de produção.
- O README passou a documentar DNS, HTTPS, variáveis, Asaas, homologação, abertura, monitoramento, backup e rollback.
- Foram adicionados `Dockerfile`, `.dockerignore` e `compose.production.example.yml` para uma instância Node.js 24 com volumes persistentes separados para SQLite e PDF privado.
- `SITE_INDEXABLE=false` e `SALES_ENABLED=false` permanecem como travas iniciais. A checagem de go-live exige ambos habilitados somente depois da compra controlada e da aprovação do titular.
- A página comercial passou a ser renderizada dinamicamente para que a trava de vendas aplicada no ambiente de execução não fique congelada no build.
- Verificação: lint passou; Vitest passou 12/12; build Next.js passou; Playwright passou 12/12; a imagem Docker foi construída, iniciou como usuário sem privilégios e respondeu HTTP 200; o runtime foi reduzido a dependências de produção com 0 vulnerabilidades conhecidas em `npm audit --omit=dev`.
