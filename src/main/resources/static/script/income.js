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
    // TODO: Implementar POST/PUT para criar/editar receita
    console.log('TODO: Salvar receita');
});

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

function editIncome(incomeId) {
    // TODO: Implementar edição
    console.log('Editar receita:', incomeId);
    alert('Funcionalidade de edição será implementada em breve!');
}