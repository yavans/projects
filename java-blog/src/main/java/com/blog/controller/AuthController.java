package com.blog.controller;

import com.blog.dto.ApiResponse;
import com.blog.dto.AuthDto;
import com.blog.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ApiResponse<?> register(@Valid @RequestBody AuthDto.RegisterRequest req) {
        userService.register(req);
        return ApiResponse.ok("注册成功", null);
    }

    @PostMapping("/login")
    public ApiResponse<Map<String, String>> login(@Valid @RequestBody AuthDto.LoginRequest req) {
        String token = userService.login(req);
        return ApiResponse.ok(Map.of("token", token));
    }
}
