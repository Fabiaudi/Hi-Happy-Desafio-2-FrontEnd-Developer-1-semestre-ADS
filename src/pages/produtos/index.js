import "./index.css";
import produtoService from '../../services/produto-service';
import Swal from "sweetalert2";
import Produto from '../../models/Produto';
import { useState, useEffect } from 'react';


export default function Produtos() {

    const [produtos, setProdutos] = useState([]);
    const [produto, setProduto] = useState(new Produto());
    const [modoEdicao, setModoEdicao] = useState(false);

    useEffect(() => {
        produtoService.obter()
            .then((response) => {
                setProdutos(response.data);
            })
            .catch(erro => { })
    }, []);

    const editar = (e) => {
        setModoEdicao(true);
        let produtoParaEditar = produtos.find(c => c.id == e.target.id);
        produtoParaEditar.dataCadastro = produtoParaEditar.dataCadastro.substring(0, 10);

        setProduto(produtoParaEditar);
    }

    const excluirProdutoNaLista = (produto) => {
        let indice = produtos.findIndex(c => c.id == produto.id);

        produtos.splice(indice, 1);

        setProdutos(arr => [...arr]);
    }

    const excluir = (e) => {
        let produtoParaExcluir = produtos.find(c => c.id == e.target.id);

        // eslint-disable-next-line no-restricted-globals
        if (confirm("Deseja realmente excluir o produto " + produtoParaExcluir.nome)) {
            produtoService.excluir(produtoParaExcluir.id)
                .then(() => {
                    excluirProdutoNaLista(produtoParaExcluir);
                })
        }
    }

    const salvar = () => {
        if (!produto.email || !produto.cpfOuCnpj) {
            Swal.fire({
                icon: 'error',
                text: 'E-mail e CPF são obrigatórios.'
            });

            return;
        }

        (modoEdicao)
            ? atualizarProdutoNoBackend(produto)
            : adicionarProdutoNoBackend(produto);
    }


    const atualizarProdutoNoBackend = (produto) => {
        produtoService.atualizar(produto)
            .then(response => {
                limparModal();

                Swal.fire({
                    icon: 'success',
                    title: `Produto ${produto.nome}, foi atualizado com sucesso!`,
                    showConfirmButton: false,
                    timer: 5000
                })

                let indice = produtos.findIndex(c => c.id == produto.id);
                produtos.splice(indice, 1, produto);

                setProdutos(lista => [...lista]);

            })
    }

    const adicionar = () => {
        setModoEdicao(false);
        limparModal();
    }

    const limparModal = () => {
        // Limpar modal de produto com react
        setProduto({
            ...produto,
            id: '',
            nome: '',
            cpfOuCnpj: '',
            telefone: '',
            dataCadastro: '',
            email: ''
        });
    }

    const adicionarProdutoNoBackend = (produto) => {
        produtoService.adicionar(produto)
            .then(response => {
                setProdutos(lista => [...lista, new Produto(response.data)]);

                limparModal();

                Swal.fire({
                    icon: 'success',
                    title: `Produto ${produto.nome}, foi cadastrado com sucesso!`,
                    showConfirmButton: false,
                    timer: 6000
                })
            })
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-12">
                    <h4>Gerenciador de Produtos</h4>
                    <hr />
                </div>
            </div>

            <div className="row">
                <div className="col-sm-3">
                    <button id="btn-adicionar" className="btn btn-primary btn-sm " data-bs-toggle="modal"
                        data-bs-target="#modal-produto">Adicionar</button>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-sm-12">
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Nome </th>
                                <th>Valor </th>
                                <th>Estoque </th>
                                <th>Observação </th>
                                <th>Data de cadastro</th>
                                <th>Modificar</th>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>
            </div>

            <div className="modal" id="modal-produto">
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title">Adicionar produto</h4>
                            <button type="button" className="btn-close"></button>
                        </div>


                        <div className="modal-body">

                            <div className="row">

                                <div className="col-sm-2">
                                    <label for="id" className="form-label">Id</label>
                                    <input id="id" type="text" disabled className="form-control" />
                                </div>

                                <div className="col-sm-10">
                                    <label for="nome" className="form-label">Nome</label>
                                    <input id="nome" type="text" className="form-control" />
                                </div>
                            </div>

                            <div className="row">

                                <div className="col-sm-2">
                                    <label for="valor" className="form-label">Valor</label>
                                    <input id="valor" type="text" className="form-control" />
                                </div>

                                <div className="col-sm-2">
                                    <label for="quantidadeEstoque" className="form-label">Estoque</label>
                                    <input id="quantidadeEstoque" type="text" className="form-control" />
                                </div>

                                <div className="col-sm-4">
                                    <label for="observacao" className="form-label">Observação</label>
                                    <input id="observacao" type="text" className="form-control" />
                                </div>

                                <div className="col-sm-3">
                                    <label for="dataCadastro" className="form-label">Data de Cadastro</label>
                                    <input id="dataCadastro" type="date" className="form-control" />
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button id="btn-salvar" type="button" className="btn btn-primary btn-sm">Salvar</button>
                            <button id="btn-cancelar" type="button" className="btn btn-light btn-sm" data-bs-dismiss="modal">Cancelar</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}