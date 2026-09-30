# Chat · tela de atendimento: índice dos componentes

Documentação **somente leitura** dos componentes da tela de atendimento, extraídos do arquivo Chat (`toKCLLnmQEIQ6ECoY19D8q`, nó `987:11695`; tela real no nó `3536:31032`).

- Estes componentes são específicos do produto de chat e **não entram no `@opa/ui`**. Só mudam se for extremamente necessário (decisão do dono, 2026-09-30).
- No Figma do DS: página **Chat · Atendimento** (uma coluna por grupo, um quadro por componente, com captura, origem, composição, o que usar do DS e medidas).
- Tokens do Chat como `bubblemessage/*` e `fixed-white` não existem no DS.

| Grupo | Componente | Nó no Chat | Usar do DS |
|---|---|---|---|
| A · Estrutura e lista de conversas | Tela de atendimento (Desktop) | `3536:31032` | Sidebar (rail + painel), Button, Avatar, Badge, Tag e Scroll Area. Específicos do chat: ConversationItem, Cabeçalho - Atendimento e Message sender. |
| A · Estrutura e lista de conversas | Navbar (rail de ícones) | `3536:31033` | Sidebar do DS: rail com SidebarItem (ativo com ícone solid, notification = Badge dot) e Avatar no rodapé. |
| A · Estrutura e lista de conversas | Cabeçalho do sidemenu | `3536:31037` | SidebarPanelHeader + SidebarPanelTitle; botões de ícone = Button quiet icon-only. |
| A · Estrutura e lista de conversas | SidebarMenuButton (item do menu) | `3536:31045` | SidebarPanelItem do DS (ícone, nome, contador) com Badge dot. |
| A · Estrutura e lista de conversas | SidebarGroupLabel (título de grupo) | `3536:31051` | SidebarPanelGroupLabel do DS. |
| A · Estrutura e lista de conversas | List-sidemenu-atendimentos (legado, oculto) | `3536:31053` | Substituído pelo SidebarPanelItem. Usa Font Awesome 6; não levar para o DS. |
| A · Estrutura e lista de conversas | ConversationItem (linha da lista de conversas) | `3536:31066` | Avatar (36/12), Badge (contador) e Tag (etiquetas) do DS. O ConversationItem e o LastText são específicos do chat. |
| A · Estrutura e lista de conversas | LastText (prévia da mensagem) | `4953:22421` | Específico do chat (texto utilitário de uma linha). |
| A · Estrutura e lista de conversas | Badge (contador de não lidas) | `4953:22424` | Badge do DS (contador). Atenção: o Chat usa secondary/600 (#ef7d00); no DS o Badge usa warning. |
| A · Estrutura e lista de conversas | Chip de data (Hoje) | `3536:31157` | Variação do Tag neutro, com fundo surface e sombra leve. Hoje não existe no DS. |
| B · Conversa e envio | Cabeçalho - Atendimento | `3536:31078` | Específico do chat; é só uma barra com título e borda inferior. |
| B · Conversa e envio | Message sender (novo atendimento) | `3575:15639` | Button, Separator e Toast (aviso). As linhas De/Para/Departamento não são o Input do DS. |
| B · Conversa e envio | Input-De (linha De/Para/Departamento) | `3575:15644` | Trigger de seleção em linha (label / divisor / valor / seta). Base possível: Combobox com layout de formulário. |
| B · Conversa e envio | Template_component (aviso de modelo) | `3575:15653` | Estrutura do Toast usada como aviso estático (tipo Alert, que o DS adiou). |
| B · Conversa e envio | Chip de variável (nome no Figma: TypingAnimation - Variable) | `4219:7817` | Tag success do DS, clicável. O nome do nó no Chat engana: não é animação de digitação. |
| B · Conversa e envio | Hangup Button (encerrar chamada) | `5403:45418` | Button destructive icon-only (36px). Conferir o raio 12 e o ícone phone-hangup no registro. |
| B · Conversa e envio | User Avatar | `5403:45413` | Avatar do DS tamanho default (36px, raio 12). Coincide com o DS. |
| B · Conversa e envio | Action (item do menu de ações da mensagem) | `1061:12081` | DropdownMenuItem do DS (ícone + texto + espaço à direita). |
| B · Conversa e envio | Gatilho do popover de ações | `1061:12109` | Button quiet icon-only tamanho sm (24px) com ícone plus. |
| C · Mensagens e bolhas | Bolha de mensagem (catálogo de variantes) | `1084:8978` | Específico do chat. Quatro variantes de cor: enviada (primary), recebida (2x) e destaque (highlight). |
| C · Mensagens e bolhas | Chat Bubble (recebida, com preview de link) | `2152:12380` | Específico do chat; tokens bubblemessage/* não existem no DS. |
| C · Mensagens e bolhas | Bolha com link e preview | `1084:8978` | Mesmo padrão do Chat Bubble (miniatura 80x80, título, descrição, URL). |
| C · Mensagens e bolhas | Bolha de áudio com chamada | `1084:8978` | Específico do chat: player (play, forma de onda, velocidade 1x) sob o cartão de chamada. |
| C · Mensagens e bolhas | Quote box (resposta citada) | `1686:19021` | Específico do chat. |
| C · Mensagens e bolhas | Calls (cartão de chamada) | `1686:19020` | Específico do chat. A caixa do ícone lembra um Avatar quadrado. |
| C · Mensagens e bolhas | Attachment (documento com preview) | `1686:19026` | Button quiet icon-only sm para o download; o resto é específico do chat. |
| C · Mensagens e bolhas | Media Container (grade de mídias) | `1686:19025` | Específico do chat; não há galeria de imagens no DS. |
| C · Mensagens e bolhas | Mapa com pino de localização | `1686:19024` | Ilustração; não é componente do DS. |
| C · Mensagens e bolhas | Event (convite de evento) | `1084:8591` | Avatar (pequeno, sobreposto) do DS; o cartão é específico do chat. |
| C · Mensagens e bolhas | Reaction (chip de reação) | `1686:19264` | Parecido com Tag/Badge, mas com blur e borda. Específico do chat. |
| C · Mensagens e bolhas | ButtonsContainer (botões da bolha) | `1686:19260` | Composição de Button ghost + Separator. Específico do chat. |
| C · Mensagens e bolhas | Popover de ações da mensagem | `1061:12081` | DropdownMenu/Popover do DS com Separator: faixa de reações (emoji + plus) e Actions (Responder, Copiar, Baixar, Transcrever). |
| C · Mensagens e bolhas | Detalhe das reações (popover) | `1084:8978` | Tabs underline do DS (Todas 2 / 👍) + lista com Avatar, nome, data e a reação. |
| C · Mensagens e bolhas | Ícones de tipo de mensagem | `1084:8978` | Faixa de ícones (microfone, câmera, vídeo, arquivo, figurinha, contato, local, evento, chamada, bloqueio). Todos são Font Awesome. |
| C · Mensagens e bolhas | Indicador de digitação | `1084:8978` | Bolhas com três pontos (recebida clara, enviada escura), com e sem Avatar. Específico do chat. |

## Pontos para decidir depois (sem alterar o Chat)
- Laranja do contador (`#ef7d00`, secondary/600) e da bolinha (`#f97d00`): no DS o Badge usa `warning`.
- Itens do rail do Chat têm raio 6; o `SidebarItem` do DS tem raio 12.
- Faltam no registro de ícones: `phone-hangup`, `arrow-turn-left`, `headset`, `comments`, `bell`, `sparkles`, `gear`, `home`, `chart-line`, `contact-card`.
- Linhas De/Para/Departamento: candidatas a um layout de formulário sobre o Combobox.
- O nó `TypingAnimation - Variable` é, na verdade, um chip de variável (Tag success).
