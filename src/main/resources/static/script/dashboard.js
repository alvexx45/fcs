// ========================================
// NAVEGAÇÃO ENTRE SEÇÕES
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Mostra data atual
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        currentDateElement.textContent = new Date().toLocaleDateString('pt-BR', {
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        });
    }

    // Navegação do menu lateral
    const navLinks = document.querySelectorAll('.sidebar .nav-link[data-section]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active de todos os links
            navLinks.forEach(l => l.classList.remove('active'));
            // Adiciona active no link clicado
            this.classList.add('active');
            
            // Esconde todas as seções
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.add('d-none');
            });
            
            // Mostra a seção correspondente
            const sectionId = this.dataset.section;
            document.getElementById(sectionId).classList.remove('d-none');
            
            // Carrega dados da seção (você implementa)
            loadSectionData(sectionId);
        });
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Deseja realmente sair?')) {
            window.location.href = '/';
        }
    });

    // Carrega dados iniciais
    loadOverviewData();
});


// ========================================
// FUNÇÕES PARA VOCÊ IMPLEMENTAR
// ========================================

function loadSectionData(section) {
    // TODO: Implementar carregamento de dados por seção
    switch(section) {
        case 'overview':
            loadOverviewData();
            break;
        case 'expenses':
            loadExpenses();
            break;
        case 'income':
            loadIncome();
            break;
        case 'investments':
            loadInvestments();
            break;
    }
}

const userId = localStorage.getItem('userId');

async function loadOverviewData() {
    try {
        // Buscar totais de cada categoria
        const [expensesRes, incomeRes, investmentsRes] = await Promise.all([
            fetch(`http://localhost:8080/users/${userId}/expense/total`),
            fetch(`http://localhost:8080/users/${userId}/income/total`),
            fetch(`http://localhost:8080/users/${userId}/investment/total`)
        ]);

        const totalExpenses = await expensesRes.json();
        const totalIncome = await incomeRes.json();
        const totalInvestments = await investmentsRes.json();

        // Atualizar cards
        document.getElementById('totalExpenses').textContent = formatCurrency(totalExpenses);
        document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
        document.getElementById('totalInvestments').textContent = formatCurrency(totalInvestments);

        // Calcular e mostrar saldo (Receitas - Despesas - Investimentos)
        const balance = totalIncome - totalExpenses - totalInvestments;
        const balanceElement = document.getElementById('totalBalance');
        balanceElement.textContent = formatCurrency(balance);
        balanceElement.className = balance >= 0 ? 'mb-0 text-success' : 'mb-0 text-danger';
    } catch (error) {
        console.error('Erro ao carregar dados gerais:', error);
    }
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

// Função para mostrar mensagens de notificação
function showNotification(message, type = 'success', color = 'primary', containerId = null) {
    // Define a cor baseada no tipo de entidade
    const colorClass = type === 'success' ? `bg-${color}` : 'bg-danger';
    
    // Cria o elemento de notificação
    const notification = document.createElement('div');
    notification.className = `alert ${colorClass} text-white alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px; opacity: 0; transition: opacity 0.3s ease-in-out;';
    notification.innerHTML = `
        <strong>${type === 'success' ? '✓' : '✗'}</strong> ${message}
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert"></button>
    `;
    
    // Adiciona ao body
    document.body.appendChild(notification);
    
    // Fade in
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Fade out e remove após 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}