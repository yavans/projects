package com.blog.dto;

import com.blog.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private String tags;
    private UserResponse author;
    private List<CommentResponse> comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PostResponse from(Post post) {
        return new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getTags(),
                UserResponse.from(post.getAuthor()),
                post.getComments().stream().map(CommentResponse::from).toList(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }
}
