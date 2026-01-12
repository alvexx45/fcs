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

async function loadExpenses() {
    try {
        const response = await fetch(`http://localhost:8080/users/${userId}/expense`);
        const expenses = await response.json();
        
        const tbody = document.getElementById('expensesTableBody');
        tbody.innerHTML = ''; // Limpa tabela
        
        if (expenses.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhuma despesa cadastrada</td></tr>';
            return;
        }
        
        expenses.forEach(expense => {
            const row = `
                <tr>
                    <td>${expense.type}</td>
                    <td class="text-danger fw-bold">${formatCurrency(expense.value)}</td>
                    <td>${expense.p_method || '-'}</td>
                    <td>${formatDate(expense.date)}</td>
                    <td class="text-end table-actions">
                        <button class="btn btn-sm btn-outline-primary" onclick="editExpense('${expense.expenseId}')">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteExpense('${expense.expenseId}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Erro ao carregar despesas:', error);
    }
}

async function loadIncome() {
    try {
        const response = await fetch(`http://localhost:8080/users/${userId}/income`);
        const incomes = await response.json();
        
        const tbody = document.getElementById('incomeTableBody');
        tbody.innerHTML = '';
        
        if (incomes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhuma receita cadastrada</td></tr>';
            return;
        }
        
        incomes.forEach(income => {
            const row = `
                <tr>
                    <td>${income.type}</td>
                    <td>${income.source || '-'}</td>
                    <td class="text-success fw-bold">${formatCurrency(income.value)}</td>
                    <td>${formatDate(income.data)}</td>
                    <td class="text-end table-actions">
                        <button class="btn btn-sm btn-outline-primary" onclick="editIncome('${income.incomeId}')">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteIncome('${income.incomeId}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Erro ao carregar receitas:', error);
    }
}

async function loadInvestments() {
    try {
        const response = await fetch(`http://localhost:8080/users/${userId}/investment`);
        const investments = await response.json();
        
        const tbody = document.getElementById('investmentsTableBody');
        tbody.innerHTML = '';
        
        if (investments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Nenhum investimento cadastrado</td></tr>';
            return;
        }
        
        investments.forEach(investment => {
            const row = `
                <tr>
                    <td>${investment.type}</td>
                    <td class="text-primary fw-bold">${formatCurrency(investment.value)}</td>
                    <td>${formatDate(investment.date)}</td>
                    <td class="text-end table-actions">
                        <button class="btn btn-sm btn-outline-primary" onclick="editInvestment('${investment.investmentId}')">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteInvestment('${investment.investmentId}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Erro ao carregar investimentos:', error);
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

// ========================================
// CRUD FUNCTIONS
// ========================================

async function deleteExpense(expenseId) {
    if (!confirm('Deseja realmente excluir esta despesa?')) return;
    
    try {
        const response = await fetch(`http://localhost:8080/users/${userId}/expense/${expenseId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Despesa excluída com sucesso!');
            loadExpenses();
            loadOverviewData();
        } else {
            alert('Erro ao excluir despesa');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor');
    }
}

async function deleteIncome(incomeId) {
    if (!confirm('Deseja realmente excluir esta receita?')) return;
    
    try {
        const response = await fetch(`http://localhost:8080/users/${userId}/income/${incomeId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Receita excluída com sucesso!');
            loadIncome();
            loadOverviewData();
        } else {
            alert('Erro ao excluir receita');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor');
    }
}

async function deleteInvestment(investmentId) {
    if (!confirm('Deseja realmente excluir este investimento?')) return;
    
    try {
        const response = await fetch(`http://localhost:8080/users/${userId}/investment/${investmentId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Investimento excluído com sucesso!');
            loadInvestments();
            loadOverviewData();
        } else {
            alert('Erro ao excluir investimento');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor');
    }
}

function editExpense(expenseId) {
    // TODO: Implementar edição
    console.log('Editar despesa:', expenseId);
    alert('Funcionalidade de edição será implementada em breve!');
}

function editIncome(incomeId) {
    // TODO: Implementar edição
    console.log('Editar receita:', incomeId);
    alert('Funcionalidade de edição será implementada em breve!');
}

function editInvestment(investmentId) {
    // TODO: Implementar edição
    console.log('Editar investimento:', investmentId);
    alert('Funcionalidade de edição será implementada em breve!');
}
