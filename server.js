const http = require('http');
const fs = require('fs');

const ARQUIVO = 'tarefas.json';

const server = http.createServer((req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'GET' && req.url === '/tarefas') {
        const dados = fs.existsSync(ARQUIVO) ? fs.readFileSync(ARQUIVO) : '[]';
        res.end(dados);

    } else if (req.method === 'POST' && req.url === '/tarefas') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            fs.writeFileSync(ARQUIVO, body);
            res.end('{"ok":true}');
        });

    } else {
        res.writeHead(404);
        res.end('{}');
    }
});

server.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));