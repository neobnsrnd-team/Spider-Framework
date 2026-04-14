'use strict';

const C = {
  reset:  '\x1b[0m',  bold: '\x1b[1m',   dim:  '\x1b[2m',
  cyan:   '\x1b[36m', green:'\x1b[32m',  yellow:'\x1b[33m',
  red:    '\x1b[31m', blue: '\x1b[34m',  gray:  '\x1b[90m', white:'\x1b[37m',
};

const METHOD_COLOR = { GET: C.cyan, POST: C.yellow, PUT: C.blue, DELETE: C.red, PATCH: C.blue };

function statusColor(c) { return c >= 500 ? C.red : c >= 400 ? C.yellow : C.green; }

function timestamp() {
  return new Date().toLocaleString('ko-KR', {
    year:'numeric', month:'2-digit', day:'2-digit',
    hour:'2-digit', minute:'2-digit', second:'2-digit', hour12: false,
  });
}

function apiLogger(req, res, next) {
  const start = Date.now();
  const originalJson = res.json.bind(res);
  res.json = (body) => { res._logBody = body; return originalJson(body); };

  res.on('finish', () => {
    const ms = Date.now() - start;
    const mc = METHOD_COLOR[req.method] ?? C.white;
    const sc = statusColor(res.statusCode);
    const inJson  = req.body && Object.keys(req.body).length ? JSON.stringify(req.body) : null;
    const outJson = res._logBody !== undefined ? JSON.stringify(res._logBody) : null;

    const parts = [
      `${C.gray}[${timestamp()}]${C.reset}`,
      `${mc}${C.bold}${req.method}${C.reset}`,
      `${C.white}${req.originalUrl}${C.reset}`,
      `${sc}${C.bold}${res.statusCode}${C.reset}`,
      `${C.gray}${ms}ms${C.reset}`,
    ];
    if (inJson)  parts.push(`${C.cyan}▶${C.reset} ${C.dim}${inJson}${C.reset}`);
    if (outJson) parts.push(`${sc}◀${C.reset} ${C.dim}${outJson}${C.reset}`);

    console.log(parts.join('  '));
  });

  next();
}

module.exports = { apiLogger };
