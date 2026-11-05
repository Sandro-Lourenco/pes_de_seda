# Sistema visual | Edição de família
## Conceito
Compor a página como uma edição impressa que se desdobra na tela. A assinatura visual é um fio curvo, semelhante a uma fita de seda marcando uma página. Ele aparece na abertura e retorna junto da oferta. Uma capa real, uma fotografia autorizada e uma citação bem composta dão identidade à página. Preservar textura, margem e silêncio visual entre essas peças.

## Tokens
| Papel | Valor | Uso |
|---|---|---|
| Papel | #FAF7F0 | Fundo principal |
| Tinta | #302C28 | Parágrafos e títulos |
| Folha | #344E42 | Botão principal com texto branco e faixa de oferta |
| Cerâmica | #894B38 | Numeração de capítulos e sublinhados |
| Linho | #EBE4D8 | Fundo alternado e áreas de imagem |
| Divisor | #D7CFC1 | Fios decorativos; controles exigem borda mais contrastante |
| Foco | #79401F | Anel de 3 px com afastamento de 3 px; em fundo escuro usar branco |

Títulos em Source Serif 4, itálico apenas em palavras escolhidas; fallback Georgia. Interface em Source Sans 3 ou fonte do sistema. Hospedar fontes localmente com licença e font-display swap. Escala desktop/celular: H1 88/52 px, H2 56/36, H3 28/24, corpo 18/17, legenda 14/14. Entrelinha de títulos 1,05–1,15; corpo 1,55. Limitar texto corrido a 62 caracteres por linha. Espaçamento base 4, 8, 12, 16, 24, 32, 48, 72 e 104 px.
## Composição por dispositivo
| Largura | Composição |
|---|---|
| 320–639 px | Coluna única, margens 20 px (16 px a 320), título e CTA antes da imagem; índice em linhas; oferta com botão de largura total |
| 640–1023 px | Margens 32 px; duas colunas apenas quando ambas acomodam texto legível |
| 1024 px ou mais | Conteúdo até 1200 px, grade de 12 colunas; abertura com texto em 5, respiro de 1 e imagem em 6; autoria em composição invertida |
Abertura em papel claro, índice numerado sobre papel, autora em linho, FAQ com divisores e oferta em verde profundo. Alternar ritmo; reservar caixas fechadas para oferta e mensagens funcionais.
## Componentes e estados
| Componente | Anatomia e estados |
|---|---|
| CTA primário | Altura mínima 48 px, raio 8 px, rótulo explícito. Hover escurece; foco contorna; ao clicar mostra “Abrindo pagamento…” e bloqueia duplo clique. Em falha, reabilitar e preservar contexto |
| Link editorial | Texto sublinhado e seta discreta; âncora compensa cabeçalho fixo. Área de toque mínima proposta 44 × 44 px |
| Índice | Número pequeno à esquerda, título e descrição à direita; divisor fino entre entradas |
| Citação | Aspas tipográficas e crédito em texto; largura menor que o corpo da seção |
| FAQ | Pergunta em botão semântico ou summary; indicador +/−; texto permanece acessível ao teclado e sem animação |
| Status de pedido | Título em linguagem simples, identificação mascarada e ação principal. Diferenciar estados com texto e ícone além da cor |
| Formulário | Rótulo persistente, erro junto ao campo, mensagem de sucesso anunciada e foco previsível |

## Direção de arte e revisão
Capa na proporção real, iluminada lateralmente sobre papel ou tecido. Priorizar material enviado pela autora. Se faltar fotografia, usar composição editorial simples. Evitar foto genérica de spa, estrelas fictícias, contadores regressivos, repetição de cartões idênticos e efeitos de vidro. Verificar contraste de texto, zoom de 200%, teclado, 320 px sem transbordamento, imagens com dimensões reservadas e CTA operacional mesmo se a animação falhar.
