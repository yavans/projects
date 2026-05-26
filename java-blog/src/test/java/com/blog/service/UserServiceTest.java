package com.blog.service;

import com.blog.dto.AuthDto;
import com.blog.entity.User;
import com.blog.exception.BusinessException;
import com.blog.repository.UserRepository;
import com.blog.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock UserRepository userRepo;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtUtil jwtUtil;

    @InjectMocks
    UserService userService;

    private AuthDto.RegisterRequest registerReq;
    private AuthDto.LoginRequest loginReq;
    private User user;

    @BeforeEach
    void setUp() {
        registerReq = new AuthDto.RegisterRequest();
        registerReq.setUsername("testuser");
        registerReq.setPassword("123456");

        loginReq = new AuthDto.LoginRequest();
        loginReq.setUsername("testuser");
        loginReq.setPassword("123456");

        user = User.builder().id(1L).username("testuser").password("encoded").build();
    }

    @Test
    void register_shouldReturnUser() {
        when(userRepo.existsByUsername("testuser")).thenReturn(false);
        when(passwordEncoder.encode("123456")).thenReturn("encoded");
        when(userRepo.save(any(User.class))).thenReturn(user);

        User result = userService.register(registerReq);

        assertThat(result.getUsername()).isEqualTo("testuser");
        verify(userRepo).save(any(User.class));
    }

    @Test
    void register_shouldThrowIfUsernameExists() {
        when(userRepo.existsByUsername("testuser")).thenReturn(true);

        assertThatThrownBy(() -> userService.register(registerReq))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("用户名已存在");
    }

    @Test
    void login_shouldReturnToken() {
        when(userRepo.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("123456", "encoded")).thenReturn(true);
        when(jwtUtil.generateToken(1L, "testuser")).thenReturn("token123");

        String token = userService.login(loginReq);

        assertThat(token).isEqualTo("token123");
    }

    @Test
    void login_shouldThrowIfUserNotFound() {
        when(userRepo.findByUsername("testuser")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.login(loginReq))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void login_shouldThrowIfPasswordWrong() {
        when(userRepo.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("123456", "encoded")).thenReturn(false);

        assertThatThrownBy(() -> userService.login(loginReq))
                .isInstanceOf(BusinessException.class);
    }
}
