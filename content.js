const chatSelector = '[data-a-target="chat-line-message"]';

let queue = [];
let delay = 1500;

function init() {

    const chatContainer = document.querySelector('[data-a-target="chat-scroller"]');

    if (!chatContainer) {
        setTimeout(init, 2000);
        return;
    }

    observeChat(chatContainer);
    messageLoop();
    createControlButton();

}

function observeChat(container) {

    const observer = new MutationObserver(mutations => {

        mutations.forEach(mutation => {

            mutation.addedNodes.forEach(node => {

                if (node.nodeType === 1 && node.matches(chatSelector)) {

                    node.style.opacity = "0";
                    queue.push(node);

                }

            });

        });

    });

    observer.observe(container, {
        childList: true,
        subtree: true
    });

}

function messageLoop() {

    if (queue.length > 0) {

        const msg = queue.shift();

        msg.style.transition = "opacity 0.3s";
        msg.style.opacity = "1";

    }

    setTimeout(messageLoop, delay);

}

function createControlButton() {

    const toolbar = document.querySelector('[data-a-target="chat-settings"]')?.parentElement;

    if (!toolbar) {
        setTimeout(createControlButton, 2000);
        return;
    }

    if (document.getElementById("slowChatBtn")) return;

    const btn = document.createElement("button");
    btn.id = "slowChatBtn";
    btn.innerText = "🐢";
    btn.title = "Chat Speed";

    toolbar.appendChild(btn);

    btn.addEventListener("click", togglePopup);

}

function togglePopup() {

    let popup = document.getElementById("slowChatPopup");

    if (popup) {
        popup.remove();
        return;
    }

    popup = document.createElement("div");
    popup.id = "slowChatPopup";

    popup.innerHTML = `
        <div class="popupTitle">Chat Speed</div>

        <button data-speed="1000">1s</button>
        <button data-speed="3000">3s</button>
        <button data-speed="5000">5s</button>
        <button data-speed="10000">10s</button>
        <button data-speed="20000">20s</button>
        <button data-speed="30000">30s</button>

        <div class="sliderLabel">Custom Speed</div>
        <input id="speedSlider" type="range" min="500" max="60000" step="500" value="${delay}">
        <div id="speedValue">${delay} ms</div>
    `;

    document.body.appendChild(popup);

    popup.querySelectorAll("button").forEach(btn => {

        btn.onclick = () => {
            delay = parseInt(btn.dataset.speed);
            popup.remove();
        };

    });

    const slider = document.getElementById("speedSlider");
    const value = document.getElementById("speedValue");

    slider.oninput = () => {
        delay = parseInt(slider.value);
        value.innerText = delay + " ms";
    };

}

init();