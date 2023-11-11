package com.dinhlam.chat.controller;

import com.dinhlam.chat.entity.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/chat.sendMessage") // Khi máy chủ nhận được một tin nhắn từ người dùng với địa chỉ "/chat.sendMessage", phương thức này sẽ được gọi.
    @SendTo("/topic/public") // tin nhắn sẽ được gửi lại tới tất cả các khách hàng đang đăng ký theo địa chỉ "/topic/public" bằng cách sử dụng annotation @SendTo.
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) { // Tham số @Payload ChatMessage chatMessage đại diện cho tin nhắn được gửi từ người dùng. Đối tượng ChatMessage chứa thông tin về người gửi (sender) và nội dung tin nhắn (content).
        return chatMessage;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage,
            SimpMessageHeaderAccessor headerAccessor) {
        // Add username in web socket session
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        return chatMessage;
    }
}
