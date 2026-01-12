// ========================================
// INVESTMENTS CRUD
// ========================================

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

document.getElementById('investmentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    // TODO: Implementar POST/PUT para criar/editar investimento
    console.log('TODO: Salvar investimento');
});

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

function editInvestment(investmentId) {
    // TODO: Implementar edição
    console.log('Editar investimento:', investmentId);
    alert('Funcionalidade de edição será implementada em breve!');
}