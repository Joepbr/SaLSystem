import myfetch from "./myfetch";

export async function checkModuloAccess(moduloId) {
    try {
        const response = await myfetch.get(`/modulos/${moduloId}/check-access`)
        return response.hasAccess
    }
    catch (error) {
        console.error('Erro checando acesso ao módulo: ', error)
        return false
    }
}

export async function checkAlunoAccess(alunoId) {
    try {
        const response = await myfetch.get(`/alunos/${alunoId}/check-access`)
        return response.hasAccess
    }
    catch (error) {
        console.error('Erro checando acesso ao perfil: ', error)
        return false
    }
}