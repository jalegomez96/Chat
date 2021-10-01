const txt_nickname = document.getElementById('nickname');
const btn_connect = document.getElementById('btn_connect');
const btn_disconnect = document.getElementById('btn_disconnect');
const txt_message = document.getElementById('message');
const btn_send = document.getElementById('btn_send');
const history = document.getElementById('history');

function connect() {
  const nickname = txt_nickname.value.trim();
  if (!nickname) return;
  enable_chat(true);
}

function disconnect() {
  enable_chat(false);
}

function enable_chat(value) {
  txt_nickname.disabled = value;
  btn_connect.disabled = value;
  btn_disconnect.disabled = !value;
  txt_message.disabled = !value;
  btn_send.disabled = !value;
}

function send() {
  const message = txt_message.value.trim();
  if (!message) return;
  add_history({ nickname: 'You', message, timestamp: new Date() });
  txt_message.value = '';
}

function add_history({ nickname, message, timestamp }) {
  history.innerHTML += `<p><b>${nickname}:</b> ${message} <sub>${new Date(
    timestamp
  ).toLocaleString()}</sub></p>`;
}
