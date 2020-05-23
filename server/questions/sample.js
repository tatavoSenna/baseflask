const DAG = {
    adjacency: {
      pj: ["1"],
      pf: ["2"],
      good: ["3"],
      witness: ["4", "5"],
      witnessData: ["6"],
    },
    nodes: {
      pj: {
        questions: [
            {
                id: 1,
                dependsOn: null,
                variable: 'concessionaries',
                type: 'input',
                value: 'Qual o nome da concessionária?'
            },
            {
                id: 2,
                dependsOn: null,
                variable: 'cnpj',
                type: 'input',
                value: 'Qual o CNPJ da concessionária?'
            },
            {
                id: 3,
                variable: 'address',
                type: 'input',
                value: 'Qual o endereço da concessionária?'
            },
        ]
      },
      pf: {
        questions: [
            {
                id: 1,
                variable: 'concessionaire_signer',
                type: 'input',
                value: 'Qual o email do responsável pela concessionária?'
            },
            {
                id: 2,
                variable: 'client',
                type: 'input',
                value: 'Qual o nome do cliente?'
            },
            {
                id: 3,
                variable: 'client_cpf',
                type: 'input',
                value: 'Qual o CPF do cliente?'
            },
            {
                id: 4,
                variable: 'client_address',
                type: 'input',
                value: 'Qual o endereço do cliente?'
            },
            {
                id: 4,
                variable: 'client_email',
                type: 'input',
                value: 'Qual o email do cliente?'
            },
        ]
      },
      good: {
          questions: [
              {
                  id: 1,
                  variable: 'good_type', // or vehicle as it is
                  type: 'input',
                  value: 'Qual o veículos adquirido?'
                },
                {
                    id: 2,
                    variable: 'description',
                    type: 'input',
                    value: 'Demonstrou insatisfação com relação à?'
                },
                {
                    id: 3,
                    variable: 'opt_for',
                    type: 'input',
                    value: 'A concessionária optou por?'
                },
                {
                    id: 4,
                    variable: 'benefit',
                    type: 'input',
                    value: 'Qual o benefício concedido pela concessionária?'
                },
            ]
        },
        witness: {
            questions: [
                {
                    id: 1,
                    variable: 'has_witness',
                    type: 'radio',
                    options: ['sim', 'não'],
                    value: 'Necessita de testemunhas?'
                },
            ]
        },
        witnessData: {
            questions: [
                {
                    id: 1,
                    variable: 'witness_name_1',
                    type: 'input',
                    value: 'Qual o nome da primeira testemunha?'
                },
                {
                    id: 2,
                    variable: 'witness_name_1',
                    type: 'input',
                    value: 'Qual o nome da primeira testemunha?'
                },
            ]
        },
        result: {
           end: true, 
        },
    },
    edges: {
      1: {
        from: "pj",
        to: "pf",
        data: {}
      },
      2: {
        from: "pf",
        to: "good",
        data: {}
      },
      3: {
        from: "good",
        to: "witness",
        data: {}
      },
      4: {
        from: "witness",
        to: "witnessData",
        data: {
            value: true
        }
      },
      5: {
        from: "witness",
        to: "result",
        data: {
            value: false
        }
      },
      6: {
        from: "witnessData",
        to: "result",
        data: {}
      },
    }
  }