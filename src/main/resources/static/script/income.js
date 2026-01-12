// ========================================
// INCOME CRUD
// ========================================

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

document.getElementById('incomeForm').addEventListener('submit', async function(e) {
    e.preventDefault();
try {
        const type = document.getElementById('incomeType').value;
        const source = document.getElementById('incomeSource').value;
        const value = document.getElementById('incomeValue').value;
        const date = document.getElementById('incomeDate').value;
        const incomeId = document.getElementById('incomeId').value; // Pega o ID (vazio se for criação)

        const incomeData = {
            type: type,
            source: source,
            value: value,
            date: date
        }

        let response;
        
        // Se tem ID, é edição (PUT), se não tem, é criação (POST)
        if (incomeId) {
            response = await fetch(`http://localhost:8080/users/${userId}/income/${incomeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(incomeData)
            });
        } else {
            response = await fetch(`http://localhost:8080/users/${userId}/income`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(incomeData)
            });
        }

        if (response.ok) {
            showNotification(
                incomeId ? 'Receita atualizada com sucesso!' : 'Receita criada com sucesso!',
                'success',
                'success'
            );

            // Fecha o modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('incomeModal'));
            modal.hide();

            // Limpa o formulário
            document.getElementById('incomeForm').reset();

            // Recarrega a lista de despesas
            loadIncome();

            // Atualiza os totais
            loadOverviewData();
        } else {
            const error = await response.text();
            showNotification('Erro ao salvar receita: ' + error, 'error', 'success');
        }

    } catch (error) {
        console.error('Erro:', error);
        showNotification('Erro ao conectar com o servidor: ' + error.message, 'error', 'success');
    }
});

async function deleteIncome(incomeId) {
    if (!confirm('Deseja realmente excluir esta receita?')) return;
    
    try {
        const response = await fetch(`http://localhost:8080/users/${userId}/income/${incomeId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('Receita excluída com sucesso!', 'success', 'success');
            loadIncome();
            loadOverviewData();
        } else {
            showNotification('Erro ao excluir receita', 'error', 'success');
        }
    } catch (error) {
        console.error('Erro:', error);
        showNotification('Erro ao conectar com o servidor', 'error', 'success');
    }
}

async function editincome(incomeId) {
    try {
        // Busca os dados da receita
        const response = await fetch(`http://localhost:8080/users/${userId}/income`);
        const incomes = await response.json();
        
        // Encontra a receita específica
        const income = incomes.find(e => e.incomeId === incomeId);
        
        if (!income) {
            showNotification('Receita não encontrada!', 'error', 'success');
            return;
        }
        
        // Preenche o formulário com os dados
        document.getElementById('incomeId').value = income.incomeId;
        document.getElementById('incomeType').value = income.type;
        document.getElementById('incomeSource').value = income.source || '';
        document.getElementById('incomeValue').value = income.value;
        document.getElementById('incomeDate').value = income.date;
        
        // Muda o título do modal
        document.getElementById('incomeModalLabel').textContent = 'Editar Receita';
        
        // Abre o modal
        const modal = new bootstrap.Modal(document.getElementById('incomeModal'));
        modal.show();
        
    } catch (error) {
        console.error('Erro ao carregar receita:', error);
        showNotification('Erro ao carregar dados da receita', 'error', 'success');
    }
}

// Limpa o formulário e reseta o título quando o modal é fechado
document.getElementById('incomeModal').addEventListener('hidden.bs.modal', function () {
    document.getElementById('incomeForm').reset();
    document.getElementById('incomeModalLabel').textContent = 'Nova Receita';
});

// Limpa o formulário quando clicar em "Nova Receita"
document.getElementById('newincomeBtn').addEventListener('click', function () {
    document.getElementById('incomeForm').reset();
    document.getElementById('incomeId').value = ''; // Garante que está vazio
    document.getElementById('incomeModalLabel').textContent = 'Nova Receita';
});