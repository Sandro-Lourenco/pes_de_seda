# Asaas em produção — Pés de Seda

## Situação atual

O checkout aceita **Pix e cartão de crédito** no mesmo pedido. O preço canônico é R$ 49,90 e permanece no servidor. A configuração de produção está preparada, mas a venda real continua fechada por `SALES_ENABLED=false` até a homologação e a aprovação expressa do titular.

Não existe um link de pagamento permanente. A aplicação cria uma sessão diferente para cada pedido, armazena o ID retornado e redireciona o comprador para o checkout hospedado pelo Asaas.

## Endereços usados

O domínio definitivo da publicação é `https://pesdeseda.com.br`.

| Finalidade | Endereço |
|---|---|
| Botão de compra chama o servidor | `POST https://pesdeseda.com.br/api/checkout` |
| API Asaas Sandbox | `POST https://api-sandbox.asaas.com/v3/checkouts` |
| Checkout Sandbox criado por pedido | `https://sandbox.asaas.com/checkoutSession/show?id=ID_RETORNADO` |
| API Asaas produção | `POST https://api.asaas.com/v3/checkouts` |
| Checkout produção criado por pedido | `https://asaas.com/checkoutSession/show?id=ID_RETORNADO` |
| Retorno de sucesso, cancelamento ou expiração | `https://pesdeseda.com.br/pedido` |
| Webhook Asaas | `POST https://pesdeseda.com.br/api/webhooks/asaas` |
| Consulta privada do pedido | `GET https://pesdeseda.com.br/api/pedido` |
| Download protegido | `GET https://pesdeseda.com.br/api/download` |

O callback `/pedido` não confirma pagamento. Mesmo que o comprador volte antes do webhook, a página mostra “Aguardando confirmação” e o PDF continua bloqueado. Somente o evento autenticado e idempotente `CHECKOUT_PAID` libera o direito.

## Payload comercial

O servidor envia ao Asaas:

- `billingTypes: ["PIX", "CREDIT_CARD"]`;
- `chargeTypes: ["DETACHED"]` para compra única;
- valor de `49.90`, obtido da oferta canônica de 4.990 centavos;
- `externalReference` com o ID opaco do pedido;
- validade de 60 minutos;
- callbacks com ID e token privados do pedido.

Nome, CPF e dados de cartão são coletados na página hospedada pelo Asaas. A aplicação Pés de Seda não recebe dados de cartão. O webhook recebe apenas os dados necessários para correlacionar e confirmar o pedido.

## Sequência segura de publicação

1. Publique a aplicação em runtime Node.js com HTTPS e `SALES_ENABLED=false`.
2. Configure no cofre da hospedagem as variáveis de `.env.production.example`; nunca envie chaves ao Git ou ao navegador.
3. Use uma chave criada na conta **de produção** e `ASAAS_API_URL=https://api.asaas.com/v3`.
4. No Asaas de produção, registre `https://pesdeseda.com.br/api/webhooks/asaas`, gere um token próprio de 32 a 255 caracteres e use o mesmo valor em `ASAAS_WEBHOOK_TOKEN`. Não use a API key como token do webhook.
5. Assine pelo menos `CHECKOUT_CREATED`, `CHECKOUT_PAID`, `CHECKOUT_CANCELED` e `CHECKOUT_EXPIRED`. Mantenha os eventos de estorno/chargeback já tratados pela aplicação quando disponíveis na configuração da conta.
6. Coloque o PDF final fora de `public/` e configure `PDF_STORAGE_KEY` em armazenamento privado/persistente.
7. Garanta banco persistente. O SQLite atual requer uma única instância Node.js com volume persistente; Vercel/serverless ou múltiplas instâncias exigem o adaptador PostgreSQL antes da abertura.
8. Execute `npm run check:production`. A checagem não imprime segredos.
9. Faça uma compra controlada em produção, valide retorno, webhook, duplicidade, download e estorno. Apague ou reembolse a operação conforme a regra comercial.
10. Após a aprovação explícita do titular, altere `SALES_ENABLED=true`, rode `npm run check:production:go-live` e monitore os primeiros pedidos.

## Ambientes

- **Simulação local:** provedor simulado e testes automatizados; não movimenta dinheiro.
- **Sandbox Asaas:** usa dados fictícios, URL e chave próprias; Pix e cartão já foram visualmente validados.
- **Produção Asaas:** usa conta, chave, webhook, domínio e armazenamento próprios. Deve ser homologada novamente; nenhum ID de Sandbox deve ser reutilizado.

## Pendências antes do go-live

- apontamento DNS e certificado HTTPS do domínio `pesdeseda.com.br`;
- chave e webhook da conta Asaas de produção;
- PDF final em armazenamento privado;
- banco persistente compatível com a hospedagem escolhida;
- termos, privacidade, suporte e contato comercial aprovados;
- compra controlada e monitoramento real;
- aprovação expressa para abrir as vendas.

## Referências oficiais

- [Asaas Checkout](https://docs.asaas.com/docs/checkout-asaas)
- [Criar novo checkout](https://docs.asaas.com/reference/criar-novo-checkout)
- [Link e redirecionamento](https://docs.asaas.com/docs/link-do-checkout-e-redirecionamento-do-cliente)
- [Autenticação e ambientes](https://docs.asaas.com/docs/authentication-2)
- [Webhooks](https://docs.asaas.com/docs/about-webhooks)
- [Prontidão para produção](https://docs.asaas.com/docs/production-readiness)
