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

function loadOverviewData() {
    // TODO: Buscar totais da API e atualizar cards
    // fetch('/api/expenses/total')
    // fetch('/api/income/total')
    // fetch('/api/investments/total')
    console.log('TODO: Carregar dados da visão geral');
}

function loadExpenses() {
    // TODO: Buscar despesas da API e popular tabela
    console.log('TODO: Carregar despesas');
}

function loadIncome() {
    // TODO: Buscar receitas da API e popular tabela
    console.log('TODO: Carregar receitas');
}

function loadInvestments() {
    // TODO: Buscar investimentos da API e popular tabela
    console.log('TODO: Carregar investimentos');
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
