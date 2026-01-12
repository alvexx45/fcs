// ========================================
// EXPENSES CRUD
// ========================================

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

// Form submit
document.getElementById('expenseForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    // TODO: Implementar POST/PUT para criar/editar despesa
    console.log('TODO: Salvar despesa');
});

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

function editExpense(expenseId) {
    // TODO: Implementar edição
    console.log('Editar despesa:', expenseId);
    alert('Funcionalidade de edição será implementada em breve!');
}