# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Pessoas interessadas em autocuidado que avaliam, principalmente pelo celular, a compra do e-book em português de Ana Maria Lourenço.

## Product Purpose

Apresentar o conteúdo e a origem familiar de Pés de Seda, permitir uma decisão de compra informada e liberar o PDF somente depois da confirmação válida do pagamento.

## Positioning

Uma edição digital de uma experiência familiar registrada pela autora, apresentada com proximidade humana e sem promessas de eficácia clínica.

## Operating Context

A pessoa conhece o livro na landing page, consulta o conteúdo, a autora, a oferta e as perguntas frequentes, abre o checkout hospedado do Asaas e retorna à página do pedido. O retorno pode ocorrer antes do webhook; nesse caso o acesso continua protegido e o estado permanece “Aguardando confirmação”.

## Capabilities and Constraints

- Venda única por R$ 49,90; preço e confirmação vêm do servidor.
- Checkout hospedado Asaas com Pix e cartão conforme a disponibilidade do ambiente.
- PDF comercial em armazenamento privado, nunca usado como fixture.
- Produção permanece fechada até aprovação expressa da titular.
- Preservar rotas, banco, hooks, estados, webhooks, entrega e regras de segurança existentes.
- A página deve funcionar em 320 px, 390 px e 1440 px, por teclado e com movimento reduzido.

## Brand Commitments

Pés de Seda, de Ana Maria Lourenço. Autenticidade, delicadeza, confiança, sofisticação discreta, proximidade humana e tradição entre gerações. A experiência deve lembrar uma edição de família, com papel, serifa, índice numerado e um fio curvo inspirado em fita de seda.

## Evidence on Hand

- Conteúdo e especificações em `doc/`.
- Implementação funcional e testes no repositório.
- Não há retrato autorizado nem capa final aprovada no projeto.
- Não há depoimentos autorizados para publicação.
- A imagem gerada existente não constitui fotografia autorizada da marca.

## Product Principles

- Informar antes de persuadir.
- Tratar a história familiar com humanidade, sem fabricar prova social ou resultado clínico.
- Manter compra, confirmação e entrega seguras e compreensíveis.
- Fazer a capa, o conteúdo e a autoria liderarem a experiência.
- Distinguir claramente simulação local, sandbox e produção.

## Accessibility & Inclusion

Contraste WCAG AA, navegação completa por teclado, foco visível, alvos de toque confortáveis, zoom de 200%, conteúdo legível sem animação e respeito a `prefers-reduced-motion`.
