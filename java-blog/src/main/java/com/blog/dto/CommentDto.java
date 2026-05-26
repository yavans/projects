package com.blog.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class CommentDto {
    @Data
    public static class CreateRequest {
        @NotBlank
        private String content;
    }
}
