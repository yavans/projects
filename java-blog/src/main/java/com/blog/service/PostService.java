package com.blog.service;

import com.blog.dto.PostDto;
import com.blog.entity.Post;
import com.blog.entity.User;
import com.blog.exception.BusinessException;
import com.blog.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepo;
    private final UserService userService;

    @CacheEvict(value = "posts", allEntries = true)
    public Post create(PostDto.CreateRequest req, Long authorId) {
        User author = userService.findById(authorId);
        Post post = Post.builder()
                .title(req.getTitle())
                .content(req.getContent())
                .tags(req.getTags())
                .author(author)
                .build();
        return postRepo.save(post);
    }

    @CacheEvict(value = "posts", allEntries = true)
    public Post update(Long id, PostDto.UpdateRequest req, Long userId) {
        Post post = postRepo.findById(id)
                .orElseThrow(() -> BusinessException.notFound("文章不存在"));
        if (!post.getAuthor().getId().equals(userId)) {
            throw BusinessException.forbidden("无权修改");
        }
        if (req.getTitle() != null) post.setTitle(req.getTitle());
        if (req.getContent() != null) post.setContent(req.getContent());
        if (req.getTags() != null) post.setTags(req.getTags());
        return postRepo.save(post);
    }

    @CacheEvict(value = "posts", allEntries = true)
    public void delete(Long id, Long userId) {
        Post post = postRepo.findById(id)
                .orElseThrow(() -> BusinessException.notFound("文章不存在"));
        if (!post.getAuthor().getId().equals(userId)) {
            throw BusinessException.forbidden("无权删除");
        }
        postRepo.delete(post);
    }

    @Cacheable(value = "posts", key = "#id", unless = "#result == null")
    public Post getById(Long id) {
        return postRepo.findById(id)
                .orElseThrow(() -> BusinessException.notFound("文章不存在"));
    }

    public Page<Post> list(String tag, String keyword, int page, int size) {
        return postRepo.search(
                tag == null || tag.isEmpty() ? null : tag,
                keyword == null || keyword.isEmpty() ? null : keyword,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))
        );
    }
}
