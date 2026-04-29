// ========================================
// CREDIT & CREDIT INSTANCES CRUD
// ========================================

let selectedCreditId = null;

async function loadCredits() {
    try {
        const response = await fetch(`http://localhost:8080/users/${userId}/credit`);
        const credits = await response.json();

        const container = document.getElementById('creditCardsContainer');
        container.innerHTML = ''; // Limpa container

        if (credits.length === 0) {
            container.innerHTML = '<div class="col-12 text-center py-5 text-muted"><i class="bi bi-credit-card-2-front display-1 opacity-25"></i><p class="mt-3">Nenhum cartão cadastrado</p></div>';
            return;
        }

        for (const credit of credits) {
            // Busca o total da fatura para cada cartão
            const totalRes = await fetch(`http://localhost:8080/users/${userId}/credit/${credit.creditId}/instance/total`);
            const total = await totalRes.json();

            const card = `
                <div class="col-md-4">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div class="p-2 bg-warning bg-opacity-10 rounded-3">
                                    <i class="bi bi-credit-card text-warning fs-4"></i>
                                </div>
                                <div class="dropdown">
                                    <button class="btn btn-link text-secondary p-0" data-bs-toggle="dropdown">
                                        <i class="bi bi-three-dots-vertical"></i>
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-end">
                                        <li><a class="dropdown-item" href="#" onclick="editCredit('${credit.creditId}', ${credit.billingDay})"><i class="bi bi-pencil me-2"></i>Editar</a></li>
                                        <li><a class="dropdown-item text-danger" href="#" onclick="deleteCredit('${credit.creditId}')"><i class="bi bi-trash me-2"></i>Excluir</a></li>
                                    </ul>
                                </div>
                            </div>
                            <h5 class="fw-bold mb-1">Fatura Atual</h5>
                            <p class="text-secondary small mb-3">Fechamento: Dia ${credit.billingDay}</p>
                            <div class="h3 fw-bold text-warning mb-4">${formatCurrency(total)}</div>
                            <button class="btn btn-outline-warning w-100 fw-bold" onclick="showCreditInstances('${credit.creditId}', '${credit.billingDay}')">
                                Ver Compras
                            </button>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += card;
        }
    } catch (error) {
        console.error('Erro ao carregar cartões:', error);
    }
}

// ========================================
// CREDIT CARDS ACTIONS
// ========================================

document.getElementById('creditForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    try {
        const billingDay = document.getElementById('creditBillingDay').value;
        const creditId = document.getElementById('creditId').value;

        const creditData = { billingDay: parseInt(billingDay) };
        let response;

        if (creditId) {
            response = await fetch(`http://localhost:8080/users/${userId}/credit/${creditId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(creditData)
            });
        } else {
            response = await fetch(`http://localhost:8080/users/${userId}/credit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(creditData)
            });
        }

        if (response.ok) {
            showNotification(creditId ? 'Cartão atualizado!' : 'Cartão criado!', 'success', 'warning');
            bootstrap.Modal.getInstance(document.getElementById('creditModal')).hide();
            loadCredits();
        }
    } catch (error) {
        console.error('Erro:', error);
    }
});

async function deleteCredit(creditId) {
    const confirmed = await showConfirm({
        title: 'Excluir Cartão',
        message: 'Deseja excluir este cartão e todas as suas compras?',
        icon: 'bi-trash',
        color: 'danger',
        buttonText: 'Excluir'
    });

    if (!confirmed) return;

    try {
        const response = await fetch(`http://localhost:8080/users/${userId}/credit/${creditId}`, { method: 'DELETE' });
        if (response.ok) {
            showNotification('Cartão excluído!', 'success', 'warning');
            loadCredits();
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

function editCredit(creditId, billingDay) {
    document.getElementById('creditId').value = creditId;
    document.getElementById('creditBillingDay').value = billingDay;
    document.getElementById('creditModalLabel').textContent = 'Editar Cartão';
    new bootstrap.Modal(document.getElementById('creditModal')).show();
}

// ========================================
// CREDIT INSTANCES ACTIONS
// ========================================

async function showCreditInstances(creditId, billingDay) {
    selectedCreditId = creditId;
    document.getElementById('selectedCreditTitle').textContent = `Compras - Cartão (Dia ${billingDay})`;
    document.getElementById('creditCardsContainer').classList.add('d-none');
    document.getElementById('creditInstancesView').classList.remove('d-none');
    loadCreditInstances();
}

function hideCreditInstances() {
    selectedCreditId = null;
    document.getElementById('creditCardsContainer').classList.remove('d-none');
    document.getElementById('creditInstancesView').classList.add('d-none');
    loadCredits(); // Recarrega para atualizar totais
}

async function loadCreditInstances() {
    if (!selectedCreditId) return;

    try {
        const response = await fetch(`http://localhost:8080/users/${userId}/credit/${selectedCreditId}/instance`);
        const instances = await response.json();

        const tbody = document.getElementById('creditInstancesTableBody');
        tbody.innerHTML = '';

        if (instances.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">Nenhuma compra registrada</td></tr>';
            return;
        }

        instances.forEach(item => {
            const row = `
                <tr>
                    <td class="fw-medium">${item.type}</td>
                    <td class="text-warning fw-bold">${formatCurrency(item.value)}</td>
                    <td>${formatDate(item.date)}</td>
                    <td>${item.isRecurrent ? '<span class="badge bg-info bg-opacity-10 text-info">Sim</span>' : '<span class="badge bg-light text-secondary">Não</span>'}</td>
                    <td class="text-end px-4">
                        <button class="btn btn-sm btn-light me-1" onclick="editCreditInstance('${item.creditInstancesId}')">
                            <i class="bi bi-pencil text-primary"></i>
                        </button>
                        <button class="btn btn-sm btn-light" onclick="deleteCreditInstance('${item.creditInstancesId}')">
                            <i class="bi bi-trash text-danger"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Erro ao carregar compras:', error);
    }
}

document.getElementById('creditInstanceForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    try {
        const type = document.getElementById('creditInstanceType').value;
        const value = document.getElementById('creditInstanceValue').value;
        const date = document.getElementById('creditInstanceDate').value;
        const isRecurrent = document.getElementById('creditInstanceIsRecurrent').checked;
        const creditInstanceId = document.getElementById('creditInstanceId').value;

        const data = { type, value, date, isRecurrent };
        let response;

        if (creditInstanceId) {
            response = await fetch(`http://localhost:8080/users/${userId}/credit/${selectedCreditId}/instance/${creditInstanceId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch(`http://localhost:8080/users/${userId}/credit/${selectedCreditId}/instance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }

        if (response.ok) {
            showNotification(creditInstanceId ? 'Compra atualizada!' : 'Compra registrada!', 'success', 'warning');
            bootstrap.Modal.getInstance(document.getElementById('creditInstanceModal')).hide();
            loadCreditInstances();
        }
    } catch (error) {
        console.error('Erro:', error);
    }
});

async function deleteCreditInstance(id) {
    const confirmed = await showConfirm({
        title: 'Excluir Compra',
        message: 'Deseja realmente remover este item da fatura?',
        icon: 'bi-trash',
        color: 'danger',
        buttonText: 'Excluir'
    });

    if (!confirmed) return;

    try {
        const response = await fetch(`http://localhost:8080/users/${userId}/credit/${selectedCreditId}/instance/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showNotification('Compra removida!', 'success', 'warning');
            loadCreditInstances();
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function editCreditInstance(id) {
    try {
        const response = await fetch(`http://localhost:8080/users/${userId}/credit/${selectedCreditId}/instance`);
        const items = await response.json();
        const item = items.find(i => i.creditInstancesId === id);

        if (item) {
            document.getElementById('creditInstanceId').value = item.creditInstancesId;
            document.getElementById('creditInstanceType').value = item.type;
            document.getElementById('creditInstanceValue').value = item.value;
            // Configura a data no Flatpickr
            const fp = document.querySelector("#creditInstanceDate")._flatpickr;
            fp.setDate(formatDateForInput(item.date));
            
            document.getElementById('creditInstanceIsRecurrent').checked = item.isRecurrent;
            document.getElementById('creditInstanceModalLabel').textContent = 'Editar Compra';
            new bootstrap.Modal(document.getElementById('creditInstanceModal')).show();
        }
    } catch (error) {
        console.error(error);
    }
}

// Resets
document.getElementById('creditModal').addEventListener('hidden.bs.modal', () => {
    document.getElementById('creditForm').reset();
    document.getElementById('creditId').value = '';
    document.getElementById('creditModalLabel').textContent = 'Novo Cartão';
});

document.getElementById('creditInstanceModal').addEventListener('hidden.bs.modal', () => {
    document.getElementById('creditInstanceForm').reset();
    document.getElementById('creditInstanceId').value = '';
    document.getElementById('creditInstanceModalLabel').textContent = 'Nova Compra';
});

document.getElementById('newCreditBtn').addEventListener('click', () => {
    document.getElementById('creditForm').reset();
    document.getElementById('creditId').value = '';
});
