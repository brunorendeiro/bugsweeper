# AGENTS.md

## Objetivo

Este projeto contém exclusivamente a app BugSweeper, um campo minado
educativo sobre vulnerabilidades de segurança web.

## Regras

- Manter o jogo 100% client-side: sem backend, sem tracking, sem login.
- Qualquer novo texto de interface ou vulnerabilidade tem de ser traduzido
  nas três línguas suportadas (`src/i18n.ts` e `src/data/vulnerabilities.ts`)
  — nunca deixar uma língua incompleta.
- Preservar o Modo Aprendizagem como default; não tornar o jogo punitivo por
  omissão.
- Não colocar aqui código do portfólio ou de outras aplicações.

## Validação

```bash
npm run check
npm run build
```
