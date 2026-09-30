# Fase 3 (navegação e feedback): decisões validadas com o dono

Validado no companion visual em 2026-09-30. Referência visual: Component Library antigo (Tabs, Toast, Tooltip, Pagination).

## Aprovados

- **Tabs:** como no desenho antigo. Variantes `segmented` (trilho cinza com aba branca) e `underline` (linha de 1px embaixo na cor `ring`: primary 400 no Light, 800 no Dark); tamanhos `default` (36px) e `sm` (24px); aba com ícone e texto ou só ícone; estados default/hover/selected/disabled/focus (foco com ring).
- **Pagination:** como no desenho antigo: "Exibindo 1 – 1 de 10" à esquerda; "Página 1 de 10" e quatro botões de ícone (primeira, anterior, próxima, última) à direita. **Não é o Pagination numerado do Shadcn: precisa de aprovação para montar como composição de Buttons + texto.**
- **Toast (Sonner):** estilo A no formato padrão do Sonner. Cartão com a cor do popover, borda e `shadow-popover`, raio `xl`; ícone à esquerda só nos tipos (sucesso, erro, alerta, info), título 14px medium e descrição 12px em `foreground-secondary`; ação à direita em **Outline pequeno** (secundária em **Quiet**); botão de fechar como círculo no canto, visível ao passar o mouse; canto inferior direito, pilha compacta que abre no hover; some em 4s; arrastar dispensa.
- **Tooltip:** compacto (padding pequeno, raio `lg`, sem seta), cor inversa (`bg-foreground text-background`), texto `text-sm` (12px). O "Infolabel" do Figma antigo é tratado como Popover (já existe).

## Ainda sem desenho (validar antes de construir)

Dropdown Menu, Sheet e Breadcrumb foram validados e construídos depois (estilos das propostas aprovadas). **Alert: adiado pelo dono** (o Toast cobre os casos por enquanto); se voltar, pode reaproveitar o visual do Toast.
