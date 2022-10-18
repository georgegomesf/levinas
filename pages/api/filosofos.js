import axios from 'axios';

const setHeader = () => {
    return {
        headers: {
            'Content-Type':'application/json',            
            'x-hasura-admin-secret':`${process.env.HASURA_TOKEN}`
        }
    }
}

const filosofos = async (req, res) => {

    const { action } = req.body;

    if(action=="getFilosofos"){

        const response = await axios.post(process.env.HASURA_GRAPHQL_URL,{
            query: `{
                filodoc_filosofos (where: { livros_filosofo: { livro_id: { _is_null: false } } }, order_by: {ultimo_nome:asc}){
                    id
                    primeiro_nome
                    ultimo_nome
                    nome
                    livros_filosofo_aggregate {
                        aggregate {
                          count
                        }
                    }
                    publicacoes_filosofo_aggregate {
                        aggregate {
                          count
                        }
                    }
                }
            }`
        },setHeader()).catch(e=>console.log(e.response?.data.errors))

        return res.status(200).json(response?.data.data?.filodoc_filosofos)

    }

    res.end()

}

export default filosofos;