# Diretrizes de animação

Personalidade: premium e calma. Movimento deve comunicar hierarquia ou resposta, nunca preencher silêncio.

- Capa: entrada única de 8 px, aproximadamente 320–420 ms.
- Abertura: stagger curto de 60 ms, conteúdo inicialmente visível.
- CTA: seta desloca 2 px em 140 ms no hover; botão responde ao toque.
- FAQ: estado nativo e imediato; foco permanece na pergunta.
- Compra: status textual em região `aria-live`; nenhuma animação bloqueia a ação.
- Propriedades preferidas: `transform` e opacidade sem ocultar o HTML inicial.
- `prefers-reduced-motion: reduce`: deslocamentos e transições são removidos, preservando todos os estados.

