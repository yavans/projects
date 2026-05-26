package com.blog.service;

import com.blog.dto.CommentDto;
import com.blog.entity.Comment;
import com.blog.entity.Post;
import com.blog.entity.User;
import com.blog.exception.BusinessException;
import com.blog.repository.CommentRepository;
import com.blog.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepo;
    private final PostRepository postRepo;
    private final UserService userService;

    @CacheEvict(value = "comments", allEntries = true)
    public Comment create(Long postId, CommentDto.CreateRequest req, Long userId) {
        Post post = postRepo.findById(postId)
                .orElseThrow(() -> BusinessException.notFound("文章不存在"));
        User user = userService.findById(userId);
        Comment comment = Comment.builder()
                .content(req.getContent())
                .post(post)
                .user(user)
                .build();
        return commentRepo.save(comment);
    }

    @CacheEvict(value = "comments", allEntries = true)
    public void delete(Long id, Long userId) {
        Comment comment = commentRepo.findById(id)
                .orElseThrow(() -> BusinessException.notFound("评论不存在"));
        if (!comment.getUser().getId().equals(userId)) {
            throw BusinessException.forbidden("无权删除");
        }
        commentRepo.delete(comment);
    }

    @Cacheable(value = "comments", key = "#postId")
    public List<Comment> getByPostId(Long postId) {
        return commentRepo.findByPostIdOrderByCreatedAtAsc(postId);
    }
}
