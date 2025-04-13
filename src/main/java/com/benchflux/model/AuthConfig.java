package com.benchflux.model;

import lombok.Data;

@Data
public class AuthConfig {
    private String authType; // JWT, BEARER, BASIC
    private String tokenUrl; // For dynamic tokens
    private String username; // For BASIC
    private String password; // For BASIC
    private String staticToken; // For static Bearer or JWT token
    private String tokenField; // Field in token response (if needed)
	public String getAuthType() {
		return authType;
	}
	public void setAuthType(String authType) {
		this.authType = authType;
	}
	public String getTokenUrl() {
		return tokenUrl;
	}
	public void setTokenUrl(String tokenUrl) {
		this.tokenUrl = tokenUrl;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getStaticToken() {
		return staticToken;
	}
	public void setStaticToken(String staticToken) {
		this.staticToken = staticToken;
	}
	public String getTokenField() {
		return tokenField;
	}
	public void setTokenField(String tokenField) {
		this.tokenField = tokenField;
	}
}
