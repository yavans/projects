package com.blog.controller;

import com.blog.dto.ApiResponse;
import com.blog.dto.CommentDto;
import com.blog.dto.CommentResponse;
import com.blog.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    public ApiResponse<List<CommentResponse>> list(@PathVariable Long postId) {
        List<CommentResponse> result = commentService.getByPostId(postId)
                .stream().map(CommentResponse::from).toList();
        return ApiResponse.ok(result);
    }

    @PostMapping
    public ApiResponse<CommentResponse> create(@PathVariable Long postId,
                                                @Valid @RequestBody CommentDto.CreateRequest req,
                                                Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ApiResponse.ok(CommentResponse.from(commentService.create(postId, req, userId)));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        commentService.delete(id, userId);
        return ApiResponse.ok("删除成功", null);
    }
}
