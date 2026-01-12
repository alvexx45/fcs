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