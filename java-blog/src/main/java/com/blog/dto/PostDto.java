package com.blog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class PostDto {
    @Data
    public static class CreateRequest {
        @NotBlank @Size(min = 1, max = 200)
        private String title;
        @NotBlank
        private String content;
        private String tags;
    }

    @Data
    public static class UpdateRequest {
        @Size(min = 1, max = 200)
        private String title;
        private String content;
        private String tags;
    }
}
