package com.blog.service;

import com.blog.dto.PostDto;
import com.blog.entity.Post;
import com.blog.entity.User;
import com.blog.exception.BusinessException;
import com.blog.repository.PostRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock PostRepository postRepo;
    @Mock UserService userService;

    @InjectMocks
    PostService postService;

    private User author;
    private Post post;

    @BeforeEach
    void setUp() {
        author = User.builder().id(1L).username("admin").password("xxx").build();
        post = Post.builder().id(1L).title("Test").content("Content")
                .tags("Java").author(author).comments(Collections.emptyList()).build();
    }

    @Test
    void create_shouldReturnPost() {
        PostDto.CreateRequest req = new PostDto.CreateRequest();
        req.setTitle("Test"); req.setContent("Content"); req.setTags("Java");

        when(userService.findById(1L)).thenReturn(author);
        when(postRepo.save(any(Post.class))).thenReturn(post);

        Post result = postService.create(req, 1L);

        assertThat(result.getTitle()).isEqualTo("Test");
        assertThat(result.getAuthor().getId()).isEqualTo(1L);
        verify(postRepo).save(any(Post.class));
    }

    @Test
    void getById_shouldReturnPost() {
        when(postRepo.findById(1L)).thenReturn(Optional.of(post));

        Post result = postService.getById(1L);

        assertThat(result.getTitle()).isEqualTo("Test");
    }

    @Test
    void getById_shouldThrowIfNotFound() {
        when(postRepo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> postService.getById(99L))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("文章不存在");
    }

    @Test
    void update_shouldThrowIfNotOwner() {
        User other = User.builder().id(2L).build();
        Post otherPost = Post.builder().id(1L).title("T").content("C")
                .author(other).build();

        when(postRepo.findById(1L)).thenReturn(Optional.of(otherPost));

        PostDto.UpdateRequest req = new PostDto.UpdateRequest();
        req.setTitle("New");

        assertThatThrownBy(() -> postService.update(1L, req, 1L))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("无权修改");
    }

    @Test
    void delete_shouldThrowIfNotOwner() {
        User other = User.builder().id(2L).build();
        Post otherPost = Post.builder().id(1L).title("T").content("C")
                .author(other).build();

        when(postRepo.findById(1L)).thenReturn(Optional.of(otherPost));

        assertThatThrownBy(() -> postService.delete(1L, 1L))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("无权删除");
    }

    @Test
    void list_shouldReturnPage() {
        Page<Post> page = new PageImpl<>(Collections.singletonList(post));
        when(postRepo.search(isNull(), isNull(), any(Pageable.class))).thenReturn(page);

        Page<Post> result = postService.list(null, null, 0, 10);

        assertThat(result.getTotalElements()).isEqualTo(1);
    }
}
