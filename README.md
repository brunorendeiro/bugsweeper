# BugSweeper

Campo minado clássico em que cada mina escondida é uma vulnerabilidade de
segurança web real (SQL Injection, XSS, SSRF, IDOR, etc.). Ao encontrares uma
mina, o jogo explica a causa e como se previne, em vez de só dizer "perdeste".

## Ideia

- **Modo Aprendizagem** (default): encontrar uma mina explica a vulnerabilidade
  e o jogo continua — o objetivo é aprender, não punir.
- **Modo Clássico**: regras tradicionais de campo minado, uma mina termina o
  jogo.
- Três dificuldades (Iniciante 9×9, Intermédio 16×16, Avançado 16×30), iguais
  às do Minesweeper original.
- Glossário no fim da página com todas as vulnerabilidades presentes nesse
  tabuleiro, reveladas à medida que são encontradas (ou todas no fim do jogo).
- Interface disponível em português (PT-PT), inglês e alemão, com deteção
  automática do idioma do browser e persistência local da escolha.
- 100% client-side, sem backend, sem tracking, sem login.

## Estado atual

- Motor de campo minado completo: flood fill, flags, primeira jogada sempre
  segura, contagem de minas/tempo.
- 15 vulnerabilidades reais documentadas (causa + prevenção), traduzidas nas
  três línguas.
- Toggle de modo bandeira para ecrãs tácteis (sem clique direito).

## Executar

```bash
npm install
npm run dev
```

Abrir <http://127.0.0.1:5176>.

## Validar

```bash
npm run check
npm run build
```

## Ideias para evoluir

- Guardar melhores tempos por dificuldade no localStorage.
- Adicionar mais vulnerabilidades (ex. clickjacking, JWT mal validado).
- Modo "diário": tabuleiro fixo por dia, partilhável como o Wordle.
- Exportar o glossário descoberto como PDF/imagem no fim do jogo.

O README deve ser atualizado quando o conceito, as funcionalidades ou as
prioridades mudarem.
