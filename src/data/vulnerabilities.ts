import type { Locale, Severity } from '../i18n'

export type VulnerabilityBase = { id: string; severity: Severity }

export type VulnerabilityText = { name: string; cause: string; fix: string }

export type Vulnerability = VulnerabilityBase & VulnerabilityText

export function getVulnerability(id: string, locale: Locale): Vulnerability | null {
  const base = vulnerabilityList.find(item => item.id === id)
  const text = vulnerabilityText[locale][id]
  if (!base || !text) return null
  return { ...base, ...text }
}

// Cada mina do tabuleiro corresponde a uma destas vulnerabilidades reais.
export const vulnerabilityList: VulnerabilityBase[] = [
  { id: 'sqli', severity: 'critical' },
  { id: 'xss', severity: 'high' },
  { id: 'ssrf', severity: 'critical' },
  { id: 'idor', severity: 'high' },
  { id: 'csrf', severity: 'medium' },
  { id: 'auth', severity: 'high' },
  { id: 'secrets', severity: 'high' },
  { id: 'deserial', severity: 'critical' },
  { id: 'ratelimit', severity: 'medium' },
  { id: 'cors', severity: 'medium' },
  { id: 'traversal', severity: 'high' },
  { id: 'headers', severity: 'low' },
  { id: 'cmdi', severity: 'critical' },
  { id: 'logging', severity: 'medium' },
  { id: 'deps', severity: 'medium' },
]

export const vulnerabilityText: Record<Locale, Record<string, VulnerabilityText>> = {
  pt: {
    sqli: {
      name: 'SQL Injection',
      cause: 'Input do utilizador é concatenado diretamente numa query SQL, permitindo alterar a lógica da base de dados.',
      fix: 'Usar sempre prepared statements / queries parametrizadas, nunca concatenar strings.',
    },
    xss: {
      name: 'Cross-Site Scripting (XSS)',
      cause: 'HTML ou JavaScript fornecido pelo utilizador é renderizado sem escaping na página de outros utilizadores.',
      fix: 'Fazer escape de output por defeito e usar Content-Security-Policy para limitar scripts inline.',
    },
    ssrf: {
      name: 'Server-Side Request Forgery (SSRF)',
      cause: 'O servidor aceita um URL do utilizador e faz o pedido sem validar o destino, podendo atingir rede interna.',
      fix: 'Bloquear IPs privados, loopback e metadata endpoints antes de qualquer pedido de saída.',
    },
    idor: {
      name: 'Insecure Direct Object Reference (IDOR)',
      cause: 'Um endpoint devolve dados de outro utilizador só porque o ID foi alterado no pedido, sem verificar permissões.',
      fix: 'Validar sempre que o utilizador autenticado tem autorização sobre o recurso pedido, não só que existe.',
    },
    csrf: {
      name: 'Cross-Site Request Forgery (CSRF)',
      cause: 'Um pedido que altera estado é aceite só com base em cookies de sessão, sem confirmar a origem do pedido.',
      fix: 'Usar tokens anti-CSRF e cookies com SameSite=Lax/Strict em ações que alteram dados.',
    },
    auth: {
      name: 'Autenticação fraca',
      cause: 'Sessões previsíveis, sem limite de tentativas de login, ou tokens que nunca expiram.',
      fix: 'Aplicar rate limiting no login, expirar sessões e usar tokens gerados de forma criptograficamente segura.',
    },
    secrets: {
      name: 'Segredos no código-fonte',
      cause: 'Chaves de API ou passwords ficam escritas diretamente no repositório, muitas vezes visíveis no histórico git.',
      fix: 'Guardar segredos em variáveis de ambiente ou num secret manager, nunca no código.',
    },
    deserial: {
      name: 'Deserialização insegura',
      cause: 'Dados não confiáveis são convertidos de volta em objetos sem validação, podendo executar código arbitrário.',
      fix: 'Evitar deserializar formatos que executam código; validar e usar formatos simples como JSON com schema.',
    },
    ratelimit: {
      name: 'Falta de rate limiting',
      cause: 'Um endpoint aceita pedidos ilimitados, permitindo força bruta ou consumo excessivo de recursos.',
      fix: 'Limitar pedidos por IP/utilizador e aplicar backoff progressivo em tentativas falhadas.',
    },
    cors: {
      name: 'CORS mal configurado',
      cause: 'A API aceita pedidos de qualquer origem (Access-Control-Allow-Origin: *) mesmo em rotas com dados sensíveis.',
      fix: 'Restringir CORS às origens realmente necessárias e nunca combinar "*" com credenciais.',
    },
    traversal: {
      name: 'Path Traversal',
      cause: 'Um nome de ficheiro fornecido pelo utilizador é usado diretamente no sistema de ficheiros, permitindo "../" sair da pasta esperada.',
      fix: 'Normalizar o caminho e confirmar que continua dentro da diretoria permitida antes de o usar.',
    },
    headers: {
      name: 'Cabeçalhos de segurança em falta',
      cause: 'Faltam headers como Content-Security-Policy, Strict-Transport-Security ou X-Frame-Options.',
      fix: 'Configurar estes headers por defeito no servidor ou proxy, mesmo quando "nada parece partir-se".',
    },
    cmdi: {
      name: 'Command Injection',
      cause: 'Input do utilizador é passado para um comando de shell sem sanitização.',
      fix: 'Evitar chamar o shell diretamente; usar APIs que aceitem argumentos como lista, não como string concatenada.',
    },
    logging: {
      name: 'Dados sensíveis em logs',
      cause: 'Passwords, tokens ou dados pessoais ficam gravados em texto simples nos logs da aplicação.',
      fix: 'Mascarar ou omitir campos sensíveis antes de qualquer log, e rever quem tem acesso aos logs.',
    },
    deps: {
      name: 'Dependências desatualizadas',
      cause: 'Bibliotecas com vulnerabilidades conhecidas continuam em produção porque ninguém as atualiza.',
      fix: 'Automatizar verificação de dependências (ex. Dependabot) e ter um processo regular de atualização.',
    },
  },
  en: {
    sqli: {
      name: 'SQL Injection',
      cause: 'User input is concatenated directly into a SQL query, letting an attacker change the database logic.',
      fix: 'Always use prepared statements / parameterized queries — never concatenate strings.',
    },
    xss: {
      name: 'Cross-Site Scripting (XSS)',
      cause: 'HTML or JavaScript supplied by a user is rendered without escaping on other users’ pages.',
      fix: 'Escape output by default and use a Content-Security-Policy to limit inline scripts.',
    },
    ssrf: {
      name: 'Server-Side Request Forgery (SSRF)',
      cause: 'The server accepts a user-supplied URL and fetches it without validating the destination, potentially reaching internal services.',
      fix: 'Block private IPs, loopback addresses and metadata endpoints before making any outbound request.',
    },
    idor: {
      name: 'Insecure Direct Object Reference (IDOR)',
      cause: 'An endpoint returns another user’s data just because the ID in the request changed, without checking permissions.',
      fix: 'Always verify the authenticated user is authorized for the requested resource, not just that it exists.',
    },
    csrf: {
      name: 'Cross-Site Request Forgery (CSRF)',
      cause: 'A state-changing request is accepted based only on session cookies, without confirming where it came from.',
      fix: 'Use anti-CSRF tokens and SameSite=Lax/Strict cookies on any action that changes data.',
    },
    auth: {
      name: 'Weak authentication',
      cause: 'Predictable sessions, no limit on login attempts, or tokens that never expire.',
      fix: 'Rate-limit login attempts, expire sessions, and generate tokens with a cryptographically secure source.',
    },
    secrets: {
      name: 'Hardcoded secrets',
      cause: 'API keys or passwords are written directly into the repository, often staying visible in git history.',
      fix: 'Keep secrets in environment variables or a secret manager, never in the code.',
    },
    deserial: {
      name: 'Insecure deserialization',
      cause: 'Untrusted data is turned back into objects without validation, potentially executing arbitrary code.',
      fix: 'Avoid deserializing formats that execute code; validate input and prefer simple schemas like JSON.',
    },
    ratelimit: {
      name: 'Missing rate limiting',
      cause: 'An endpoint accepts unlimited requests, enabling brute force or excessive resource consumption.',
      fix: 'Limit requests per IP/user and apply progressive backoff on failed attempts.',
    },
    cors: {
      name: 'Misconfigured CORS',
      cause: 'The API accepts requests from any origin (Access-Control-Allow-Origin: *) even on routes with sensitive data.',
      fix: 'Restrict CORS to the origins that actually need it, and never combine "*" with credentials.',
    },
    traversal: {
      name: 'Path traversal',
      cause: 'A user-supplied file name is used directly on the file system, allowing "../" to escape the intended folder.',
      fix: 'Normalize the path and confirm it stays inside the allowed directory before using it.',
    },
    headers: {
      name: 'Missing security headers',
      cause: 'Headers like Content-Security-Policy, Strict-Transport-Security or X-Frame-Options are missing.',
      fix: 'Configure these headers by default on the server or proxy, even when "nothing seems to break".',
    },
    cmdi: {
      name: 'Command injection',
      cause: 'User input is passed to a shell command without sanitization.',
      fix: 'Avoid invoking the shell directly; use APIs that accept arguments as a list, not a concatenated string.',
    },
    logging: {
      name: 'Sensitive data in logs',
      cause: 'Passwords, tokens or personal data are written in plain text to the application logs.',
      fix: 'Mask or omit sensitive fields before logging, and review who has access to the logs.',
    },
    deps: {
      name: 'Outdated dependencies',
      cause: 'Libraries with known vulnerabilities stay in production because nobody updates them.',
      fix: 'Automate dependency scanning (e.g. Dependabot) and keep a regular update process.',
    },
  },
  de: {
    sqli: {
      name: 'SQL Injection',
      cause: 'Benutzereingaben werden direkt in eine SQL-Abfrage eingefügt, wodurch die Datenbanklogik verändert werden kann.',
      fix: 'Immer Prepared Statements / parametrisierte Abfragen verwenden, niemals Strings zusammenfügen.',
    },
    xss: {
      name: 'Cross-Site Scripting (XSS)',
      cause: 'Von Nutzern bereitgestelltes HTML oder JavaScript wird ohne Escaping auf den Seiten anderer Nutzer angezeigt.',
      fix: 'Ausgaben standardmäßig escapen und eine Content-Security-Policy nutzen, um Inline-Skripte einzuschränken.',
    },
    ssrf: {
      name: 'Server-Side Request Forgery (SSRF)',
      cause: 'Der Server akzeptiert eine vom Nutzer angegebene URL und ruft sie ohne Validierung des Ziels ab, wodurch interne Systeme erreichbar werden.',
      fix: 'Private IPs, Loopback-Adressen und Metadata-Endpunkte blockieren, bevor ausgehende Anfragen gestellt werden.',
    },
    idor: {
      name: 'Insecure Direct Object Reference (IDOR)',
      cause: 'Ein Endpunkt liefert die Daten eines anderen Nutzers, nur weil die ID in der Anfrage geändert wurde, ohne Berechtigungen zu prüfen.',
      fix: 'Immer prüfen, ob der authentifizierte Nutzer für die angeforderte Ressource berechtigt ist, nicht nur ob sie existiert.',
    },
    csrf: {
      name: 'Cross-Site Request Forgery (CSRF)',
      cause: 'Eine zustandsändernde Anfrage wird allein aufgrund von Session-Cookies akzeptiert, ohne die Herkunft zu prüfen.',
      fix: 'Anti-CSRF-Tokens und SameSite=Lax/Strict-Cookies bei allen datenverändernden Aktionen verwenden.',
    },
    auth: {
      name: 'Schwache Authentifizierung',
      cause: 'Vorhersehbare Sessions, kein Limit für Login-Versuche oder Tokens, die nie ablaufen.',
      fix: 'Login-Versuche begrenzen, Sessions ablaufen lassen und Tokens kryptografisch sicher erzeugen.',
    },
    secrets: {
      name: 'Geheimnisse im Quellcode',
      cause: 'API-Schlüssel oder Passwörter werden direkt im Repository gespeichert, oft dauerhaft in der Git-Historie sichtbar.',
      fix: 'Geheimnisse in Umgebungsvariablen oder einem Secret-Manager speichern, niemals im Code.',
    },
    deserial: {
      name: 'Unsichere Deserialisierung',
      cause: 'Nicht vertrauenswürdige Daten werden ohne Validierung wieder in Objekte umgewandelt, wodurch beliebiger Code ausgeführt werden kann.',
      fix: 'Formate vermeiden, die Code ausführen; Eingaben validieren und einfache Formate wie JSON mit Schema bevorzugen.',
    },
    ratelimit: {
      name: 'Fehlendes Rate Limiting',
      cause: 'Ein Endpunkt akzeptiert unbegrenzt viele Anfragen, was Brute-Force oder übermäßigen Ressourcenverbrauch ermöglicht.',
      fix: 'Anfragen pro IP/Nutzer begrenzen und bei fehlgeschlagenen Versuchen progressives Backoff anwenden.',
    },
    cors: {
      name: 'Falsch konfiguriertes CORS',
      cause: 'Die API akzeptiert Anfragen von jeder Quelle (Access-Control-Allow-Origin: *), selbst bei sensiblen Daten.',
      fix: 'CORS auf tatsächlich benötigte Quellen beschränken und "*" niemals mit Credentials kombinieren.',
    },
    traversal: {
      name: 'Path Traversal',
      cause: 'Ein vom Nutzer angegebener Dateiname wird direkt im Dateisystem verwendet, wodurch "../" den erwarteten Ordner verlassen kann.',
      fix: 'Den Pfad normalisieren und vor der Nutzung prüfen, dass er innerhalb des erlaubten Verzeichnisses bleibt.',
    },
    headers: {
      name: 'Fehlende Sicherheits-Header',
      cause: 'Header wie Content-Security-Policy, Strict-Transport-Security oder X-Frame-Options fehlen.',
      fix: 'Diese Header standardmäßig auf Server oder Proxy konfigurieren, auch wenn "nichts kaputtzugehen scheint".',
    },
    cmdi: {
      name: 'Command Injection',
      cause: 'Benutzereingaben werden ohne Bereinigung an einen Shell-Befehl übergeben.',
      fix: 'Die Shell nicht direkt aufrufen; APIs verwenden, die Argumente als Liste statt als zusammengesetzten String akzeptieren.',
    },
    logging: {
      name: 'Sensible Daten in Logs',
      cause: 'Passwörter, Tokens oder persönliche Daten werden im Klartext in den Anwendungs-Logs gespeichert.',
      fix: 'Sensible Felder vor dem Loggen maskieren oder weglassen und den Zugriff auf Logs überprüfen.',
    },
    deps: {
      name: 'Veraltete Abhängigkeiten',
      cause: 'Bibliotheken mit bekannten Schwachstellen bleiben in Produktion, weil niemand sie aktualisiert.',
      fix: 'Abhängigkeitsprüfung automatisieren (z. B. Dependabot) und regelmäßig aktualisieren.',
    },
  },
}
