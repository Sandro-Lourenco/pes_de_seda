import { afterEach, describe, expect, it, vi } from "vitest";
import { AsaasCheckoutProvider } from "@/lib/commerce/asaas-provider";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("adaptador Asaas", () => {
  it("envia Pix, cartão e o preço canônico de R$ 49,90", async () => {
    vi.stubEnv("ASAAS_ACCESS_TOKEN", "token-exclusivo-do-servidor");
    vi.stubEnv("ASAAS_API_URL", "https://api-sandbox.asaas.com/v3");
    vi.stubEnv("ASAAS_SUCCESS_URL", "https://exemplo.test/pedido");
    vi.stubEnv("ASAAS_CANCEL_URL", "https://exemplo.test/pedido");
    vi.stubEnv("ASAAS_EXPIRED_URL", "https://exemplo.test/pedido");
    const fetchMock = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      void input;
      void init;
      return new Response(JSON.stringify({ id: "chk_teste_4990" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await new AsaasCheckoutProvider().create({
      orderId: "ord_teste_4990",
      accessToken: "acesso-privado-do-pedido",
      priceCents: 4_990,
    });

    expect(result.url).toBe("https://sandbox.asaas.com/checkoutSession/show?id=chk_teste_4990");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0];
    const payload = JSON.parse(String(init?.body));
    expect(payload.billingTypes).toEqual(["PIX", "CREDIT_CARD"]);
    expect(payload.chargeTypes).toEqual(["DETACHED"]);
    expect(payload.externalReference).toBe("ord_teste_4990");
    expect(payload.callback).toEqual({
      successUrl: "https://exemplo.test/pedido?pedido=ord_teste_4990&acesso=acesso-privado-do-pedido",
      cancelUrl: "https://exemplo.test/pedido?pedido=ord_teste_4990&acesso=acesso-privado-do-pedido&retorno=cancelado",
      expiredUrl: "https://exemplo.test/pedido?pedido=ord_teste_4990&acesso=acesso-privado-do-pedido&retorno=expirado",
    });
    expect(payload.items).toEqual([{
      name: "E-book Pés de Seda",
      description: "Edição digital em PDF, 41 páginas",
      quantity: 1,
      value: 49.9,
    }]);
  });

  it("monta o link oficial do checkout no ambiente de produção", async () => {
    vi.stubEnv("ASAAS_ACCESS_TOKEN", "token-exclusivo-do-servidor");
    vi.stubEnv("ASAAS_API_URL", "https://api.asaas.com/v3");
    vi.stubEnv("ASAAS_SUCCESS_URL", "https://pesdeseda.example/pedido");
    vi.stubEnv("ASAAS_CANCEL_URL", "https://pesdeseda.example/pedido");
    vi.stubEnv("ASAAS_EXPIRED_URL", "https://pesdeseda.example/pedido");
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ id: "chk_producao" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    })));

    const result = await new AsaasCheckoutProvider().create({
      orderId: "ord_producao",
      accessToken: "acesso-producao",
      priceCents: 4_990,
    });

    expect(result.url).toBe("https://asaas.com/checkoutSession/show?id=chk_producao");
  });

  it("recusa qualquer preço divergente antes de chamar o Asaas", async () => {
    vi.stubEnv("ASAAS_ACCESS_TOKEN", "token-exclusivo-do-servidor");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(new AsaasCheckoutProvider().create({
      orderId: "ord_preco_invalido",
      accessToken: "acesso-privado-do-pedido",
      priceCents: 1,
    })).rejects.toThrow("Preço divergente");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("consulta uma cobrança por GET sem body e valida pedido e preço", async () => {
    vi.stubEnv("ASAAS_ACCESS_TOKEN", "token-exclusivo-do-servidor");
    vi.stubEnv("ASAAS_API_URL", "https://api-sandbox.asaas.com/v3");
    const fetchMock = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      void input;
      void init;
      return new Response(JSON.stringify({
        id: "pay_teste_4990",
        status: "CONFIRMED",
        billingType: "PIX",
        value: 49.9,
        externalReference: "ord_teste_4990",
        customer: "cus_dado_nao_exposto",
      }), { status: 200, headers: { "content-type": "application/json" } });
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await new AsaasCheckoutProvider().getPayment("pay_teste_4990", "ord_teste_4990");

    expect(result).toEqual({
      id: "pay_teste_4990",
      status: "CONFIRMED",
      billingType: "PIX",
      valueCents: 4_990,
      externalReference: "ord_teste_4990",
    });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api-sandbox.asaas.com/v3/payments/pay_teste_4990");
    expect(init?.method).toBe("GET");
    expect(init?.body).toBeUndefined();
    expect((init?.headers as Record<string, string>).access_token).toBe("token-exclusivo-do-servidor");
  });

  it("recusa uma cobrança de outro pedido ou valor", async () => {
    vi.stubEnv("ASAAS_ACCESS_TOKEN", "token-exclusivo-do-servidor");
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({
      id: "pay_divergente",
      status: "RECEIVED",
      billingType: "CREDIT_CARD",
      value: 1,
      externalReference: "ord_outro",
    }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      new AsaasCheckoutProvider().getPayment("pay_divergente", "ord_esperado"),
    ).rejects.toThrow("não corresponde");
  });
});
