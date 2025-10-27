class Funcionario {
    constructor(nome, idade, cargo, salario) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.nome = nome;
        this.idade = idade;
        this.cargo = cargo;
        this.salario = salario;
    }

    getNome() { return this.nome; }
    setNome(nome) { this.nome = nome; }

    getIdade() { return this.idade; }
    setIdade(idade) { this.idade = idade; }

    getCargo() { return this.cargo; }
    setCargo(cargo) { this.cargo = cargo; }

    getSalario() { return this.salario; }
    setSalario(salario) { this.salario = salario; }

    toString() {
        return `Funcionario { Nome: ${this.nome}, Idade: ${this.idade}, Cargo: ${this.cargo}, Salário: ${this.salario} }`;
    }
}

let funcionarios = [];
let editandoId = null;

const form = document.getElementById('formFuncionario');
const btnCancelar = document.getElementById('btnCancelar');
const corpoTabela = document.getElementById('corpoTabela');
const relatorioDiv = document.getElementById('relatorio');

// Cadastrar ou Editar
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const idade = parseInt(document.getElementById('idade').value);
    const cargo = document.getElementById('cargo').value;
    const salario = parseFloat(document.getElementById('salario').value);

    if (editandoId) {
        const func = funcionarios.find(f => f.id === editandoId);
        if (func) {
            func.setNome(nome);
            func.setIdade(idade);
            func.setCargo(cargo);
            func.setSalario(salario);
        }
        editandoId = null;
        btnCancelar.style.display = 'none';
    } else {
        const novoFunc = new Funcionario(nome, idade, cargo, salario);
        funcionarios.push(novoFunc);
    }

    form.reset();
    atualizarTabela();
});

// Cancelar Edição
btnCancelar.addEventListener('click', () => {
    editandoId = null;
    btnCancelar.style.display = 'none';
    form.reset();
});

// Atualizar Tabela
const atualizarTabela = () => {
    corpoTabela.innerHTML = '';
    funcionarios.forEach(func => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${func.nome}</td>
            <td>${func.idade}</td>
            <td>${func.cargo}</td>
            <td>R$ ${func.salario.toFixed(2)}</td>
            <td>
                <button class="btnEditar" data-id="${func.id}">Editar</button>
                <button class="btnExcluir" data-id="${func.id}">Excluir</button>
            </td>
        `;
        corpoTabela.appendChild(tr);
    });

    // Adicionar eventos de editar e excluir
    document.querySelectorAll('.btnEditar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const func = funcionarios.find(f => f.id === id);
            if (func) {
                document.getElementById('nome').value = func.nome;
                document.getElementById('idade').value = func.idade;
                document.getElementById('cargo').value = func.cargo;
                document.getElementById('salario').value = func.salario;
                editandoId = id;
                btnCancelar.style.display = 'inline';
            }
        });
    });

    document.querySelectorAll('.btnExcluir').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            funcionarios = funcionarios.filter(f => f.id !== id);
            atualizarTabela();
        });
    });
};

// RELATÓRIOS CORRIGIDOS
document.getElementById('btnSalarioMaior5000').addEventListener('click', () => {
    const filtrados = funcionarios.filter(f => f.salario > 5000);
    const resultado = filtrados.map(f => 
        `${f.nome} - R$ ${f.salario.toFixed(2)}`
    ).join('<br>');
    
    relatorioDiv.innerHTML = `
        <h3>Funcionários com salário > R$ 5000:</h3>
        <p>${filtrados.length > 0 ? resultado : 'Nenhum funcionário encontrado'}</p>
    `;
});

document.getElementById('btnMediaSalarial').addEventListener('click', () => {
    const media = funcionarios.reduce((acc, f) => acc + f.salario, 0) / funcionarios.length || 0;
    relatorioDiv.innerHTML = `<h3>Média Salarial: R$ ${media.toFixed(2)}</h3>`;
});

document.getElementById('btnCargosUnicos').addEventListener('click', () => {
    const cargos = [...new Set(funcionarios.map(f => f.cargo))];
    relatorioDiv.innerHTML = `
        <h3>Cargos Únicos:</h3>
        <p>${cargos.join('<br>')}</p>
    `;
});

document.getElementById('btnNomesMaiusculo').addEventListener('click', () => {
    const nomes = funcionarios.map(f => f.nome.toUpperCase());
    relatorioDiv.innerHTML = `
        <h3>Nomes em Maiúsculo:</h3>
        <p>${nomes.join('<br>')}</p>
    `;
});

// Inicializar tabela
atualizarTabela();