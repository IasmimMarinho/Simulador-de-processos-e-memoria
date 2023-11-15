function substituicaoFIFO(frames, paginas) {
    let paginaAtual = 0;
    let fila = [];

    return paginas.map((pagina) => {
        if (!fila.includes(pagina)) {
            if (fila.length < frames) {
                fila.push(pagina);
            } else {
                const paginaSubstituida = fila.shift();
                fila.push(pagina);
                return paginaSubstituida;
            }
        }

        return null;
    });
}

function substituicaoLRU(frames, paginas) {
    let fila = [];

    return paginas.map((pagina, index) => {
        if (!fila.includes(pagina)) {
            if (fila.length < frames) {
                fila.push(pagina);
            } else {
                const paginaSubstituida = fila.shift();
                fila.push(pagina);

                return paginaSubstituida;
            }
        } else {
            fila = fila.filter((p) => p !== pagina);
            fila.push(pagina);
        }

        return null;
    });
}

