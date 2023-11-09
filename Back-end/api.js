const http = require('http');
const SchedulingCalculator = require('./Calculators/scheludingCalculator'); 

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/calculateTurnAround') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            const data = JSON.parse(body);

            const schedulingCalculator = new SchedulingCalculator(data.tempoChegada, data.quantum, data.sobrecarga);

            const fifoResult = schedulingCalculator.fifo();
            const sjfResult = schedulingCalculator.sjf();
            const roundRobinResult = schedulingCalculator.roundRobin();
            const edfResult = schedulingCalculator.edf();

            const response = {
                fifo: fifoResult,
                sjf: sjfResult,
                roundRobin: roundRobinResult,
                edf: edfResult,
            };

            console.log(data, response);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(response));
        });
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});