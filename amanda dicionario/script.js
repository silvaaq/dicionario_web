let url = 'https://api.dicionario-aberto.net/word/';


let inputTxt = document.querySelector('#container__inputtxt');
let btntxt = document.querySelector('#container__btn');
let resultado = document.querySelector('#container__result');
let isLightMode = true;

btntxt.addEventListener('click', () => {
    let palavra = inputTxt.value;
    if (palavra === '') {
        resultado.innerHTML = `<p id="container__significado">Opa, não pode ficar vazio…!!</p>`;
    } else {
        fetch(`${url}${palavra}`)
            .then((resposta) => resposta.json())
            .then((data) => {
                console.log(data);
                if (data.length === 0 || !data[0].xml) {
                    resultado.innerHTML = `
                        <div id="noDefinitions">
                            <img src="./assets/img/triste.png" alt="triste">
                            <p style="color: red;">Nenhuma definição encontrada</p>
                            <p style="color: red;">Desculpe, não encontramos definições para a palavra que você está procurando. Você pode tentar a busca novamente mais tarde ou acessar a web para mais informações.</p>
                        </div>`;
                } else {
                    let parser = new DOMParser();
                    let xmlDoc = parser.parseFromString(data[0].xml, 'text/xml');
                    let definitions = Array.from(xmlDoc.getElementsByTagName('def'))
                        .map((def, index) => `<p id="container__significado"><span>${index + 1}º</span> ${def.textContent}</p>`)
                        .join('');

                    resultado.innerHTML = `
                        <h3 id="container__palavra">${palavra}</h3>
                        ${definitions}`;

                }
            })
            .catch(() => {
                resultado.innerHTML = `
                    <div id="noDefinitions">
                        <img src="./assets/img/triste.png" alt="triste">
                        <p style="color: red;">Nenhuma definição encontrada</p>
                        <p style="color: red;">Desculpe, não encontramos definições para a palavra que você está procurando. Você pode tentar a busca novamente mais tarde ou acessar a web para mais informações.</p>
                    </div>`;
            });
    }
});

function toggleIcon() {
    const button = document.getElementById('toggleButton');
    const modeInput = document.getElementById('modeInput');

    if (isLightMode) {
        button.textContent = '🌜'; // Lua
        modeInput.value = 'dark';
    } else {
        button.textContent = '🌞'; // Sol
        modeInput.value = 'light';
    }

    isLightMode = !isLightMode;
}

function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    toggleIcon();
}

function changeFont() {
    const fontSelect = document.getElementById('fontSelect');
    const selectedFont = fontSelect.value;

    const allTextElements = document.querySelectorAll('body, body *');
    allTextElements.forEach(element => {
        element.style.fontFamily = selectedFont;
    });
}
document.addEventListener('DOMContentLoaded', () => {
    const wordAudioButton = document.getElementById('word__audio');

    wordAudioButton.addEventListener('click', (event) => {
        event.preventDefault();
        const audioSrc = wordAudioButton.getAttribute('href');
        if (audioSrc) {
            const audio = new Audio(audioSrc);
            audio.play();
        }
    });

    document.getElementById('fetchPronunciation').addEventListener('click', function() {
        const word = document.getElementById('wordInput').value;
        if (word) {
            fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
                .then(response => response.json())
                .then(data => {
                    if (data && data[0] && data[0].phonetics && data[0].phonetics.length > 0) {
                        const phonetic = data[0].phonetics.find(p => p.audio);
                        if (phonetic && phonetic.audio) {
                            document.getElementById('audioPlayer').src = phonetic.audio;
                            document.getElementById('audioPlayer').play();
                        } else {
                            alert('Pronúncia não disponível para esta palavra.');
                        }
                    } else {
                        alert('Pronúncia não disponível para esta palavra.');
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar a pronúncia:', error);
                    alert('Erro ao buscar a pronúncia.');
                });
        } else {
            alert('Por favor, digite uma palavra.');
        }
    });
    
});

  



