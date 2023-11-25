import * as Highcharts from 'https://code.highcharts.com/highcharts.js'

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


function simularExecucao(frames, paginas, algoritmo) {
    const usoRam = [];
    const usoDisco = [];
  
    for (let i = 0; i < paginas.length; i++) {
      const paginaAtual = paginas[i];
  
      if (usoRam.includes(paginaAtual)) {
        usoDisco.push(null);
      } else {
        usoRam.push(paginaAtual);
  
        if (usoRam.length > frames) {
          usoRam.shift();
          usoDisco.push(null);
        } else {
          usoDisco.push(null);
        }
      }
    }
  
    return usoRam;
  }

  const script = document.createElement('script');
  
  document.addEventListener('DOMContentLoaded', function() {
    
  document.head.appendChild(script);
  });
  
  script.onload = function () {
    function gerarGanttChart(usoRam) {
      const data = usoRam.map((processo, index) => ({
        x: index,
        y: processo === null ? 0 : 1,
        name: processo === null ? 'Disco' : `RAM P${processo}`,
        color: processo === null ? 'red' : 'green',
      }));
  
      Highcharts.ganttChart('ganttChart', {
        series: [{
          data: data,
        }],
        title: {
          text: 'Gantt Chart - Substituição de Páginas',
        },
        xAxis: {
          title: {
            text: 'Steps',
          },
        },
        yAxis: {
          categories: ['Disco', 'RAM'],
          title: {
            text: 'Memória',
          },
        },
      });
    }
  
    const frames = 3;
    const paginas = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];
  
    const usoRam = simularExecucao(frames, paginas, substituicaoFIFO);
    gerarGanttChart(usoRam);
  };