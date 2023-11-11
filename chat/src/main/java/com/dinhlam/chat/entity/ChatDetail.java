package com.dinhlam.chat.entity;

import lombok.*;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "chat_detail")
public class ChatDetail {

    @Id
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "receiver_name" ,nullable = false)
    private String receiver_name;

    @Column(name = "sender_name", nullable = false)
    private String sender_name;

    @Column(name = "datetime",nullable = false)
    private Date datetime;

    @Column(name = "content", nullable = false)
    private String content;

    private MessageType type;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "chatdetail_account", joinColumns = @JoinColumn(name = "chatdetail_id"),
            inverseJoinColumns = @JoinColumn(name = "account_id"))
    private Set<Account> accounts = new HashSet<>();
}
