package com.cybershield.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request payload for Google OAuth2 / Single Sign-On authentication")
public class GoogleAuthRequest {

    @Schema(description = "Google ID Token / Credential string received from Google Identity Services", example = "eyJhbGciOiJSUzI1NiIs...")
    private String credential;

    @Schema(description = "Google account email address", example = "user@gmail.com")
    private String email;

    @Schema(description = "User display name provided by Google profile", example = "Alex Mercer")
    private String name;

    @Schema(description = "Google profile picture URL", example = "https://lh3.googleusercontent.com/a/...")
    private String picture;

    @Schema(description = "Flag indicating whether this is a citizen sign-up action (true) or a login action (false)", example = "false")
    private Boolean isSignUp;
}
