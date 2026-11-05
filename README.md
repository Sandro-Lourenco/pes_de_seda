# Pés de Seda

Landing page e fluxo de venda do e-book **Pés de Seda**, de Ana Maria Lourenço.

- Domínio oficial: [https://pesdeseda.com.br](https://pesdeseda.com.br)
- Preço canônico: **R$ 49,90**
- Pagamento: checkout hospedado pelo Asaas com **Pix e cartão de crédito**
- Branch de publicação: `main`
- Runtime: Node.js 24

O site deve ser publicado primeiro com as vendas fechadas. A abertura comercial só acontece depois de validar domínio, HTTPS, webhook, banco, PDF privado e uma compra controlada em produção.

## Estado da entrega

- Interface responsiva e acessível.
- Checkout Asaas criado somente no servidor.
- Preço e credenciais ausentes do navegador.
- Confirmação financeira exclusiva pelo webhook `CHECKOUT_PAID`.
- Webhook autenticado e idempotente.
- Retorno antecipado mantém “Aguardando confirmação” e bloqueia o PDF.
- Download exige pedido pago e direito ativo.
- Pix e cartão já validados no Sandbox.
- Produção fechada por padrão com `SALES_ENABLED=false`.

## Arquitetura de hospedagem

Esta versão utiliza SQLite e um PDF privado no filesystem. Portanto, a opção pronta para produção é:

- uma única instância Node.js;
- volume persistente para `/app/data`;
- volume privado para `/app/private`;
- proxy HTTPS na frente da aplicação;
- backups do banco e do PDF.

Não publique esta versão diretamente em Vercel, funções serverless ou múltiplas réplicas. Esses ambientes exigem antes a implementação do repositório PostgreSQL e de armazenamento privado de objetos.

## Arquivos para a hospedagem

| Arquivo | Finalidade |
|---|---|
| `.env.production.example` | Modelo das variáveis, sem segredos |
| `Dockerfile` | Build reproduzível com Node.js 24 |
| `compose.production.example.yml` | Aplicação, portas e volumes persistentes |
| `scripts/check-production-readiness.mjs` | Bloqueia configurações incompletas |
| `docs/operacao/ASAAS-PRODUCAO.md` | Contrato detalhado do pagamento |

## 1. Preparar DNS e servidor

No provedor de DNS do domínio, configure:

- registro `A` de `pesdeseda.com.br` apontando para o IPv4 do servidor;
- registro `A` de `www.pesdeseda.com.br` para o mesmo IPv4, ou `CNAME` para `pesdeseda.com.br`;
- se houver IPv6, o registro `AAAA` correspondente.

No servidor Linux instale Git, Docker Engine, Docker Compose e um proxy HTTPS como Caddy. Libere apenas as portas públicas `80` e `443`. A porta `3000` permanece vinculada a `127.0.0.1`.

## 2. Baixar o projeto

```bash
git clone https://github.com/Sandro-Lourenco/pes_de_seda.git
cd pes_de_seda
git checkout main
```

Para atualizações futuras:

```bash
git pull --ff-only origin main
```

## 3. Configurar as variáveis

Crie o arquivo local de produção, que é ignorado pelo Git:

```bash
cp .env.production.example .env.production.local
chmod 600 .env.production.local
```

Preencha no servidor:

```dotenv
SALES_ENABLED=false
CHECKOUT_MODE=asaas
PRODUCT_PRICE_CENTS=4990

APP_URL=https://pesdeseda.com.br
SITE_INDEXABLE=false

ASAAS_API_URL=https://api.asaas.com/v3
ASAAS_ACCESS_TOKEN='$aact_prod_COLOQUE_A_CHAVE_REAL_AQUI'
ASAAS_WEBHOOK_TOKEN='COLOQUE_UM_TOKEN_ALEATORIO_DE_32_A_255_CARACTERES'

ASAAS_SUCCESS_URL=https://pesdeseda.com.br/pedido
ASAAS_CANCEL_URL=https://pesdeseda.com.br/pedido
ASAAS_EXPIRED_URL=https://pesdeseda.com.br/pedido
ASAAS_WEBHOOK_URL=https://pesdeseda.com.br/api/webhooks/asaas

PDF_STORAGE_KEY=/app/private/pes-de-seda.pdf
DATABASE_PATH=/app/data/pes-de-seda.sqlite
```

Use aspas simples na chave Asaas para preservar o caractere inicial `$`. Nunca envie `.env.production.local` por Git, e-mail ou mensagem pública. Em plataformas com cofre de segredos, cadastre as mesmas variáveis diretamente no painel.

## 4. Instalar o PDF e criar os volumes

```bash
mkdir -p data private
chmod 700 data private
```

Copie o PDF comercial final para:

```text
private/pes-de-seda.pdf
```

O PDF não pode ficar dentro de `public/`. O volume `private` é montado como somente leitura no contêiner.

## 5. Validar antes da publicação

Com Node.js 24 disponível no servidor:

```bash
npm ci
npm run lint
npm test
npm run build
npm run check:production
```

`npm run check:production` valida domínio, HTTPS, ambiente Asaas, preço, token do webhook, banco e PDF sem imprimir os segredos. Com `SALES_ENABLED=false`, ele verifica a pré-homologação.

## 6. Subir com Docker

```bash
docker compose -f compose.production.example.yml build
docker compose -f compose.production.example.yml up -d
docker compose -f compose.production.example.yml ps
docker compose -f compose.production.example.yml logs --tail=100 web
```

A aplicação ficará disponível internamente em `http://127.0.0.1:3000`. O healthcheck do Compose verifica a página automaticamente.

## 7. Ativar HTTPS

Exemplo de `/etc/caddy/Caddyfile`:

```caddyfile
www.pesdeseda.com.br {
    redir https://pesdeseda.com.br{uri} permanent
}

pesdeseda.com.br {
    encode zstd gzip
    reverse_proxy 127.0.0.1:3000
}
```

Depois:

```bash
sudo systemctl reload caddy
```

Confirme:

```bash
curl -I https://pesdeseda.com.br
```

O certificado precisa estar válido antes de configurar callbacks e webhook no Asaas.

## 8. Configurar o Asaas de produção

Na conta **de produção** do Asaas:

1. Crie uma API key de produção e salve-a apenas no cofre do servidor.
2. Cadastre o webhook `https://pesdeseda.com.br/api/webhooks/asaas`.
3. Configure no webhook exatamente o mesmo token salvo em `ASAAS_WEBHOOK_TOKEN`.
4. Ative pelo menos `CHECKOUT_CREATED`, `CHECKOUT_PAID`, `CHECKOUT_CANCELED` e `CHECKOUT_EXPIRED`.
5. Quando disponíveis na conta, mantenha os eventos de estorno e chargeback tratados pela aplicação.

Não use a API key como token do webhook. Sandbox e produção possuem chaves, dados e webhooks independentes.

## 9. Homologar com vendas fechadas

Mantenha:

```dotenv
SALES_ENABLED=false
SITE_INDEXABLE=false
```

Verifique:

- `https://pesdeseda.com.br` abre com HTTPS;
- o botão mostra “Vendas em preparação”;
- o endpoint do webhook está acessível ao Asaas e rejeita token incorreto;
- o banco permanece após reiniciar o contêiner;
- o PDF não possui URL pública;
- callbacks retornam para `/pedido`;
- logs não exibem chave, CPF, cartão ou token privado.

## 10. Compra controlada e abertura

Depois da aprovação do titular, altere temporariamente:

```dotenv
SALES_ENABLED=true
SITE_INDEXABLE=false
```

Recrie o contêiner:

```bash
docker compose -f compose.production.example.yml up -d --build
```

Faça uma compra controlada de R$ 49,90 e confirme:

1. o checkout oferece Pix e cartão;
2. o retorno anterior ao webhook mostra “Aguardando confirmação”;
3. o webhook `CHECKOUT_PAID` muda o pedido para pago;
4. o download só abre depois da confirmação;
5. webhook duplicado não duplica direito ou entrega;
6. estorno/chargeback revoga o acesso.

Após a compra controlada passar, defina:

```dotenv
SALES_ENABLED=true
SITE_INDEXABLE=true
```

Execute a trava final e reinicie:

```bash
npm run check:production:go-live
docker compose -f compose.production.example.yml up -d --build
```

## 11. Atualizar, monitorar e voltar atrás

Atualização:

```bash
git pull --ff-only origin main
npm ci
npm run check
docker compose -f compose.production.example.yml up -d --build
```

Para pausar vendas, altere `SALES_ENABLED=false` e `SITE_INDEXABLE=false` e reinicie o serviço. A aplicação continua disponível, mas não cria novos checkouts.

Monitore respostas `5xx`, falhas de webhook, espaço em disco, integridade do volume `data`, tentativas presas e pedidos aguardando confirmação por tempo anormal.

Faça backup periódico de `data/pes-de-seda.sqlite` e `private/pes-de-seda.pdf`. Para copiar o SQLite com segurança, pare o contêiner ou use uma ferramenta compatível com backup online do SQLite.

## Desenvolvimento local

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). O arquivo `.env.example` usa Sandbox/local e permanece fechado por padrão.

## Comandos do projeto

```bash
npm run dev                       # desenvolvimento
npm run lint                      # lint
npm test                          # testes de contratos e pagamento
npm run build                     # build de produção
npm run test:e2e                  # navegador e responsividade
npm run check                     # lint + testes + build
npm run check:production          # pré-homologação
npm run check:production:go-live  # trava final de abertura
npm start                         # servidor de produção
```

## Rotas comerciais

- `POST /api/checkout`: cria um checkout por tentativa e ignora preço do navegador.
- `POST /api/webhooks/asaas`: autentica e processa eventos idempotentemente.
- `GET /api/pedido`: consulta privada do estado do pedido.
- `GET /pedido`: retorno seguro do checkout.
- `GET /api/download`: entrega o PDF somente com direito ativo.
- `GET /api/pagamentos/asaas`: reconciliação pontual e privada.

O link público a ser enviado aos compradores é somente:

```text
https://pesdeseda.com.br
```

O link do checkout Asaas é dinâmico e criado individualmente para cada pedido.

## Documentação complementar

- [Operação Asaas em produção](docs/operacao/ASAAS-PRODUCAO.md)
- [Plano e resultados](doc/07-Plano-e-verificacao.md)
- [Sistema visual](DESIGN.md)
- [Verdade do produto](PRODUCT.md)

Referências oficiais: [Asaas Checkout](https://docs.asaas.com/docs/checkout-asaas), [autenticação](https://docs.asaas.com/docs/authentication-2), [webhooks](https://docs.asaas.com/docs/about-webhooks) e [prontidão para produção](https://docs.asaas.com/docs/production-readiness).
