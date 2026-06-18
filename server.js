const http = require('http');
const fs = require('fs');

const ARQUIVO = 'tarefas.json';
const USUARIO = { email: 'silvia@email.com', senha: '1234' };

const server = http.createServer((req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    // ── PREFLIGHT CORS (navegador envia antes do POST) ─────
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // ── LOGIN ──────────────────────────────────────────────
    if (req.method === 'POST' && req.url === '/login') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const { email, senha } = JSON.parse(body);

            if (email === USUARIO.email && senha === USUARIO.senha) {
                res.end('{"ok":true}');
            } else {
                res.writeHead(401);
                res.end('{"ok":false}');
            }
        });

    // ── TAREFAS: buscar ────────────────────────────────────
    } else if (req.method === 'GET' && req.url === '/tarefas') {
        const dados = fs.existsSync(ARQUIVO) ? fs.readFileSync(ARQUIVO) : '[]';
        res.end(dados);

    // ── TAREFAS: salvar ────────────────────────────────────
    } else if (req.method === 'POST' && req.url === '/tarefas') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            fs.writeFileSync(ARQUIVO, body);
            res.end('{"ok":true}');
        });

    // ── ROTA NÃO ENCONTRADA ────────────────────────────────
    } else {
        res.writeHead(404);
        res.end('{}');
    }
});

server.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));