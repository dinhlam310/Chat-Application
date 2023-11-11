'use strict';

var usernamePage = document.querySelector('#username-page'); // thẻ div lớn trước khi tham gia phiên làm việc
var chatPage = document.querySelector('#chat-page');         // thẻ div lớn sau khi tham gia phiên làm việc
var usernameForm = document.querySelector('#usernameForm');  // Form bên trong username-page
var messageForm = document.querySelector('#messageForm');    // Form bên trong chat-page
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');// khu vuc chat , gom event va chat-message
var connectingElement = document.querySelector('.connecting');

var stompClient = null;
var username = null;

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function connect(event) {
    username = document.querySelector('#name').value.trim(); // lấy trường nhập tên khi muốn tham gia phiên làm việc

    if(username) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        var socket = new SockJS('/ws'); //Dòng này tạo một đối tượng kết nối WebSocket tới đường dẫn '/ws'. Đối tượng SockJS là một thư viện JavaScript hỗ trợ kết nối WebSocket trên các trình duyệt không hỗ trợ WebSocket trực tiếp.
        stompClient = Stomp.over(socket); //Dòng này tạo một khách hàng Stomp mới sử dụng đối tượng kết nối WebSocket socket. Thư viện Stomp.js là một thư viện JavaScript cho phép giao tiếp với máy chủ WebSocket sử dụng giao thức Stomp.

        stompClient.connect({}, onConnected, onError); //Dòng này kết nối khách hàng Stomp với máy chủ WebSocket. Đối tượng rỗng {} được truyền làm tham số đầu tiên để chỉ định các tiêu chí kết nối tùy chọn
    }
    event.preventDefault();
}


function onConnected() {
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/public', onMessageReceived); // Hàm subscribe() được gọi để đăng ký việc nhận tin nhắn từ chủ đề '/topic/public'. Khi có tin nhắn mới được gửi đến chủ đề này, hàm onMessageReceived sẽ được gọi

    // Tell your username to the server
    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({sender: username, type: 'JOIN'}) // gửi một tin nhắn đến máy chủ với đường dẫn '/app/chat.addUser'. Tin nhắn này được đóng gói dưới dạng một đối tượng JSON với các thuộc tính sender (tên người dùng)và type
    )

    connectingElement.classList.add('hidden');
}


function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}


function sendMessage(event) {
    var messageContent = messageInput.value.trim();
    if(messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT'
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}


//function create chat
function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);// 3 type in MessageType : CHAT , JOIN, LEAVE
    //create li for the chat
    var messageElement = document.createElement('li');

    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message'); //event-message : notify whose join the chat
        message.content = message.sender + ' joined!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');// notify who left the chat
        message.content = message.sender + ' left!';
    } else {
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i'); // khoi tao avatar
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}


function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}

usernameForm.addEventListener('submit', connect, true)
messageForm.addEventListener('submit', sendMessage, true)
