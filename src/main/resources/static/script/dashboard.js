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
// EXPENSES CRUD
// ========================================

// Form submit
document.getElementById('expenseForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    // TODO: Implementar POST/PUT para criar/editar despesa
    console.log('TODO: Salvar despesa');
});

function editExpense(id) {
    // TODO: Buscar despesa por ID e preencher modal
    console.log('TODO: Editar despesa', id);
}

function deleteExpense(id) {
    // TODO: Deletar despesa
    if (confirm('Deseja realmente excluir esta despesa?')) {
        console.log('TODO: Deletar despesa', id);
    }
}


// ========================================
// INCOME CRUD
// ========================================

document.getElementById('incomeForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    // TODO: Implementar POST/PUT para criar/editar receita
    console.log('TODO: Salvar receita');
});

function editIncome(id) {
    // TODO: Buscar receita por ID e preencher modal
    console.log('TODO: Editar receita', id);
}

function deleteIncome(id) {
    // TODO: Deletar receita
    if (confirm('Deseja realmente excluir esta receita?')) {
        console.log('TODO: Deletar receita', id);
    }
}


// ========================================
// INVESTMENTS CRUD
// ========================================

document.getElementById('investmentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    // TODO: Implementar POST/PUT para criar/editar investimento
    console.log('TODO: Salvar investimento');
});

function editInvestment(id) {
    // TODO: Buscar investimento por ID e preencher modal
    console.log('TODO: Editar investimento', id);
}

function deleteInvestment(id) {
    // TODO: Deletar investimento
    if (confirm('Deseja realmente excluir este investimento?')) {
        console.log('TODO: Deletar investimento', id);
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

// Exemplo de como popular uma tabela (você adapta)
function populateExpensesTable(expenses) {
    const tbody = document.getElementById('expensesTableBody');
    tbody.innerHTML = '';
    
    expenses.forEach(expense => {
        const row = `
            <tr>
                <td>${expense.description}</td>
                <td>${formatCurrency(expense.value)}</td>
                <td>${formatDate(expense.date)}</td>
                <td>${expense.category || '-'}</td>
                <td class="text-end table-actions">
                    <button class="btn btn-sm btn-outline-primary" onclick="editExpense('${expense.id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteExpense('${expense.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}
