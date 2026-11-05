---
name: "Pés de Seda"
description: "Um caderno de família contemporâneo para uma edição digital de autocuidado."
colors:
  papel: "#FAF7F0"
  tinta: "#302C28"
  tinta-suave: "#625B54"
  folha: "#344E42"
  folha-profunda: "#263B31"
  ceramica: "#894B38"
  linho: "#EBE4D8"
  divisor: "#CFC5B6"
  foco: "#79401F"
  branco-quente: "#FFFDF8"
  papel-estudio: "#F5EEE3"
  papel-luz: "#FBF7EF"
  folha-estudio: "#17483A"
  folha-estudio-profunda: "#0F332A"
  folha-noturna: "#092820"
  salvia: "#D8DFCF"
  pessego: "#E5A38E"
  texto-invertido-suave: "#C9D4CF"
  papel-hover: "#F1ECE3"
  capa-papel: "#EFE7DA"
  capa-borda: "#C9BDAB"
  oferta-acento: "#F0BCA8"
  oferta-texto: "#D9E1DC"
  oferta-texto-forte: "#DCE4DF"
  rodape: "#25342D"
  rodape-acento: "#EFB8A2"
  branco-28: "rgb(255 255 255 / .28)"
  branco-18: "rgb(255 255 255 / .18)"
  sombra-neutra: "rgb(0 0 0 / .2)"
  papel-neutro: "#F3F2ED"
  cinza-estudio: "#E8E8E2"
  lavanda-editorial: "#DEDDE4"
  verde-estudio-texto: "#233D34"
  texto-estudio-suave: "#5E6963"
  divisor-estudio: "#C9CBC4"
typography:
  display:
    fontFamily: "Source Serif 4 Variable, Georgia, serif"
    fontSize: "clamp(4.7rem, 10.2vw, 8.7rem)"
    fontWeight: 520
    lineHeight: 0.76
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Source Serif 4 Variable, Georgia, serif"
    fontSize: "clamp(2.8rem, 5.6vw, 5rem)"
    fontWeight: 520
    lineHeight: 0.95
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Source Serif 4 Variable, Georgia, serif"
    fontSize: "clamp(1.45rem, 2.5vw, 2rem)"
    fontWeight: 520
    lineHeight: 1.12
  body:
    fontFamily: "Source Sans 3 Variable, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Source Sans 3 Variable, system-ui, sans-serif"
    fontSize: "0.73rem"
    fontWeight: 760
    lineHeight: 1
    letterSpacing: "0.13em"
  micro:
    fontFamily: "Source Sans 3 Variable, system-ui, sans-serif"
    fontSize: "0.58rem"
    fontWeight: 760
    lineHeight: 1
  caption:
    fontFamily: "Source Sans 3 Variable, system-ui, sans-serif"
    fontSize: "0.70rem"
    fontWeight: 400
    lineHeight: 1.35
  meta:
    fontFamily: "Source Sans 3 Variable, system-ui, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 760
    lineHeight: 1
  helper:
    fontFamily: "Source Sans 3 Variable, system-ui, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 400
    lineHeight: 1.45
  navigation:
    fontFamily: "Source Sans 3 Variable, system-ui, sans-serif"
    fontSize: "0.88rem"
    fontWeight: 650
    lineHeight: 1
  note:
    fontFamily: "Source Sans 3 Variable, system-ui, sans-serif"
    fontSize: "0.90rem"
    fontWeight: 400
    lineHeight: 1.5
  body-small:
    fontFamily: "Source Sans 3 Variable, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.6
  body-mobile:
    fontFamily: "Source Sans 3 Variable, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  display-mobile:
    fontFamily: "Source Serif 4 Variable, Georgia, serif"
    fontSize: "clamp(4.6rem, 22vw, 6rem)"
    fontWeight: 520
    lineHeight: 0.76
  display-compact:
    fontFamily: "Source Serif 4 Variable, Georgia, serif"
    fontSize: "4.15rem"
    fontWeight: 520
    lineHeight: 0.76
  display-order:
    fontFamily: "Source Serif 4 Variable, Georgia, serif"
    fontSize: "clamp(2.5rem, 8vw, 4.5rem)"
    fontWeight: 520
    lineHeight: 0.95
  display-studio:
    fontFamily: "Source Serif 4 Variable, Georgia, serif"
    fontSize: "clamp(4.2rem, 7.5vw, 7.3rem)"
    fontWeight: 500
    lineHeight: 0.84
    letterSpacing: "-0.04em"
  headline-studio:
    fontFamily: "Source Serif 4 Variable, Georgia, serif"
    fontSize: "clamp(3.6rem, 6.7vw, 6.5rem)"
    fontWeight: 520
    lineHeight: 0.95
  body-studio:
    fontFamily: "Source Sans 3 Variable, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
rounded:
  none: "0"
  action: "8px"
  panel: "12px"
  thread: "50%"
spacing:
  gutter: "clamp(1rem, 4vw, 3rem)"
  section: "clamp(6rem, 11vw, 10rem)"
  grid-gap: "1.5rem"
  touch-target: "48px"
components:
  button-primary:
    backgroundColor: "{colors.folha}"
    textColor: "{colors.branco-quente}"
    typography: "{typography.body}"
    rounded: "{rounded.action}"
    padding: "0.8rem 1.3rem"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.folha-profunda}"
    textColor: "{colors.branco-quente}"
  button-light:
    backgroundColor: "{colors.branco-quente}"
    textColor: "{colors.folha-profunda}"
    typography: "{typography.body}"
    rounded: "{rounded.action}"
    padding: "0.8rem 1.3rem"
    height: "58px"
  cover-preview:
    backgroundColor: "{colors.linho}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
    padding: "clamp(1.6rem, 4vw, 2.5rem) 1.4rem 1.8rem"
---

# Design System: Pés de Seda

## Overview

**Creative North Star: “Estúdio botânico de uma história de família”**

Pés de Seda transforma uma história íntima em uma edição digital serena, humana e criteriosa. A linguagem combina luz natural, papel quente, linho, pedra e folhas com a disciplina de uma publicação contemporânea: margens amplas, linhas finas, índice numerado e composições deliberadamente assimétricas.

A abertura concentra a atenção em dois gestos: o e-book encenado como objeto em uma natureza-morta botânica e uma coluna de decisão no espaço negativo da fotografia. A referência fornecida informa luz, materialidade e ritmo; textos, prova social, promessas e componentes permanecem próprios de Pés de Seda.

A interface informa antes de persuadir. A imagem de abertura é identificada como representação visual e não como fotografia documental; a autora aparece como dedicatória, sem retrato inventado nem card promocional; e a oferta encerra a narrativa como um colofão. A capa final continua pendente de aprovação.

**Key Characteristics:**

- Serifa expressiva para memória e autoria; sans-serif sóbria para leitura e operação.
- Muito espaço negativo, grade editorial e alinhamentos assimétricos.
- Fólios, divisores de um pixel e fio curvo como motivos recorrentes.
- Persuasão discreta, sem prova social fabricada nem promessa clínica.
- Estados de foco fortes, alvos de toque confortáveis e movimento dispensável.

## Colors

A paleta parece impressa em materiais naturais: papel quente, tinta escura, verde folha e um acento de cerâmica usado com parcimônia.

O conceito Estúdio autorizado acrescenta uma rampa tonal, sem mudar as famílias cromáticas: Papel Estúdio e Papel Luz aquecem superfícies fotográficas; Folha Estúdio, Folha Estúdio Profunda e Folha Noturna criam os três níveis escuros; Sálvia separa o material complementar; Pêssego e Texto Invertido Suave são reservados a detalhes e leitura sobre verde.

### Primary

- **Folha** (`#344E42`): fundo da oferta, ação principal e sinal de confiança; Folha Profunda (`#263B31`) responde ao hover e ancora o rodapé.

### Secondary

- **Cerâmica** (`#894B38`): acento editorial para itálicos, fólios, números, citações e o fio curvo; não deve dominar grandes superfícies.

### Neutral

- **Papel** (`#FAF7F0`): tela principal e superfície de leitura.
- **Tinta** (`#302C28`): texto e títulos; Tinta Suave (`#625B54`) sustenta texto secundário.
- **Linho** (`#EBE4D8`): faixa tonal da autora e superfícies de apoio.
- **Divisor** (`#CFC5B6`): linhas estruturais de um pixel.
- **Branco Quente** (`#FFFDF8`): texto sobre Folha e ação clara no colofão.

### Named Rules

**Regra do Acento Raro.** Cerâmica pontua hierarquia e memória; não vira cor genérica de superfície.

**Regra do Contraste Editorial.** Texto longo usa Tinta sobre Papel/Linho ou Branco Quente sobre Folha; Foco (`#79401F`) mantém contorno visível de 3px.

## Typography

**Display Font:** Source Serif 4 Variable (fallback Georgia, serif)  
**Body Font:** Source Sans 3 Variable (fallback system-ui, sans-serif)

**Character:** Source Serif 4 traz voz literária e familiar sem nostalgia ornamental. Source Sans 3 mantém preço, fatos, navegação, avisos e ações diretos e contemporâneos.

### Hierarchy

- **Display** (520, `clamp(4.7rem, 10.2vw, 8.7rem)`, 0.76): título heroico, compacto e assimétrico; o conectivo em itálico recebe escala e cor distintas.
- **Headline** (520, `clamp(2.8rem, 5.6vw, 5rem)`, 0.95): aberturas de capítulo e oferta, com composição balanceada.
- **Title** (520, `clamp(1.45rem, 2.5vw, 2rem)`, 1.12): itens do índice e perguntas.
- **Body** (400, 18px/1.6; 17px no celular): leitura confortável, normalmente limitada a 31–47rem conforme a função.
- **Label** (760, 0.73rem, `0.13em`, caixa alta): fólios, edição, numeração e metadados.

### Named Rules

**Regra das Duas Vozes.** Serifa conta a história; sans-serif orienta e operacionaliza. Não introduza uma terceira família.

## Layout

O contêiner tem largura máxima de 1240px e gutter fluido de `clamp(1rem, 4vw, 3rem)`. Em desktop, a composição usa 12 colunas com intervalos de 1.5rem, alternando blocos deslocados em vez de centralizar tudo. Seções respiram com `clamp(6rem, 11vw, 10rem)` e começam por um fólio separado do conteúdo.

Abaixo de 768px, grades editoriais viram fluxos verticais, as ações ocupam a largura disponível e autoria/oferta reordenam texto antes do elemento visual. O layout precisa permanecer íntegro em 320px, 390px e 1440px, suportar zoom de 200% e nunca depender do fio ou da numeração decorativa para transmitir conteúdo.

## Elevation & Depth

O sistema é plano por padrão. Profundidade vem de blocos tonais, linhas finas, sobreposição tipográfica e assimetria. Sombras aparecem apenas onde há um objeto editorial físico — a capa provisória — e no painel isolado de acompanhamento do pedido; não são decoração de cards.

### Shadow Vocabulary

- **Objeto editorial** (`-18px 28px 48px rgb(40 47 43 / .18), inset 10px 0 18px rgb(92 67 43 / .07)`): faz a capa parecer um livreto impresso.
- **Painel de pedido** (`0 24px 70px rgb(67 49 33 / .12)`): separa uma tarefa transacional singular da superfície de linho.

### Named Rules

**Regra do Plano por Padrão.** Não eleve seções, autoria, perguntas ou fatos como cards; use cor, espaço e divisores.

## Shapes

As formas são contidas: superfícies editoriais mantêm cantos retos, ações usam raio de 8px e o painel transacional admite 12px. O círculo aparece somente como construção parcial do fio curvo. Divisores de 1px e bordas discretas substituem caixas pesadas; a capa usa proporção 3:4, leve rotação e recorte controlado.

## Components

### Buttons

- **Shape:** retângulo de 8px, altura mínima de 52px (58px no checkout) e peso 720.
- **Primary:** Branco Quente sobre Folha, `0.8rem 1.3rem`; hover em Folha Profunda.
- **Hover / Focus:** transição de 140ms; foco de 3px com offset de 3px; active reduz a `scale(.98)`.
- **Light:** Branco Quente sobre Folha Profunda na oferta; desabilitado mantém o contexto com opacidade 0.62 e texto explicativo.

### Cards / Containers

- **Corner Style:** reto para blocos editoriais; 12px somente no painel de pedido.
- **Background:** Papel, Linho ou Folha conforme a seção.
- **Shadow Strategy:** plano por padrão; capa e painel de pedido são as exceções nomeadas.
- **Border:** Divisor de 1px para listas, citações e agrupamentos.
- **Internal Padding:** segue o ritmo de 1.25rem a 2.5rem, preservando espaço negativo.

### Navigation

O cabeçalho é uma linha editorial tripartida com wordmark serifado, links sans-serif e oferta em Folha. Links têm alvo mínimo de 48px e sublinhado deslocado; no celular, a navegação intermediária some, preservando wordmark e oferta. O rodapé retoma o contraste Folha Profunda/Branco Quente.

### Capa provisória

Objeto 3:4 de linho/papel, título serifado, fio de cerâmica e microtipografia em caixa alta. Deve sempre dizer “Prévia editorial” e nunca ser apresentada como capa final aprovada.

### Índice e FAQ

Índice e perguntas são listas lineares divididas por traços, sem cards. O FAQ usa `details/summary`, alvo mínimo de 82px e sinal “+” que gira ao abrir; o estado continua compreensível sem animação.

## Do's and Don'ts

### Do:

- **Do** usar margens generosas, assimetria e linhas finas para criar hierarquia.
- **Do** manter preço, confirmação e estados de compra claros e vindos do servidor.
- **Do** marcar toda representação atual da capa como prévia editorial.
- **Do** preservar foco visível, navegação por teclado, contraste AA e `prefers-reduced-motion`.
- **Do** tratar a autora como dedicatória tipográfica e a oferta como colofão.

### Don't:

- **Don't** usar imagem gerada como prova, depoimento, retrato da autora ou registro de resultado. Representações de produto devem ser identificadas como tal.
- **Don't** transformar conteúdo em uma grade de cards arredondados e sombreados.
- **Don't** inventar depoimentos, resultados, autoridade clínica ou promessa de eficácia.
- **Don't** aplicar Cerâmica indiscriminadamente ou introduzir cores saturadas alheias à paleta.
- **Don't** abrir o checkout de produção sem autorização expressa da titular.
