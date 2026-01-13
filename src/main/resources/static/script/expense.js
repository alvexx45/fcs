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
document.getElementById('expenseForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    try {
        const type = document.getElementById('expenseType').value;
        const p_method = document.getElementById('expensePMethod').value;
        const value = document.getElementById('expenseValue').value;
        const date = document.getElementById('expenseDate').value;
        const expenseId = document.getElementById('expenseId').value; // Pega o ID (vazio se for criação)

        const expenseData = {
            type: type,
            p_method: p_method,
            value: value,
            date: date
        }

        let response;
        
        // Se tem ID, é edição (PUT), se não tem, é criação (POST)
        if (expenseId) {
            response = await fetch(`http://localhost:8080/users/${userId}/expense/${expenseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(expenseData)
            });
        } else {
            response = await fetch(`http://localhost:8080/users/${userId}/expense`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(expenseData)
            });
        }

        if (response.ok) {
            showNotification(
                expenseId ? 'Despesa atualizada com sucesso!' : 'Despesa criada com sucesso!',
                'success',
                'danger'
            );

            // Fecha o modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('expenseModal'));
            modal.hide();

            // Limpa o formulário
            document.getElementById('expenseForm').reset();

            // Recarrega a lista de despesas
            loadExpenses();

            // Atualiza os totais
            loadOverviewData();
        } else {
            const error = await response.text();
            showNotification('Erro ao salvar despesa: ' + error, 'error', 'danger');
        }

    } catch (error) {
        console.error('Erro:', error);
        showNotification('Erro ao conectar com o servidor: ' + error.message, 'error', 'danger');
    }
});

async function deleteExpense(expenseId) {
    if (!confirm('Deseja realmente excluir esta despesa?')) return;

    try {
        const response = await fetch(`http://localhost:8080/users/${userId}/expense/${expenseId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showNotification('Despesa excluída com sucesso!', 'success', 'danger');
            loadExpenses();
            loadOverviewData();
        } else {
            showNotification('Erro ao excluir despesa', 'error', 'danger');
        }
    } catch (error) {
        console.error('Erro:', error);
        showNotification('Erro ao conectar com o servidor', 'error', 'danger');
    }
}

async function editExpense(expenseId) {
    try {
        // Busca os dados da despesa
        const response = await fetch(`http://localhost:8080/users/${userId}/expense`);
        const expenses = await response.json();
        
        // Encontra a despesa específica
        const expense = expenses.find(e => e.expenseId === expenseId);
        
        if (!expense) {
            showNotification('Despesa não encontrada!', 'error', 'danger');
            return;
        }
        
        // Preenche o formulário com os dados
        document.getElementById('expenseId').value = expense.expenseId;
        document.getElementById('expenseType').value = expense.type;
        document.getElementById('expensePMethod').value = expense.p_method || '';
        document.getElementById('expenseValue').value = expense.value;
        document.getElementById('expenseDate').value = formatDateForInput(expense.date);
        
        // Muda o título do modal
        document.getElementById('expenseModalLabel').textContent = 'Editar Despesa';
        
        // Abre o modal
        const modal = new bootstrap.Modal(document.getElementById('expenseModal'));
        modal.show();
        
    } catch (error) {
        console.error('Erro ao carregar despesa:', error);
        showNotification('Erro ao carregar dados da despesa', 'error', 'danger');
    }
}

// Limpa o formulário e reseta o título quando o modal é fechado
document.getElementById('expenseModal').addEventListener('hidden.bs.modal', function () {
    document.getElementById('expenseForm').reset();
    document.getElementById('expenseModalLabel').textContent = 'Nova Despesa';
});

// Limpa o formulário quando clicar em "Nova Despesa"
document.getElementById('newExpenseBtn').addEventListener('click', function () {
    document.getElementById('expenseForm').reset();
    document.getElementById('expenseId').value = ''; // Garante que está vazio
    document.getElementById('expenseModalLabel').textContent = 'Nova Despesa';
});