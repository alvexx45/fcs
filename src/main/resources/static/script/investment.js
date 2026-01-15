// ========================================
// INVESTMENTS CRUD
// ========================================

async function loadInvestments() {
    try {
        const response = await fetch(`/users/${userId}/investment`);
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

// Form submit
document.getElementById('investmentForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    try {
        const type = document.getElementById('investmentType').value;
        const value = document.getElementById('investmentValue').value;
        const date = document.getElementById('investmentDate').value;
        const investmentId = document.getElementById('investmentId').value; // Pega o ID (vazio se for criação)

        const investmentData = {
            type: type,
            value: value,
            date: date
        }

        let response;
        
        // Se tem ID, é edição (PUT), se não tem, é criação (POST)
        if (investmentId) {
            response = await fetch(`/users/${userId}/investment/${investmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(investmentData)
            });
        } else {
            response = await fetch(`/users/${userId}/investment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(investmentData)
            });
        }

        if (response.ok) {
            showNotification(
                investmentId ? 'Investimento atualizado com sucesso!' : 'Investimento criado com sucesso!',
                'success',
                'primary'
            );

            // Fecha o modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('investmentModal'));
            modal.hide();

            // Limpa o formulário
            document.getElementById('investmentForm').reset();

            // Recarrega a lista de investimentos
            loadInvestments();

            // Atualiza os totais
            loadOverviewData();
        } else {
            const error = await response.text();
            showNotification('Erro ao salvar investimento: ' + error, 'error', 'primary');
        }

    } catch (error) {
        console.error('Erro:', error);
        showNotification('Erro ao conectar com o servidor: ' + error.message, 'error', 'primary');
    }
});

async function deleteInvestment(investmentId) {
    if (!confirm('Deseja realmente excluir este investimento?')) return;
    
    try {
        const response = await fetch(`/users/${userId}/investment/${investmentId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('Investimento excluído com sucesso!', 'success', 'primary');
            loadInvestments();
            loadOverviewData();
        } else {
            showNotification('Erro ao excluir investimento', 'error', 'primary');
        }
    } catch (error) {
        console.error('Erro:', error);
        showNotification('Erro ao conectar com o servidor', 'error', 'primary');
    }
}

async function editInvestment(investmentId) {
    try {
        // Busca os dados da investimento
        const response = await fetch(`/users/${userId}/investment`);
        const investments = await response.json();
        
        // Encontra a investimento específica
        const investment = investments.find(e => e.investmentId === investmentId);
        
        if (!investment) {
            showNotification('Investimento não encontrado!', 'error', 'primary');
            return;
        }
        
        // Preenche o formulário com os dados
        document.getElementById('investmentId').value = investment.investmentId;
        document.getElementById('investmentType').value = investment.type;
        document.getElementById('investmentValue').value = investment.value;
        document.getElementById('investmentDate').value = formatDateForInput(investment.date);
        
        // Muda o título do modal
        document.getElementById('investmentModalLabel').textContent = 'Editar Investimento';
        
        // Abre o modal
        const modal = new bootstrap.Modal(document.getElementById('investmentModal'));
        modal.show();
        
    } catch (error) {
        console.error('Erro ao carregar investimento:', error);
        showNotification('Erro ao carregar dados do investimento', 'error', 'primary');
    }
}

// Limpa o formulário e reseta o título quando o modal é fechado
document.getElementById('investmentModal').addEventListener('hidden.bs.modal', function () {
    document.getElementById('investmentForm').reset();
    document.getElementById('investmentModalLabel').textContent = 'Novo Investimento';
});

// Limpa o formulário quando clicar em "Novo Investimento"
document.getElementById('newInvestmentBtn').addEventListener('click', function () {
    document.getElementById('investmentForm').reset();
    document.getElementById('investmentId').value = ''; // Garante que está vazio
    document.getElementById('investmentModalLabel').textContent = 'Novo Investimento';
});