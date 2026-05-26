package com.blog.controller;

import com.blog.dto.ApiResponse;
import com.blog.dto.PostDto;
import com.blog.entity.Post;
import com.blog.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public ApiResponse<Page<Post>> list(
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(postService.list(tag, keyword, page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<Post> get(@PathVariable Long id) {
        return ApiResponse.ok(postService.getById(id));
    }

    @PostMapping
    public ApiResponse<Post> create(@Valid @RequestBody PostDto.CreateRequest req,
                                     Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ApiResponse.ok("发布成功", postService.create(req, userId));
    }

    @PutMapping("/{id}")
    public ApiResponse<Post> update(@PathVariable Long id,
                                     @Valid @RequestBody PostDto.UpdateRequest req,
                                     Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ApiResponse.ok("更新成功", postService.update(id, req, userId));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        postService.delete(id, userId);
        return ApiResponse.ok("删除成功", null);
    }
}
