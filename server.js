import * as http from "node:http";
import {spawn, spawnSync} from 'child_process';

function serverResponse(res, status=200, message='success') {
        res.writeHead(status, { "Content-Type": "application/json"});
        res.end(JSON.stringify({status, message}));
        return;
}

function activateGPIO(id, during) {
        if(!id || !during) return 'Parameters "id" and "during" are mandatory.';

        const pythonProcess = spawn('/usr/bin/python', ["/root/vld-rpi-gpio-interface/gpio-rpi3.py", id, during]);
        pythonProcess.stdout.on('data', (data) => console.log('callback: ', data));
        return `Command activate GPIO ${id} during ${during}s was executed successfully.`
}

const PORT = 3000;

http.createServer(async (req, res) => {
        // ignore favicon request
        if (req.url === '/favicon.ico') return;

        console.log(`input request "${req.url}" at "${(new Date()).toISOString()}"`);

        try {
                const matches = req.url.match(/\/gpio\/activate\?id=(?<id>[0-9]+)&during=(?<during>[0-9]+)/);
                
                if(!matches) return serverResponse(res, 404, `Route ${req.url} was not found.`);

                const { id, during } = matches['groups'];
                const message = activateGPIO(id, during);
                return serverResponse(res, 200, message);

        } catch (error) {
                return serverResponse(res, 500, error?.message || 'error');
        }

}).listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);
