package com.blog.service;

import com.blog.dto.CommentDto;
import com.blog.entity.Comment;
import com.blog.entity.Post;
import com.blog.entity.User;
import com.blog.repository.CommentRepository;
import com.blog.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepo;
    private final PostRepository postRepo;
    private final UserService userService;

    public Comment create(Long postId, CommentDto.CreateRequest req, Long userId) {
        Post post = postRepo.findById(postId).orElseThrow(() -> new RuntimeException("文章不存在"));
        User user = userService.findById(userId);
        Comment comment = Comment.builder()
                .content(req.getContent())
                .post(post)
                .user(user)
                .build();
        return commentRepo.save(comment);
    }

    public void delete(Long id, Long userId) {
        Comment comment = commentRepo.findById(id).orElseThrow(() -> new RuntimeException("评论不存在"));
        if (!comment.getUser().getId().equals(userId)) {
            throw new RuntimeException("无权删除");
        }
        commentRepo.delete(comment);
    }

    public List<Comment> getByPostId(Long postId) {
        return commentRepo.findByPostIdOrderByCreatedAtAsc(postId);
    }
}
