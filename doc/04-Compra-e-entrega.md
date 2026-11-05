# Contrato de compra | Asaas
## Jornada
Ao tocar em comprar, o navegador solicita uma tentativa ao servidor. O servidor cria um pedido pelo preço cadastrado, cria o checkout Asaas, salva a associação e devolve o endereço hospedado. A pessoa paga no Asaas e retorna ao pedido. O retorno pode ocorrer antes da notificação financeira. Mostrar “Aguardando confirmação” até o servidor confirmar o evento válido. Oferecer download na página e recuperação por e-mail verificado.

## Contratos do projeto
| Interface sugerida | Comportamento |
|---|---|
| POST /api/checkout | Recebe identificador de tentativa e produto; exige mesma origem. Reutilizar tentativa existente; ignorar qualquer preço enviado pelo navegador |
| POST /api/webhooks/asaas | Validar token asaas-access-token e correlacionar checkout.id, pedido, ambiente e oferta. Persistir evento e mudança de estado na mesma transação antes de responder sucesso |
| GET /pedido | Exigir sessão ou link privado de acesso. Mostrar pendente, pago, cancelado, expirado ou acesso revogado |
| GET /api/download | Conferir direito ativo em cada requisição. Servir o PDF privado ou emitir URL assinada curta. Usar cache privado |
| POST /api/recuperar | Aceitar e-mail e responder de forma neutra; enviar link temporário apenas se houver compra elegível. Limitar tentativas |

## Criação no Asaas
Servidor envia POST /v3/checkouts usando access_token. Usar preço canônico em centavos internamente e converter para reais apenas na API. Preencher billingTypes com PIX e CREDIT_CARD se habilitados, chargeTypes com DETACHED, um item de quantidade 1, externalReference com o ID opaco do pedido e callback com successUrl, cancelUrl e expiredUrl. Salvar o ID retornado antes de encaminhar o comprador. Validar o endereço de checkout do ambiente pela documentação vigente.

| Evento | Resultado esperado |
|---|---|
| CHECKOUT_CREATED | Associar ou confirmar tentativa; acesso permanece fechado |
| CHECKOUT_PAID | Marcar pago e criar um único direito de acesso; enfileirar entrega com chave única |
| CHECKOUT_CANCELED / CHECKOUT_EXPIRED | Encerrar tentativa ainda aberta e permitir nova compra. Evento tardio não rebaixa pedido pago |
| Estorno ou contestação | Correlacionar eventos financeiros da cobrança ao pedido; revogar novos downloads conforme política aprovada e registrar motivo |

## Persistência e falhas
Manter pedidos, tentativas, eventos, direitos de acesso e fila de envio. Definir unicidade para chave de tentativa, ID de checkout, ID de evento e entrega por pedido. Se o Asaas responder com timeout após o envio, guardar estado “em conciliação” e localizar o checkout pela referência antes de recriar. Se o evento chegar cedo, persistir em fila para conciliação ou permitir nova tentativa do provedor. Reprocessar falhas de e-mail sem cobrar novamente. Registrar IDs operacionais e tempos; ocultar chaves, tokens, dados de cartão e links privados.

## Configuração e operação
Separar sandbox e produção com chaves, tokens, bancos e URLs próprias. Configurar origem HTTPS, preço, identificação do produto, versão do PDF, armazenamento privado e remetente de e-mail autenticado. Capturar e confirmar o endereço de entrega; manter consentimento de marketing separado. Adotar backup restaurável e verificar transações pagas sem direito de acesso. Fechar novas vendas durante incidente preservando o atendimento de pedidos existentes.

Fontes oficiais: https://docs.asaas.com/reference/criar-novo-checkout · https://docs.asaas.com/docs/link-do-checkout-e-redirecionamento-do-cliente · https://docs.asaas.com/docs/eventos-para-checkout · https://docs.asaas.com/docs/faq-do-asaas-checkout
