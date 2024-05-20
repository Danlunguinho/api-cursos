'use strict';
const isCpfValido = require('../../utils/validaCpfHelper.js');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pessoa extends Model {
    static associate(models) {
      Pessoa.hasMany(models.Curso, {
        foreignKey: 'docente_id'
      });
      Pessoa.hasMany(models.Matricula, {
        foreignKey: 'estudante_id',
        scope: { status: 'matriculado' },
        as: 'aulasMatriculadas'
      });
      Pessoa.hasMany(models.Matricula, {
        foreignKey: 'estudante_id',
        as: 'todasAsMatriculas'
      });
    }
  }
  Pessoa.init({
    nome: {
      type: DataTypes.STRING,
      validate: { 
        len: { arg: [3, 30], msg: 'O campo nome deve ter no minímo 3 caracteres'} 
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: { args: true, msg: 'Formato do E-mail inválido'}
      }
    },
    cpf: {
      type: DataTypes.STRING,
      validate: {
        cpfEhValido: (cpf) => {
          if(!isCpfValido(cpf)) throw new Error('número de CPF inválido');
        }
      }
    },
    ativo: DataTypes.BOOLEAN,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Pessoa',
    tableName: 'pessoas',
    paranoid: true,
    defaultScope: { 
      where: { ativo: true }
    },
    scopes: {
      todosOsRegistros: { where: {} }
    }
  });
  return Pessoa;
};