// Função para criar um novo usuário
async function createUser(event) {
    // Previne o comportamento padrão do formulário (recarregar a página)
    event.preventDefault();
    
    try {
        // 1. Pega os valores dos inputs
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // 2. Cria o objeto que será enviado (formato JSON)
        const userData = {
            username: username,
            password: password
        };
        
        // 3. Faz a requisição POST para o backend
        const response = await fetch('http://localhost:8080/users', {
            method: 'POST',                          // Tipo da requisição
            headers: {
                'Content-Type': 'application/json'   // Informa que estamos enviando JSON
            },
            body: JSON.stringify(userData)           // Converte o objeto em texto JSON
        });
        
        console.log('Status:', response.status);  // Debug
        
        // 4. Verifica se deu certo
        if (response.ok) {
            alert('Usuário criado com sucesso!');
            // Redireciona imediatamente
            window.location.href = "/dashboard.html";
        } else {
            // Se der erro, mostra a mensagem
            const error = await response.text();
            alert('Erro ao criar usuário: ' + error);
        }
        
    } catch(error) {
        // Se der algum erro de conexão ou outro problema
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor: ' + error.message);
    }
}

// Função para fazer login
async function handleLogin(event) {
    event.preventDefault();
    
    try {
        // Pega os valores dos inputs (mesmos nomes do DTO: username e password)
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Cria o objeto conforme UserLoginDTO
        const loginData = {
            username: username,
            password: password
        };
        
        const response = await fetch('http://localhost:8080/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        
        if (response.ok) {
            const user = await response.json();
            // Salvar token/userId no localStorage
            localStorage.setItem('userId', user.userId);
            // Redirecionar para dashboard
            window.location.href = '/dashboard.html';
        } else {
            alert('Usuário ou senha incorretos!');
        }
        
    } catch(error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor: ' + error.message);
    }
}
