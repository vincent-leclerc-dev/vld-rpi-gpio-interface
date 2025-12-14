import * as fs from "node:fs";
import * as http from "node:http";
import * as path from "node:path";
import {spawn, spawnSync} from 'child_process';

const PORT = 3000;

http.createServer(async (req, res) => {
        // ignore favicon request
        if (req.url === '/favicon.ico') return;

        console.log(`input request "${req.url}" at "${(new Date()).toISOString()}"`);

        try {
                const matches = req.url.match('(?<path>.*)?id=(?<id>[0-9]{1,2})&during=(?<during>[0-9]{1,2})');

                if(!matches) {
                        return response(res, 404, `Route ${req.url} was not found.`);
                }

                const { path, id, during } = matches['groups'];

                // remove the last '?'
                const basePath = path.slice(0, -1);

                if(basePath !== '/gpio/activate') {
                        return response(res, 404, `Route ${req.url} was not found.`);
                }

                activateGPIO(id, during);

                return response(res, 200, `Command activate GPIO ${id} during ${during}s was executed successfully.`);

        } catch (error) {
                return response(res, 500, error?.message || 'error');
        }

}).listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);

function activateGPIO(id, during) {
        console.log(`Execute command activate GPIO ${id} during ${during}s`);
        const pythonProcess = spawn('/usr/bin/python', ["/root/vld-rpi-gpio-interface/gpio-rpi3.py", id, during]);
        pythonProcess.stdout.on('data', (data) => console.log('callback: ', data));
}

function response(res, status=200, message='success') {
        res.writeHead(status, { "Content-Type": "application/json"});
        res.end(JSON.stringify({status, message}));
        return;
}
