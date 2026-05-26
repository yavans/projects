package com.blog.service;

import com.blog.dto.CommentDto;
import com.blog.entity.Comment;
import com.blog.entity.Post;
import com.blog.entity.User;
import com.blog.exception.BusinessException;
import com.blog.repository.CommentRepository;
import com.blog.repository.PostRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock CommentRepository commentRepo;
    @Mock PostRepository postRepo;
    @Mock UserService userService;

    @InjectMocks
    CommentService commentService;

    private User user;
    private Post post;
    private Comment comment;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).username("test").password("x").build();
        post = Post.builder().id(1L).title("T").content("C").author(user).build();
        comment = Comment.builder().id(1L).content("Nice!").post(post).user(user).build();
    }

    @Test
    void create_shouldReturnComment() {
        CommentDto.CreateRequest req = new CommentDto.CreateRequest();
        req.setContent("Nice!");

        when(postRepo.findById(1L)).thenReturn(Optional.of(post));
        when(userService.findById(1L)).thenReturn(user);
        when(commentRepo.save(any(Comment.class))).thenReturn(comment);

        Comment result = commentService.create(1L, req, 1L);

        assertThat(result.getContent()).isEqualTo("Nice!");
        verify(commentRepo).save(any(Comment.class));
    }

    @Test
    void create_shouldThrowIfPostNotFound() {
        when(postRepo.findById(99L)).thenReturn(Optional.empty());

        CommentDto.CreateRequest req = new CommentDto.CreateRequest();
        req.setContent("X");

        assertThatThrownBy(() -> commentService.create(99L, req, 1L))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("文章不存在");
    }

    @Test
    void delete_shouldThrowIfNotOwner() {
        User other = User.builder().id(2L).build();
        Comment otherComment = Comment.builder().id(1L).content("X").user(other).build();

        when(commentRepo.findById(1L)).thenReturn(Optional.of(otherComment));

        assertThatThrownBy(() -> commentService.delete(1L, 1L))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("无权删除");
    }
}
