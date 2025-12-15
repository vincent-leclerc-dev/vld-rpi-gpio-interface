import * as http from "node:http";
import * as fs from "node:fs";
import * as crypto from "node:crypto";
import {spawn} from 'child_process';

const configFileName = './config.json';
import configFile from './config.json' with { type: 'json' };

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

function updateConfig(data){
        if(!data) return;

        data = JSON.parse(data);

        fs.writeFile(configFileName, JSON.stringify(data, null, 4), function writeJSON(err) {
                if (err) return console.log(err);
                console.log('writing config file successfully.' );
        });
}

function getGpios(){
        return configFile.gpios;
}

function getGpiosAvailable(){
        const gpiosLinked =configFile.pumps.map(pump => (pump.gpio));
        return configFile.gpios.filter(gpio => !gpiosLinked.includes(gpio.id));
}

function getPumps(){
        return configFile.pumps;
}

function getIngredients(){
        return configFile.ingredients;
}

function createIngredients(data){
        if(!data) return "Parameter 'body' is mandatory.";

        data = JSON.parse(data);

        if(!data.name) return "Parameter 'name' is mandatory.";

        if(configFile.ingredients.find(ingredient => (ingredient.name.toLowerCase() === data.name.toLowerCase()))) {
                return `Ingredient '${data.name.toLowerCase()}' already exist.`;
        }

        data.id = crypto.randomUUID();

        configFile.ingredients.push(data);

        updateConfig(JSON.stringify(configFile));

        return `Ingredient ${data.name} was created successfully.`;
}

function deleteIngredients(id){
        if(!id) return "Parameter 'id' is mandatory.";

        if(!configFile.ingredients.find(ingredient => (id === ingredient.id))) {
                return `Ingredient ${id} not exist.`;
        }

        const ingredientLinked = configFile['pumps-as-ingredients'].find(ingredientLinked => (id === ingredientLinked.ingredient));
        if(ingredientLinked){
                return `Can't delete ingredient ${id} because it is linked to pump ${ingredientLinked.pump}.`;
        }

        configFile.ingredients = configFile.ingredients.filter(ingredient => (ingredient.id !== id));

        updateConfig(JSON.stringify(configFile));

        return `Ingredient ${id} was deleted successfully.`;
}

function getPumpsAsIngredients(){
        return configFile['pumps-as-ingredients'];
}

function updatePumps(pumpId, gpioId){
        if(!pumpId || !gpioId) return 'Parameters "pumpId" and "gpioId" are mandatory.';

        if(!configFile.gpios.find(gpio => (parseInt(gpioId) === gpio.id))) {
                return `GPIO ${gpioId} not exist.`;
        }

        if(!configFile.pumps.find(pump => (parseInt(pumpId) === pump.id))) {
                return `Pump ${pumpId} not exist.`;
        }

        const alreadyLinked = configFile.pumps.find(pump => (parseInt(gpioId) === pump.gpio))
        if(alreadyLinked) {
                return `GPIO ${gpioId} is already linked to pump ${alreadyLinked.id}`;
        }

        configFile.pumps.forEach(pump => {
                pump.id == pumpId ? pump.gpio = parseInt(gpioId) : pump.gpioId;
        });

        updateConfig(JSON.stringify(configFile));

        return `Pump ${pumpId} was linked to gpio ${gpioId} successfully.`;     
}

function updatePumpIngredient(pumpId, ingredientId){
        if(!pumpId || !ingredientId) return 'Parameters "pumpId" and "ingredientId" are mandatory.';

        if(!configFile.ingredients.find(ingredient => (ingredientId === ingredient.id))) {
                return `ingredient ${ingredientId} not exist.`;
        }

        if(!configFile.pumps.find(pump => (parseInt(pumpId) === pump.id))) {
                return `Pump ${pumpId} not exist.`;
        }

        const ingredientLinked = configFile['pumps-as-ingredients'].find(ingredientLinked => (ingredientId === ingredientLinked.ingredient))
        if(ingredientLinked) {
                return `ingredient ${ingredientId} is already linked to pump ${ingredientLinked.pump}`;
        }

        configFile['pumps-as-ingredients'].forEach(ingredientLinked => {
                ingredientLinked.pump == pumpId ? ingredientLinked.ingredient = ingredientId : ingredientLinked.ingredient;
        });

        updateConfig(JSON.stringify(configFile));

        return `Ingredient ${ingredientId} was linked to pump ${pumpId} successfully.`;     
}

const PORT = 3000;

http.createServer(async (req, res) => {
        // ignore favicon request
        if (req.url === '/favicon.ico') return;

        console.log(`input request ${req.method} "${req.url}" at "${(new Date()).toISOString()}"`);

        if(req.method === 'GET' && req.url === '/gpios'){
                return serverResponse(res, 200, getGpios());
        }

        if(req.method === 'GET' && req.url === '/gpios/available'){
                return serverResponse(res, 200, getGpiosAvailable());
        }

        if(req.method === 'GET' && req.url === '/pumps'){
                return serverResponse(res, 200, getPumps());
        }

        if(req.method === 'GET' && req.url === '/pumps-as-ingredients'){
                return serverResponse(res, 200, getPumpsAsIngredients());
        }

        if(req.method === 'GET' && req.url === '/ingredients'){
                return serverResponse(res, 200, getIngredients());
        }

        if(req.method === 'POST' && req.url === '/ingredients'){
                let data = '';
                req.on('data', (chunk) => {
                        data += chunk;
                });
                req.on('end', () => {
                        return serverResponse(res, 200, createIngredients(data));   
                });
        }

        if(req.method === 'DELETE' && req.url.startsWith('/ingredients')){
                const matches = req.url.match(/\/ingredients\?id=(?<id>.*)/);
                if(!matches) return serverResponse(res, 404, `Route ${req.url} was not found.`);

                const { id } = matches['groups'];
                return serverResponse(res, 200, deleteIngredients(id));
        }

        if(req.method === 'PATCH' && req.url.startsWith('/pumps-as-ingredients')){

                const matches = req.url.match(/\/pumps-as-ingredients\?pumpId=(?<pumpId>[0-9]+)&ingredientId=(?<ingredientId>.*)/);
                if(!matches) return serverResponse(res, 404, `Route ${req.url} was not found.`);

                const { pumpId, ingredientId } = matches['groups'];

                return serverResponse(res, 200, updatePumpIngredient(pumpId, ingredientId));
        }

        if(req.method === 'PATCH' && req.url.startsWith('/pumps')){

                const matches = req.url.match(/\/pumps\?pumpId=(?<pumpId>[0-9]+)&gpioId=(?<gpioId>[0-9]+)/);
                if(!matches) return serverResponse(res, 404, `Route ${req.url} was not found.`);

                const { pumpId, gpioId } = matches['groups'];

                return serverResponse(res, 200, updatePumps(pumpId, gpioId));
        }

        if(req.method === 'GET' && req.url.startsWith('/gpio')){
                try {
                        const matches = req.url.match(/\/gpio\/activate\?id=(?<id>[0-9]+)&during=(?<during>[0-9]+)/);
                        
                        if(!matches) return serverResponse(res, 404, `Route ${req.url} was not found.`);

                        const { id, during } = matches['groups'];
                        const message = activateGPIO(id, during);
                        return serverResponse(res, 200, message);

                } catch (error) {
                        return serverResponse(res, 500, error?.message || 'error');
                }
        }

}).listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);
