package com.dinhlam.chat.entity;

import lombok.*;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "account")
public class Account {

    @Id
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "name" ,nullable = false)
    private String name;

//    @ManyToMany(fetch = FetchType.EAGER)
//    @JoinTable(name = "chatdetail_account", joinColumns = @JoinColumn(name = "account_id"),
//            inverseJoinColumns = @JoinColumn(name = "chatdetail_id"))
//    private Set<ChatDetail> chatDetails = new HashSet<>();

}
