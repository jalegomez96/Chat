const txt_nickname = document.getElementById('nickname');
const btn_connect = document.getElementById('btn_connect');
const btn_disconnect = document.getElementById('btn_disconnect');
const txt_message = document.getElementById('message');
const btn_send = document.getElementById('btn_send');
const history = document.getElementById('history');
const socket = io('http://localhost:5000/', { autoConnect: false });

socket.on('response', (data) => {
  add_history(data);
});

function connect() {
  const nickname = txt_nickname.value.trim();
  if (!nickname) return;
  if (socket.connected) return;
  socket.connect();
  enable_chat(true);
}

function disconnect() {
  if (socket.disconnected) return;
  socket.disconnect();
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
  if (socket.disconnected) return;
  const message = txt_message.value.trim();
  if (!message) return;
  const nickname = txt_nickname.value.trim();
  add_history({ nickname: 'You', message, timestamp: new Date() });
  socket.emit('send', { nickname, message });
  txt_message.value = '';
}

function add_history({ nickname, message, timestamp }) {
  history.innerHTML += `<p><b>${nickname}:</b> ${message} <sub>${new Date(
    timestamp
  ).toLocaleString()}</sub></p>`;
}
