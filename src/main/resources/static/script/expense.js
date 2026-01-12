// ========================================
// EXPENSES CRUD
// ========================================

// Form submit
document.getElementById('expenseForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    // TODO: Implementar POST/PUT para criar/editar despesa
    console.log('TODO: Salvar despesa');
});

function editExpense(id) {
    // TODO: Buscar despesa por ID e preencher modal
    console.log('TODO: Editar despesa', id);
}

function deleteExpense(id) {
    // TODO: Deletar despesa
    if (confirm('Deseja realmente excluir esta despesa?')) {
        console.log('TODO: Deletar despesa', id);
    }
}