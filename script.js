// script.js
class ArduinoController {
    constructor() {
        this.apiBase = 'https://github.com/walterdecastro/atm-test/';
        this.githubToken = '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'; // Token de acesso
        this.console = document.getElementById('consoleOutput');
        this.init();
    }
    
    init() {
        // Configurar botões
        document.getElementById('btnLedOn').addEventListener('click', () => this.sendCommand('LED_ON'));
        document.getElementById('btnLedOff').addEventListener('click', () => this.sendCommand('LED_OFF'));
        document.getElementById('btnRefresh').addEventListener('click', () => this.getSensorData());
        
        // Atualização automática
        setInterval(() => this.getSensorData(), 5000);
        
        this.log('Sistema iniciado. Pronto para controlar Arduino!');
    }
    
    async sendCommand(command) {
        this.log(`Enviando comando: ${command}`);
        
        try {
            // Método 1: Usando GitHub API (armazenando comando em arquivo)
            const response = await fetch(`${this.apiBase}/comando.txt`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `Comando: ${command}`,
                    content: btoa(command), // Converter para base64
                    sha: await this.getFileSHA('comando.txt')
                })
            });
            
            if (response.ok) {
                this.log(`✅ Comando "${command}" enviado com sucesso!`);
                
                // Atualizar interface
                if (command === 'LED_ON') {
                    document.getElementById('ledStatus').textContent = 'LIGADO';
                    document.getElementById('ledStatus').className = 'status-on';
                } else if (command === 'LED_OFF') {
                    document.getElementById('ledStatus').textContent = 'DESLIGADO';
                    document.getElementById('ledStatus').className = 'status-off';
                }
            }
        } catch (error) {
            this.log(`❌ Erro: ${error.message}`);
        }
    }
    
    async getSensorData() {
        try {
            // Método alternativo: dados armazenados em JSON
            const response = await fetch('https://raw.githubusercontent.com/seu-usuario/seu-repo/main/dados.json');
            const data = await response.json();
            
            // Atualizar interface
            document.getElementById('tempValue').textContent = `${data.temperatura} °C`;
            document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString();
            
            this.log(`📡 Dados recebidos: ${data.temperatura}°C, LED: ${data.led ? 'LIGADO' : 'DESLIGADO'}`);
            
        } catch (error) {
            this.log(`⚠️ Aguardando dados do sensor...`);
        }
    }
    
    async getFileSHA(filename) {
        try {
            const response = await fetch(`${this.apiBase}/${filename}`, {
                headers: { 'Authorization': `token ${this.githubToken}` }
            });
            const data = await response.json();
            return data.sha;
        } catch {
            return null; // Arquivo não existe ainda
        }
    }
    
    log(message) {
        const timestamp = new Date().toLocaleTimeString();
        const entry = document.createElement('div');
        entry.innerHTML = `[${timestamp}] ${message}`;
        this.console.appendChild(entry);
        this.console.scrollTop = this.console.scrollHeight;
    }
}

// Iniciar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.controller = new ArduinoController();
});
