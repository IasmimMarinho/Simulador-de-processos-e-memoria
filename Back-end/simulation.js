const { substituicaoFIFO, substituicaoLRU } = require('./pagination');

function simularExecucao(frames, paginas, algoritmo) {
    const substituicoes = algoritmo(frames, paginas);
    const usoRam = [];
    const usoDisco = [];

    for (let i = 0; i < paginas.length; i++) {
        const paginaAtual = paginas[i];

        if (usoRam.includes(paginaAtual)) {
            usoDisco.push(null);
        } else {
            usoRam.push(paginaAtual);

             if (usoRam.length > frames) {
                const paginaSubstituida = substituicoes.shift();
                usoRam.splice(usoRam.indexOf(paginaSubstituida), 1);
                usoDisco.push(paginaSubstituida);
            } else {
                usoDisco.push(null);
            }
        }
    }

    return { usoRam, usoDisco };
}

const frames = 3;
const paginas = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];

const resultadoFIFO = simularExecucao(frames, paginas, substituicaoFIFO);
const resultadoLRU = simularExecucao(frames, paginas, substituicaoLRU);

console.log("Resultado FIFO:", resultadoFIFO);
console.log("Resultado LRU:", resultadoLRU);