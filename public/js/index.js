const txt_nickname = document.getElementById('nickname');
const btn_connect = document.getElementById('btn_connect');
const btn_disconnect = document.getElementById('btn_disconnect');
const txt_message = document.getElementById('message');
const btn_send = document.getElementById('btn_send');
const history = document.getElementById('history');
const socket = io('http://186.99.185.68:3000/', { autoConnect: false });

socket.on('response', (data) => {
  add_history(data);
});

socket.on('history', (data) => {
  set_history(data);
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
  set_history();
}

function send() {
  if (socket.disconnected) return;
  const message = txt_message.value.trim();
  if (!message) return;
  const nickname = txt_nickname.value.trim();
  add_history({ nickname, message, timestamp: new Date(), own: true });
  socket.emit('send', { nickname, message });
  txt_message.value = '';
}

function toHistory({ nickname, message, timestamp, own = false }) {
  const own_class = own ? 'chat-log__item--own' : '';
  return `<div class="chat-log__item ${own_class}">
  <h3 class="chat-log__author">${own ? 'You' : nickname} <small>${new Date(
    timestamp
  ).toLocaleString()}</small></h3>
  <div class="chat-log__message">${message}</div>
  </div>`;
}

function add_history(data) {
  history.innerHTML += toHistory(data);
}

function set_history(data = []) {
  console.log(data);
  const nickname = txt_nickname.value.trim();
  history.innerHTML = data
    .map((d) => {
      const own = d.nickname === nickname;
      return toHistory({ ...d, own });
    })
    .join('');
}
