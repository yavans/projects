package com.blog.controller;

import com.blog.dto.ApiResponse;
import com.blog.dto.CommentDto;
import com.blog.entity.Comment;
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
    public ApiResponse<List<Comment>> list(@PathVariable Long postId) {
        return ApiResponse.ok(commentService.getByPostId(postId));
    }

    @PostMapping
    public ApiResponse<Comment> create(@PathVariable Long postId,
                                        @Valid @RequestBody CommentDto.CreateRequest req,
                                        Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ApiResponse.ok(commentService.create(postId, req, userId));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        commentService.delete(id, userId);
        return ApiResponse.ok("删除成功", null);
    }
}
