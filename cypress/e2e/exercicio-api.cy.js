/// <reference types="cypress" />
import usuariosSchema from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response => {
      expect(response.status).to.equal(200)
      return usuariosSchema.validateAsync(response.body)
    })
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).then((response) =>{
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('usuarios')
    })
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    cy.fixture('usuarios').then(dados =>{
      cy.cadastrarUsuarios(dados[0].nome, dados[0].email, dados[0].password, dados[0].administrador)
      .then((response) => {
        expect(response.status).to.equal(201)
        expect(response.body.message).to.equal('Cadastro realizado com sucesso')
      })
    })
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.fixture('usuarios').then(dados =>{
      cy.cadastrarUsuarios(dados[1].nome, dados[1].email, dados[1].password, dados[1].administrador)
      .then((response) => {
        expect(response.status).to.equal(400)
        expect(response.body.email).to.equal('email deve ser um email válido')
      })
    })
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    let id
    cy.fixture('usuarios').then(dados =>{
      cy.cadastrarUsuarios(dados[2].nome, dados[2].email, dados[2].password, dados[2].administrador)
      .then((response) => {
        expect(response.status).to.equal(201)
        id = response.body._id
        cy.request({
          method: 'PUT',
          url: `usuarios/${id}`,
          body: 
          {
              "nome": "Marrom editada",
              "email": "marromalcione@qa.com.br",
              "password": "teste",
              "administrador": "false"
          }
        }).then(response => {
          expect(response.body.message).to.equal("Registro alterado com sucesso")
        })
      })
    })
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    let id
    cy.fixture('usuarios').then(dados =>{
      cy.cadastrarUsuarios(dados[3].nome, dados[3].email, dados[3].password, dados[3].administrador)
      .then((response) => {
        expect(response.status).to.equal(201)
        id = response.body._id
        cy.request({
          method: 'DELETE',
          url: `usuarios/${id}`
        }).then(response => {
          expect(response.body.message).to.equal("Registro excluído com sucesso")
        })
      })
    })
  });


});
