package com.blog.controller;

import com.blog.dto.ApiResponse;
import com.blog.dto.PostDto;
import com.blog.dto.PostResponse;
import com.blog.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public ApiResponse<Page<PostResponse>> list(
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<PostResponse> result = postService.list(tag, keyword, page, size)
                .map(PostResponse::from);
        return ApiResponse.ok(result);
    }

    @GetMapping("/{id}")
    public ApiResponse<PostResponse> get(@PathVariable Long id) {
        return ApiResponse.ok(PostResponse.from(postService.getById(id)));
    }

    @PostMapping
    public ApiResponse<PostResponse> create(@Valid @RequestBody PostDto.CreateRequest req,
                                             Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ApiResponse.ok("发布成功", PostResponse.from(postService.create(req, userId)));
    }

    @PutMapping("/{id}")
    public ApiResponse<PostResponse> update(@PathVariable Long id,
                                             @Valid @RequestBody PostDto.UpdateRequest req,
                                             Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ApiResponse.ok("更新成功", PostResponse.from(postService.update(id, req, userId)));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        postService.delete(id, userId);
        return ApiResponse.ok("删除成功", null);
    }
}
