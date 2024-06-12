document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('search-form');
    const filterForm = document.getElementById('filter-form');
    const filterDialog = document.getElementById('filter-dialog');
    const newsList = document.getElementById('news-list');
    const pagination = document.getElementById('pagination');

    const apiUrl = 'http://servicodados.ibge.gov.br/api/v3/noticias';
    const agencyNewsUrl = 'https://agenciadenoticias.ibge.gov.br/';

    function updateFilterOptions() {
        const filterQuantity = document.getElementById('filter-quantity');
        for (let i = 10; i <= 100; i += 5) {
            let option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            filterQuantity.appendChild(option);
        }
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const filterType = document.getElementById('filter-type');
                const types = new Set(data.items.map(item => item.tipo));
                types.forEach(type => {
                    let option = document.createElement('option');
                    option.value = type;
                    option.textContent = type;
                    filterType.appendChild(option);
                });
            });
    }

    function toggleFilterDialog() {
        if (filterDialog.open) {
            filterDialog.close();
        } else {
            filterDialog.showModal();
        }
    }

    function applyFilters() {
        const formData = new FormData(filterForm);
        const query = new URLSearchParams(formData).toString();
        const searchParams = new URLSearchParams(window.location.search);
        formData.forEach((value, key) => searchParams.set(key, value));
        window.history.replaceState({}, '', `?${searchParams.toString()}`);
        fetchNews();
        filterDialog.close();
    }

    function fetchNews(page = 1) {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('page', page);
        const query = searchParams.toString();
        fetch(`${apiUrl}?${query}`)
            .then(response => response.json())
            .then(data => {
                renderNews(data.items);
                renderPagination(data.totalPages, page);
            });
    }

    function renderNews(news) {
        newsList.innerHTML = '';
        news.forEach(item => {
            const li = document.createElement('li');
            li.className = 'news-item';
            li.innerHTML = `
                <img src="${agencyNewsUrl}${item.imagens[0].image}" alt="${item.titulo}">
                <h2>${item.titulo}</h2>
                <p>${item.introducao}</p>
                <p class="editoria">#${item.editorias.join(', #')}</p>
                <p>Publicado há ${formatDateDiff(item.data_publicacao)}</p>
                <a href="${agencyNewsUrl}${item.id}" target="_blank">Leia Mais</a>
            `;
            newsList.appendChild(li);
        });
    }

    function renderPagination(totalPages, currentPage) {
        pagination.innerHTML = '';
        const start = Math.max(1, currentPage - 4);
        const end = Math.min(totalPages, currentPage + 5);
        for (let i = start; i <= end; i++) {
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.textContent = i;
            button.className = i === currentPage ? 'active' : '';
            button.addEventListener('click', () => fetchNews(i));
            li.appendChild(button);
            pagination.appendChild(li);
        }
    }

    function formatDateDiff(dateString) {
        const date = new Date(dateString);
        const diff = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
        if (diff === 0) return 'hoje';
        if (diff === 1) return 'ontem';
        return `há ${diff} dias`;
    }

    updateFilterOptions();
    fetchNews();

    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const query = document.getElementById('search-input').value;
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('q', query);
        window.history.replaceState({}, '', `?${searchParams.toString()}`);
        fetchNews();
    });

    filterForm.addEventListener('submit', function (e) {
        e.preventDefault();
        applyFilters();
    });

    document.getElementById('filter-icon').addEventListener('click', toggleFilterDialog);
    document.getElementById('close-dialog').addEventListener('click', toggleFilterDialog);
});
