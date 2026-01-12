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