// ========================================
// NAVEGAÇÃO ENTRE SEÇÕES
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // ========================================
    // MOBILE SIDEBAR TOGGLE
    // ========================================
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
            sidebarOverlay.classList.toggle('show');
        });
        
        // Fecha sidebar ao clicar no overlay
        sidebarOverlay.addEventListener('click', function() {
            sidebar.classList.remove('show');
            sidebarOverlay.classList.remove('show');
        });
    }
    
    // Mostra data atual
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        currentDateElement.textContent = new Date().toLocaleDateString('pt-BR', {
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        });
    }

    // Navegação do menu lateral
    const navLinks = document.querySelectorAll('.sidebar .nav-link[data-section]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active de todos os links
            navLinks.forEach(l => l.classList.remove('active'));
            // Adiciona active no link clicado
            this.classList.add('active');
            
            // Esconde todas as seções
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.add('d-none');
            });
            
            // Mostra a seção correspondente
            const sectionId = this.dataset.section;
            document.getElementById(sectionId).classList.remove('d-none');
            
            // Fecha sidebar no mobile
            if (window.innerWidth < 768 && sidebar) {
                sidebar.classList.remove('show');
                sidebarOverlay.classList.remove('show');
            }
            
            // Carrega dados da seção
            loadSectionData(sectionId);
        });
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', async function(e) {
        e.preventDefault();
        const confirmed = await showConfirm({
            title: 'Sair da conta',
            message: 'Deseja realmente encerrar sua sessão?',
            icon: 'bi-box-arrow-right',
            color: 'primary',
            buttonText: 'Sair'
        });
        
        if (confirmed) {
            window.location.href = '/';
        }
    });

    // Carrega dados iniciais
    loadOverviewData();

    // Inicializa o Flatpickr para todos os campos de data
    const flatpickrConfig = {
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "d/m/Y",
        locale: "pt",
        disableMobile: "true"
    };

    flatpickr('#expenseDate', flatpickrConfig);
    flatpickr('#incomeDate', flatpickrConfig);
    flatpickr('#investmentDate', flatpickrConfig);
});

// Função para mostrar modal de confirmação customizado
function showConfirm({ title, message, icon, color, buttonText }) {
    return new Promise((resolve) => {
        const modalElement = document.getElementById('confirmModal');
        const confirmBtn = document.getElementById('confirmBtn');
        const iconElement = document.getElementById('confirmIcon');
        const titleElement = document.getElementById('confirmTitle');
        const messageElement = document.getElementById('confirmMessage');
        
        // Configura conteúdo
        titleElement.textContent = title || 'Tem certeza?';
        messageElement.textContent = message || 'Esta ação não poderá ser desfeita.';
        confirmBtn.textContent = buttonText || 'Confirmar';
        
        // Configura ícone e cor
        iconElement.className = `bi ${icon || 'bi-exclamation-circle'} display-4 text-${color || 'warning'}`;
        confirmBtn.className = `btn btn-${color === 'primary' ? 'primary' : 'danger'} px-4`;
        
        const modal = new bootstrap.Modal(modalElement);
        
        // Handler para o botão de confirmar
        const handleConfirm = () => {
            modal.hide();
            resolve(true);
            confirmBtn.removeEventListener('click', handleConfirm);
        };
        
        confirmBtn.addEventListener('click', handleConfirm);
        
        // Handler para quando o modal fecha (seja por cancelar ou clicar fora)
        modalElement.addEventListener('hidden.bs.modal', function onHidden() {
            resolve(false);
            confirmBtn.removeEventListener('click', handleConfirm);
            modalElement.removeEventListener('hidden.bs.modal', onHidden);
        }, { once: true });
        
        modal.show();
    });
}

function loadSectionData(section) {
    switch(section) {
        case 'overview':
            loadOverviewData();
            break;
        case 'expenses':
            loadExpenses();
            break;
        case 'income':
            loadIncome();
            break;
        case 'investments':
            loadInvestments();
            break;
    }
}

const userId = localStorage.getItem('userId');

async function loadOverviewData() {
    try {
        // Buscar totais de cada categoria
        const [expensesRes, incomeRes, investmentsRes] = await Promise.all([
            fetch(`http://localhost:8080/users/${userId}/expense/total`),
            fetch(`http://localhost:8080/users/${userId}/income/total`),
            fetch(`http://localhost:8080/users/${userId}/investment/total`)
        ]);

        const totalExpenses = await expensesRes.json();
        const totalIncome = await incomeRes.json();
        const totalInvestments = await investmentsRes.json();

        // Atualizar cards
        document.getElementById('totalExpenses').textContent = formatCurrency(totalExpenses);
        document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
        document.getElementById('totalInvestments').textContent = formatCurrency(totalInvestments);

        // Calcular e mostrar saldo (Receitas - Despesas - Investimentos)
        const balance = totalIncome - totalExpenses - totalInvestments;
        const balanceElement = document.getElementById('totalBalance');
        balanceElement.textContent = formatCurrency(balance);
        // Mantém a cor do texto igual ao rótulo (branco no card primário) para melhor harmonia
        balanceElement.className = 'display-4 fw-bold mb-0 text-white';
    } catch (error) {
        console.error('Erro ao carregar dados gerais:', error);
    }
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(dateString) {
    // Se for array [2026, 1, 12], converte para string
    if (Array.isArray(dateString)) {
        const [year, month, day] = dateString;
        dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
}

// Converte data do backend para formato do input type="date" (YYYY-MM-DD)
function formatDateForInput(dateValue) {
    if (Array.isArray(dateValue)) {
        const [year, month, day] = dateValue;
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    return dateValue;
}

// Função para mostrar mensagens de notificação
function showNotification(message, type = 'success', color = 'primary', containerId = null) {
    // Define a cor baseada no tipo de entidade
    const colorClass = type === 'success' ? `bg-${color}` : 'bg-danger';
    
    // Cria o elemento de notificação
    const notification = document.createElement('div');
    notification.className = `alert ${colorClass} text-white shadow-lg border-0 fade show position-fixed`;
    // Estilo para centralizar no topo
    notification.style.cssText = 'top: 20px; left: 50%; transform: translateX(-50%); z-index: 9999; min-width: 320px; max-width: 90%; opacity: 0; transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); padding: 1rem 1.5rem;';
    notification.innerHTML = `
        <div class="d-flex align-items-center justify-content-center gap-2">
            <strong>${type === 'success' ? '✓' : '✗'}</strong> 
            <span>${message}</span>
        </div>
    `;
    
    // Adiciona ao body
    document.body.appendChild(notification);
    
    // Fade in e leve movimento para baixo
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.top = '30px';
    }, 10);
    
    // Fade out e remove após 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.top = '20px';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}