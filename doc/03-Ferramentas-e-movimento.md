# Instruções ao Codex | Pesquisa, componentes e animação
1. **UI/UX Pro Max.** Verifique se a skill já está disponível no projeto. Se necessário, instale localmente com o CLI oficial ui-ux-pro-max-cli e execute `uipro init --ai codex`. Use seu script search.py com a consulta “editorial wellness ebook, family memoir, botanical print, accessible checkout” e a opção --design-system. Registre as recomendações adotadas e rejeitadas. O sistema do arquivo 02 define o resultado visual desejado.
2. **21st.dev.** Use o catálogo oficial para pesquisar “editorial book hero”, “author biography” e “accessible accordion”. Compare pelo menos duas referências. Selecione apenas o que acrescenta à leitura ou à compra. Documente URL, autoria, licença e alterações antes de importar código. Para Codex, o comando oficial de registro do marketplace é `codex plugin marketplace add 21st-dev/codex-plugin`; conclua a instalação e autenticação conforme a página do provedor. Sem acesso ao catálogo, registre a limitação e use componentes próprios orientados pelo arquivo 02.
3. **Framer Motion / Motion para React.** Em um projeto React, use o pacote motion, imports de motion/react e MotionConfig com reducedMotion="user". Use useReducedMotion para remover deslocamentos e substituir transições por atualização imediata. Escolha a implementação compatível com o stack existente; isole animações em componentes pequenos.

| Interação | Coreografia | Movimento reduzido |
|---|---|---|
| Entrada da capa | Surgimento único, deslocamento vertical de 8 px em 320 ms | Capa visível imediatamente |
| Ícone do CTA | Deslocamento de 2 px em 140 ms no hover | Sem deslocamento |
| FAQ | Transição de 160 ms; foco permanece na pergunta | Abrir e fechar imediatamente |
| Compra | Mensagem de progresso estática anunciada ao leitor de tela | Mesmo comportamento |

Texto inicial visível no HTML, sem depender de JavaScript para aparecer. Evitar rolagem forçada, carrossel automático e efeitos que atrasem o botão. Ver documentação oficial: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill · https://21st.dev/mcp · https://motion.dev/docs/react-accessibility
