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