// LER arquivo (sem token, apenas leitura)
async function lerComando() {
    try {
        const response = await fetch(
            'https://raw.githubusercontent.com/walterdecastro/atm-test/main/comando.txt'
        );
        const texto = await response.text();
        return texto.trim();
    } catch (error) {
        console.error('Erro ao ler:', error);
        return '';
    }
}

// ESCREVER arquivo (precisa de token e API)
async function escreverComando(comando) {
    const GITHUB_TOKEN = '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'; // Token com permissões
    
    try {
        // 1. Primeiro pega o SHA atual do arquivo
        const sha = await getFileSHA();
        
        // 2. Atualiza via API GitHub
        const response = await fetch(
            'https://api.github.com/repos/walterdecastro/atm-test/contents/comando.txt',
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `Comando: ${comando}`,
                    content: btoa(comando), // Base64
                    sha: sha
                })
            }
        );
        
        return response.ok;
    } catch (error) {
        console.error('Erro ao escrever:', error);
        return false;
    }
}

async function getFileSHA() {
    const GITHUB_TOKEN = 'SEU_TOKEN_AQUI';
    
    try {
        const response = await fetch(
            'https://api.github.com/repos/walterdecastro/atm-test/contents/comando.txt',
            {
                headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
            }
        );
        const data = await response.json();
        return data.sha;
    } catch {
        return null; // Arquivo não existe ainda
    }
}
